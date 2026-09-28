import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/shell";
import { getSession } from "@/lib/auth";
import { formatLongDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/admin/login");
  const newCount = await prisma.travelRequest.count({ where: { status: "NOUVELLE" } });

  return (
    <AdminShell user={user} today={formatLongDate()} newCount={newCount}>
      {children}
    </AdminShell>
  );
}
