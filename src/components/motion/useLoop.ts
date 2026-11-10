"use client";

import { animate, useMotionValue, useReducedMotion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { duration, ease } from "@/lib/motion";

/**
 * Endless arrow carousel. The row renders a copy of the last item before the
 * first and a copy of the first after the last (both just off screen); an
 * arrow slides the row one card over, then the order rotates and the row
 * snaps back in the same frame, so the content repeats forever with no jump.
 *
 * Render `[order.at(-1), ...order, order[0]]` in a `ul` with `ref={rowRef}`,
 * `style={{ x }}` and a negative left margin of one step (card + gap).
 */
export function useLoop<T>(items: T[]) {
  const [order, setOrder] = useState(items);
  const x = useMotionValue(0);
  const rowRef = useRef<HTMLUListElement>(null);
  const busy = useRef(false);
  const reduce = useReducedMotion();

  const go = useCallback(
    async (dir: 1 | -1) => {
      const row = rowRef.current;
      if (busy.current || !row || row.children.length < 2) return;
      busy.current = true;
      const step = row.children[1].getBoundingClientRect().left - row.children[0].getBoundingClientRect().left;
      await animate(x, -dir * step, { duration: reduce ? 0 : duration.slow, ease: ease.inOut });
      flushSync(() => setOrder((o) => (dir === 1 ? [...o.slice(1), o[0]] : [o[o.length - 1], ...o.slice(0, -1)])));
      x.set(0);
      busy.current = false;
    },
    [reduce, x],
  );

  return { order, x, rowRef, next: () => go(1), prev: () => go(-1) };
}
