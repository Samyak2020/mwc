// The arrow glyph from the Figma file (stem + triangular head), drawn with
// currentColor so it can be reused on light and dark buttons.
export function Arrow({ width = 25, className = "" }: { width?: number; className?: string }) {
  const head = 7.5;
  return (
    <svg
      aria-hidden
      width={width}
      height="8.66"
      viewBox={`0 0 ${width} 8.66025`}
      fill="none"
      className={`cta-arrow shrink-0 ${className}`}
    >
      <path
        d={`M0 4.33013V5.08013H${width - 6.75}V4.33013V3.58013H0V4.33013ZM${width} 4.33013L${width - head} 0V8.66025L${width} 4.33013Z`}
        fill="currentColor"
      />
    </svg>
  );
}
