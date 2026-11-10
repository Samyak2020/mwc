import Image from "next/image";

// Figma "Trusted Companies" (y=4839): label + a row of client logos that
// scrolls sideways forever. The set is rendered twice and the strip moves by
// exactly one set's width per loop, so the seam is invisible.
const logos = [
  { src: "/figma/logo-0.png", w: 165, h: 22.5 },
  { src: "/figma/logo-1.png", w: 154, h: 23.5 },
  { src: "/figma/logo-0.png", w: 165, h: 22.5 },
  { src: "/figma/logo-2.png", w: 113, h: 23.5 },
  { src: "/figma/logo-3.png", w: 101, h: 22.5 },
  { src: "/figma/logo-4.png", w: 107, h: 35.5 },
  { src: "/figma/logo-0.png", w: 165, h: 22.5 },
  { src: "/figma/logo-5.png", w: 124, h: 27.5 },
  { src: "/figma/logo-0.png", w: 165, h: 22.5 },
];

function LogoSet({ hidden = false }: { hidden?: boolean }) {
  return (
    // pr matches the gap so the spacing across the seam is the same 48px
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-12 pr-12">
      {logos.map((l, i) => (
        <li key={i} className="shrink-0">
          <Image
            src={l.src}
            alt={hidden ? "" : "Client logo"}
            width={l.w}
            height={l.h}
            style={{ width: l.w, height: l.h }}
          />
        </li>
      ))}
    </ul>
  );
}

export function TrustedBy({ label = true, className = "mt-6 lg:mt-u-24" }: { label?: boolean; className?: string } = {}) {
  return (
    <section aria-label="Trusted companies" className={`shell ${className}`}>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        {label && (
        <p className="shrink-0 border-fg/25 p-2 text-base leading-[1.3] font-medium tracking-[-0.005em] text-muted sm:w-[234px] sm:border-r">
          Trusted by 20+ Companies
        </p>
        )}
        <div className="marquee h-[37px] w-full min-w-0 flex-1 overflow-hidden opacity-80">
          <div className="marquee-track flex h-full w-max items-center opacity-50">
            <LogoSet />
            <LogoSet hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
