import { SitePage } from "@/components/marketing/site-page";
export const metadata = { title: "How it works" };
export default function Page() {
  return (
    <SitePage
      eyebrow="The continuity protocol"
      title="A careful process, not a dead-man switch."
      intro="A missed check-in begins a staged verification sequence. Time, authenticated responses, quorum, integrity, and a final hold all matter. No single signal is enough."
      sections={[
        [
          "Protect",
          "Prepare a harmless test package locally. Your browser encrypts it; the service never needs the plaintext or an unwrapped key.",
        ],
        [
          "Verify",
          "Check in through your authenticated account. Reminders arrive by email or text, but messages alone never prove identity.",
        ],
        [
          "Deliver",
          "Only explicit deterministic policy can advance delivery. Conflicts, outages, integrity failures, or the global freeze stop the cycle.",
        ],
      ]}
    />
  );
}
