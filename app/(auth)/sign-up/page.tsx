import { AuthShell } from "@/components/auth-shell";
export const metadata = { title: "Create account" };
export default function Page() {
  return <AuthShell mode="sign-up" />;
}
