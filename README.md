# Client prototype

A Next.js + Tailwind + Motion starter, set up to be built from a Figma design
with Claude Code and deployed to Vercel.

## 1. Run it locally
You need Node.js 20 or newer.

```bash
npm install
npm run dev
```
Open http://localhost:3000.

## 2. Open it in Claude Code
Open this folder in Claude Code (Claude Desktop → Code tab, or run `claude` in
the folder). `CLAUDE.md` tells it how to work on this project, and `.mcp.json`
connects it to Figma. The first time, it will ask you to sign in to Figma.

Then try a prompt like:
> Build the hero section from this frame: <paste Figma frame link>.
> Pull the color and type variables into globals.css first.

Repeat section by section, then ask for the motion pass.

## 3. Put it on GitHub
Create an empty repo on github.com, then:

```bash
git add -A
git commit -m "Initial setup"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```
(Or just ask Claude Code to do this for you.)

## 4. Deploy on Vercel
1. Go to vercel.com → Add New → Project → import the GitHub repo.
2. Keep the defaults and click Deploy.
3. Every push now redeploys. Pushing a branch creates its own preview link,
   handy for showing clients a revision without changing the main link.

Before sending a link, open it in a private browser window. If Vercel asks
you to log in, turn off Vercel Authentication under
Project → Settings → Deployment Protection so clients can view it.
