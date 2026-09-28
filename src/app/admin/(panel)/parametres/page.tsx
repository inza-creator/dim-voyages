import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/server/content";

export default async function SettingsPage() {
  const settings = await getSettings();
  return <SettingsForm initial={settings} />;
}
