"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { Children, isValidElement } from "react";
import { scrollReveal as r } from "@/lib/motion";

// Scroll reveal used on comp 4 v2 (after sereinwealth.com): rise r.y px, fade
// in and come into focus from an r.blur px blur. Each element watches its own
// position, so a tall list reveals card by card as you scroll; `order` adds
// r.step per position so elements that enter together still follow one
// another. Reduced motion: a plain fade.

function variants(reduce: boolean | null, delay: number): Variants {
  return reduce
    ? {
        hidden: { opacity: 0 },
        shown: { opacity: 1, transition: { duration: 0.4, delay } },
      }
    : {
        hidden: { opacity: 0, y: r.y, filter: `blur(${r.blur}px)` },
        shown: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: r.duration, ease: r.ease, delay },
        },
      };
}

type RiseProps = {
  /** position in its group: delays the reveal by order × step */
  order?: number;
  delay?: number;
  as?: "div" | "li" | "p" | "section";
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

export function Rise({
  order = 0,
  delay = 0,
  as = "div",
  className,
  children,
  ...rest
}: RiseProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      className={className}
      variants={variants(reduce, delay + order * r.step)}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: r.margin }}
      {...(rest as object)}
    >
      {children}
    </Tag>
  );
}

/** Wraps each direct child in a Rise, numbered in order: cards, columns, rows. */
export function RiseEach({
  as = "div",
  itemAs = "div",
  className,
  itemClassName,
  children,
}: {
  as?: "div" | "ul";
  itemAs?: "div" | "li";
  className?: string;
  itemClassName?: string;
  children: React.ReactNode;
}) {
  const Tag = as;
  return (
    <Tag className={className}>
      {Children.toArray(children)
        .filter(isValidElement)
        .map((child, i) => (
          <Rise
            key={child.key ?? i}
            as={itemAs}
            order={i}
            className={itemClassName}
          >
            {child}
          </Rise>
        ))}
    </Tag>
  );
}

/** A paragraph whose words rise one after another (r.wordStep apart). */
export function RiseWords({
  text,
  className,
  as = "p",
}: {
  text: string;
  className?: string;
  as?: "p" | "h3";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.p;
  const words = text.split(" ");
  const word = (i: number) => variants(reduce, reduce ? 0 : i * r.wordStep);
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: r.margin }}
    >
      {/* screen readers get the sentence once, not word by word */}
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i}>
            <motion.span className="inline-block" variants={word(i)}>
              {w}
            </motion.span>{" "}
          </span>
        ))}
      </span>
    </Tag>
  );
}
