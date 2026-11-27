"use client";

import { useEffect, useRef } from "react";

// The stages read off a circular ruler on the left edge (after the "circular
// ruler" reference): an arc with ticks that turns with the scroll, a fixed
// needle at three o'clock, and the stage names set along the arc. The stage
// under the needle is large and white; its neighbours sit smaller and dim
// above and below. Driven per frame from the camera's own progress, so the
// dial and the drawing always agree. Clicking a name scrolls to its stage.
const STEP = 15; // degrees between stages
const SUB = 10; // ticks between stages
const SPARE = 40; // extra ticks past the first and last stage

export type DialApi = (f: number) => void;

export function StageDial({
  stages,
  api,
  onPick,
}: {
  stages: { n: number; title: string }[];
  api: React.MutableRefObject<DialApi | null>;
  onPick: (i: number) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const arc = useRef<SVGCircleElement>(null);
  const ticks = useRef<SVGGElement>(null);
  const needle = useRef<SVGLineElement>(null);
  const names = useRef<(HTMLButtonElement | null)[]>([]);
  const geo = useRef({ cx: 0, cy: 0, r: 400, gap: 56, k: 1 });
  const last = useRef(0);
  const n = stages.length;

  useEffect(() => {
    const el = box.current;
    const g = ticks.current;
    if (!el || !g) return;
    const NS = "http://www.w3.org/2000/svg";

    const set: DialApi = (f) => {
      last.current = f;
      const { cx, cy, r, gap, k } = geo.current;
      g.setAttribute("transform", `translate(${cx} ${cy}) rotate(${(-f * STEP).toFixed(3)})`);
      names.current.forEach((b, i) => {
        if (!b) return;
        const d = i - f;
        const a = (d * STEP * Math.PI) / 180;
        const near = Math.max(0, 1 - Math.abs(d));
        const e = near * near * (3 - 2 * near);
        const x = cx + Math.cos(a) * (r + gap);
        const y = cy + Math.sin(a) * (r + gap);
        b.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translateY(-50%)`;
        b.style.fontSize = `${((28 + 20 * e) * k).toFixed(2)}px`;
        const gone = Math.abs(d) > 1.6;
        b.style.opacity = gone ? "0" : (0.45 + 0.55 * e).toFixed(3);
        b.tabIndex = gone ? -1 : 0;
      });
    };

    const layout = () => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      const r = Math.max(H * 0.56, Math.min(W * 0.72, H * 0.64));
      // line the highlighted tick up with the section heading: the needle
      // starts at the heading's left edge, whatever the screen width.
      // Offsets ignore transforms, so the intro's moving heading doesn't matter.
      let headLeft = Math.min(W * 0.09, 130);
      const head = document.getElementById("field-heading");
      if (head) {
        let x = 0;
        let n: HTMLElement | null = head;
        while (n && n !== el.parentElement && n !== document.body) {
          x += n.offsetLeft;
          n = n.offsetParent as HTMLElement | null;
        }
        headLeft = x;
      }
      const cx = headLeft + 20 - r;
      const cy = H * 0.56;
      // type scale: full size on big screens, smaller on laptops (a 1440×900
      // or a MacBook screen gets about 80%), never below 70%
      const k = Math.max(0.7, Math.min(1, W / 1600, H / 1100));
      geo.current = { cx, cy, r, gap: Math.min(W * 0.03, 44) * k, k };
      const c = arc.current;
      if (c) {
        c.setAttribute("cx", String(cx));
        c.setAttribute("cy", String(cy));
        c.setAttribute("r", String(r));
      }
      const l = needle.current;
      if (l) {
        l.setAttribute("x1", String(cx + r - 20));
        l.setAttribute("x2", String(cx + r + 10));
        l.setAttribute("y1", String(cy));
        l.setAttribute("y2", String(cy));
      }
      // ticks point inward from the arc: long at each stage, mid every five
      g.replaceChildren();
      for (let i = -SPARE; i <= (n - 1) * SUB + SPARE; i++) {
        const major = i % SUB === 0 && i >= 0 && i <= (n - 1) * SUB;
        const mid = !major && i % 5 === 0;
        const len = major ? 22 : mid ? 14 : 9;
        const a = ((i / SUB) * STEP * Math.PI) / 180;
        const ro = r - 2;
        const ri = ro - len;
        const t = document.createElementNS(NS, "line");
        t.setAttribute("x1", (Math.cos(a) * ri).toFixed(2));
        t.setAttribute("y1", (Math.sin(a) * ri).toFixed(2));
        t.setAttribute("x2", (Math.cos(a) * ro).toFixed(2));
        t.setAttribute("y2", (Math.sin(a) * ro).toFixed(2));
        t.setAttribute("stroke-width", major ? "2" : mid ? "1.5" : "1");
        t.setAttribute("stroke-opacity", major ? "0.85" : mid ? "0.5" : "0.3");
        g.appendChild(t);
      }
      set(last.current);
    };

    layout();
    api.current = set;
    const ro = new ResizeObserver(layout);
    ro.observe(el);
    return () => {
      ro.disconnect();
      api.current = null;
    };
  }, [api, n]);

  return (
    <div ref={box} className="pointer-events-none absolute inset-0 hidden lg:block">
      <svg aria-hidden className="absolute inset-0 h-full w-full overflow-visible text-bg">
        <defs>
          <linearGradient id="dial-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.06" />
            <stop offset="0.3" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="0.56" stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="0.8" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.06" />
          </linearGradient>
        </defs>
        <circle ref={arc} fill="none" stroke="url(#dial-fade)" strokeWidth="1.5" />
        <g ref={ticks} stroke="currentColor" strokeLinecap="round" />
        <line ref={needle} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {stages.map((st, i) => {
        const [a, b] = st.title.split(" and ");
        return (
          <button
            key={st.title}
            ref={(el) => {
              names.current[i] = el;
            }}
            type="button"
            onClick={() => onPick(i)}
            aria-label={`${st.n}. ${st.title}`}
            className="pointer-events-auto absolute top-0 left-0 w-max text-left leading-[1.1] font-semibold tracking-[-0.02em] text-bg will-change-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bg"
          >
            {b ? (
              <>
                {a} and
                <br />
                {b}
              </>
            ) : (
              st.title
            )}
          </button>
        );
      })}
    </div>
  );
}
