import Image from "next/image";

export function MediaImage({
  src,
  alt,
  className = "object-cover",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (!src) {
    return <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-800 to-sea" />;
  }

  return (
    <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={className} />
  );
}
