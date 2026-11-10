"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useLoop } from "@/components/motion/useLoop";
import { CarouselNav } from "@/components/ui/CarouselNav";
import { Texture } from "@/components/ui/Texture";
import { FadeUp } from "@/components/comp2/FadeUp";
import { PHOTO_QUALITY } from "@/lib/motion";

type Member = { id: number; name: string; role: string; experience: string; image: string; crop?: string };

// Revised Figma team cards (629:572 / 573 / 583 / 595).
const team: Member[] = [
  { id: 1, name: "John B. Doe", role: "Project Manager", experience: "8+ yrs of exp", image: "/comp1r/team-1.png" },
  { id: 2, name: "Samantha Campbell", role: "Project Manager", experience: "8+ yrs of exp", image: "/comp1r/team-2.png" },
  { id: 3, name: "Jason Todd", role: "Project Manager", experience: "8+ yrs of exp", image: "/comp1r/team-3.png" },
  { id: 4, name: "Frank Schaffer", role: "Project Manager", experience: "8+ yrs of exp", image: "/comp1r/team-4.png", crop: "0% 0%" },
];

function Card({ m, clone = false }: { m: Member; clone?: boolean }) {
  return (
    <li
      // every other person sits 95px lower (Figma), tied to the person so the
      // stagger travels with the card as the row loops
      className={`w-[260px] shrink-0 sm:w-[300px] lg:w-u-329 ${m.id % 2 === 0 ? "mt-12 lg:mt-u-95" : ""}`}
      {...(clone ? { "aria-hidden": true, inert: true } : {})}
    >
      <div className="relative h-[300px] w-full overflow-hidden bg-navy sm:h-[330px] lg:h-u-360">
        <Image
          src={m.image}
          alt={clone ? "" : m.name}
          fill
          sizes="(min-width: 1024px) 23vw, 300px"
          quality={PHOTO_QUALITY}
          className="object-cover"
          style={m.crop ? { objectPosition: m.crop } : undefined}
        />
        <Texture />
      </div>
      <p className="flex h-12 items-center bg-sky px-5 text-xl leading-[1.3] font-bold tracking-[-0.005em] text-bg">{m.name}</p>
      <p className="flex h-12 items-center justify-between bg-navy px-5 text-sm leading-[1.5] tracking-[0.005em] text-bg">
        <span>{m.role}</span>
        <span>{m.experience}</span>
      </p>
    </li>
  );
}

// Revised Figma y=6820–7568: intro, "Meet the Team" + arrows, staggered
// member cards that slide one over per arrow press and repeat endlessly.
export function TeamRow({ className = "pt-24 lg:pt-u-184" }: { className?: string } = {}) {
  const { order, x, rowRef, prev, next } = useLoop(team);
  return (
    <section aria-labelledby="team-heading" className={`shell ${className}`}>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <FadeUp className="max-w-[678px] lg:w-u-678">
          <h2
            id="team-heading"
            className="text-[28px] leading-[1.1] font-medium tracking-[-0.005em] text-fg/90 sm:text-[40px] lg:fs-u-40"
          >
            Each engagement is led by a senior project or construction manager who has run comparable work.
          </h2>
        </FadeUp>
        <CarouselNav label="Meet the Team" what="team member" onPrev={prev} onNext={next} />
      </div>

      <div className="-mx-4 mt-10 overflow-hidden px-4 lg:mx-0 lg:mt-u-64 lg:px-0">
        <motion.ul
          ref={rowRef}
          aria-label="Team members"
          className="-ml-[280px] flex items-start gap-5 sm:-ml-[320px] lg:-ml-[calc(var(--u)*349)] lg:gap-u-20"
          style={{ x }}
        >
          <Card key={`pre-${order[order.length - 1].id}`} m={order[order.length - 1]} clone />
          {order.map((m) => (
            <Card key={m.id} m={m} />
          ))}
          <Card key={`post-${order[0].id}`} m={order[0]} clone />
        </motion.ul>
      </div>
    </section>
  );
}
