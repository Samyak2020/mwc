// The site's arrow (Font Awesome 7 solid "arrow-right"), drawn with
// currentColor so it works on light and dark buttons. `width` is the icon's
// square size; older callers passed the long Figma arrow's width (25), so
// anything above 18 is held to 18 to keep one icon size across the site.
export function Arrow({ width = 18, className = "" }: { width?: number; className?: string }) {
  const size = Math.min(width, 18);
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 20 20" fill="none" className={`cta-arrow shrink-0 ${className}`}>
      <path
        d="M17.7062 10.7066C18.0969 10.316 18.0969 9.68164 17.7062 9.29102L12.7063 4.29102C12.3156 3.90039 11.6812 3.90039 11.2906 4.29102C10.9 4.68164 10.9 5.31602 11.2906 5.70664L14.5844 9.00039H3C2.44687 9.00039 2 9.44727 2 10.0004C2 10.5535 2.44687 11.0004 3 11.0004H14.5844L11.2906 14.2941C10.9 14.6848 10.9 15.3191 11.2906 15.7098C11.6812 16.1004 12.3156 16.1004 12.7063 15.7098L17.7062 10.7098V10.7066Z"
        fill="currentColor"
      />
    </svg>
  );
}
