"use client";
import { useActionState, useEffect } from "react";
import { login } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);
  const router = useRouter();
  useEffect(() => {
    if (state?.success === "Access Granted!") {
      router.push("/dashboard");
      toast.success("Access Granted!");
    }
  }, [state, router]);

  return <AuthForm action={action} state={state} pending={pending} />;
}
