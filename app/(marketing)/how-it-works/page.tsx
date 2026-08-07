import { SitePage } from "@/components/marketing/site-page";
export const metadata = { title: "How it works" };
export default function Page() {
  return (
    <SitePage
      eyebrow="How it works"
      title="One missed check-in never shares anything."
      intro="First we remind you. Then we wait. Trusted people must agree, and there is one last waiting period. If anything is unclear, the process stops."
      sections={[
        [
          "Prepare",
          "Create a practice package on your device. Your browser locks it before the service can receive anything.",
        ],
        [
          "Check in",
          "Sign in and tell us you are okay. Email and text messages are reminders only; replying to one cannot approve anything.",
        ],
        [
          "Share safely",
          "The locked package can be shared only after every safety step passes. Conflicting answers, outages, or security concerns stop the process.",
        ],
      ]}
    />
  );
}
