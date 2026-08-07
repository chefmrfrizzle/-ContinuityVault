import { SitePage } from "@/components/marketing/site-page";
export const metadata = { title: "Security boundary" };
export default function Page() {
  return (
    <SitePage
      eyebrow="Security boundary"
      title="Designed around what we must never know."
      intro="The company coordinates state, timing, authenticated responses, and ciphertext delivery. It does not possess the recovery key required to read a package."
      sections={[
        [
          "Only your browser sees plaintext",
          "Package preparation and local decryption occur on your device. This prototype accepts harmless test content only.",
        ],
        [
          "Channels are not identity",
          "Email and SMS are delivery routes for neutral reminders and short-lived links. Secure actions require an authenticated session.",
        ],
        [
          "Fail closed by construction",
          "Unknown states, conflicting evidence, provider incidents, package-integrity failure, and security freezes cannot advance release.",
        ],
      ]}
    />
  );
}
