import type {
  CryptoProvider,
  DecryptPackageInput,
  EncryptedPackage,
  EncryptedRecoveryKit,
  LocalPackageInput,
  RecoveryKitInput,
} from "@/lib/crypto/types";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64Url(bytes: ArrayBuffer): string {
  const array = new Uint8Array(bytes);
  let binary = "";
  for (const byte of array) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function fromBase64Url(value: string): ArrayBuffer {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const binary = atob(
    normalized + "=".repeat((4 - (normalized.length % 4)) % 4),
  );
  return Uint8Array.from(binary, (char) => char.charCodeAt(0)).buffer;
}

async function sha256(value: ArrayBuffer): Promise<string> {
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256", value))]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export class TestOnlyWebCryptoProvider implements CryptoProvider {
  async createPackage(input: LocalPackageInput) {
    if (!input.plaintext.trim())
      throw new Error("A harmless test message is required.");
    const contentKey = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const packageId = crypto.randomUUID();
    const aad = {
      planId: input.planId,
      policyVersion: input.policyVersion,
      packageVersion: 1 as const,
    };
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
        additionalData: encoder.encode(JSON.stringify(aad)),
      },
      contentKey,
      encoder.encode(input.plaintext),
    );
    const encryptedPackage: EncryptedPackage = {
      format: "continuity-vault-test-package",
      version: 1,
      packageId,
      createdAt: new Date().toISOString(),
      algorithmSuite: "AES-256-GCM-TEST-ONLY",
      ciphertext: base64Url(ciphertext),
      ciphertextSha256: await sha256(ciphertext),
      iv: base64Url(iv.buffer),
      aad,
    };
    return { package: encryptedPackage, contentKey };
  }

  async createRecipientEnvelope(): Promise<never> {
    throw new Error(
      "Recipient key envelopes are disabled pending independent cryptographic review.",
    );
  }

  async verifyPackage(input: EncryptedPackage) {
    if (input.format !== "continuity-vault-test-package" || input.version !== 1)
      return { valid: false, reason: "Unknown package format." };
    return {
      valid:
        (await sha256(fromBase64Url(input.ciphertext))) ===
        input.ciphertextSha256,
    };
  }

  async decryptPackage({ package: input, contentKey }: DecryptPackageInput) {
    const plaintext = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(fromBase64Url(input.iv)),
        additionalData: encoder.encode(JSON.stringify(input.aad)),
      },
      contentKey,
      fromBase64Url(input.ciphertext),
    );
    return { plaintext: decoder.decode(plaintext) };
  }

  async exportRecoveryKit(
    input: RecoveryKitInput,
  ): Promise<EncryptedRecoveryKit> {
    if (input.passphrase.length < 12)
      throw new Error("Use a test passphrase with at least 12 characters.");
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const baseKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(input.passphrase),
      "PBKDF2",
      false,
      ["deriveKey"],
    );
    const wrappingKey = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 210_000, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"],
    );
    const wrapped = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      wrappingKey,
      input.rawContentKey,
    );
    return {
      format: "continuity-vault-test-recovery",
      version: 1,
      packageId: input.packageId,
      salt: base64Url(salt.buffer),
      iv: base64Url(iv.buffer),
      wrappedContentKey: base64Url(wrapped),
    };
  }
}
