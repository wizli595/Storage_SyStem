import { getSession } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";

export default async function Dashboard() {
  const session = (await getSession()) as { userId: string };

  if (!session) {
    return <p>Unauthorized. Redirecting...</p>;
  }

  return (
    <div>
      <h1>Welcome to the Dashboard, User {session.userId}!</h1>
      <LogoutButton />
    </div>
  );
}
