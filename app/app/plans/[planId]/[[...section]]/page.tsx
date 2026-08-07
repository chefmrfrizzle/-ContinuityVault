import { PlanWorkspace } from "@/components/plans/plan-workspace";
export const metadata = { title: "My plan" };
export default async function Page({
  params,
}: {
  params: Promise<{ planId: string; section?: string[] }>;
}) {
  const { planId, section } = await params;
  return <PlanWorkspace planId={planId} section={section?.[0] ?? ""} />;
}
