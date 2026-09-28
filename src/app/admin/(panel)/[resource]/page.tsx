import { notFound } from "next/navigation";
import { ResourceManager } from "@/components/admin/resource-manager";
import { isResourceKey, resources } from "@/lib/admin-resources";
import { listResource } from "@/server/resources";

export default async function ResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!isResourceKey(resource)) notFound();
  const items = await listResource(resource);
  return <ResourceManager config={resources[resource]} initialItems={JSON.parse(JSON.stringify(items))} />;
}
