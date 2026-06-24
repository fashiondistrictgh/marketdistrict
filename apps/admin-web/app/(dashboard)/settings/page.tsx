import { redirect } from "next/navigation";

import { ADMIN_ROUTES } from "@/constants/routes";

export default function SettingsIndex() {
  redirect(ADMIN_ROUTES.settingsProfile);
}
