import { SitePage } from "@/components/marketing/site-page";
export const metadata = { title: "Security boundary" };
export default function Page() {
  return (
    <SitePage
      eyebrow="How we protect your information"
      title="We run the safety steps. We cannot read your package."
      intro="The service keeps track of time, check-ins, and answers from trusted people. It does not have the recovery key needed to read your package."
      sections={[
        [
          "Your device locks the information",
          "Your package is created and opened on your device. This practice version accepts made-up information only.",
        ],
        [
          "Messages are reminders, not permission",
          "Email and text messages can remind you and provide short-lived links. Important actions require a secure sign-in.",
        ],
        [
          "If anything is unclear, we stop",
          "Unknown steps, conflicting answers, service outages, a damaged package, or a security concern cannot move the process forward.",
        ],
      ]}
    />
  );
}
