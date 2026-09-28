import { UsersManager } from "@/components/admin/users-manager";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return <p className="rounded-3xl bg-white p-6 text-sm text-muted">Cette section est réservée à l&apos;administrateur.</p>;
  }
  const items = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, active: true },
  });
  return <UsersManager initialItems={items} currentId={session.id} />;
}
