import { redirect } from "next/navigation";

// The root path redirects to the dashboard overview.
export default function RootPage() {
  redirect("/dashboard");
}
