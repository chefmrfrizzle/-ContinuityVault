import { RecipientFlow } from "@/components/recipient-flow";
export const metadata = { title: "Recipient invitation" };
export default function Page() {
  return <RecipientFlow kind="invitation" />;
}
