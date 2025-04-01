"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { login } from "@/app/actions/auth";
import AuthForm from "./AuthForm";
import { toast } from "react-toastify";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success === "Access Granted!") {
      toast.success("Access Granted!");
      router.push("/dashboard");
    }
  }, [state, router]);

  return <AuthForm action={action} state={state} pending={pending} />;
}
