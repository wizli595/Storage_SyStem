"use server";

import { createSession, deleteSession } from "@/lib/session";
import { z } from "zod";

// Code validation schema
const CodeSchema = z.object({
  code: z
    .string()
    .min(5, { message: "Code must be 5 characters long." })
    .nonempty({ message: "Code is required." })
    .trim(),
});

export type AuthState = {
  errors?: { code?: string[] };
  message?: string;
  success?: string;
};

// Login Action (User enters a code)
export async function login(
  state: AuthState | undefined,
  formData: FormData
): Promise<AuthState | undefined> {
  const validated = CodeSchema.safeParse({
    code: formData.get("code"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { code } = validated.data;

  // Only accept "12345" as the valid code
  if (code !== "12345") {
    return { message: "Invalid code. Try again." };
  }

  await createSession("123"); // Mock user ID
  return { success: "Access Granted!" };
}

// Logout Action
export async function logout() {
  await deleteSession();
}
