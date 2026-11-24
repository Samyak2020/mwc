// Drafting registration marks: a short L at each corner of the parent (which
// must be positioned), as on the corners of a drawing sheet. Purely visual.
export function RegMarks({ size = 10, className = "text-bg/60" }: { size?: number; className?: string }) {
  const corners = [
    "top-0 left-0",
    "top-0 right-0 rotate-90",
    "right-0 bottom-0 rotate-180",
    "bottom-0 left-0 -rotate-90",
  ];
  return (
    <>
      {corners.map((c) => (
        <svg
          key={c}
          aria-hidden
          width={size}
          height={size}
          viewBox="0 0 10 10"
          className={`pointer-events-none absolute -m-px ${c} ${className}`}
        >
          <path d="M0.75 10V0.75H10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ))}
    </>
  );
}
