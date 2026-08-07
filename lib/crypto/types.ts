export type LocalPackageInput = {
  plaintext: string;
  planId: string;
  policyVersion: number;
};
export type RecipientEnvelopeInput = { recipientKeyId: string };
export type KeyEnvelope = { recipientKeyId: string; wrappedContentKey: string };
export type IntegrityResult = { valid: boolean; reason?: string };
export type DecryptPackageInput = {
  package: EncryptedPackage;
  contentKey: CryptoKey;
};
export type LocalPackageOutput = { plaintext: string };
export type RecoveryKitInput = {
  packageId: string;
  rawContentKey: ArrayBuffer;
  passphrase: string;
};
export type EncryptedRecoveryKit = {
  format: "continuity-vault-test-recovery";
  version: 1;
  packageId: string;
  salt: string;
  iv: string;
  wrappedContentKey: string;
};
export type EncryptedPackage = {
  format: "continuity-vault-test-package";
  version: 1;
  packageId: string;
  createdAt: string;
  algorithmSuite: "AES-256-GCM-TEST-ONLY";
  ciphertext: string;
  ciphertextSha256: string;
  iv: string;
  aad: { planId: string; policyVersion: number; packageVersion: 1 };
};

export interface CryptoProvider {
  createPackage(
    input: LocalPackageInput,
  ): Promise<{ package: EncryptedPackage; contentKey: CryptoKey }>;
  createRecipientEnvelope(input: RecipientEnvelopeInput): Promise<KeyEnvelope>;
  verifyPackage(input: EncryptedPackage): Promise<IntegrityResult>;
  decryptPackage(input: DecryptPackageInput): Promise<LocalPackageOutput>;
  exportRecoveryKit(input: RecoveryKitInput): Promise<EncryptedRecoveryKit>;
}
