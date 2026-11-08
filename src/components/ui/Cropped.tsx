import Image from "next/image";

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
export function Cropped({ src, alt = "", left, top, width, height, sizes = "100vw", priority, className = "" }: CroppedProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute" style={{ left, top, width, height }}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    </div>
  );
}
