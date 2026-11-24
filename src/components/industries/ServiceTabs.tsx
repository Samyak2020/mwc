"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { duration, ease } from "@/lib/motion";

type Group = {
  label: string;
  items: { lead: string; text: string; href: string }[];
};

// Services, after a tabbed reference: the categories listed on the left with a
// dot marking the open one; choosing one swaps the services shown beside it.
export function ServiceTabs({
  groups,
  footer,
}: {
  groups: Group[];
  footer?: React.ReactNode;
}) {
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();
  const uid = useId();
  const g = groups[open];

  return (
    <div className="grid gap-10 lg:grid-cols-[calc(var(--u)*300)_minmax(0,1fr)] lg:gap-u-96">
      <div className="flex flex-col gap-8 lg:gap-u-48">
        <div
          role="tablist"
          aria-orientation="vertical"
          className="flex flex-wrap gap-x-6 gap-y-3 lg:flex-col lg:gap-4"
        >
          {groups.map((x, i) => {
            const on = i === open;
            return (
              <button
                key={x.label}
                id={`${uid}-tab-${i}`}
                role="tab"
                aria-selected={on}
                aria-controls={`${uid}-panel`}
                onClick={() => setOpen(i)}
                className={`group flex items-center gap-3 text-left text-lg leading-[1.2] transition-colors duration-[var(--duration-base)] ${on ? "text-fg" : "text-fg/45 hover:text-fg/75"}`}
              >
                <span
                  aria-hidden
                  className={`grid size-[14px] shrink-0 place-items-center rounded-full border transition-colors duration-[var(--duration-base)] ${on ? "border-fg" : "border-fg/30 group-hover:border-fg/55"}`}
                >
                  <span
                    className={`size-[6px] rounded-full bg-fg transition-transform duration-[var(--duration-base)] ${on ? "scale-100" : "scale-0"}`}
                  />
                </span>
                {x.label}
              </button>
            );
          })}
        </div>
        {footer && <div>{footer}</div>}
      </div>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${open}`}
        className="min-h-[320px]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={open}
            className="flex flex-col"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: duration.base, ease: ease.out }}
          >
            {g.items.map((it) => (
              <li key={it.lead} className="border-t border-fg/15 last:border-b">
                <a
                  href={it.href}
                  className="cta group grid gap-3 py-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_auto] lg:items-baseline lg:gap-u-56 lg:py-u-32"
                >
                  <span className="text-xl leading-[1.25] font-semibold tracking-[-0.01em] transition-colors duration-[var(--duration-base)] group-hover:text-navy">
                    {it.lead}
                  </span>
                  <span className="max-w-[520px] text-base leading-[1.55] text-fg/70">
                    {it.text}
                  </span>
                  <span className="hidden text-fg/60 transition-colors duration-[var(--duration-base)] group-hover:text-navy lg:block">
                    <Arrow width={18} />
                  </span>
                </a>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}
