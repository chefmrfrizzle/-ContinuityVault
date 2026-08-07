import { LegalPage } from "@/components/legal-page";
export const metadata = { title: "Privacy" };
export default function Page() {
  return (
    <LegalPage title="Privacy model">
      <p>
        This prototype uses synthetic local preview data. It does not accept
        real protected material.
      </p>
      <h2>Data minimization</h2>
      <p>
        The intended service stores opaque identifiers, hashed contact
        addresses, policy and workflow state, ciphertext, and redacted audit
        events. It must not record protected-content names, message bodies,
        recovery material, or recipient identities in analytics.
      </p>
      <h2>Review required</h2>
      <p>
        A qualified privacy and legal review, retention schedule, subprocessor
        list, and jurisdiction-specific notices are required before launch.
      </p>
    </LegalPage>
  );
}
