import { RecipientFlow } from "@/components/recipient-flow";
export const metadata = { title: "Secure response" };
export default function Page() {
  return <RecipientFlow kind="challenge" />;
}
