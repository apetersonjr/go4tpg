import type { RetreatPhoto } from "@/content/retreatPhotos";
import { withBasePath } from "@/lib/basePath";
import { cn } from "@/lib/cn";

type PhotoProps = {
  photo: RetreatPhoto;
  /** `sizes` hint so the browser picks the right width. */
  sizes: string;
  /** Classes for the <img>, e.g. a fixed-height crop with object-cover. */
  imgClassName?: string;
  className?: string;
};

/**
 * A lazy-loaded photo with WebP and a JPEG fallback, plus an optional caption
 * in the kicker style. Width and height reserve its space so nothing shifts
 * when it arrives. Everything using this sits below the fold.
 */
export function Photo({ photo, sizes, imgClassName, className }: PhotoProps) {
  const src = (w: number, ext: string) =>
    withBasePath(`/assets/retreats/${photo.name}-${w}.${ext}`);
  const set = (ext: string) => photo.widths.map((w) => `${src(w, ext)} ${w}w`).join(", ");
  return (
    <figure className={className}>
      <picture>
        <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
        <img
          src={src(photo.widths[0], "jpg")}
          srcSet={set("jpg")}
          sizes={sizes}
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          className={cn("block h-auto w-full rounded-md", imgClassName)}
        />
      </picture>
      {photo.caption && (
        <figcaption className="text-tpg-muted mt-3 text-[12.5px] font-bold tracking-[0.18em] uppercase">
          {photo.caption}
        </figcaption>
      )}
    </figure>
  );
}
