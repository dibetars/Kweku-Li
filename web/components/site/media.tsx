import Image from 'next/image';

// A fill-mode next/image for the site's fixed-ratio media boxes. The parent must be positioned
// (every .case-media, .portfolio-visual, .hero-figure, etc. in site.css already is).
export function Media({
  src,
  alt,
  className,
  sizes,
  priority = false,
  position,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  position?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      style={position ? { objectPosition: position } : undefined}
    />
  );
}
