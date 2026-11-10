"use client";

import Image from "next/image";
import { animate, motion, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Arrow } from "@/components/ui/Arrow";
import { TexturedPanel } from "@/components/ui/Texture";
import { StaggerItem } from "@/components/motion/Stagger";
import { duration, ease, stagger } from "@/lib/motion";

// Placeholder people from the Figma file.
const team = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  name: "John Doe",
  role: "Project Manager",
  experience: "8+ yrs of exp",
}));
type Member = (typeof team)[number];

const GAP = 20; // Figma "Teams" frame: 4 × 329 cards, 20 apart

function MemberCard({ m, clone = false }: { m: Member; clone?: boolean }) {
  return (
    <StaggerItem
      className="w-[260px] shrink-0 snap-start sm:w-[329px] lg:w-[calc((100%-60px)/4)]"
      {...(clone ? { "aria-hidden": true, inert: true } : {})}
    >
      <TexturedPanel className="aspect-[329/290] w-full" />
      <div className="h-[110px] border border-fg/10 px-3 pt-[11px]">
        <p className="text-lg leading-[1.3] font-medium tracking-[-0.005em] text-fg/90">{m.name}</p>
        <p className="mt-1 text-sm leading-[1.5] tracking-[0.005em] text-fg/80">{m.role}</p>
        <p className="mt-4 text-sm leading-[1.5] tracking-[0.005em] text-muted">{m.experience}</p>
      </div>
    </StaggerItem>
  );
}

// Figma "Team" (y=7135): intro, prev/next + "Meet the Team", member cards.
// Desktop: the arrows slide the row one card in the clicked direction and
// it loops (copies of the last/first card wait just off each edge, so the
// incoming side is never empty). Mobile: a swipeable row; arrows scroll it.
export function Team({ variant = "comp1" }: { variant?: "comp1" | "comp2" } = {}) {
  const comp2 = variant === "comp2";
  const scroller = useRef<HTMLUListElement>(null);
  const [order, setOrder] = useState(team);
  const [desktop, setDesktop] = useState(false);
  const x = useMotionValue(0);
  const busy = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const step = () => {
    const card = scroller.current?.querySelector("li");
    return card ? card.getBoundingClientRect().width + GAP : 300;
  };

  const go = async (dir: 1 | -1) => {
    if (!desktop) {
      scroller.current?.scrollBy({ left: dir * step(), behavior: "smooth" });
      return;
    }
    if (busy.current) return;
    busy.current = true;
    await animate(x, -dir * step(), { duration: duration.slow, ease: ease.inOut });
    // rotate the order and snap back in the same frame: no visible jump
    flushSync(() => setOrder((o) => (dir === 1 ? [...o.slice(1), o[0]] : [o[o.length - 1], ...o.slice(0, -1)])));
    x.set(0);
    busy.current = false;
  };

  const last = order[order.length - 1];
  const first = order[0];

  return (
    <section aria-labelledby="team-heading" className={`shell pt-24 ${comp2 ? "lg:pt-u-142" : "lg:pt-u-200"}`}>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <h2
          id="team-heading"
          className={`max-w-[678px] font-display text-[28px] leading-none font-semibold tracking-[-0.02em] text-fg lg:w-u-678 ${
            comp2 ? "lg:fs-u-32 lg:leading-[0.95]" : "sm:text-[40px] lg:fs-u-40"
          }`}
        >
          Each engagement is led by a senior project or construction manager who has run comparable work.
        </h2>

        {comp2 ? (
          // Figma "Team Navigation" (581:1905): text link, then prev / next
          <div className="flex items-center gap-4">
            <a href="#" className="cta px-5 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-fg">
              Meet the Team
            </a>
            <button type="button" aria-label="Previous team member" onClick={() => go(-1)} className="cta shrink-0">
              <Image src="/comp2/btn-prev.svg" alt="" width={55} height={50} className="-scale-x-100" />
            </button>
            <button type="button" aria-label="Next team member" onClick={() => go(1)} className="cta shrink-0">
              <Image src="/figma/btn-next.svg" alt="" width={55} height={50} />
            </button>
          </div>
        ) : (
        <div className="flex items-center gap-4">
          <button type="button" aria-label="Previous team member" onClick={() => go(-1)} className="cta shrink-0">
            <Image src="/figma/btn-prev.svg" alt="" width={55} height={50} className="-scale-x-100" />
          </button>
          <button type="button" aria-label="Next team member" onClick={() => go(1)} className="cta shrink-0">
            <Image src="/figma/btn-next.svg" alt="" width={55} height={50} />
          </button>
          <a
            href="#"
            className="cta flex w-[213px] items-center justify-center gap-[9px] border border-fg/40 px-3 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] text-fg"
          >
            Meet the Team
            <Arrow />
          </a>
        </div>
        )}
      </div>

      <div className="mt-8 lg:mt-u-32 lg:overflow-hidden">
        <motion.ul
          ref={scroller}
          aria-label="Team members"
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 lg:mx-0 lg:w-full lg:snap-none lg:overflow-visible lg:px-0"
          // desktop: start one card to the left so the "previous" copy is hidden
          style={desktop ? { x, marginLeft: `calc(-1 * ((100% - 60px) / 4 + ${GAP}px))` } : undefined}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
        >
          {desktop && <MemberCard key={`pre-${last.id}`} m={last} clone />}
          {order.map((m) => (
            <MemberCard key={m.id} m={m} />
          ))}
          {desktop && <MemberCard key={`post-${first.id}`} m={first} clone />}
        </motion.ul>
      </div>
    </section>
  );
}
