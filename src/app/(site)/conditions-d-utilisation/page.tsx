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
      <p>Les offres affichées sont des points de départ. La disponibilité, le tarif et le programme sont confirmés par DIM VOYAGES après étude de la demande.</p>
      <p>Envoyer un formulaire ne constitue pas une réservation ferme et n&apos;entraîne aucun paiement.</p>
      <p>Les conseils visa décrivent une aide à la préparation du dossier. La décision appartient aux autorités compétentes.</p>
    </LegalPage>
  );
}
