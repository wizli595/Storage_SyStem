import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET || "super-secret-key";
const key = new TextEncoder().encode(secretKey);

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h") // 2-hour session
    .sign(key);

  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const { payload } = await jwtVerify(sessionCookie, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete("session");
}
