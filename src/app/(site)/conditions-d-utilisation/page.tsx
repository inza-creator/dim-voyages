import type { Metadata } from "next";
import { LegalPage } from "@/components/public/legal";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  return { title: copy(await getLocale()).footer.terms };
}

export default async function Page() {
  const locale = await getLocale();
  return (
    <LegalPage title={copy(locale).footer.terms}>
      {copy(locale).legal.terms.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </LegalPage>
  );
}
