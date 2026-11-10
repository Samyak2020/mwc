"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { Texture } from "@/components/ui/Texture";
import { PHOTO_QUALITY, wavyAccordion } from "@/lib/motion";

export type AccordionItem = {
  name: string;
  /** Short label on the collapsed panel (Figma), when it differs from name */
  label?: string;
  image: string;
  description: string;
  cta: string;
};

// Figma "Industry Card" (573:642): 1376×500, five panels 8px apart; the open
// one is 562 wide, the rest share what's left (195.5 each).
const FRAME_W = 1376;
const OPEN_W = 562;
const GAP = 8;

const optimised = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=1920&q=${PHOTO_QUALITY}`;

/**
 * Image accordion drawn on a canvas. Panel widths follow an under-damped
 * spring; while a panel edge moves, its middle bows out in the direction of
 * travel (top and bottom stay pinned), so the panels stretch like fabric and
 * straighten as they settle. DOM panels sit on top for text, focus and hover.
 */
export function WavyAccordion({ items }: { items: AccordionItem[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const active = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0); // for aria only
  const kick = useRef<() => void>(() => {});
  const reduce = useReducedMotion();

  const activate = (i: number) => {
    if (active.current === i) return;
    active.current = i;
    setActiveIdx(i);
    kick.current();
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;
    const n = items.length;
    const { stiffness, damping, bowPerVelocity, maxBow, contentFrom } = wavyAccordion;

    // images (drawn once loaded; navy until then)
    const imgs = items.map((it) => {
      const im = new window.Image();
      im.decoding = "async";
      im.src = optimised(it.image);
      im.onload = () => kick.current();
      return im;
    });
    const tex = new window.Image();
    tex.src = optimised("/figma/texture.png");
    tex.onload = () => kick.current();

    let W = 0, H = 0, gap = 0, openW = 0, closedW = 0, dpr = 1;
    const w = new Float64Array(n);
    const v = new Float64Array(n);
    let sized = false;

    const targets = (i: number) => (i === active.current ? openW : closedW);

    const measure = () => {
      const r = wrap.getBoundingClientRect();
      if (!r.width) return;
      const prevOpen = openW, prevClosed = closedW;
      W = r.width;
      H = r.height;
      gap = (W * GAP) / FRAME_W;
      openW = (W * OPEN_W) / FRAME_W;
      closedW = (W - openW - gap * (n - 1)) / (n - 1);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      for (let i = 0; i < n; i++) {
        if (!sized) w[i] = targets(i);
        else {
          // keep each panel's openness through a resize
          const t = (w[i] - prevClosed) / (prevOpen - prevClosed || 1);
          w[i] = closedW + t * (openW - closedW);
        }
      }
      sized = true;
    };

    const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

    const coverDraw = (im: HTMLImageElement, cx: number, boxW: number) => {
      if (!im.complete || !im.naturalWidth) return false;
      const s = Math.max(boxW / im.naturalWidth, H / im.naturalHeight);
      const dw = im.naturalWidth * s, dh = im.naturalHeight * s;
      ctx.drawImage(im, cx - dw / 2, (H - dh) / 2, dw, dh);
      return true;
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      let x = 0, xv = 0; // left edge position and velocity
      const maxB = maxBow * H;
      for (let i = 0; i < n; i++) {
        const left = x, right = x + w[i];
        const vl = xv, vr = xv + v[i];
        // the middle of each edge leads in its direction of travel
        const bl = reduce ? 0 : clamp(vl * bowPerVelocity, -maxB, maxB);
        const br = reduce ? 0 : clamp(vr * bowPerVelocity, -maxB, maxB);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(left, 0);
        ctx.lineTo(right, 0);
        ctx.quadraticCurveTo(right + 2 * br, H / 2, right, H); // control at 2b → midpoint offset b
        ctx.lineTo(left, H);
        ctx.quadraticCurveTo(left + 2 * bl, H / 2, left, 0);
        ctx.closePath();
        ctx.clip();

        const t = clamp((w[i] - closedW) / (openW - closedW), 0, 1);
        const cx = (left + right) / 2;
        // photo framed for the open panel, centred on the panel (collapsed
        // panels show its middle strip, as in Figma)
        ctx.fillStyle = "#072871";
        ctx.fillRect(left - maxB, 0, w[i] + 2 * maxB, H);
        coverDraw(imgs[i], cx, Math.max(openW, w[i] + 2 * maxB));
        // overlay: 60% ink when collapsed → 20% + bottom fade when open
        ctx.fillStyle = `rgba(0,6,17,${0.6 - 0.4 * t})`;
        ctx.fillRect(left - maxB, 0, w[i] + 2 * maxB, H);
        if (t > 0) {
          const g = ctx.createLinearGradient(0, 0, 0, H);
          g.addColorStop(0, "rgba(0,6,17,0)");
          g.addColorStop(1, `rgba(0,6,17,${0.8 * t})`);
          ctx.fillStyle = g;
          ctx.fillRect(left - maxB, 0, w[i] + 2 * maxB, H);
        }
        // grain at 15%
        if (tex.complete && tex.naturalWidth) {
          ctx.globalAlpha = 0.15;
          const tw = openW * 1.0953;
          ctx.drawImage(tex, cx - openW / 2, -0.4711 * H, tw, H * 2.351);
          ctx.globalAlpha = 1;
        }
        ctx.restore();

        // DOM layer follows the same geometry
        const panel = panelRefs.current[i];
        if (panel) {
          panel.style.transform = `translateX(${left}px)`;
          panel.style.width = `${w[i]}px`;
        }
        const label = labelRefs.current[i];
        if (label) label.style.opacity = String(clamp(1 - t * 3, 0, 1));
        const content = contentRefs.current[i];
        if (content) content.style.opacity = String(clamp((t - contentFrom) / (1 - contentFrom), 0, 1));

        x = right + gap;
        xv = vr;
      }
    };

    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      let moving = false;
      if (reduce) {
        for (let i = 0; i < n; i++) (w[i] = targets(i)), (v[i] = 0);
      } else {
        // semi-implicit Euler in small sub-steps (stable at any frame rate)
        const steps = Math.ceil(dt / (1 / 240));
        const h = dt / steps;
        for (let s = 0; s < steps; s++)
          for (let i = 0; i < n; i++) {
            v[i] += (stiffness * (targets(i) - w[i]) - damping * v[i]) * h;
            w[i] += v[i] * h;
          }
        for (let i = 0; i < n; i++)
          if (Math.abs(v[i]) > 0.5 || Math.abs(targets(i) - w[i]) > 0.25) moving = true;
          else (w[i] = targets(i)), (v[i] = 0);
      }
      draw();
      if (moving) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    kick.current = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    measure();
    draw();
    const ro = new ResizeObserver(() => {
      measure();
      draw();
    });
    ro.observe(wrap);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      kick.current = () => {};
    };
  }, [items, reduce]);

  return (
    <>
      {/* Desktop: canvas accordion */}
      <div
        ref={wrapRef}
        role="group"
        aria-label="Industries"
        className="relative hidden h-u-500 w-full overflow-hidden lg:block"
      >
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
        {items.map((it, i) => (
          <div
            key={it.name}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="absolute top-0 left-0 h-full overflow-hidden text-bg"
            onPointerEnter={() => activate(i)}
            onFocusCapture={() => activate(i)}
          >
            {/* collapsed label (Figma: 18px, 16px in from the top left) */}
            <button
              type="button"
              aria-expanded={activeIdx === i}
              aria-label={it.name}
              onClick={() => activate(i)}
              className="absolute inset-0 text-left"
            >
              <p
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                aria-hidden
                className="absolute top-4 left-4 w-[calc(var(--u)*172)] text-lg leading-none tracking-[-0.005em]"
              >
                {it.label ?? it.name}
              </p>
            </button>

            {/* open content (Figma 581:1762): centred, 483 wide, 24.5 below centre */}
            <div
              ref={(el) => {
                contentRefs.current[i] = el;
              }}
              inert={activeIdx !== i}
              className="pointer-events-none absolute top-[calc(50%+var(--u)*24.5)] left-1/2 flex w-u-483 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-u-48 text-center opacity-0"
            >
              <div className="flex flex-col items-center gap-5">
                <h3 className="text-[40px] leading-none font-bold tracking-[-0.005em] lg:fs-u-40">{it.name}</h3>
                <p className="w-u-460 text-base leading-[1.5] tracking-[-0.005em]">{it.description}</p>
              </div>
              <a
                href="#contact"
                className="cta pointer-events-auto flex items-center justify-center gap-[9px] border border-fg/40 bg-bg px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] whitespace-nowrap text-fg"
              >
                {it.cta}
                <Arrow />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile / tablet: stacked cards */}
      <ul className="flex flex-col gap-2 lg:hidden">
        {items.map((it) => (
          <li key={it.name} className="relative h-[340px] overflow-hidden bg-navy text-bg">
            <Image src={it.image} alt="" fill sizes="100vw" quality={PHOTO_QUALITY} className="object-cover" />
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_6_17/0.2)_0%,rgb(0_6_17/0.85)_100%)]" />
            <Texture />
            <div className="absolute inset-x-5 bottom-6 flex flex-col items-start gap-4">
              <h3 className="text-[28px] leading-none font-bold tracking-[-0.005em]">{it.name}</h3>
              <p className="text-base leading-[1.5]">{it.description}</p>
              <a
                href="#contact"
                className="cta flex items-center gap-[9px] border border-fg/40 bg-bg px-5 py-3 text-base leading-[1.1] font-semibold text-fg"
              >
                {it.cta}
                <Arrow />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
