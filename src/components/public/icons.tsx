import { Building2, Compass, FileCheck2, Map, Plane, type LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  plane: Plane,
  hotel: Building2,
  visa: FileCheck2,
  route: Map,
  compass: Compass,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Compass;
  return <Icon className={className} aria-hidden />;
}
