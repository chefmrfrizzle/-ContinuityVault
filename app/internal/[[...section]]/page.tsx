import { InternalConsole } from "@/components/internal-console";
export const metadata = { title: "Operator console" };
export default async function Page({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section } = await params;
  return <InternalConsole section={section?.join(" / ") ?? "overview"} />;
}
