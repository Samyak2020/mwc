"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { RevealHeading, Line } from "@/components/motion/LineReveal";
import { useLoop } from "@/components/motion/useLoop";
import { CarouselNav } from "@/components/ui/CarouselNav";
import { Texture } from "@/components/ui/Texture";
import { PHOTO_QUALITY } from "@/lib/motion";

type Article = {
  id: number;
  title: string;
  description: string;
  image: string;
  /** image height in Figma px (cards are top-aligned with ragged bottoms) */
  h: number;
};

// Revised Figma "Resource card" ×3 (629:626 / 633 / 638).
const articles: Article[] = [
  {
    id: 1,
    title: "What Does an Owner’s Representative Actually Do on a Utility Project?",
    description:
      "Understand the owner’s representative’s responsibilities, how the role differs from construction management and where it can supplement your internal team.",
    image: "/comp1r/res-1.png",
    h: 400,
  },
  {
    id: 2,
    title: "What Construction Firms Need to Know Before Entering Utility Work",
    description:
      "Review the documentation, utility coordination and scheduling requirements that affect planning and field execution.",
    image: "/comp1r/res-2.png",
    h: 231,
  },
  {
    id: 3,
    title: "How Project Leaders Keep Construction Teams Aligned",
    description:
      "See how defined responsibilities, regular coordination and documented decisions help teams manage changing field conditions.",
    image: "/comp1r/res-3.png",
    h: 338,
  },
];

function Card({ a, clone = false }: { a: Article; clone?: boolean }) {
  return (
    <li className="w-[300px] shrink-0 lg:w-u-446" {...(clone ? { "aria-hidden": true, inert: true } : {})}>
      <a href="#" className="group flex flex-col gap-8">
        {/* Hover (Figma 629:626): photo darkens to 50%, "Read the Article" in an ink chip */}
        <div className="relative w-full overflow-hidden bg-navy" style={{ height: `calc(var(--u) * ${a.h})`, minHeight: a.h * 0.6 }}>
          <Image src={a.image} alt="" fill sizes="(min-width: 1024px) 31vw, 300px" quality={PHOTO_QUALITY} className="object-cover" />
          <div aria-hidden className="absolute inset-0 bg-black/10" />
          <Texture top="-47.11%" height="235.1%" />
          <div
            aria-hidden
            className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:opacity-100 group-focus-visible:opacity-100"
          />
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-night/50 px-3 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-bg uppercase opacity-0 transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            Read the Article
          </span>
        </div>
        <div className="flex flex-col gap-5">
          <h3 className="text-xl leading-[1.3] font-semibold tracking-[0.005em] text-fg group-hover:text-navy">{a.title}</h3>
          <p className="text-base leading-[1.5] tracking-[0.005em] text-fg/80">{a.description}</p>
        </div>
      </a>
    </li>
  );
}

// Revised Figma y=4654–5297: "Client Resources" + See all + arrows, cards
// that slide one over per arrow press and repeat endlessly.
export function ClientResources() {
  const { order, x, rowRef, prev, next } = useLoop(articles);
  return (
    <section aria-labelledby="resources-heading" className="shell pt-24 lg:pt-u-206">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <RevealHeading id="resources-heading" className="display text-[44px] text-fg sm:text-[64px] lg:fs-u-64">
          <Line className="block">Client Resources</Line>
        </RevealHeading>
        <CarouselNav label="See all" what="article" onPrev={prev} onNext={next} />
      </div>

      <div className="-mx-4 mt-10 overflow-hidden px-4 lg:mx-0 lg:mt-u-40 lg:px-0">
        <motion.ul
          ref={rowRef}
          aria-label="Articles"
          // starts one card to the left so the "previous" copy is hidden
          className="-ml-[320px] flex items-start gap-5 lg:-ml-[calc(var(--u)*466)] lg:gap-u-20"
          style={{ x }}
        >
          <Card key={`pre-${order[order.length - 1].id}`} a={order[order.length - 1]} clone />
          {order.map((a) => (
            <Card key={a.id} a={a} />
          ))}
          <Card key={`post-${order[0].id}`} a={order[0]} clone />
        </motion.ul>
      </div>
    </section>
  );
}
