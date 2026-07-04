# Loopy — Landing Page

Marketing site for **Loopy** (tryloopy.io): Meta ads, built for B2B SaaS. We learn the
product, write the angles, ship the creative, and run the ads — tuned for trial
signups, not add-to-carts.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **CSS Modules** over a shared design-token layer (`styles/tokens.css`)
- **DM Sans** via `next/font`
- **Vitest** + React Testing Library for logic/behavior tests
- Static deploy on **Vercel** (no backend)

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Verify

```bash
npm run lint     # fails on unused vars/imports
npx tsc --noEmit
npm test
npm run build
```

## Structure

```
app/                 # App Router entry (layout, page, globals)
components/          # one folder per section + ui/ primitives; co-located CSS Modules
styles/tokens.css    # design system: color, type, spacing, motion (source of truth)
public/              # logo, favicon, demo image
legacy/              # original static HTML/CSS, kept for reference
docs/superpowers/    # design spec + this plan
```

## Notes

- The waitlist form is client-only (inline confirmation, no persistence). A real
  endpoint can be wired into `components/ui/WaitlistForm.tsx` later without
  changing markup.
- `legacy/` is reference only; nothing in the app imports from it.
