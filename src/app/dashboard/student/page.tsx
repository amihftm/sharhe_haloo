import { redirect } from "next/navigation";

// This is a server component that acts as a route handler.
export default async function DashboardPage() {

  redirect("/dashboard/student/clinics");

  return null;
}
