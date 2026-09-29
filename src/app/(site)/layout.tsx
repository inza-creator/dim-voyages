import { SiteHeader } from "@/components/public/header";
import { SiteFooter } from "@/components/public/footer";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { getSettings } from "@/server/content";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <SiteHeader settings={settings} />
        <main className="flex-1">{children}</main>
        <SiteFooter settings={settings} />
      </div>
      <WhatsAppButton phone={settings.whatsapp} />
    </>
  );
}
