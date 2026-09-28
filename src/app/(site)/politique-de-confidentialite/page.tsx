import type { Metadata } from "next";
import { LegalPage } from "@/components/public/legal";

export const metadata: Metadata = { title: "Confidentialité" };

export default function Page() {
  return (
    <LegalPage title="Politique de confidentialité">
      <p>Les formulaires recueillent les informations nécessaires pour répondre à une demande : nom, téléphone, email éventuel, destination, dates et message.</p>
      <p>Ces informations sont enregistrées afin que DIM VOYAGES puisse recontacter la personne par WhatsApp, téléphone ou email. Elles ne sont pas vendues.</p>
      <p>La newsletter conserve uniquement l&apos;adresse email des personnes qui s&apos;inscrivent. Une inscription peut être retirée depuis le back-office.</p>
      <p>Cette première version ne comporte pas de paiement en ligne.</p>
    </LegalPage>
  );
}
