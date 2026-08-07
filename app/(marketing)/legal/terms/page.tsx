import { LegalPage } from "@/components/legal-page";
export const metadata = { title: "Terms" };
export default function Page() {
  return (
    <LegalPage title="Terms of service">
      <p>These are prototype notices, not launch-ready legal terms.</p>
      <h2>Service boundary</h2>
      <p>
        Continuity Vault is not an executor, trustee, emergency service,
        legal-document execution service, or custodian of recovery keys. It does
        not guarantee delivery through a third-party route.
      </p>
      <h2>Test data only</h2>
      <p>
        Do not enter real protected, personal, financial, medical, legal,
        credential, or recovery information in this prototype.
      </p>
    </LegalPage>
  );
}
