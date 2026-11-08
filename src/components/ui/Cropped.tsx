import Image from "next/image";
import { PHOTO_QUALITY } from "@/lib/motion";

type CroppedProps = {
  src: string;
  alt?: string;
  /** Figma crop box, as percentages of the frame. */
  left: string;
  top: string;
  width: string;
  height: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

// Reproduces a Figma image "crop": an oversized image offset inside a clipped frame.
export function Cropped({ src, alt = "", left, top, width, height, sizes, priority, className = "" }: CroppedProps) {
  // The image box is wider than its frame (e.g. 159%), so request that width.
  const autoSizes = width.endsWith("%") ? `${Math.ceil(parseFloat(width))}vw` : "100vw";
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute" style={{ left, top, width, height }}>
        <Image src={src} alt={alt} fill sizes={sizes ?? autoSizes} priority={priority} quality={PHOTO_QUALITY} className="object-cover" />
      </div>
    </div>
  );
}
