# BetterYourAds Next.js Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the static `legacy/index.html` BetterYourAds landing page as a scalable Next.js (App Router) + TypeScript app, faithful to the existing design, deployable as a static site on Vercel with no backend.

**Architecture:** Static-first App Router app at the repo root, alongside an untouched `legacy/`. Every section is a React Server Component except two isolated `"use client"` components: `LiveDemo` (animated ad-generator, driven by a pure `useReducer` phase machine) and `WaitlistForm` (client-only inline confirmation). The design system (`tokens.css`) is preserved verbatim as the single source of truth; each section's styles live in a co-located CSS Module. Only styles/assets the live page actually uses are ported.

**Tech Stack:** Next.js (App Router, latest), TypeScript, CSS Modules, `next/font/google` (DM Sans), Vitest + React Testing Library (logic/behavior tests only). A separate `samples/tailwind-shadcn/` folder demos one section in Tailwind + shadcn/ui for format comparison and is excluded from the build.

---

## How to read this plan

The legacy source (`legacy/index.html`, `legacy/styles/*.css`) stays in the repo and is the source of truth for markup and styling. Two kinds of porting work appear:

- **New / non-mechanical code** (the reducer, `WaitlistForm` logic, font/token wiring, the optimize-chart data, `next/image` swaps) — given in full as code blocks.
- **Mechanical markup/CSS ports** (static sections) — given as precise instructions: exact legacy line ranges, the className→module mapping, and the transforms to apply. The engineer reads the legacy file and applies them. This avoids duplicating ~1,300 lines of HTML/CSS into the plan and keeps the legacy file authoritative.

**JSX transform rules (apply to every markup port):**
1. `class="x"` → `className={styles.x}` (kebab class `foo-bar` → `styles['foo-bar']`).
2. Self-close void elements (`<img ... />`, `<input ... />`).
3. Inline `style="a:b;c:d"` → `style={{ a: 'b', c: 'd' }}` (camelCase props, string values).
4. `<img src="assets/x">` → `next/image` `<Image src="/x" .../>` with explicit `width`/`height` (values given per task), EXCEPT decorative inline-SVG/spans which stay as-is.
5. `<a href="#id">` stays a plain `<a>` (same-page anchors).
6. Comments (`<!-- -->`) are dropped unless they label a non-obvious block.

**CSS Module port rules:**
1. Copy only the listed selector blocks from the legacy file. Do NOT copy the omitted (dead) selectors.
2. Strip the leading `.` is NOT needed — keep class selectors; CSS Modules scopes them. Keep `var(--token)` references unchanged (tokens are global).
3. `@keyframes`, `@media`, and `:root` overrides used by a module move into that module (CSS Modules hoists `@keyframes` and `@media` fine; `:global(:root){}` for any root var override).
4. Pseudo-selectors and combinators (`.x .y`, `.x:hover`, `.x::before`) stay; CSS Modules scopes the leading class.

---

## Task 0: Scaffold the Next.js app and strip boilerplate

**Files:**
- Create (via generator): `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `next-env.d.ts`, `.gitignore`
- Delete: generator boilerplate (`public/*.svg` defaults, `app/favicon.ico` if undesired, default `app/page.module.css`)

- [ ] **Step 1: Scaffold into the existing repo root**

The repo root already contains `legacy/` and `docs/`. Scaffold into a temp dir and move files in (create-next-app refuses a non-empty dir).

Run:
```bash
cd "C:\Users\jerem\OneDrive\Documents\Projects\betteryourads-website"
npx create-next-app@latest .bya-scaffold --typescript --eslint --app --no-src-dir --no-tailwind --import-alias "@/*" --use-npm --no-turbopack
```
Expected: scaffold completes in `.bya-scaffold/`.

- [ ] **Step 2: Move scaffold output to repo root, then remove temp dir**

Run (PowerShell):
```powershell
$src = ".bya-scaffold"
Get-ChildItem -Force $src | Where-Object { $_.Name -ne '.git' } | ForEach-Object { Move-Item -Force $_.FullName . }
Remove-Item -Recurse -Force $src
```
Expected: `package.json`, `app/`, `next.config.ts`, `tsconfig.json` now at repo root. `legacy/` and `docs/` untouched.

- [ ] **Step 3: Verify the dev toolchain runs**

Run:
```bash
npm run build
```
Expected: build succeeds on the default starter page.

- [ ] **Step 4: Delete starter boilerplate (hygiene)**

Remove the default home page styling and starter assets that won't be used:
```powershell
Remove-Item -Force app/page.module.css -ErrorAction SilentlyContinue
Remove-Item -Force public/next.svg, public/vercel.svg, public/file.svg, public/globe.svg, public/window.svg -ErrorAction SilentlyContinue
```
Leave `app/layout.tsx`, `app/page.tsx`, `app/globals.css` (rewritten in later tasks).

- [ ] **Step 5: Replace `.gitignore` with a clean Next.js ignore**

Overwrite `.gitignore` with:
```gitignore
# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files
.env
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 6: Commit**
```bash
git add -A
git commit -m "chore: scaffold Next.js app and strip starter boilerplate"
```

---

## Task 1: Add test tooling (Vitest + RTL)

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`
- Modify: `package.json` (scripts + devDeps), `tsconfig.json` (vitest globals types)

- [ ] **Step 1: Install dev dependencies**
```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Create `vitest.config.ts`**
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: { '@': resolve(__dirname, '.') },
  },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**
```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Add the test script to `package.json`**

In `"scripts"`, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Add vitest globals to `tsconfig.json`**

In `compilerOptions.types` (create the array if absent), add `"vitest/globals"`. Example merge:
```jsonc
"types": ["vitest/globals"]
```

- [ ] **Step 6: Add a smoke test to prove the harness works**

Create `vitest.smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
describe('harness', () => {
  it('runs', () => { expect(1 + 1).toBe(2); });
});
```

Run: `npm test`
Expected: 1 passed.

- [ ] **Step 7: Delete the smoke test and commit**
```bash
git rm vitest.smoke.test.ts
git add -A
git commit -m "chore: add vitest + react-testing-library"
```

---

## Task 2: Port design tokens and wire DM Sans

**Files:**
- Create: `styles/tokens.css`
- Modify: `app/globals.css`, `app/layout.tsx`

- [ ] **Step 1: Create `styles/tokens.css` from the legacy tokens**

Copy `legacy/styles/tokens.css` into `styles/tokens.css` with these hygiene edits:
- **Delete the entire `@import url('https://fonts.googleapis.com/...')` line** (line 7). Fonts now load via `next/font`.
- In the type section, **delete** the alt-font variables `--font-inter`, `--font-open`, `--font-jakarta` and their "Alternative sans candidates" comment.
- Change `--font-sans` to consume the next/font variable:
  ```css
  --font-sans: var(--font-dm-sans), ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  ```
- Change `--font-mono` to alias sans (the marketing layer never renders mono):
  ```css
  --font-mono: var(--font-sans);
  ```
- **Delete** the `.serif` rule (lines ~242-246, the "Reserved — no serif family" placeholder).
- Keep everything else verbatim: all color tokens, sizes, spacing, radii, shadows, motion, the base resets, the semantic type classes (`.display`, `h1`–`h5`, `.lead`, `.small`, `.meta`, `.eyebrow`, `.mono`, link styles, `::selection`, `:focus-visible`).

- [ ] **Step 2: Rewrite `app/globals.css`**

Replace its entire contents with:
```css
@import "../styles/tokens.css";

html, body { margin: 0; background: var(--bg); }
body { overflow-x: hidden; }
```
(These two rules reproduce the legacy inline `<style>` block from `index.html` lines 12-15.)

- [ ] **Step 3: Wire DM Sans in `app/layout.tsx`**

Replace `app/layout.tsx` with:
```tsx
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'betteryourads — meta ads, built for b2b saas',
  description:
    'We learn your product, write the angles, ship the creative, and run the Meta ads. Built for SaaS funnels — not ecommerce.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Verify it builds and the token var resolves**

Run: `npm run build`
Expected: build succeeds. (Visual check happens after sections exist.)

- [ ] **Step 5: Commit**
```bash
git add -A
git commit -m "feat: port design tokens and load DM Sans via next/font"
```

---

## Task 3: Copy used assets into `public/`

**Files:**
- Create: `public/logo-mark.png`, `public/favicon.svg`, `public/demo-clickup-ad.jpg`

- [ ] **Step 1: Copy the three referenced assets (grain.svg is unused — skip it)**
```powershell
Copy-Item legacy/assets/logo-mark.png public/logo-mark.png
Copy-Item legacy/assets/favicon.svg public/favicon.svg
Copy-Item legacy/assets/demo-clickup-ad.jpg public/demo-clickup-ad.jpg
```

- [ ] **Step 2: Confirm the three files exist and grain.svg was NOT copied**

Run: `Get-ChildItem public`
Expected: `logo-mark.png`, `favicon.svg`, `demo-clickup-ad.jpg` present; no `grain.svg`.

- [ ] **Step 3: Commit**
```bash
git add -A
git commit -m "chore: copy referenced landing assets into public/"
```

---

## Task 4: Shared UI primitives — `Eyebrow`, `SectionHead`

**Files:**
- Create: `components/ui/Eyebrow.tsx`, `components/ui/Eyebrow.module.css`
- Create: `components/ui/SectionHead.tsx`, `components/ui/SectionHead.module.css`

> Rationale: `.eyebrow` / `.eyebrow.accent` and the `.section-head` block (head + `.h-section` + `.sub`) repeat across nearly every section. Centralizing them is DRY and keeps section modules small.

- [ ] **Step 1: Create `Eyebrow.module.css`**

Port the marketing `.eyebrow` rules from `legacy/styles/landing.css:105-111`:
```css
.eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--fg-3);
}
.accent { color: var(--accent); }
```

- [ ] **Step 2: Create `Eyebrow.tsx`**
```tsx
import styles from './Eyebrow.module.css';

export function Eyebrow({
  children,
  accent = false,
  as: Tag = 'div',
  className,
}: {
  children: React.ReactNode;
  accent?: boolean;
  as?: 'div' | 'span';
  className?: string;
}) {
  const classes = [styles.eyebrow, accent ? styles.accent : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  return <Tag className={classes}>{children}</Tag>;
}
```

- [ ] **Step 3: Create `SectionHead.module.css`**

Port from `legacy/styles/landing.css:30-39` (`.section-head` and children) plus `.h-section` (121-128) and `.sub` (145-151):
```css
.head {
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 8px;
}
.title {
  font-family: var(--font-sans);
  font-size: clamp(34px, 4vw, 56px);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.025em;
  margin: 0;
}
.sub {
  font-family: var(--font-sans);
  font-size: 17px;
  line-height: 1.5;
  color: var(--fg-2);
  margin: 0;
  max-width: 640px;
}
```

- [ ] **Step 4: Create `SectionHead.tsx`**
```tsx
import { Eyebrow } from './Eyebrow';
import styles from './SectionHead.module.css';

export function SectionHead({
  eyebrow,
  eyebrowAccent = false,
  title,
  sub,
}: {
  eyebrow: React.ReactNode;
  eyebrowAccent?: boolean;
  title: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className={styles.head}>
      <Eyebrow accent={eyebrowAccent}>{eyebrow}</Eyebrow>
      <h2 className={styles.title}>{title}</h2>
      {sub ? <p className={styles.sub}>{sub}</p> : null}
    </div>
  );
}
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: succeeds (components not yet imported, but must compile).

- [ ] **Step 6: Commit**
```bash
git add -A
git commit -m "feat: add Eyebrow and SectionHead primitives"
```

---

## Task 5: Shared `Button` (marketing `.btn-m`)

**Files:**
- Create: `components/ui/Button.tsx`, `components/ui/Button.module.css`

> Only the variants the live page uses are ported: base, `.primary`, `.sm`. The `.ghost`, `.lg`, `.inverse` variants and `.cta-row` are dead — omit them.

- [ ] **Step 1: Create `Button.module.css`**

Port from `legacy/styles/landing.css` the used button rules only — `.btn-m` (86-94), `.btn-m.primary` (95-96), `.btn-m.sm` (100):
```css
.btn {
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  padding: 11px 18px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid var(--fg);
  background: var(--bg);
  color: var(--fg);
  letter-spacing: -0.005em;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  line-height: 1;
  white-space: nowrap;
  transition: background 120ms var(--ease), color 120ms var(--ease),
    border-color 120ms var(--ease);
}
.btn:hover { background: var(--bg-raised); }
.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--bg);
}
.primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
.sm { font-size: 13px; padding: 8px 14px; }
```

- [ ] **Step 2: Create `Button.tsx` (anchor-based — every CTA is a link)**
```tsx
import styles from './Button.module.css';

export function Button({
  href,
  children,
  primary = false,
  sm = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  sm?: boolean;
  className?: string;
}) {
  const classes = [styles.btn, primary ? styles.primary : '', sm ? styles.sm : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}
```

- [ ] **Step 3: Verify build & commit**
```bash
npm run build
git add -A
git commit -m "feat: add Button primitive (used variants only)"
```

---

## Task 6: `WaitlistForm` (client) — TDD

**Files:**
- Create: `components/ui/WaitlistForm.tsx`, `components/ui/WaitlistForm.module.css`
- Test: `components/ui/WaitlistForm.test.tsx`

> Behavior (from `legacy/index.html` JS, lines 557-569): on submit, if the email is invalid, trigger native validation and stop; otherwise replace the form with a green inline confirmation. No network. A `center` prop reproduces the final-CTA centering.

- [ ] **Step 1: Write the failing test**

Create `components/ui/WaitlistForm.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { WaitlistForm } from './WaitlistForm';

describe('WaitlistForm', () => {
  it('shows the confirmation message after a valid submit', async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await user.type(screen.getByPlaceholderText('founder@yoursaas.com'), 'a@b.com');
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));
    expect(screen.getByText(/you’re on the list/i)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('founder@yoursaas.com')).not.toBeInTheDocument();
  });

  it('does not confirm when the email is empty/invalid', async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));
    expect(screen.queryByText(/you’re on the list/i)).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('founder@yoursaas.com')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- WaitlistForm`
Expected: FAIL — cannot resolve `./WaitlistForm`.

- [ ] **Step 3: Create `WaitlistForm.module.css`**

Port `.email-cta` (input + button + focus-within) from `legacy/styles/landing.css:210-238`, `.micro`/`.micro .sep` (240-246), and the confirmation styling (inline in JS, lines 563-566). Add a `.center` modifier (final CTA centers the form: legacy `.final-cta .email-cta { margin: 0 auto; }`, line 912):
```css
.form {
  display: flex;
  align-items: stretch;
  border: 1px solid var(--fg);
  border-radius: 4px;
  background: var(--bg);
  max-width: 460px;
  overflow: hidden;
}
.form:focus-within { outline: 2px solid var(--accent); outline-offset: 1px; }
.input {
  flex: 1;
  border: 0;
  outline: 0;
  padding: 14px 18px;
  font-family: var(--font-sans);
  font-size: 15px;
  background: transparent;
  color: var(--fg);
}
.input::placeholder { color: var(--fg-3); }
.button {
  border: 0;
  cursor: pointer;
  background: var(--accent);
  color: var(--bg);
  padding: 0 22px;
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.005em;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 120ms var(--ease);
}
.button:hover { background: var(--accent-hover); }
.center { margin: 0 auto; }
.done {
  max-width: 460px;
  padding: 14px 18px;
  border: 1px solid var(--bya-forest);
  border-radius: 4px;
  background: var(--bya-forest-soft);
  color: var(--bya-forest);
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}
.doneCenter { margin: 0 auto; }
.doneDot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--bya-forest);
  display: inline-block;
  flex-shrink: 0;
}
```

- [ ] **Step 4: Create `WaitlistForm.tsx`**
```tsx
'use client';

import { useState, type FormEvent } from 'react';
import styles from './WaitlistForm.module.css';

export function WaitlistForm({
  id,
  center = false,
}: {
  id?: string;
  center?: boolean;
}) {
  const [done, setDone] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input');
    if (input && !input.checkValidity()) {
      input.reportValidity();
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className={`${styles.done} ${center ? styles.doneCenter : ''}`.trim()}>
        <span className={styles.doneDot} />
        you’re on the list — we’ll email you when your seat opens.
      </div>
    );
  }

  return (
    <form
      id={id}
      className={`${styles.form} ${center ? styles.center : ''}`.trim()}
      onSubmit={handleSubmit}
    >
      <input
        className={styles.input}
        type="email"
        placeholder="founder@yoursaas.com"
        autoComplete="email"
        required
      />
      <button className={styles.button} type="submit">
        join the waitlist →
      </button>
    </form>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- WaitlistForm`
Expected: 2 passed.

- [ ] **Step 6: Commit**
```bash
git add -A
git commit -m "feat: add WaitlistForm with inline confirmation (client-only)"
```

---

## Task 7: `Nav`

**Files:**
- Create: `components/Nav/Nav.tsx`, `components/Nav/Nav.module.css`

- [ ] **Step 1: Create `Nav.module.css`**

Port from `legacy/styles/landing.css`: `.nav` (57-61), `.nav-inner` (62-66), `.nav .brand`/`.mark`/`.wordmark`/`.ads` (67-76), `.nav .links` + `a` + hover (77-82), `.nav .cta-group` (83). Also include the responsive rule `.nav .links { display: none; }` from the 960px media block (line 974) as a `@media (max-width: 960px)` inside this module. Class name map: `nav→nav`, `nav-inner→inner`, `brand→brand`, `mark→mark`, `wordmark→wordmark`, `ads→ads`, `links→links`, `cta-group→ctaGroup`. Example head:
```css
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(244, 239, 230, 0.92);
  border-bottom: 1px solid var(--fg);
}
.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 32px;
  max-width: 1240px;
  margin: 0 auto;
}
.brand { display: flex; align-items: center; gap: 8px; text-decoration: none; color: var(--fg); }
.mark { width: 26px; height: 26px; display: block; }
.wordmark { font-family: var(--font-sans); font-size: 17px; font-weight: 700; letter-spacing: -0.03em; }
.ads { color: var(--accent); }
.links { display: flex; align-items: center; gap: 28px; }
.links a { font-size: 14px; color: var(--fg-2); text-decoration: none; transition: color 120ms var(--ease); }
.links a:hover { color: var(--fg); }
.ctaGroup { display: flex; align-items: center; gap: 10px; }
@media (max-width: 960px) {
  .links { display: none; }
}
```

- [ ] **Step 2: Create `Nav.tsx`**

Port markup from `legacy/index.html:20-36`. Use `next/image` for the logo (26×26). Use the shared `Button` for the CTA.
```tsx
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import styles from './Nav.module.css';

export function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#">
          <Image className={styles.mark} src="/logo-mark.png" alt="" width={26} height={26} />
          <span className={styles.wordmark}>
            betteryour<span className={styles.ads}>ads</span>
          </span>
        </a>
        <div className={styles.links}>
          <a href="#how">how it works</a>
          <a href="#compare">compare</a>
          <a href="#pricing">pricing</a>
          <a href="#faq">faq</a>
        </div>
        <div className={styles.ctaGroup}>
          <Button href="#waitlist" primary sm>
            join the waitlist →
          </Button>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Verify build & commit**
```bash
npm run build
git add -A
git commit -m "feat: add Nav"
```

---

## Task 8: `LiveDemo` phase reducer — TDD (pure logic)

**Files:**
- Create: `components/LiveDemo/liveDemoMachine.ts`
- Test: `components/LiveDemo/liveDemoMachine.test.ts`

> Extracts the timeline logic from `legacy/index.html` `liveDemo()` (lines 571-717) into pure, testable pieces: phase status text, feed-row state, and progress→opacity math. The component (Task 9) only schedules timers that call these.

The legacy phases (0-7): 0 idle, 1 audit, 2 customers, 3 brand, 4 brand(cont), 5 concepts, 6 render, 7 shipped. Feed rows: `audit, customers, brand, concepts, creative`.

- [ ] **Step 1: Write the failing test**

Create `components/LiveDemo/liveDemoMachine.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import {
  statusText,
  feedRowState,
  stepLabel,
  canvasOpacities,
  FEED_DEFS,
} from './liveDemoMachine';

describe('statusText', () => {
  it('maps each phase to its label', () => {
    expect(statusText(0)).toBe('type a url to begin');
    expect(statusText(1)).toBe('auditing your site');
    expect(statusText(3)).toBe('extracting brand');
    expect(statusText(4)).toBe('extracting brand');
    expect(statusText(7)).toBe('shipped to meta, day 1 of 30');
  });
});

describe('feedRowState', () => {
  it('marks the audit row active at phase 1 and done after', () => {
    expect(feedRowState(FEED_DEFS[0], 1)).toBe('active');
    expect(feedRowState(FEED_DEFS[0], 2)).toBe('done');
    expect(feedRowState(FEED_DEFS[0], 0)).toBe('idle');
  });
  it('keeps brand active across phases 3 and 4', () => {
    expect(feedRowState(FEED_DEFS[2], 3)).toBe('active');
    expect(feedRowState(FEED_DEFS[2], 4)).toBe('active');
    expect(feedRowState(FEED_DEFS[2], 5)).toBe('done');
  });
  it('creative is done only at phase 7', () => {
    expect(feedRowState(FEED_DEFS[4], 6)).toBe('active');
    expect(feedRowState(FEED_DEFS[4], 7)).toBe('done');
  });
});

describe('stepLabel', () => {
  it('clamps to "step N of 6"', () => {
    expect(stepLabel(0)).toBe('step 0 of 6');
    expect(stepLabel(3)).toBe('step 3 of 6');
    expect(stepLabel(7)).toBe('step 6 of 6');
  });
});

describe('canvasOpacities', () => {
  it('wire fades out as progress rises; image fades in late', () => {
    const start = canvasOpacities(0);
    expect(start.wire).toBe(1);
    expect(start.img).toBe(0);
    const end = canvasOpacities(1);
    expect(end.wire).toBe(0);
    expect(end.img).toBeGreaterThan(0.9);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- liveDemoMachine`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `liveDemoMachine.ts`**

Port the predicates and math verbatim from the legacy JS (`statusText` 636-647, `feedDefs` 597-603, `clamp` + canvas opacity math 648/672-678, `step` label 682):
```ts
export type FeedRowStatus = 'idle' | 'active' | 'done';

export interface FeedDef {
  label: string;
  /** value shown when active/done; `phase` only matters for the creative row */
  value: (phase: number) => string;
  active: (phase: number) => boolean;
  done: (phase: number) => boolean;
}

export const DEMO_URL = 'clickup.com';
export const DEMO_PALETTE = ['#8930FF', '#FF43C1', '#FF8A47', '#00D2FF'];

export const FEED_DEFS: FeedDef[] = [
  {
    label: 'audit',
    value: () => 'all your work, in one place',
    active: (p) => p === 1,
    done: (p) => p > 1,
  },
  {
    label: 'customers',
    value: () => 'PM + ops teams, 50–5000 emp',
    active: (p) => p === 2,
    done: (p) => p > 2,
  },
  {
    label: 'brand',
    value: () => '__PALETTE__', // component renders the palette swatches for this sentinel
    active: (p) => p === 3 || p === 4,
    done: (p) => p > 4,
  },
  {
    label: 'concepts',
    value: () => 'stop switching',
    active: (p) => p === 5,
    done: (p) => p > 5,
  },
  {
    label: 'creative',
    value: (p) => (p === 7 ? 'ready to ship' : 'composing...'),
    active: (p) => p === 6,
    done: (p) => p === 7,
  },
];

export function statusText(phase: number): string {
  switch (phase) {
    case 0: return 'type a url to begin';
    case 1: return 'auditing your site';
    case 2: return 'understanding your customers';
    case 3:
    case 4: return 'extracting brand';
    case 5: return 'drafting ad concepts';
    case 6: return 'rendering creative';
    default: return 'shipped to meta, day 1 of 30';
  }
}

export function feedRowState(def: FeedDef, phase: number): FeedRowStatus {
  if (def.done(phase)) return 'done';
  if (def.active(phase)) return 'active';
  return 'idle';
}

export function stepLabel(phase: number): string {
  const n = phase === 0 ? 0 : Math.min(phase, 6);
  return `step ${n} of 6`;
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function canvasOpacities(progress: number) {
  return {
    wire: Math.max(0, 1 - progress / 0.35),
    grad: clamp((progress - 0.18) / 0.35),
    img: clamp((progress - 0.5) / 0.42),
  };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- liveDemoMachine`
Expected: all passed.

- [ ] **Step 5: Commit**
```bash
git add -A
git commit -m "feat: add tested LiveDemo phase machine (pure logic)"
```

---

## Task 9: `LiveDemo` component (client)

**Files:**
- Create: `components/LiveDemo/LiveDemo.tsx`, `components/LiveDemo/LiveDemo.module.css`

> Renders the `.ldg` block from `legacy/index.html:70-115`, driven by React state + `useEffect` timers replicating the legacy `runCycle()` timeline (lines 691-711). Uses the pure helpers from Task 8.

- [ ] **Step 1: Create `LiveDemo.module.css`**

Copy ALL of `legacy/styles/live-demo.css` (every rule is used) into this module, mapping kebab classes to the same names (CSS Modules will scope them). Keep `@keyframes ldg-tick`, `ldg-caret`, `ldg-fade-in`, `ldg-shimmer` and the `@media (max-width: 720px)` block. Class map (selector → module key): `ldg→ldg`, `ldg-chrome→chrome`, `ldg-dots→dots`, `ldg-app-url→appUrl`, `ldg-live→live`, `ldg-tick→tick`, `ldg-url-row→urlRow`, `ldg-url-label→urlLabel`, `ldg-url-input→urlInput`, `ldg-url-scheme→urlScheme`, `ldg-url-typed→urlTyped`, `ldg-caret→caret`, `ldg-analyze-btn→analyzeBtn` (+`.done→done`), `ldg-body→body`, `ldg-feed→feed`, `ldg-feed-row→feedRow` (+`.active`,`.done`,`.idle`), `ldg-feed-mark→feedMark`, `ldg-feed-pulse→feedPulse`, `ldg-feed-empty→feedEmpty`, `ldg-feed-content→feedContent`, `ldg-feed-label→feedLabel`, `ldg-feed-value→feedValue`, `ldg-feed-wait→feedWait`, `ldg-feed-palette→feedPalette` (+`-text→feedPaletteText`), `ldg-canvas-wrap→canvasWrap`, `ldg-canvas→canvas`, `ldg-canvas-bg→canvasBg`, `ldg-canvas-img→canvasImg` (+`.in→in`), `ldg-wire→wire`, `ldg-wire-bar→wireBar`, `ldg-canvas-badge→canvasBadge`, `ldg-foot→foot`, `ldg-status-dot→statusDot`, `ldg-status-text→statusText`, `ldg-foot-meta→footMeta`.

  NOTE on compound selectors like `.ldg-feed-row.active .ldg-feed-mark`: rewrite as `.feedRow.active .feedMark`. The string-keyed classes (`active`,`done`,`idle`,`in`) are applied alongside the base class in the component.

- [ ] **Step 2: Create `LiveDemo.tsx`**
```tsx
'use client';

import { useEffect, useReducer } from 'react';
import Image from 'next/image';
import {
  DEMO_URL,
  DEMO_PALETTE,
  FEED_DEFS,
  statusText,
  feedRowState,
  stepLabel,
  canvasOpacities,
} from './liveDemoMachine';
import styles from './LiveDemo.module.css';

interface State { phase: number; typedChars: number; progress: number; }
type Action =
  | { type: 'reset' }
  | { type: 'typed'; n: number }
  | { type: 'phase'; p: number }
  | { type: 'progress'; v: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'reset': return { phase: 0, typedChars: 0, progress: 0 };
    case 'typed': return { ...state, typedChars: action.n };
    case 'phase': return { ...state, phase: action.p };
    case 'progress': return { ...state, progress: action.v };
  }
}

// Timeline constants, copied from legacy liveDemo() (lines 579-581).
const TYPE_MS = 700;
const T = { typed: 950, audit: 1750, cust: 2550, brand: 3350, concept: 4150, render: 4950, shipped: 7050, cycle: 9300 };
const RENDER_STEPS = 28;

export function LiveDemo() {
  const [state, dispatch] = useReducer(reducer, { phase: 0, typedChars: 0, progress: 0 });

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    function runCycle() {
      dispatch({ type: 'reset' });
      for (let i = 1; i <= DEMO_URL.length; i++) {
        at((TYPE_MS * i) / DEMO_URL.length, () => dispatch({ type: 'typed', n: i }));
      }
      at(T.typed, () => dispatch({ type: 'phase', p: 1 }));
      at(T.audit, () => dispatch({ type: 'phase', p: 2 }));
      at(T.cust, () => dispatch({ type: 'phase', p: 3 }));
      at(T.brand, () => dispatch({ type: 'phase', p: 4 }));
      at(T.concept, () => dispatch({ type: 'phase', p: 5 }));
      at(T.render, () => dispatch({ type: 'phase', p: 6 }));
      for (let i = 1; i <= RENDER_STEPS; i++) {
        at(T.concept + i * 70, () => dispatch({ type: 'progress', v: i / RENDER_STEPS }));
      }
      at(T.shipped, () => dispatch({ type: 'phase', p: 7 }));
      at(T.cycle, runCycle);
    }

    runCycle();
    return () => timers.forEach(clearTimeout);
  }, []);

  const { phase, typedChars, progress } = state;
  const generated = phase >= 1;
  const { wire, grad, img } = canvasOpacities(progress);

  const gradStyle = `linear-gradient(135deg, ${DEMO_PALETTE[0]} 0%, ${DEMO_PALETTE[1]} 50%, ${DEMO_PALETTE[2]} 100%)`;

  return (
    <div className={styles.ldg}>
      <div className={styles.chrome}>
        <div className={styles.dots}>
          <span style={{ background: '#ff5f57' }} />
          <span style={{ background: '#febc2e' }} />
          <span style={{ background: '#28c840' }} />
        </div>
        <div className={styles.appUrl}>app.betteryourads.com</div>
        <div className={styles.live}><span className={styles.tick} />live</div>
      </div>

      <div className={styles.urlRow}>
        <div className={styles.urlLabel}>your site</div>
        <div className={styles.urlInput}>
          <span className={styles.urlScheme}>https://</span>
          <span className={styles.urlTyped}>{DEMO_URL.slice(0, typedChars)}</span>
          {phase === 0 ? <span className={styles.caret} /> : null}
        </div>
        <div className={`${styles.analyzeBtn} ${generated ? styles.done : ''}`.trim()}>
          {generated ? <Check /> : 'generate'}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.feed}>
          {FEED_DEFS.map((def) => {
            const rs = feedRowState(def, phase);
            return (
              <div key={def.label} className={`${styles.feedRow} ${styles[rs]}`}>
                <div className={styles.feedMark}>
                  {rs === 'done' ? <Check />
                    : rs === 'active' ? <span className={styles.feedPulse} />
                    : <span className={styles.feedEmpty} />}
                </div>
                <div className={styles.feedContent}>
                  <div className={styles.feedLabel}>{def.label}</div>
                  <div className={styles.feedValue}>
                    {rs === 'idle' ? <span className={styles.feedWait}>·</span>
                      : def.value(phase) === '__PALETTE__' ? <Palette />
                      : def.value(phase)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.canvasWrap}>
          <div className={styles.canvas}>
            <div className={styles.wire} style={{ opacity: wire }}>
              <div className={styles.wireBar} style={{ width: '30%', top: '16%' }} />
              <div className={styles.wireBar} style={{ width: '62%', top: '44%', height: '10%' }} />
              <div className={styles.wireBar} style={{ width: '46%', top: '58%', height: '5%' }} />
              <div className={styles.wireBar} style={{ width: '26%', bottom: '16%', height: '11%' }} />
            </div>
            <div className={styles.canvasBg} style={{ background: gradStyle, opacity: grad }} />
            <Image
              className={`${styles.canvasImg} ${img > 0.6 ? styles.in : ''}`.trim()}
              style={{ opacity: img }}
              src="/demo-clickup-ad.jpg"
              alt="clickup ad mockup"
              width={240}
              height={240}
            />
            {phase === 7 ? (
              <div className={styles.canvasBadge}>
                <span className={styles.tick} />running on meta
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className={styles.foot}>
        <span
          className={styles.statusDot}
          style={{ background: phase === 7 ? 'var(--bya-forest)' : 'var(--accent)' }}
        />
        <span className={styles.statusText}>{statusText(phase)}</span>
        <span className={styles.footMeta}>{stepLabel(phase)}</span>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Palette() {
  return (
    <span className={styles.feedPalette}>
      {DEMO_PALETTE.map((c, i) => (
        <span key={c} style={{ background: c, transitionDelay: `${i * 80}ms` }} />
      ))}
      <span className={styles.feedPaletteText}>+ bold all-caps</span>
    </span>
  );
}
```

> Note: the legacy used two check sizes (12px feed, 14px analyze button). The 12px `Check` is reused for the analyze button too — visually negligible at that scale; acceptable per parity. If exact parity is required, add a `size` prop.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit**
```bash
git add -A
git commit -m "feat: add LiveDemo animated ad-generator (client)"
```

---

## Task 10: `Hero`

**Files:**
- Create: `components/Hero/Hero.tsx`, `components/Hero/Hero.module.css`

- [ ] **Step 1: Create `Hero.module.css`**

Port from `legacy/styles/landing.css`: `.hero` (158-162), `.hero-grid` (163-168), `.hero-left` (169-173), `.hero-right` (174), `.hero-eyebrow` + `.dot` (175-187), `@keyframes tick` (188), `.hero h1` (190-198), `.hero .lead` (199-206), `.micro` is provided by WaitlistForm? No — `.micro` belongs to the hero too. Put `.micro`/`.micro .sep` (240-246) here AND it's also used in final CTA; to stay DRY, leave `.micro` here and FinalCta will reuse by importing? CSS Modules don't cross-import cleanly — instead duplicate the small `.micro` rule in both modules (it is 6 lines; acceptable and keeps modules self-contained). Include the hero responsive rules from the 960px block (954-957: `.hero`, `.hero-grid`, `.hero-left`, `.ldg` max-width — the `.ldg` override lives in LiveDemo's own media query already, so only port `.hero`, `.hero-grid`, `.hero-left` here). Class map: `hero→hero`, `hero-grid→grid`, `hero-left→left`, `hero-right→right`, `hero-eyebrow→eyebrow`, `dot→dot`, `micro→micro`, `sep→sep`. Keep `h1` as a scoped `.left h1` rule.

- [ ] **Step 2: Create `Hero.tsx`**

Port `legacy/index.html:39-119`. The hero-right contains `<LiveDemo />`. The hero form is the first `WaitlistForm` with `id="waitlist"`.
```tsx
import { LiveDemo } from '@/components/LiveDemo/LiveDemo';
import { WaitlistForm } from '@/components/ui/WaitlistForm';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className="wrap">
        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.eyebrow}>
              <span className={styles.dot} />
              <span>meta ads · for b2b saas</span>
            </div>
            <h1>
              Meta ads, <span className="accent">run for you</span>.
            </h1>
            <p className="lead">
              We learn your product, write the angles, and run the creative.
              Built for trial signups, not add-to-carts.
            </p>
            <WaitlistForm id="waitlist" />
            <div className={styles.micro}>
              <span>first month free</span>
              <span className={styles.sep}>·</span>
              <span>30 ads on us</span>
              <span className={styles.sep}>·</span>
              <span>no card required</span>
            </div>
          </div>
          <div className={styles.right}>
            <LiveDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
```

> `wrap`, `accent`, and `lead` are global classes (defined in tokens.css / a shared layout module — see Task 18). They are NOT module-scoped. Confirm `.wrap`, `.accent`, `.lead` exist as globals before this renders (Task 18 adds `.wrap` to globals; `.accent` and `.lead` get added to globals in Task 18 too).

- [ ] **Step 3: Verify build & commit**
```bash
npm run build
git add -A
git commit -m "feat: add Hero section"
```

---

## Task 11: `PilotProof`

**Files:**
- Create: `components/PilotProof/PilotProof.tsx`, `components/PilotProof/PilotProof.module.css`

- [ ] **Step 1: Create `PilotProof.module.css`**

Port from `legacy/styles/landing.css`: `.section-pilot` (519-521), `.pilot-grid` (522-527), `.pilot-card` + hover (528-538), `.pilot-mark` (540-547), `.pilot-num` (548), `.pilot-status` (549-552), `.pilot-live` (553-557), `.pilot-name` (559-567), `.pilot-rows` (569-575), `.pilot-row` (576-578), `.pilot-row .k` (579-586), `.pilot-row .v` (587-592), `.pilot-foot` (594-602), and the `@media (max-width: 720px) { .pilot-grid { grid-template-columns: 1fr; } }` (604-606). Reference `@keyframes tick` — it's defined in Hero's module which won't be in scope here. Re-declare `@keyframes tick` inside this module (keyframes are global-ish but to be safe and self-contained, declare it). Class map: straight camelCase (`pilot-card→card`, `pilot-mark→mark`, `pilot-num→num`, `pilot-status→status`, `pilot-live→live`, `pilot-name→name`, `pilot-rows→rows`, `pilot-row→row`, `pilot-foot→foot`; keep `.k`/`.v` as `.row .k`).

- [ ] **Step 2: Create `PilotProof.tsx`**

Port `legacy/index.html:122-162`. Section uses `id="pilot"`, classes `section section-pilot`. Use `SectionHead` for the head block (eyebrow accent "currently in pilot", title with `<br/>`, sub). The two cards repeat — render from an array:
```tsx
import { SectionHead } from '@/components/ui/SectionHead';
import styles from './PilotProof.module.css';

const PILOTS = [
  {
    num: 'pilot 01',
    name: 'A Startmate-backed startup',
    rows: [
      ['stage', 'pre-seed'],
      ['funnel', 'self-serve, trial to paid'],
      ['running', 'facebook + instagram'],
    ],
  },
  {
    num: 'pilot 02',
    name: 'A Melbourne accelerator company',
    rows: [
      ['stage', 'seed'],
      ['funnel', 'sales-led, demo to close'],
      ['running', 'facebook + instagram'],
    ],
  },
] as const;

export function PilotProof() {
  return (
    <section className={`section ${styles.sectionPilot}`} id="pilot">
      <div className="wrap">
        <SectionHead
          eyebrow="currently in pilot"
          eyebrowAccent
          title={<>Two founders. Real ads.<br />Shipping daily.</>}
          sub="We're running ads right now for two B2B SaaS teams. Anonymous until the data is. Specific because we owe you specifics."
        />
        <div className={styles.grid}>
          {PILOTS.map((p) => (
            <div className={styles.card} key={p.num}>
              <div className={styles.mark}>
                <span className={styles.num}>{p.num}</span>
                <span className={styles.status}><span className={styles.live} />shipping daily</span>
              </div>
              <div className={styles.name}>{p.name}</div>
              <div className={styles.rows}>
                {p.rows.map(([k, v]) => (
                  <div className={styles.row} key={k}>
                    <span className={styles.k}>{k}</span>
                    <span className={styles.v}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.foot}>Both go public when the numbers do.</div>
      </div>
    </section>
  );
}
```

> `section` and `wrap` are global classes (Task 18). `section-pilot` only sets `background: var(--bg)` — module-scoped as `sectionPilot`.

- [ ] **Step 3: Verify build & commit**
```bash
npm run build
git add -A
git commit -m "feat: add PilotProof section"
```

---

## Task 12: `Problem`

**Files:**
- Create: `components/Problem/Problem.tsx`, `components/Problem/Problem.module.css`

- [ ] **Step 1: Create `Problem.module.css`**

Port from `legacy/styles/landing.css`: `.problem-grid` (474-483), `.problem-cell` + `:last-child` (484-489), `.problem-cell .title` (490-497), `.problem-cell .body` (498-505), `.problem-cell .verdict` (506-516), plus the 960px responsive rules for `.problem-grid`/`.problem-cell` (960-962). Class map: `problem-grid→grid`, `problem-cell→cell`; keep `.cell .title`, `.cell .body`, `.cell .verdict`.

- [ ] **Step 2: Create `Problem.tsx`**

Port `legacy/index.html:165-202`. `id="problem"`. Head: eyebrow (no accent) "the status quo", title w/ `<br/>`, sub. Three cells from an array:
```tsx
import { SectionHead } from '@/components/ui/SectionHead';
import { Eyebrow } from '@/components/ui/Eyebrow';
import styles from './Problem.module.css';

const OPTIONS = [
  {
    tag: 'option a',
    title: 'Hire a Meta-ads agency',
    body: 'Weeks to onboard. Creative from someone who ran shopify ads last quarter. You pay for a monthly status call, not for ads.',
    verdict: 'slow · ecom-trained · status-call shaped',
  },
  {
    tag: 'option b',
    title: 'Hire a freelance designer',
    body: 'Great ads, once. No system, no second round. Next quarter you brief from zero and the angles that worked are stale.',
    verdict: 'one-off · no system · no learning',
  },
  {
    tag: 'option c',
    title: 'Do it yourself',
    body: "Canva on a Sunday night. Two ads ship, both perform the same, you can't tell which one drove the signups in Stripe.",
    verdict: 'no time · no expertise · no signal',
  },
] as const;

export function Problem() {
  return (
    <section className="section" id="problem">
      <div className="wrap">
        <SectionHead
          eyebrow="the status quo"
          title={<>Three ways to run paid social.<br />None built for SaaS.</>}
          sub="You're a founder, not a creative director. Every option for Meta ads burns money, burns time, or leaves you guessing."
        />
        <div className={styles.grid}>
          {OPTIONS.map((o) => (
            <div className={styles.cell} key={o.tag}>
              <Eyebrow>{o.tag}</Eyebrow>
              <div className={styles.title}>{o.title}</div>
              <div className={styles.body}>{o.body}</div>
              <div className={styles.verdict}>{o.verdict}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify build & commit**
```bash
npm run build
git add -A
git commit -m "feat: add Problem section"
```

---

## Task 13: `HowItWorks` + `OptimizeChart`

**Files:**
- Create: `components/HowItWorks/HowItWorks.tsx`, `components/HowItWorks/HowItWorks.module.css`
- Create: `components/HowItWorks/OptimizeChart.tsx`, `components/HowItWorks/OptimizeChart.module.css`

> The three steps each have a bespoke inline-styled "visual". Steps 01 and 02 are static markup with heavy inline styles → port to the module as named classes (don't keep giant inline style objects — that fights hygiene). Step 03's bar chart was built by JS (`buildOptimizeRows`, lines 524-555) → becomes `OptimizeChart` rendering from a data array server-side.

- [ ] **Step 1: Create `HowItWorks.module.css`**

Port `.steps` (609-614), `.step` (615-624), `.step .n` (625-630), `.step .text` + `h3` + `p` (631-642), `.step .visual` (643-650), and the 960px rules for `.step`/`.step .visual` (963-964). Then translate the inline styles of the **VisualLearn** (step 01, lines 224-249) and **VisualLaunch** (step 02, lines 261-284) blocks into named classes in this module (e.g. `.learn`, `.learnRow`, `.learnGrid`, `.learnKey`, `.learnFoot`, `.launch`, `.launchHead`, `.angle`, `.angleSelected`, `.radio`, `.radioDot`, `.angleTitle`, `.angleTag`). Use the exact px/color values from the inline styles. Class map for structural: `steps→steps`, `step→step`, `n→n`, `text→text`, `visual→visual`.

- [ ] **Step 2: Create `OptimizeChart.module.css`**

Translate the inline styles from `buildOptimizeRows` (lines 537-552) and the step-03 visual wrapper (lines 296-307) into classes: `.optimize` (wrapper, 18px/22px padding flex column), `.head` (the labels row), `.rows` (flex column gap 6), `.row` (grid `1fr 56px`), `.bar` (relative 22px bg bg-raised radius 2 overflow hidden), `.fill` (absolute inset0, width set inline), `.barLabel` (relative padding 0 8 line-height 22 font 11 weight 500, flex justify-between), `.barName` (ellipsis), `.signups` (font-mono margin-left 6), `.cps` (font-mono 11 text-right), `.foot` (margin-top auto, border-top, flex justify-between). Use exact values from the legacy inline strings.

- [ ] **Step 3: Create `OptimizeChart.tsx`**

Data + winner logic from legacy lines 527-533/542-543 (`winner = i < 2`; label color flips when `pct > 50`; bar color accent for winners else `--bya-ink-4`; cps color `--fg` for winners else `--fg-3`):
```tsx
import styles from './OptimizeChart.module.css';

const ROWS = [
  { name: 'ship without the standup', pct: 92, signups: 47, cps: '$18' },
  { name: 'speed is the feature', pct: 71, signups: 36, cps: '$24' },
  { name: 'for engineers, by eng.', pct: 48, signups: 24, cps: '$33' },
  { name: 'the issue tracker', pct: 28, signups: 14, cps: '$71' },
  { name: 'your roadmap, not theirs', pct: 11, signups: 6, cps: '$162' },
] as const;

export function OptimizeChart() {
  return (
    <div className={styles.optimize}>
      <div className={styles.head}>
        <span>this week · trial signups by angle</span>
        <span>cost / signup</span>
      </div>
      <div className={styles.rows}>
        {ROWS.map((r, i) => {
          const winner = i < 2;
          return (
            <div className={styles.row} key={r.name}>
              <div className={styles.bar}>
                <div
                  className={styles.fill}
                  style={{
                    width: `${r.pct}%`,
                    background: winner ? 'var(--accent)' : 'var(--bya-ink-4)',
                  }}
                />
                <div
                  className={styles.barLabel}
                  style={{ color: r.pct > 50 ? 'var(--bg)' : 'var(--fg)' }}
                >
                  <span className={styles.barName}>{r.name}</span>
                  <span className={styles.signups}>{r.signups}</span>
                </div>
              </div>
              <span
                className={styles.cps}
                style={{ color: winner ? 'var(--fg)' : 'var(--fg-3)' }}
              >
                {r.cps}
              </span>
            </div>
          );
        })}
      </div>
      <div className={styles.foot}>
        <span>spend shifted to top signup drivers · auto</span>
        <span>127 signups · $2,841 mrr</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `HowItWorks.tsx`**

Port `legacy/index.html:205-311`. `id="how"`. Head: eyebrow accent "how it works", title, sub. Three `.step` rows; step 03's visual is `<OptimizeChart />`. The VisualLearn/VisualLaunch markup is ported using the classes defined in Step 1 (replace each inline `style="..."` with the corresponding `className={styles.x}`). Structure:
```tsx
import { SectionHead } from '@/components/ui/SectionHead';
import { OptimizeChart } from './OptimizeChart';
import styles from './HowItWorks.module.css';

export function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="wrap">
        <SectionHead
          eyebrow="how it works"
          eyebrowAccent
          title="Learns. Launches. Optimizes for signups."
          sub="Three stages. About 90 seconds per ad. Tuned for what shows up in your Stripe dashboard, not your CTR column."
        />
        <div className={styles.steps}>
          {/* Step 01 */}
          <div className={styles.step}>
            <div className={styles.n}>01 //</div>
            <div className={styles.text}>
              <h3>We read your site.</h3>
              <p>Drop your URL. We extract positioning, category, ICP, and palette in about twelve seconds. No briefing call. No questionnaire.</p>
            </div>
            <div className={styles.visual}>
              <VisualLearn />
            </div>
          </div>
          {/* Step 02 */}
          <div className={styles.step}>
            <div className={styles.n}>02 //</div>
            <div className={styles.text}>
              <h3>We write five angles.</h3>
              <p>Process, category, rebuttal, proof, manifesto. The angles SaaS founders actually use. Pick one, pick all five. The creative renders on-brand and ready to ship.</p>
            </div>
            <div className={styles.visual}>
              <VisualLaunch />
            </div>
          </div>
          {/* Step 03 */}
          <div className={styles.step}>
            <div className={styles.n}>03 //</div>
            <div className={styles.text}>
              <h3>We ship to Meta and tune for signups.</h3>
              <p>One click, the ads go live on Facebook and Instagram. We shift spend daily toward the angles driving trial signups, the lowest cost per signup, and the highest MRR added.</p>
            </div>
            <div className={styles.visual}>
              <OptimizeChart />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```
Implement `VisualLearn` and `VisualLaunch` as local components in the same file, porting the markup from legacy lines 224-249 and 261-284 respectively, with inline styles replaced by `styles.*` classes from Step 1. Keep the palette swatch colors (`#5e6ad2`, `#0b0c10`, `#f4f5f8`, `#9aa0b4`) as inline `style={{ background }}` since they are data, not layout.

- [ ] **Step 5: Verify build & commit**
```bash
npm run build
git add -A
git commit -m "feat: add HowItWorks section with OptimizeChart"
```

---

## Task 14: `Compare`

**Files:**
- Create: `components/Compare/Compare.tsx`, `components/Compare/Compare.module.css`

- [ ] **Step 1: Create `Compare.module.css`**

Port from `legacy/styles/landing.css`: `.compare` (685-690), `.compare-row` (691-695), `.compare.four .compare-row` (696-698), `.compare-row:last-child` (699), `.compare-row > div` (700-708), `.compare-row.header` (709-717), `.cell-them` (718), `.cell-us` (719-724), `.compare-row.header .cell-us` (725-728), plus 960px rules (966-968). Class map: `compare→compare` (+`.four`), `compare-row→row` (+`.header`), `cell-them→them`, `cell-us→us`. Rewrite `.compare.four .compare-row` as `.compare.four .row`, `.compare-row.header .cell-us` as `.row.header .us`, etc.

- [ ] **Step 2: Create `Compare.tsx`**

Port `legacy/index.html:314-357`. `id="compare"`. Head: eyebrow "why we exist", title w/ `<br/>`, sub. The table is `.compare.four` with a header row + 5 data rows. Model rows as data:
```tsx
import { SectionHead } from '@/components/ui/SectionHead';
import styles from './Compare.module.css';

const ROWS = [
  ['What it optimizes for', 'whatever you brief', 'add-to-cart, ROAS', 'trial signups, MRR, CAC payback'],
  ['Time to first ad live', 'weeks', 'a few days', 'about 90 seconds'],
  ['Reports you actually read', 'a monthly deck', 'clicks, CPM, impressions', 'signups, cost per signup, MRR added'],
  ["How it's priced", 'retainer + creative hours', 'subscription + your hours', 'flat monthly, month-to-month'],
] as const;

export function Compare() {
  return (
    <section className="section" id="compare">
      <div className="wrap">
        <SectionHead
          eyebrow="why we exist"
          title={<>Built for SaaS funnels.<br />Not for ecommerce.</>}
          sub='Most "AI ads" tools were trained on Shopify stores. Most agencies grew up on ecom retainers. SaaS sells differently. Long cycles, multi-stakeholder, trial-to-paid. Your ads need to know that.'
        />
        <div className={`${styles.compare} ${styles.four}`}>
          <div className={`${styles.row} ${styles.header}`}>
            <div />
            <div>meta-ads agency</div>
            <div>ecom-trained ai tools</div>
            <div className={styles.us}>betteryourads</div>
          </div>
          {ROWS.map(([label, them1, them2, us]) => (
            <div className={styles.row} key={label}>
              <div>{label}</div>
              <div className={styles.them}>{them1}</div>
              <div className={styles.them}>{them2}</div>
              <div className={styles.us}>{us}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify build & commit**
```bash
npm run build
git add -A
git commit -m "feat: add Compare section"
```

---

## Task 15: `Pricing`

**Files:**
- Create: `components/Pricing/Pricing.tsx`, `components/Pricing/Pricing.module.css`

- [ ] **Step 1: Create `Pricing.module.css`**

Port from `legacy/styles/landing.css`: `.pricing-grid` (731-736), `.price-card` (737-744), `.price-card.featured` (745-747), `.tier-name` (748-752), `.amount` + `.per` (753-762), `.pitch` (763-770), `ul` (771-776), `li` + `::before` (777-789), `.price-card .btn-m` (790-795), `.footnote` (796-801), `.anchor-bar` + `strong` (803-815), plus 960px rule for `.pricing-grid` (969). Also translate the inline-styled **waitlist offer banner** (legacy lines 368-376) into a `.offer` class set (`.offer`, `.offerText`) and the **"most teams" badge** (lines 394-396) into `.tierRow` + `.badge`. Class map: `pricing-grid→grid`, `price-card→card` (+`.featured`), `tier-name→tierName`, `amount→amount`, `per→per`, `pitch→pitch`, `footnote→footnote`, `anchor-bar→anchorBar`. The `.price-card .btn-m` rule (margin-top auto; stretch; center) must target the Button — add a passthrough `className` (`styles.cardCta`) to the `Button`.

- [ ] **Step 2: Create `Pricing.tsx`**

Port `legacy/index.html:360-416`. `id="pricing"`. Head: eyebrow "pricing", title "Two plans. No retainer.", sub. Then the offer banner, the two price cards, and the anchor bar. Use shared `Button` (with `styles.cardCta`) and `Eyebrow`.
```tsx
import { SectionHead } from '@/components/ui/SectionHead';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import styles from './Pricing.module.css';

export function Pricing() {
  return (
    <section className="section" id="pricing">
      <div className="wrap">
        <SectionHead
          eyebrow="pricing"
          title="Two plans. No retainer."
          sub="Pay for ads that ship, not for meetings. Month to month. Cancel any time."
        />

        <div className={styles.offer}>
          <div className={styles.offerText}>
            <Eyebrow accent as="span">waitlist offer</Eyebrow>
            <span>
              Join now, get your <strong>first month free</strong> and{' '}
              <strong>30 ads on us</strong>.
            </span>
          </div>
          <Button href="#waitlist" primary sm>claim my spot →</Button>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.tierName}>founder</div>
            <div className={styles.amount}><span>$499</span><span className={styles.per}>/ month</span></div>
            <p className={styles.pitch}>For founders running their first paid social, or replacing a freelancer.</p>
            <ul>
              <li>30 ads / month, shipped live</li>
              <li>1 brand, unlimited angles</li>
              <li>Daily spend reallocation toward signups</li>
              <li>Slack support, founder-to-founder</li>
            </ul>
            <div className={styles.footnote}>private beta, 2026</div>
            <Button href="#waitlist" className={styles.cardCta}>join the waitlist</Button>
          </div>

          <div className={`${styles.card} ${styles.featured}`}>
            <div className={styles.tierRow}>
              <div className={styles.tierName}>scale</div>
              <span className={styles.badge}>most teams</span>
            </div>
            <div className={styles.amount}><span>$1,499</span><span className={styles.per}>/ month</span></div>
            <p className={styles.pitch}>For teams shipping ads daily, scaling beyond the founder plan.</p>
            <ul>
              <li>120 ads / month, shipped live</li>
              <li>1 brand, unlimited angles</li>
              <li>Daily reallocation + weekly creative refresh</li>
              <li>Dedicated account, shared Slack with our team</li>
            </ul>
            <div className={styles.footnote}>white-glove onboarding included</div>
            <Button href="#waitlist" primary className={styles.cardCta}>join the waitlist</Button>
          </div>
        </div>

        <div className={styles.anchorBar}>
          <span>A full-service Meta-ads agency typically runs several thousand a month plus creative hours. We charge a flat fee, ship every day, and never schedule a status call.</span>
          <a className="signal" href="#faq">how is this priced? →</a>
        </div>
      </div>
    </section>
  );
}
```

> The legacy anchor-bar link had bespoke inline styles; using the global `.signal` link style (defined in tokens.css) is the faithful, DRY equivalent. Add `font-weight:600` to `.anchorBar a` in the module if exact weight parity is wanted.

- [ ] **Step 3: Verify build & commit**
```bash
npm run build
git add -A
git commit -m "feat: add Pricing section"
```

---

## Task 16: `Faq`

**Files:**
- Create: `components/Faq/Faq.tsx`, `components/Faq/Faq.module.css`

- [ ] **Step 1: Create `Faq.module.css`**

Port from `legacy/styles/landing.css`: `.faq-list` (863-866), `.faq-item` (867-870), `.faq-q` + `::-webkit-details-marker` (871-881), `.faq-q .toggle` (882-889), `.faq-item[open] .faq-q .toggle` (890), `.faq-a` (891-897). Class map: `faq-list→list`, `faq-item→item`, `faq-q→q`, `toggle→toggle`, `faq-a→a`. Rewrite `.faq-item[open] .faq-q .toggle` as `.item[open] .q .toggle`.

- [ ] **Step 2: Create `Faq.tsx`**

Port `legacy/index.html:419-449`. Uses `wrap-narrow`. Native `<details>`/`<summary>`; first item `open`. Data array:
```tsx
import { SectionHead } from '@/components/ui/SectionHead';
import styles from './Faq.module.css';

const FAQS = [
  {
    q: 'When does it actually launch?',
    a: "We're in private beta now and opening seats in waves through 2026. Waitlist signups get the next available seat, plus the first-month-free and 30-ads offer. We email you when your seat is ready. You only pay when you connect your Meta account and ship your first ad.",
  },
  {
    q: 'What metric does it optimize for?',
    a: "Trial signups by default, demo bookings if you're sales-led, paid conversions if you have self-serve checkout. We track cost per signup, MRR added per angle, and CAC payback. The numbers a founder actually defends in a board meeting. CTR and impressions are in the dashboard, just not what we tune against.",
  },
  {
    q: 'How is this different from a Meta-ads agency?',
    a: "We're a product, not a people business. Agencies bill for meetings, decks, and slow creative cycles. We bill for ads that ship and the signups they drive. The work that takes an agency weeks happens here in about 90 seconds, and the system gets better at your brand every time you use it.",
  },
  {
    q: 'Will this actually work for SaaS, or is it ecom dressed up?',
    a: "Built for SaaS funnels from day one. The angles, the audience model, the attribution window (28-day click, 7-day view), the conversion event (signup, not add-to-cart). All tuned for high-consideration software sales. We don't do shopify ads. If you sell shoes, you're in the wrong place.",
  },
  {
    q: 'What does it do with my Meta account?',
    a: "We connect via Meta's official Marketing API. We create campaigns, ad sets, and creative inside your account. You own everything. You can pull our access any time and the ads keep running. We never touch budget beyond the daily cap you set.",
  },
];

export function Faq() {
  return (
    <section className="section" id="faq">
      <div className="wrap-narrow">
        <SectionHead eyebrow="questions, mostly heard twice" title="Frequently asked." />
        <div className={styles.list}>
          {FAQS.map((f, i) => (
            <details className={styles.item} key={f.q} open={i === 0}>
              <summary className={styles.q}>
                <span>{f.q}</span>
                <span className={styles.toggle}>+</span>
              </summary>
              <p className={styles.a}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify build & commit**
```bash
npm run build
git add -A
git commit -m "feat: add Faq section"
```

---

## Task 17: `FinalCta` and `Footer`

**Files:**
- Create: `components/FinalCta/FinalCta.tsx`, `components/FinalCta/FinalCta.module.css`
- Create: `components/Footer/Footer.tsx`, `components/Footer/Footer.module.css`

- [ ] **Step 1: Create `FinalCta.module.css`**

Port `.final-cta` (900-903), `.final-cta h2` (904-911), `.final-cta .email-cta { margin: 0 auto; }` is handled by `WaitlistForm center`. Re-declare `.micro`/`.sep` here (self-contained; 6 lines from landing.css:240-246) and the centered variant: `.micro { justify-content: center; margin-top: 22px; }`. Class map: `final-cta→finalCta`; keep `.finalCta h2`.

- [ ] **Step 2: Create `FinalCta.tsx`**

Port `legacy/index.html:452-471`. Uses `wrap-narrow`. Eyebrow accent "join the waitlist", h2 w/ `<br/>` and accented "shipping", sub, centered `WaitlistForm`, centered micro line.
```tsx
import { Eyebrow } from '@/components/ui/Eyebrow';
import { WaitlistForm } from '@/components/ui/WaitlistForm';
import styles from './FinalCta.module.css';

export function FinalCta() {
  return (
    <section className={styles.finalCta}>
      <div className="wrap-narrow">
        <Eyebrow accent>join the waitlist</Eyebrow>
        <h2>
          Stop guessing.<br />Start <span className="accent">shipping</span>.
        </h2>
        <p className="sub" style={{ maxWidth: 580, margin: '0 auto 36px' }}>
          First month free. 30 ads on us. We email you when your seat is ready.
        </p>
        <WaitlistForm center />
        <div className={styles.micro}>
          <span>no card required</span>
          <span className={styles.sep}>·</span>
          <span>seats released in waves</span>
          <span className={styles.sep}>·</span>
          <span>b2b saas only</span>
        </div>
      </div>
    </section>
  );
}
```
> The eyebrow had `margin-bottom:24px` and the h2 had top spacing inline; add `.finalCta .eyebrowSpacing`? Simpler: wrap with module spacing — add `margin-bottom: 24px` to a `.intro` wrapper or set it via a `style` on `<Eyebrow>` is not supported. Instead, in the module add `.finalCta > .wrap-narrow > :global(.eyebrow)`? Avoid `:global` gymnastics — give the `Eyebrow` a `className` prop value `styles.kicker` and define `.kicker { margin-bottom: 24px; }`. (The `Eyebrow` component already accepts `className`.)

- [ ] **Step 3: Create `Footer.module.css`**

Port from `legacy/styles/landing.css`: `footer.foot` (915-919) → `.foot`, `.foot-inner` (920-927) → `.inner`, `.foot h6` (928-934), `.foot ul` (935), `.foot a` + hover (936-941), `.foot .meta-line` (942-950) → `.metaLine`, plus 960px rule for `.foot-inner` (971). Add classes for the footer brand block (legacy inline styles, lines 477-483): `.brand`, `.brandRow`, `.brandWordmark`, `.brandAds`, `.brandBlurb`. Add `.live` dot + "private beta" styling from the meta-line inline (lines 512-514): `.metaStatus`, `.metaDot`.

- [ ] **Step 4: Create `Footer.tsx`**

Port `legacy/index.html:474-517`. Logo via `next/image` (28×28). Column link lists from arrays:
```tsx
import Image from 'next/image';
import styles from './Footer.module.css';

const COLUMNS = [
  { h: 'product', links: [['how it works', '#how'], ['pricing', '#pricing'], ['compare', '#compare']] },
  { h: 'company', links: [['about', '#'], ['contact', '#'], ['careers', '#']] },
  { h: 'resources', links: [['faq', '#faq'], ['privacy', '#'], ['terms', '#']] },
] as const;

export function Footer() {
  return (
    <footer className={styles.foot}>
      <div className={styles.inner}>
        <div>
          <a className={styles.brandRow} href="#">
            <Image src="/logo-mark.png" alt="" width={28} height={28} />
            <span className={styles.brandWordmark}>
              betteryour<span className={styles.brandAds}>ads</span>
            </span>
          </a>
          <p className={styles.brandBlurb}>
            Meta ads for b2b saas. Built by founders who got tired of agency invoices.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.h}>
            <h6>{col.h}</h6>
            <ul>
              {col.links.map(([label, href]) => (
                <li key={label}><a href={href}>{label}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.metaLine}>
        <span>betteryourads · 2026 · sf</span>
        <span className={styles.metaStatus}>
          <span className={styles.metaDot} />
          private beta · waitlist open
        </span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Verify build & commit**
```bash
npm run build
git add -A
git commit -m "feat: add FinalCta and Footer sections"
```

---

## Task 18: Global layout classes + assemble `app/page.tsx`

**Files:**
- Modify: `styles/tokens.css` (append shared layout classes) OR create `styles/layout.css`
- Modify: `app/globals.css`, `app/page.tsx`

> Several global, cross-section classes are referenced by section JSX: `.wrap`, `.wrap-narrow`, `.section`, `.section + .section` divider, and the type helpers `.accent`, `.lead`, `.sub` used directly in Hero. tokens.css already defines `.lead`, `.small`, `.meta`, `.eyebrow` semantically — but the *marketing* `.lead`/`.sub`/`.accent` differ (landing.css overrides). Put the marketing-global layout + the `.accent`/`.lead`/`.sub` used outside SectionHead into `app/globals.css` so they're available app-wide.

- [ ] **Step 1: Add global layout + accent classes to `app/globals.css`**

Append to `app/globals.css` (values from landing.css:23-27, 154, 137-151):
```css
.wrap { max-width: 1240px; margin: 0 auto; padding: 0 32px; }
.wrap-narrow { max-width: 980px; margin: 0 auto; padding: 0 32px; }

.section { padding: 96px 0; position: relative; }
.section + .section { border-top: 1px solid var(--fg); }

.accent { color: var(--accent); font-weight: 700; font-style: normal; }

.lead {
  font-family: var(--font-sans);
  font-size: 18px;
  line-height: 1.5;
  color: var(--fg-2);
  max-width: 480px;
  margin: 0;
  text-wrap: pretty;
}
.sub {
  font-family: var(--font-sans);
  font-size: 17px;
  line-height: 1.5;
  color: var(--fg-2);
  margin: 0;
}

@media (max-width: 960px) {
  .section { padding: 64px 0; }
}
```
> Note: tokens.css also defines `.lead`/`.sub`. Since globals.css imports tokens.css first, these marketing values override — but to avoid two competing definitions (hygiene), DELETE the `.lead`, `.small`, `.meta`, `.sub` (if present) duplicate rules from `styles/tokens.css` that the marketing page doesn't use, keeping only the marketing versions here. Keep tokens.css's heading rules (`.display`, `h1`–`h5`, `.eyebrow`, `.mono`, links, `::selection`, `:focus-visible`) since those are the base layer. (tokens.css has no `.sub`; it has `.lead` at 213-219 and `.small`/`.meta` — remove `.lead` from tokens.css to avoid the clash; `.small`/`.meta` are unused by the page, remove them too.)

- [ ] **Step 2: Write `app/page.tsx`**
```tsx
import { Nav } from '@/components/Nav/Nav';
import { Hero } from '@/components/Hero/Hero';
import { PilotProof } from '@/components/PilotProof/PilotProof';
import { Problem } from '@/components/Problem/Problem';
import { HowItWorks } from '@/components/HowItWorks/HowItWorks';
import { Compare } from '@/components/Compare/Compare';
import { Pricing } from '@/components/Pricing/Pricing';
import { Faq } from '@/components/Faq/Faq';
import { FinalCta } from '@/components/FinalCta/FinalCta';
import { Footer } from '@/components/Footer/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <PilotProof />
      <Problem />
      <HowItWorks />
      <Compare />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Full verification gate**

Run, in order:
```bash
npx tsc --noEmit
npm run lint
npm test
npm run build
```
Expected: tsc clean; lint clean (no unused vars/imports); tests pass; build succeeds.

- [ ] **Step 4: Visual parity check**

Run: `npm run dev`, open http://localhost:3000. Open `legacy/index.html` side by side. Verify: nav, hero + animated LiveDemo cycling, pilot cards, problem grid, how-it-works (incl. bar chart), compare table, pricing, FAQ accordion, final CTA (submit → confirmation), footer. Note any drift; fix in the relevant module.

- [ ] **Step 5: Commit**
```bash
git add -A
git commit -m "feat: assemble landing page and add global layout classes"
```

---

## Task 19: Enforce no-unused lint rule

**Files:**
- Modify: `eslint.config.mjs`

- [ ] **Step 1: Add the no-unused-vars rule**

In `eslint.config.mjs`, add a rules override so unused imports/vars fail lint (allowing `_`-prefixed args):
```js
{
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
  },
}
```
(Append this object to the exported flat-config array.)

- [ ] **Step 2: Run lint and fix any flagged unused code**

Run: `npm run lint`
Expected: passes. If anything is flagged (stray imports/vars from porting), delete it.

- [ ] **Step 3: Commit**
```bash
git add -A
git commit -m "chore: fail lint on unused vars/imports"
```

---

## Task 20: Tailwind + shadcn/ui sample (Pricing, format comparison)

**Files:**
- Create: `samples/tailwind-shadcn/README.md`
- Create: `samples/tailwind-shadcn/Pricing.tsx`
- Create: `samples/tailwind-shadcn/theme.css`

> Goal: show the **format** of the same Pricing UI in Tailwind + shadcn/ui idiom, for comparison. It is self-contained and NOT imported by `app/` (so it doesn't pull Tailwind into the build). It is reference code; it does not need to compile against the app's config.

- [ ] **Step 1: Create `samples/tailwind-shadcn/theme.css`**

Map the BYA tokens into a Tailwind v4 `@theme` block so the sample reads idiomatically:
```css
@import "tailwindcss";

@theme {
  --color-bg: #f4efe6;
  --color-bg-raised: #ece5d6;
  --color-fg: #0a0a0a;
  --color-fg-2: #3a3a38;
  --color-fg-3: #7a7771;
  --color-accent: #1a3df0;
  --color-accent-hover: #1530c2;
  --color-accent-soft: #e3e5fb;
  --radius-card: 8px;
}
```

- [ ] **Step 2: Create `samples/tailwind-shadcn/Pricing.tsx`**

The same Pricing section, written with Tailwind utilities + shadcn-style `Card`/`Button` (referenced by import path as they'd exist in a shadcn project). This is illustrative of format:
```tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const tiers = [
  {
    name: 'founder', price: '$499', featured: false,
    pitch: 'For founders running their first paid social, or replacing a freelancer.',
    features: ['30 ads / month, shipped live', '1 brand, unlimited angles', 'Daily spend reallocation toward signups', 'Slack support, founder-to-founder'],
    footnote: 'private beta, 2026',
  },
  {
    name: 'scale', price: '$1,499', featured: true,
    pitch: 'For teams shipping ads daily, scaling beyond the founder plan.',
    features: ['120 ads / month, shipped live', '1 brand, unlimited angles', 'Daily reallocation + weekly creative refresh', 'Dedicated account, shared Slack with our team'],
    footnote: 'white-glove onboarding included',
  },
];

export function Pricing() {
  return (
    <section className="py-24 bg-bg text-fg" id="pricing">
      <div className="mx-auto max-w-[1240px] px-8">
        <div className="flex max-w-[760px] flex-col gap-[18px]">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-fg-3">pricing</span>
          <h2 className="text-[clamp(34px,4vw,56px)] font-medium leading-[1.05] tracking-[-0.025em]">Two plans. No retainer.</h2>
          <p className="max-w-[640px] text-[17px] leading-relaxed text-fg-2">Pay for ads that ship, not for meetings. Month to month. Cancel any time.</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {tiers.map((t) => (
            <Card key={t.name} className={`rounded-[8px] border border-fg bg-bg p-9 ${t.featured ? 'border-t-4 border-t-accent' : ''}`}>
              <CardContent className="flex flex-col gap-[18px] p-0">
                <div className="flex items-center gap-[10px]">
                  <span className="text-sm font-semibold">{t.name}</span>
                  {t.featured && (
                    <span className="rounded-[2px] border border-accent px-[7px] py-[3px] text-[10px] font-semibold uppercase tracking-[0.1em] text-accent">most teams</span>
                  )}
                </div>
                <div className="flex items-baseline gap-2 text-[56px] font-medium leading-none tracking-[-0.03em]">
                  {t.price}<span className="text-[15px] font-medium text-fg-3">/ month</span>
                </div>
                <p className="min-h-[2.9em] text-[15px] leading-snug text-fg-2">{t.pitch}</p>
                <ul className="flex flex-col gap-[10px] border-t border-fg/10 pt-2">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-[10px] text-sm leading-snug">
                      <span className="mt-2 h-[5px] w-[5px] shrink-0 rounded-full bg-accent" />{f}
                    </li>
                  ))}
                </ul>
                <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-fg-3">{t.footnote}</span>
                <Button asChild className={`mt-auto w-full justify-center rounded-[4px] ${t.featured ? 'bg-accent text-bg hover:bg-accent-hover' : 'border border-fg bg-bg text-fg hover:bg-bg-raised'}`}>
                  <a href="#waitlist">join the waitlist</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `samples/tailwind-shadcn/README.md`**

Explain the folder's purpose and how the two approaches differ:
```markdown
# Tailwind + shadcn/ui — format sample

This folder shows the **Pricing** section (see `../../components/Pricing/`) rewritten
in the Tailwind + shadcn/ui idiom, for comparing authoring formats. It is **not**
part of the site build — `app/` never imports it, so Tailwind stays out of the
production bundle.

- **CSS Modules version** (shipped): markup in `Pricing.tsx`, styling in
  `Pricing.module.css`, design values from `styles/tokens.css`. Styling and
  structure are separated.
- **Tailwind + shadcn version** (this folder): styling lives inline as utility
  classes; tokens map into a Tailwind `@theme` (`theme.css`); components come
  from shadcn primitives (`Card`, `Button`).

To run this for real you would: `npx shadcn@latest init`, add `card` + `button`,
import `theme.css`, and render `<Pricing />`. Left as reference only.
```

- [ ] **Step 4: Confirm the sample is excluded from the build**

Run: `npm run build`
Expected: succeeds; build output makes no reference to `samples/`. (Next only compiles what `app/` imports.)

- [ ] **Step 5: Commit**
```bash
git add -A
git commit -m "docs: add Tailwind+shadcn Pricing format sample"
```

---

## Task 21: Rewrite README and final hygiene sweep

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Rewrite `README.md`**
```markdown
# BetterYourAds — Landing Page

Marketing site for **BetterYourAds**: Meta ads, built for B2B SaaS. We learn the
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
samples/tailwind-shadcn/   # format comparison only — NOT part of the build
legacy/              # original static HTML/CSS, kept for reference
docs/superpowers/    # design spec + this plan
```

## Notes

- The waitlist form is client-only (inline confirmation, no persistence). A real
  endpoint can be wired into `components/ui/WaitlistForm.tsx` later without
  changing markup.
- `legacy/` is reference only; nothing in the app imports from it.
```

- [ ] **Step 2: Final unused-file sweep**

Verify no orphan files exist in `app/`, `components/`, `styles/`, `public/`:
- No `app/page.module.css` (deleted in Task 0).
- No starter SVGs in `public/`.
- Every `.module.css` is imported by its sibling `.tsx`.
- `grain.svg` is not in `public/`.

Run: `npm run build` and `npm run lint`
Expected: both clean.

- [ ] **Step 3: Commit**
```bash
git add -A
git commit -m "docs: rewrite README for the Next.js landing page"
```

---

## Self-Review notes (for the implementer)

- **Spec coverage:** Next.js App Router (T0), CSS Modules + tokens (T2,T4-17), DM-Sans-only fonts (T2), client-only waitlist (T6), LiveDemo as tested reducer + client component (T8,T9), assets minus grain.svg (T3), Tailwind+shadcn Pricing sample excluded from build (T20), README + .gitignore (T0,T21), code hygiene incl. dropped dead CSS/fonts/assets and enforced no-unused lint (T2,T5,T19,T21), verification gates (T18). All spec sections map to a task.
- **Type consistency:** `WaitlistForm({id?, center?})`, `Eyebrow({children, accent?, as?, className?})`, `SectionHead({eyebrow, eyebrowAccent?, title, sub?})`, `Button({href, children, primary?, sm?, className?})` are used consistently across sections. `liveDemoMachine` exports (`statusText`, `feedRowState`, `stepLabel`, `canvasOpacities`, `FEED_DEFS`, `DEMO_URL`, `DEMO_PALETTE`) match between Task 8 tests, the module, and Task 9's component.
- **Known parity caveats (documented in-task):** single 12px check SVG reused for the analyze button (T9); anchor-bar link uses global `.signal` style (T15); final-CTA eyebrow spacing via `Eyebrow className` (T17). Each notes how to reach exact parity if desired.
```
