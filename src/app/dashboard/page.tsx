import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

// This is a server component that acts as a route handler.
export default async function DashboardPage() {
  // 1. Get the session on the server.
  const session = await auth();

  // 2. Check the user's role from the session object.
  const userRole = session?.user?.role;

  // 3. Redirect based on the role.
  if (userRole === UserRole.ADMIN) {
    redirect("/dashboard/admin");
  }

  if (userRole === UserRole.STUDENT) {
    redirect("/dashboard/student");
  }

  // 4. Fallback: If the user has no role or is not logged in,
  // our middleware should have already caught this, but as a safeguard,
  // we can redirect them to the login page.
  redirect("/auth/login");

  // This component doesn't render any UI, it just handles the redirect.
  // You could return a loading spinner here if you wanted a brief loading state.
  return null;
}
