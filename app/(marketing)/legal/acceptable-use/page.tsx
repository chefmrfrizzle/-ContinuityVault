import { LegalPage } from "@/components/legal-page";
export const metadata = { title: "Acceptable use" };
export default function Page() {
  return (
    <LegalPage title="Acceptable use">
      <p>
        This continuity system may not be used for unlawful, threatening,
        coercive, abusive, emergency-response, surveillance, or anonymous plans.
      </p>
      <h2>Prototype restriction</h2>
      <p>
        Only harmless synthetic test material is permitted. Real protected
        material is disabled until independent cryptographic and security
        reviews are complete.
      </p>
    </LegalPage>
  );
}
