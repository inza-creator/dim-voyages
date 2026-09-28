import type { Metadata } from "next";
import { LegalPage } from "@/components/public/legal";

export const metadata: Metadata = { title: "Conditions d'utilisation" };

export default function Page() {
  return (
    <LegalPage title="Conditions d'utilisation">
      <p>Les offres affichées sont des points de départ. La disponibilité, le tarif et le programme sont confirmés par DIM VOYAGES après étude de la demande.</p>
      <p>Envoyer un formulaire ne constitue pas une réservation ferme et n&apos;entraîne aucun paiement.</p>
      <p>Les conseils visa décrivent une aide à la préparation du dossier. La décision appartient aux autorités compétentes.</p>
    </LegalPage>
  );
}
