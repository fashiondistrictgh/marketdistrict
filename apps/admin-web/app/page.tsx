import { redirect } from "next/navigation";

import { ADMIN_ROUTES } from "@/constants/routes";

/** Root redirects into the dashboard; middleware handles auth gating. */
export default function Home() {
  redirect(ADMIN_ROUTES.dashboard);
}
