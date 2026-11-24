"use client";

import { useEffect } from "react";
import { SiteNavV2 } from "@/components/nav/SiteNavV2";

export function NavLogoV2() {
  // Figma 775:6364 / 775:6375 (191.4×30): the gradient mountain is the same on
  // light bars; over a dark section with the bar transparent the whole mark
  // turns white (vars --logo-ridge / --logo-body / --logo-text).
  return (
    <svg viewBox="0 0 191.382 30.0566" className="block h-[30px] w-[191px]" aria-hidden>
      <defs>
        <linearGradient id="mwc-nav-ridge" x1="0.286673" y1="29.9243" x2="102.607" y2="29.9243" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2EC0DA" />
          <stop offset="0.28" stopColor="#28A7D3" />
          <stop offset="0.5" stopColor="#1E82DC" />
          <stop offset="0.72" stopColor="#2290D4" />
          <stop offset="1" stopColor="#2EC2DD" />
        </linearGradient>
        <linearGradient id="mwc-nav-body" x1="41.7443" y1="6.10837" x2="73.4989" y2="27.2781" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34466C" />
          <stop offset="0.45" stopColor="#101A3A" />
          <stop offset="1" stopColor="#000714" />
        </linearGradient>
      </defs>
      <path style={{ fill: "var(--logo-ridge)" }} fillRule="evenodd" d="M102.894 29.9022L70.1026 0.220518L69.5954 0L49.837 14.1793L48.9991 13.7603L41.2368 7.67402L40.6855 7.47555L28.0719 16.4506L22.9559 17.4209L0 29.9904L6.39502 29.9684L24.2129 20.2876L29.1525 19.4717L40.6855 11.3126L49.2416 17.9501L49.7488 18.1045L69.3308 3.99137L98.3509 29.9904L102.563 30.0566L102.894 29.9022Z" />
      <path style={{ fill: "var(--logo-body)" }} fillRule="evenodd" d="M96.8959 29.8581L69.3532 5.09399L49.683 19.2512L40.6418 12.4372L29.4836 20.3538L24.2573 21.3241L8.53436 29.9022L27.6753 29.9463L23.6398 26.8811L27.9399 24.1467L35.9447 25.7345L33.2544 22.0518L41.5459 14.9291L47.8968 20.861L37.5766 29.3289L49.5507 24.1688L57.6437 28.116L52.9246 23.2647L54.0933 19.3835L60.753 23.1985L65.1633 26.2857L60.9956 16.4727L65.031 13.3855L68.6255 11.07L73.4328 13.9809L96.8959 29.8581Z" />
      <g fill="var(--logo-text)">
        <path d="M109.067 29.4286V6.95225H117.772L121.399 18.1904L122.52 22.3882L123.641 18.1904L127.268 6.95225H135.775V29.4286H129.049L129.477 14.5215L127.73 20.6364L124.861 29.4286H119.981L117.047 20.5041L115.365 14.5876L115.794 29.4286H109.067Z" />
        <path d="M157.048 29.4286L154.146 18.8184L153.586 16.108L153.025 18.8184L150.156 29.4286H142.771L136.44 6.95225H143.628L146.134 19.9092L146.793 23.2476L147.519 19.9092L151.047 6.95225H156.52L160.015 19.9092L160.741 23.2476L161.4 19.9092L163.939 6.95225H170.731L164.401 29.4286H157.048Z" />
        <path d="M191.382 14.6206H184.359C183.864 12.7366 182.71 11.778 180.864 11.778C178.127 11.778 176.61 14.1909 176.61 18.2235C176.61 22.256 178.094 24.6028 180.864 24.6028C182.578 24.6028 183.831 23.6773 184.293 21.9585H191.382C190.327 27.3462 186.139 30.0566 181.029 30.0566C174.038 30.0566 169.719 25.5613 169.719 18.2235C169.719 10.8856 174.038 6.32424 181.029 6.32424C186.172 6.32424 190.492 9.10072 191.382 14.6206Z" />
      </g>
    </svg>
  );
}

// Which section is under the nav? Sections declare data-nav-theme="dark" |
// "light"; the answer goes on <html data-nav-theme> and CSS recolours the nav
// and the sticky CTA (white on dark, ink on light).
export function useNavTheme(bar: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = bar.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const y = r.top + r.height / 2;
      let theme = "light";
      for (const s of document.querySelectorAll<HTMLElement>("body [data-nav-theme]")) {
        const b = s.getBoundingClientRect();
        if (b.top <= y && b.bottom > y) theme = s.dataset.navTheme ?? theme;
      }
      if (document.documentElement.dataset.navTheme !== theme) document.documentElement.dataset.navTheme = theme;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [bar]);
}

// The site header (src/components/nav/SiteNavV2), on every page. `v2` is
// kept so older pages that pass it still compile; it no longer changes anything.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SiteNav(_props: { v2?: boolean } = {}) {
  return <SiteNavV2 />;
}
