import Link from "next/link";
import { notFound } from "next/navigation";
import { CallButton } from "@/components/admin/call-button";
import { EmailButton } from "@/components/admin/email-button";
import { StatusForm } from "@/components/admin/status-form";
import { requestTypeLabels } from "@/lib/constants";
import { formatDateTime, whatsappHref } from "@/lib/utils";
import { getRequest } from "@/server/requests";

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getRequest(id);
  if (!item) notFound();
  const details = item.details && typeof item.details === "object" && !Array.isArray(item.details) ? item.details as Record<string, string> : {};

  return (
    <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <Link href="/admin/demandes" className="text-sm font-semibold text-orange">Retour aux demandes</Link>
        <h1 className="mt-2 text-2xl font-bold text-navy">{item.reference}</h1>
        <p className="text-sm text-muted">{requestTypeLabels[item.type]} · {formatDateTime(item.createdAt)}</p>
        <dl className="mt-6 space-y-3 rounded-3xl bg-white p-5 text-sm shadow-sm">
          <Row label="Nom" value={item.fullName} />
          <Row label="Téléphone" value={item.phone} />
          <Row label="Email" value={item.email || "—"} />
          <Row label="Destination" value={item.destination || "—"} />
          <Row label="Date" value={item.travelDate || "—"} />
          <Row label="Voyageurs" value={item.travelers ? String(item.travelers) : "—"} />
          <Row label="Message" value={item.message} />
          {Object.entries(details).map(([key, value]) => <Row key={key} label={detailLabels[key] ?? key} value={String(value)} />)}
        </dl>
      </div>
      <div className="space-y-4">
        <StatusForm id={item.id} status={item.status} />
        <a href={whatsappHref(item.phone, `Bonjour ${item.fullName}, DIM VOYAGES revient vers vous au sujet de votre demande envoyée sur notre site.`)} className="flex h-12 items-center justify-center rounded-full bg-whatsapp font-semibold text-white">
          Contacter sur WhatsApp
        </a>
        {item.email && <EmailButton name={item.fullName} email={item.email} />}
        <CallButton name={item.fullName} phone={item.phone} />
      </div>
    </div>
  );
}

const detailLabels: Record<string, string> = {
  budget: "Budget indicatif",
  currency: "Monnaie",
  travelType: "Type de voyage",
  company: "Société",
  childName: "Enfant ou groupe",
  childAge: "Âge",
  participants: "Participants",
  subject: "Sujet",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-muted uppercase">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-navy">{value}</dd>
    </div>
  );
}
