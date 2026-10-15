import { MediaImage } from "@/components/public/media-image";

export function HeroCarousel({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  const slides = images.filter((image) => image.src);
  const count = Math.min(slides.length, 3);

  return (
    <>
      {slides.slice(0, 3).map((image, slide) => (
        <div
          key={`${image.src}-${slide}`}
          className={count > 1 ? `hero-slide hero-slide-${count} absolute inset-0` : "absolute inset-0"}
          style={
            count > 1
              ? { animationDelay: `${slide * 10}s`, animationDuration: `${count * 10}s` }
              : undefined
          }
        >
          <MediaImage src={image.src} alt={image.alt} priority sizes="100vw" className="object-cover object-center" />
        </div>
      ))}
    </>
  );
}
