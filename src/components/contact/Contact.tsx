"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { industries } from "@/components/nav/navData";
import { Rise } from "@/components/motion/Rise";
import { Arrow } from "@/components/ui/Arrow";
import { PHOTO_QUALITY } from "@/lib/motion";

// Contact (layout after gigaenergy.com/contact): the form on the site's paper
// ground, outlined fields with the site's 4px corner, and the navy raised
// submit. The field photograph carries the page; the contact details sit on it
// as one solid navy sheet of ruled rows, links set as plain underlined text.
// Addresses and links are placeholders.

const label = "text-[15px] leading-[1.3] font-medium text-fg/80";
const field =
  "w-full rounded-[4px] border border-fg/30 bg-transparent px-5 py-3.5 text-[17px] text-fg placeholder:text-fg/40 outline-none transition-colors duration-[var(--duration-fast)] hover:border-fg/60 focus-visible:border-navy focus-visible:ring-1 focus-visible:ring-navy";

const budgets = ["Under $1M", "$1M – $10M", "$10M – $50M", "$50M+", "Not yet defined"];

function Field({ id, text, children }: { id: string; text: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className={label}>
        {text}
      </label>
      {children}
    </div>
  );
}

function Form() {
  const uid = useId();
  const [picked, setPicked] = useState<string[]>([]);
  const [file, setFile] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const toggle = (k: string) => setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  if (sent)
    return (
      <div className="mt-16 rounded-[4px] border border-fg/20 p-8" role="status">
        <p className="display text-[28px] leading-none">Thank you</p>
        <p className="mt-4 max-w-[420px] text-fg/70">A project lead will be in touch within one business day.</p>
      </div>
    );

  return (
    <form
      className="mt-14 flex flex-col gap-10"
      onSubmit={(e) => {
        // prototype: no backend yet, so confirm in place
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-6">
        <Field id={`${uid}-name`} text="What’s your name?">
          <input id={`${uid}-name`} name="name" required autoComplete="name" placeholder="Full name" className={field} />
        </Field>
        <Field id={`${uid}-company`} text="What’s your company’s name?">
          <input id={`${uid}-company`} name="company" autoComplete="organization" placeholder="Company name" className={field} />
        </Field>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 sm:gap-6">
        <Field id={`${uid}-email`} text="What’s your email address?">
          <input id={`${uid}-email`} name="email" type="email" required autoComplete="email" placeholder="Email address" className={field} />
        </Field>
        <Field id={`${uid}-phone`} text="What’s your phone number?">
          <input id={`${uid}-phone`} name="phone" type="tel" autoComplete="tel" placeholder="Phone number" className={field} />
        </Field>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className={`${label} mb-3`}>Which industry? (select all that apply)</legend>
        <div className="flex flex-wrap gap-2">
          {industries.map((ind) => {
            const on = picked.includes(ind.key);
            return (
              <button
                key={ind.key}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(ind.key)}
                className={`min-h-10 rounded-[4px] border px-4 text-sm leading-none font-medium transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
                  on ? "border-navy bg-navy text-bg" : "border-fg/30 text-fg/75 hover:border-fg/60 hover:text-fg"
                }`}
              >
                {ind.label}
              </button>
            );
          })}
        </div>
        <input type="hidden" name="industries" value={picked.join(",")} />
      </fieldset>

      <Field id={`${uid}-budget`} text="Is there a defined budget for this project?">
        <div className="relative">
          <select
            id={`${uid}-budget`}
            name="budget"
            defaultValue=""
            className={`${field} appearance-none pr-12`}
          >
            <option value="" disabled>
              Please select
            </option>
            {budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <svg aria-hidden width="10" height="6" viewBox="0 0 10 6" className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 opacity-60">
            <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Field>

      <Field id={`${uid}-about`} text="Tell us about your project">
        <textarea
          id={`${uid}-about`}
          name="about"
          rows={5}
          placeholder="What are you trying to achieve? Share the scope, schedule, challenges or requirements."
          className={`${field} resize-y`}
        />
      </Field>

      <Field id={`${uid}-file`} text="Attach a project brief (optional) – up to 5MB">
        <label
          htmlFor={`${uid}-file`}
          className="flex min-h-[112px] cursor-pointer items-center justify-center rounded-[4px] border border-dashed border-fg/30 px-5 text-center text-fg/70 transition-colors duration-[var(--duration-fast)] hover:border-fg/60"
        >
          {file ?? (
            <span>
              Drop file here or <span className="text-fg underline underline-offset-4">browse</span>
            </span>
          )}
        </label>
        <input
          id={`${uid}-file`}
          name="brief"
          type="file"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            setFile(f ? (f.size > 5 * 1024 * 1024 ? "That file is over 5MB" : f.name) : null);
          }}
        />
      </Field>

      <div>
        <button
          type="submit"
          className="cta btn btn-dark btn-raised flex items-center justify-center gap-[9px] bg-navy px-6 py-4 text-base leading-[1.1] font-semibold tracking-[-0.005em] whitespace-nowrap text-bg"
        >
          Send Message
          <Arrow />
        </button>
      </div>
    </form>
  );
}

/* ----------------------------------------------- details on the photo */

// one solid sheet of ruled rows: the label on the left, the way to reach us on
// the right, links as plain underlined text
const link =
  "text-[15px] font-medium text-bg underline decoration-bg/40 underline-offset-4 transition-[text-decoration-color] duration-[var(--duration-fast)] hover:decoration-bg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bg";
const row = "flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6";
const lead = "text-[17px] leading-[1.3]";

function Details() {
  return (
    <div className="divide-y divide-bg/15 overflow-hidden rounded-[4px] bg-navy text-bg">
      <div className={row}>
        <p className={lead}>Project enquiries</p>
        <a href="mailto:projects@mwconsultllc.com" className={link}>
          projects@mwconsultllc.com
        </a>
      </div>
      <div className={row}>
        <p className={lead}>General enquiries</p>
        <a href="mailto:info@mwconsultllc.com" className={link}>
          info@mwconsultllc.com
        </a>
      </div>
      <div className="grid items-start gap-3 px-6 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
        <div>
          <p className={lead}>Address</p>
          <p className="mt-2 max-w-[240px] text-sm leading-[1.5] text-pretty text-bg/70">
            Veteran-led, supporting projects across the US from our Arizona office.
          </p>
        </div>
        <address className="sm:text-right text-[15px] leading-[1.5] text-bg/90 not-italic tabular-nums">
          [Street address],
          <br />
          [City], AZ [ZIP]
          <br />
          <a href="tel:+16237386988" className={`${link} mt-3 inline-block`}>
            (623) 738-6988
          </a>
        </address>
      </div>
      <div className={row}>
        <p className={lead}>
          Join us <span className="ml-1 text-sm text-bg/70">(open positions)</span>
        </p>
        <a href="/careers" className={link}>
          Careers
        </a>
      </div>
      <div className={row}>
        <p className={lead}>Socials</p>
        <a href="#" className={link}>
          LinkedIn
        </a>
      </div>
    </div>
  );
}

export function ContactPage() {
  return (
    <section data-nav-theme="light" data-nav-solid="" aria-labelledby="contact-title" className="grid bg-bg text-fg lg:grid-cols-2">
      {/* left: the form */}
      <div className="shell pt-28 pb-20 lg:pt-[calc(var(--u)*160)] lg:pb-u-120">
        <Rise>
          <h1 id="contact-title" className="display text-[48px] sm:text-[64px] lg:fs-u-80">
            Talk to a
            <br />
            Project Lead
          </h1>
        </Rise>
        <Rise delay={0.1}>
          <p className="mt-6 max-w-[460px] text-lg leading-[1.5] text-fg/70">
            Tell us about your project and we’ll get back to you with what we can do for you.
          </p>
        </Rise>
        <Form />
      </div>

      {/* right: the photo, held while the form scrolls, with the details on it */}
      <div className="relative bg-night">
        <div className="relative h-[70svh] overflow-hidden lg:sticky lg:top-0 lg:h-svh">
          <Image src="/about-v2/cta.png" alt="" fill priority sizes="(min-width: 1024px) 50vw, 100vw" quality={PHOTO_QUALITY} className="object-cover" />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_6_17/0.2),rgb(0_6_17/0)_40%,rgb(0_6_17/0.35))]" />
          <div className="absolute right-4 bottom-4 left-4 hidden lg:right-6 lg:bottom-6 lg:left-auto lg:block lg:w-[min(520px,calc(100%-48px))]">
            <Details />
          </div>
        </div>
        {/* small screens: the details sit under the photo */}
        <div className="bg-bg p-4 lg:hidden">
          <Details />
        </div>
      </div>
    </section>
  );
}
