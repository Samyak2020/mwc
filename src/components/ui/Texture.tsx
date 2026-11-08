import Image from "next/image";

type TextureProps = {
  opacity?: number;
  /** Figma crops the grain texture differently per frame; these match it. */
  top?: string;
  height?: string;
  className?: string;
};

// The grain overlay Figma layers on most images and blue cards.
export function Texture({ opacity = 0.15, top = "-56.1%", height = "256.86%", className = "" }: TextureProps) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} style={{ opacity }}>
      <div className="absolute left-0" style={{ top, height, width: "109.53%" }}>
        <Image src="/figma/texture.png" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-fill" />
      </div>
    </div>
  );
}

// A navy (or other) panel with the grain texture, used for placeholder cards.
export function TexturedPanel({ color = "var(--color-navy)", className = "" }: { color?: string; className?: string }) {
  return (
    <div aria-hidden className={`relative overflow-hidden ${className}`} style={{ background: color }}>
      <Texture />
    </div>
  );
}
