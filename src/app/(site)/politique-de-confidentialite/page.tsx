import type { Metadata } from "next";
import { LegalPage } from "@/components/public/legal";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  return { title: copy(await getLocale()).footer.privacy };
}

export default async function Page() {
  const locale = await getLocale();
  return (
    <LegalPage title={copy(locale).footer.privacy}>
      {copy(locale).legal.privacy.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </LegalPage>
  );
}
