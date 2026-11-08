# Project guide for Claude Code

This is a client prototype: a website built from a Figma design, with motion,
deployed to Vercel so clients can review it by link.

## Stack
- Next.js (App Router, TypeScript), Tailwind CSS v4, Motion (`motion/react`)
- Motion tokens live in `src/lib/motion.ts`. Always use them; never hard-code
  durations or easing curves in components.
- Design tokens (colors, type) live in `src/app/globals.css`.

## Building from Figma
- Use the Figma MCP server (`.mcp.json`). When given a Figma frame link, call
  `get_design_context` for that node, and `get_variable_defs` to pull tokens.
- Build one section at a time. After each section, run the dev server and
  compare against `get_screenshot` of the frame before moving on.
- Match the design exactly: spacing, type sizes, colors. Don't invent styling.
- Export images/icons from Figma into `public/` and use `next/image`.
- Components go in `src/components/`, one per section (e.g. `Hero.tsx`).

## Motion rules
- Get the static layout right first; add motion as a separate pass.
- Follow the motion notes in the Figma file when present.
- Prefer one orchestrated moment (e.g. the hero load sequence) over
  animating every section. Motion that responds to user actions
  (hover, open, expand) is welcome when it shows what changed.
- Animate only `transform` and `opacity` where possible.
- Reduced motion is handled globally by `MotionProvider`; don't remove it.

## Quality bar
- Responsive down to 360px wide. Visible keyboard focus.
- `npm run build` must pass before any push.

## Deploying
- The repo is connected to Vercel through GitHub. Pushing a branch creates a
  preview URL; merging to `main` updates the main client link.
