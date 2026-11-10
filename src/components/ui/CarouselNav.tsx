import Image from "next/image";

// Figma "Team Navigation" (629:616 / 629:643): text link, then prev / next.
export function CarouselNav({
  label,
  href = "#",
  what,
  onPrev,
  onNext,
}: {
  label: string;
  href?: string;
  /** what the arrows move, for their accessible names */
  what: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <a href={href} className="cta px-5 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-fg">
        {label}
      </a>
      <button type="button" aria-label={`Previous ${what}`} onClick={onPrev} className="cta shrink-0">
        <Image src="/comp2/btn-prev.svg" alt="" width={55} height={50} className="-scale-x-100" />
      </button>
      <button type="button" aria-label={`Next ${what}`} onClick={onNext} className="cta shrink-0">
        <Image src="/figma/btn-next.svg" alt="" width={55} height={50} />
      </button>
    </div>
  );
}
