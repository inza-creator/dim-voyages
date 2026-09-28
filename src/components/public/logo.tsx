import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/logo-dim-voyages.png"
      alt="DIM VOYAGES — Le spécialiste du tourisme"
      width={846}
      height={295}
      priority={priority}
      className={cn("w-auto", className)}
      style={{ width: "auto" }}
    />
  );
}
