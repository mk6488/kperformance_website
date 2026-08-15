# K Performance — Style Guide

Use this document when building any new page or component so the visual language stays consistent across the site.

---

## Colours

| Token | Hex | Usage |
|---|---|---|
| `navy` | `#215681` | Primary brand colour. Buttons, logo text, strong headings, links |
| `blue` | `#4A86B7` | Eyebrow labels, section titles, hover states, secondary accents |
| `green` | `#5CBF88` | Positive values, badges, success states |
| `amber` | `#E3A857` | Warm accent (use sparingly) |
| `offWhite` | `#F7F9FC` | Page background |
| `charcoal` | `#1F2A35` | Primary body text, dark section backgrounds |
| `slate` | `#334155` | Footer background, muted text on dark |
| `muted` | `#64748B` | Secondary / helper text on light backgrounds |
| `line` | `#e9eef5` | Card borders, dividers |

In Tailwind use the `brand-*` prefix: `text-brand-navy`, `bg-brand-offWhite`, etc.  
In plain CSS use the CSS custom properties defined below.

```css
:root {
  --navy:     #215681;
  --blue:     #4A86B7;
  --green:    #5CBF88;
  --amber:    #E3A857;
  --offwhite: #F7F9FC;
  --charcoal: #1F2A35;
  --slate:    #334155;
  --muted:    #64748B;
  --line:     #e9eef5;
  --sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --mono: ui-monospace, "SF Mono", Consolas, "Courier New", monospace;
}
```

---

## Typography

**Font family:** `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`  
Monospace (data/numbers): `ui-monospace, "SF Mono", Consolas, "Courier New", monospace`

| Role | Size | Weight | Other |
|---|---|---|---|
| Page h1 | `1.6–2rem` | 700 | `letter-spacing: -0.01em`, charcoal |
| Section h2 | `1.5–1.75rem` | 600 | charcoal |
| Eyebrow label | `0.68–0.72rem` | 700 | uppercase, `letter-spacing: 0.15em`, blue |
| Body | `0.9–1rem` | 400 | `line-height: 1.55–1.65`, muted on light |
| Small / helper | `0.75–0.78rem` | 400 | muted |
| Card section title | `0.68rem` | 700 | uppercase, `letter-spacing: 0.15em`, blue |
| Nav brand name | `1.1rem` | 600 | `letter-spacing: -0.01em`, navy |

---

## Layout

**Max-width container:** `max-width: 1152px` (Tailwind `max-w-6xl`), centred, `px: 16px / 24px / 32px` at sm/md/lg.  
**Tool-page container:** `max-width: 960px`, `px: 24px`.  
**Page background:** `#F7F9FC` (off-white).  
**Section vertical padding:** `py-14 md:py-20` (56px / 80px).

---

## Header (nav bar)

Every page uses the same sticky white nav bar.

- **Background:** `rgba(255,255,255,0.95)` + `backdrop-filter: blur(8px)`
- **Border:** `1px solid #f1f5f9` (bottom only)
- **Height:** ~60px (`padding: 10px 24px`, 40px logo)
- **Left:** `logo-blue.png` (40×40, object-fit contain) + "K Performance" (1.1rem, 600, navy)
- **Right:** Primary CTA button on marketing pages; page label or nothing on tool pages

```html
<header>
  <div class="header-inner">
    <div class="header-brand">
      <img src="logo-blue.png" alt="K Performance" class="header-logo">
      <span class="header-name">K Performance</span>
      <div class="header-divider"></div>
      <span class="header-page-label">Page Name</span>
    </div>
  </div>
</header>
```

---

## Footer

- **Background:** `#334155` (slate)
- **Text:** `rgba(255,255,255,0.80)`
- **Padding:** `28px 24px`
- **Font size:** `0.78rem`, `line-height: 1.7`
- Strong tags use `rgba(255,255,255,0.95)`

---

## Buttons

All buttons are **pill-shaped** (`border-radius: 100px`) with `min-height: 44px`.

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| Primary | `#215681` navy | white | none | `#4A86B7` blue |
| Secondary | white | navy | `1px solid navy` | `#f1f5f9` |
| Ghost | transparent | navy | none | `#F7F9FC` |

```css
.btn-primary {
  background: var(--navy);
  color: #fff;
  border: none;
  padding: 11px 24px;
  border-radius: 100px;
  font-size: 0.88rem;
  font-weight: 700;
  min-height: 44px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-primary:hover { background: var(--blue); }

.btn-secondary {
  background: #fff;
  color: var(--navy);
  border: 1px solid var(--navy);
  padding: 10px 24px;
  border-radius: 100px;
  font-size: 0.88rem;
  font-weight: 600;
  min-height: 44px;
  cursor: pointer;
}
```

---

## Cards

```css
.card {
  background: #fff;
  border: 1px solid #e9eef5;
  border-radius: 12px;   /* Tailwind rounded-xl */
  padding: 20px;
  box-shadow: 0 1px 3px rgba(31, 42, 53, 0.05);
}
```

Card section titles (inside a card) use the eyebrow label style: `0.68rem`, `700`, uppercase, `letter-spacing: 0.15em`, blue. Add a `1px solid #f1f5f9` rule below.

---

## Form Inputs

```css
input, select {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.92rem;
  background: #fff;
  color: var(--charcoal);
  transition: border-color 0.15s, box-shadow 0.15s;
}
input:focus, select:focus {
  outline: none;
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(74, 134, 183, 0.15);
}
label {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--muted);
  margin-bottom: 5px;
  letter-spacing: 0.02em;
}
```

Numeric/data fields: use monospace font (`var(--mono)`).  
Labels: small-caps muted style (not uppercase — just small and semibold).

---

## Badges

Used to communicate a status or attribute (e.g. "No data stored").

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--green);
  background: rgba(92, 191, 136, 0.10);
  border: 1px solid rgba(92, 191, 136, 0.28);
  padding: 4px 12px;
  border-radius: 100px;
}
```

Add a `6×6px` green dot before the text using `::before` or an inline `<span>`.

---

## Eyebrow / Section Labels

Used above section headings or as page labels.

```css
.eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--blue);
}
```

In Tailwind: `text-xs font-bold tracking-[0.15em] uppercase text-brand-blue`

---

## Section patterns

### Marketing section (React)
```jsx
<Section variant="muted">   {/* bg-brand-offWhite */}
  <SectionHeading eyebrow="Label" title="Heading" subtitle="..." />
  {/* content */}
</Section>
```

### Tool / form page (plain HTML)
```html
<div class="page-intro">          <!-- white bg, border-bottom -->
  <div class="page-intro-inner">  <!-- max-width 960px, centred -->
    <p class="eyebrow">Label</p>
    <h1 class="page-title">Heading</h1>
    <p class="page-desc">Description.</p>
    <span class="badge">…</span>
  </div>
</div>
<main>…</main>
```

---

## Logos

| File | Use |
|---|---|
| `logo-blue.png` | On white / light backgrounds (nav, cards) |
| `logo-white.png` | On dark / coloured backgrounds (dark headers, gradient heroes) |

Nav logo size: `40×40px`, `object-fit: contain`.  
Hero logo size: `64–80px`.

---

## Spacing scale (key values)

| Token | Value | Tailwind |
|---|---|---|
| xs | 4px | `p-1` |
| sm | 8px | `p-2` |
| md | 16px | `p-4` |
| lg | 24px | `p-6` |
| xl | 32px | `p-8` |
| 2xl | 48px | `p-12` |
| 3xl | 64px | `p-16` |

Section padding: `56px` vertical (sm), `80px` (md+).
