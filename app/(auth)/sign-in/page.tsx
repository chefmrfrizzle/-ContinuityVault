import { AuthShell } from "@/components/auth-shell";
export const metadata = { title: "Sign in" };
export default function Page() {
  return <AuthShell mode="sign-in" />;
}
