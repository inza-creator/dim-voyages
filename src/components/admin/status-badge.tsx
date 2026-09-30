import { requestStatusLabels } from "@/lib/constants";

const statusTones: Record<string, string> = {
  NOUVELLE: "bg-[#e7f3fb] text-[#2080c0]",
  EN_COURS: "bg-[#fff1e6] text-[#de640c]",
  CLIENT_CONTACTE: "bg-[#fbf6e4] text-[#9a7208]",
  TRAITEE: "bg-[#e7f8ee] text-[#14914a]",
  ANNULEE: "bg-[#eef1f4] text-[#64748b]",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTones[status] ?? "bg-sand text-muted"}`}>
      {requestStatusLabels[status] ?? status}
    </span>
  );
}
