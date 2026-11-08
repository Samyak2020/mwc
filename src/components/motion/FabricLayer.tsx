"use client";

import { animate, useReducedMotion } from "motion/react";
import { useId, useLayoutEffect, useRef } from "react";
import { duration, fabric } from "@/lib/motion";

/** 1: pulled up from below, -1: pulled down from above. */
export type FabricDir = 1 | -1;

// Leading edge of the incoming layer: two travelling sine waves whose
// amplitude peaks mid-pull, so the edge ripples like cloth being tugged.
// Coordinates are objectBoundingBox (0–1).
function wavePath(p: number, dir: FabricDir) {
  const amp = fabric.ripple * Math.sin(Math.PI * p);
  const travel = -0.1 + p * 1.2; // overshoots both ends so the wave fully clears
  const phase = p * 1.1;
  const steps = 48;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const x = i / steps;
    const wave =
      amp * (Math.sin(2 * Math.PI * (1.1 * x + phase)) + 0.45 * Math.sin(2 * Math.PI * (2.3 * x - 1.4 * phase)));
    const edge = 1 - travel + wave; // covered region is [edge, 1] when pulled from below
    const y = dir === 1 ? edge : 1 - edge;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(4)},${y.toFixed(4)}`;
  }
  return d + (dir === 1 ? "L1,1.3L0,1.3Z" : "L1,-0.3L0,-0.3Z");
}

type FabricLayerProps = {
  dir: FabricDir;
  /** Called once the layer fully covers what is beneath it. */
  onDone?: () => void;
  children: React.ReactNode;
};

// A full-bleed layer that is "tugged" over whatever is beneath it like
// fabric: a rippling leading edge sweeps across while the content settles
// from a slight stretch. Reduced motion: a quick cross-fade.
// Used by the Industries hover backdrop and the Experience metrics.
export function FabricLayer({ dir, onDone, children }: FabricLayerProps) {
  const clipId = "fabric-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const pathRef = useRef<SVGPathElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const done = useRef(onDone);
  done.current = onDone;

  useLayoutEffect(() => {
    const path = pathRef.current;
    const content = contentRef.current;
    const el = layerRef.current;
    if (!path || !content || !el) return;

    if (reduce) {
      path.setAttribute("d", "M0,0H1V1H0Z");
      const c = animate(el, { opacity: [0, 1] }, { duration: duration.base, onComplete: () => done.current?.() });
      return () => c.stop();
    }

    content.style.transformOrigin = dir === 1 ? "50% 100%" : "50% 0%";
    const apply = (p: number) => {
      path.setAttribute("d", wavePath(p, dir));
      const rest = 1 - p;
      content.style.transform = `translate3d(0, ${dir * rest * fabric.tug}%, 0) scaleY(${1 + rest * fabric.stretch})`;
    };
    apply(0);
    const c = animate(0, 1, {
      duration: fabric.duration,
      ease: fabric.ease,
      onUpdate: apply,
      onComplete: () => done.current?.(),
    });
    return () => c.stop();
    // a layer plays its pull exactly once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={layerRef} className="absolute inset-0 overflow-hidden" style={{ clipPath: `url(#${clipId})` }}>
      <svg aria-hidden width="0" height="0" className="absolute">
        <clipPath id={clipId} clipPathUnits="objectBoundingBox">
          <path ref={pathRef} d={wavePath(0, dir)} />
        </clipPath>
      </svg>
      <div ref={contentRef} className="absolute inset-0 will-change-transform">
        {children}
      </div>
    </div>
  );
}
