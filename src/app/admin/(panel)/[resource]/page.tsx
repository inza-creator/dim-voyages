import { notFound } from "next/navigation";
import { ResourceManager } from "@/components/admin/resource-manager";
import { isResourceKey, resources, type ResourceConfig } from "@/lib/admin-resources";
import { prisma } from "@/lib/prisma";
import { listResource } from "@/server/resources";

export default async function ResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!isResourceKey(resource) || resource === "galerie") notFound();
  const items = await listResource(resource);
  const config = resource === "offres" ? await withDestinationField(resources.offres) : resources[resource];
  return <ResourceManager config={config} initialItems={JSON.parse(JSON.stringify(items))} />;
}

async function withDestinationField(config: ResourceConfig): Promise<ResourceConfig> {
  const destinations = await prisma.destination.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true },
  });
  const field = {
    name: "destinationId",
    label: "Rubrique destination",
    type: "select" as const,
    options: [
      { value: "", label: "Aucune (visible seulement dans Offres)" },
      ...destinations.map((destination) => ({ value: destination.id, label: destination.name })),
    ],
  };
  const fields = [...config.fields];
  const index = fields.findIndex((item) => item.name === "destinationLabelEn");
  fields.splice(index + 1, 0, field);
  return { ...config, fields };
}
