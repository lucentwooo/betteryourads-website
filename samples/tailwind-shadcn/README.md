# Tailwind + shadcn/ui — format sample

This folder shows the **Pricing** section (see `../../components/Pricing/`) rewritten
in the Tailwind + shadcn/ui idiom, for comparing authoring formats. It is **not**
part of the site build — `app/` never imports it, so Tailwind stays out of the
production bundle. It is excluded from `tsconfig.json` and ESLint, so it does not
need to resolve the shadcn primitives it references.

- **CSS Modules version** (shipped): markup in `Pricing.tsx`, styling in
  `Pricing.module.css`, design values from `styles/tokens.css`. Styling and
  structure are separated.
- **Tailwind + shadcn version** (this folder): styling lives inline as utility
  classes; tokens map into a Tailwind `@theme` (`theme.css`); components come
  from shadcn primitives (`Card`, `Button`).

To run this for real you would: `npx shadcn@latest init`, add `card` + `button`,
import `theme.css`, and render `<Pricing />`. Left as reference only.
