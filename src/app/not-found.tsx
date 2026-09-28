import Link from "next/link";
import { btnPrimary } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold text-orange">DIM VOYAGES</p>
      <h1 className="mt-2 text-4xl font-bold text-navy">Page introuvable</h1>
      <p className="mt-3 text-muted">Cette page n&apos;existe pas ou n&apos;est plus publiée.</p>
      <Link href="/" className={`${btnPrimary} mt-6`}>Retour à l&apos;accueil</Link>
    </div>
  );
}
