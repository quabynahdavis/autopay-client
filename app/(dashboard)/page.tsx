import { redirect } from "next/navigation";

// The dashboard has moved to /dashboard
export default function OldDashboardRoot() {
  redirect("/dashboard");
}
