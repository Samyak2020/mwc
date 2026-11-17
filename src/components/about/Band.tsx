// Scrolling text band (after letsgrowcanada.ca/about-us): a thin sky strip
// with the page's phrases running along it, horizontally under the hero photo
// or vertically up the edge of a portrait. The phrases are set twice and the
// track moves by half its length, so the loop is seamless.

const aboutPhrases = ["About MWC", "Veteran-led", "Predictable outcomes", "SDVOSB certified"];

const text = "text-xs leading-none font-bold tracking-[0.08em] whitespace-nowrap uppercase";

function Run({ vertical, phrases }: { vertical: boolean; phrases: string[] }) {
  return (
    <div className={`flex shrink-0 ${vertical ? "flex-col" : ""}`}>
      {phrases.map((p) => (
        <span
          key={p}
          // vertical: each phrase is set sideways on its own; the stack stays a physical column
          className={`flex shrink-0 items-center gap-3 ${vertical ? "py-3 [writing-mode:vertical-rl]" : "px-3"}`}
        >
          <span aria-hidden className="size-1.5 rotate-45 bg-current" />
          {p}
        </span>
      ))}
    </div>
  );
}

export function Band({
  vertical = false,
  className = "",
  phrases = aboutPhrases,
}: {
  vertical?: boolean;
  className?: string;
  phrases?: string[];
}) {
  return (
    <div
      aria-hidden
      // vertical: turned over so the words read bottom-to-top, like a book spine
      className={`overflow-hidden bg-sky text-bg ${vertical ? "flex rotate-180 justify-center" : ""} ${className}`}
    >
      <div
        className={`${vertical ? "marquee-track-y flex h-max flex-col" : "marquee-track flex h-full w-max items-center"} ${text}`}
      >
        <Run vertical={vertical} phrases={phrases} />
        <Run vertical={vertical} phrases={phrases} />
        <Run vertical={vertical} phrases={phrases} />
        <Run vertical={vertical} phrases={phrases} />
      </div>
    </div>
  );
}
