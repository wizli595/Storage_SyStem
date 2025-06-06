import { getSession } from "@/lib/session";
import { LoginForm } from "@/components/auth/";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return <LoginForm />;
}
