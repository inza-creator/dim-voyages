import type { Metadata } from "next";
import { LegalPage } from "@/components/public/legal";

export const metadata: Metadata = { title: "Mentions légales" };

export default function Page() {
  return (
    <LegalPage title="Mentions légales">
      <p>Le site présente DIM VOYAGES, agence de voyage et de tourisme basée à Abidjan, en Côte d&apos;Ivoire.</p>
      <p>Contact : info@dimvoyages.net — +225 07 00 15 69 81.</p>
      <p>Les informations légales complémentaires (immatriculation, responsable de publication) pourront être précisées par l&apos;agence.</p>
      <p>Les photos utilisées pendant la mise en place du site sont provisoires. Elles sont remplaçables depuis le back-office.</p>
    </LegalPage>
  );
}
