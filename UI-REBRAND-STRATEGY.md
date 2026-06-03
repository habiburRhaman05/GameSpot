# GameSpot — UI Rebranding Strategy

> **Status:** Planning · Awaiting Approval  
> **Scope:** UI/UX-only refactor — zero business logic changes  
> **Date:** June 3, 2026

---

## 1. Executive Summary

GameSpot is a sports venue booking platform that currently uses a clean but generic SaaS aesthetic (indigo primary, coral accent, serif display font). The goal is to transform the visual identity into a **premium, energetic, sports-first** experience comparable to ESPN, Bleacher Report, OneFootball, SofaScore, and Flashscore — while preserving 100% of existing functionality.

**Key Transformation Areas:**
- Color system → Sports-oriented palette (electric blue + energetic accent)
- Typography → Bold, condensed display font + clean body font
- Layout density → More data-rich, scannable, sports-dashboard feel
- Animations → Unified on `framer-motion`/`motion` with sports-energy motion language
- Component styling → Higher contrast, bolder borders, sport-ready surfaces
- Dark theme → Dominant theme (sports apps are dark-first)

---

## 2. Brand Direction & Visual Identity

### 2.1 Brand Personality
| Trait | Description |
|-------|-------------|
| **Energetic** | Fast, dynamic, alive — like a live match |
| **Premium** | High-end sports club, not a budget booking app |
| **Data-driven** | Stats, scores, rankings front and center |
| **Bold** | High contrast, confident typography, strong visual hierarchy |
| **Modern** | Contemporary sports media — think 2026, not 2020 |

### 2.2 Visual Reference Points
- **ESPN** → Bold reds, strong headlines, data-heavy layouts
- **Bleacher Report** → Dark-first, editorial typography, immersive cards
- **OneFootball** → Dark backgrounds, green accents, clean data viz
- **SofaScore** → Blue data UI, live stats, real-time feel
- **Flashscore** → Dense information, color-coded, high-density data

### 2.3 What We're Moving Away From
| Current | New Direction |
|---------|--------------|
| Indigo/Coral palette | Electric Blue + Stadium Green/Amber accent |
| Instrument Serif headings | Inter Tight or similar condensed sans-serif for headlines |
| Light-first design | Dark-first (dark is the default sports aesthetic) |
| SaaS dashboard feel | Sports media / live match feel |
| Soft, muted tones | High-contrast, vibrant accents |
| Generic card layouts | Data-rich, scannable card designs |

---

## 3. Color System

### 3.1 Light Theme — "Daylight Arena"

```css
:root {
  /* Core surfaces — crisp, clean, athletic */
  --background: #f8f9fc;          /* Cool white — not warm/generic */
  --foreground: #0a0e1a;          /* Near-black with blue tint */
  --surface: #ffffff;
  --surface-2: #f1f3f8;           /* Slightly blue-tinted gray */
  --surface-3: #e2e6ef;           /* Elevated surface */
  --surface-glass: rgba(255, 255, 255, 0.82);

  /* Cards & popovers */
  --card: #ffffff;
  --card-foreground: #0a0e1a;
  --popover: #ffffff;
  --popover-foreground: #0a0e1a;

  /* Borders — clean, visible structure */
  --border: rgba(10, 14, 26, 0.08);
  --border-strong: rgba(10, 14, 26, 0.14);
  --input: rgba(10, 14, 26, 0.10);

  /* Text — bold hierarchy */
  --text-primary: #0a0e1a;
  --text-secondary: #4a5568;
  --text-tertiary: #8896ab;
  --muted: #f1f3f8;
  --muted-foreground: #4a5568;

  /* Primary — Electric Blue (trust, sports data, technology) */
  --primary: #0066ff;
  --primary-hover: #0052cc;
  --primary-soft: rgba(0, 102, 255, 0.08);
  --primary-foreground: #ffffff;
  --primary-fg: #ffffff;

  /* Accent — Stadium Green (live, active, energetic) */
  --accent: #00d26a;
  --accent-hover: #00b85c;
  --accent-soft: rgba(0, 210, 106, 0.08);
  --accent-foreground: #0a0e1a;
  --accent-fg: #0a0e1a;

  /* Tertiary — Victory Gold (premium, achievement) */
  --tertiary: #ffb800;
  --tertiary-hover: #e6a600;
  --tertiary-soft: rgba(255, 184, 0, 0.08);

  /* Action — Signal Red (urgency, CTAs, excitement) */
  --action: #ff3d00;
  --action-hover: #e63600;
  --action-soft: rgba(255, 61, 0, 0.08);

  /* Secondary */
  --secondary: rgba(0, 102, 255, 0.06);
  --secondary-foreground: #0066ff;

  /* Semantic statuses */
  --success: #00d26a;
  --success-foreground: #0a0e1a;
  --warning: #ffb800;
  --warning-foreground: #0a0e1a;
  --error: #ff3d00;
  --error-foreground: #ffffff;
  --info: #0066ff;
  --info-foreground: #ffffff;
  --destructive: #ff3d00;
  --destructive-foreground: #ffffff;

  /* Focus ring */
  --ring: #0066ff;

  /* Charts — sports-oriented */
  --chart-1: #0066ff;    /* Blue — primary data */
  --chart-2: #00d26a;    /* Green — positive/live */
  --chart-3: #ffb800;    /* Gold — achievement */
  --chart-4: #ff3d00;    /* Red — negative/alerts */
  --chart-5: #8b5cf6;    /* Purple — neutral/accent */

  /* Shadows — blue-tinted for sports feel */
  --shadow-color: 220 60% 50%;
  --shadow-sm: 0 1px 2px 0 hsl(var(--shadow-color) / 0.03);
  --shadow: 0 2px 4px 0 hsl(var(--shadow-color) / 0.04), 0 0 0 1px hsl(var(--shadow-color) / 0.02);
  --shadow-md: 0 4px 12px -2px hsl(var(--shadow-color) / 0.06), 0 0 0 1px hsl(var(--shadow-color) / 0.02);
  --shadow-lg: 0 8px 24px -4px hsl(var(--shadow-color) / 0.08), 0 0 0 1px hsl(var(--shadow-color) / 0.02);
  --shadow-xl: 0 16px 48px -8px hsl(var(--shadow-color) / 0.10), 0 0 0 1px hsl(var(--shadow-color) / 0.03);
  --shadow-glow-primary: 0 0 0 3px rgba(0, 102, 255, 0.12), 0 8px 24px -4px rgba(0, 102, 255, 0.3);
  --shadow-glow-accent: 0 0 0 3px rgba(0, 210, 106, 0.12), 0 8px 24px -4px rgba(0, 210, 106, 0.3);
}
```

### 3.2 Dark Theme — "Stadium Night" (Dominant Theme)

```css
.dark {
  /* Core surfaces — deep stadium dark */
  --background: #080b14;          /* Deep blue-black — the stadium at night */
  --foreground: #e8ecf4;          /* Cool white text */
  --surface: #0d1220;             /* Card/surface — slightly elevated */
  --surface-2: #141c2e;           /* Interactive surfaces */
  --surface-3: #1c2640;           /* Hover/elevated */
  --surface-glass: rgba(13, 18, 32, 0.85);

  --card: #0d1220;
  --card-foreground: #e8ecf4;
  --popover: #0d1220;
  --popover-foreground: #e8ecf4;

  /* Borders — subtle structure in dark */
  --border: rgba(255, 255, 255, 0.06);
  --border-strong: rgba(255, 255, 255, 0.10);
  --input: rgba(255, 255, 255, 0.08);

  --text-primary: #e8ecf4;
  --text-secondary: #8896ab;
  --text-tertiary: #4a5568;
  --muted: #141c2e;
  --muted-foreground: #8896ab;

  /* Primary — brighter blue for dark backgrounds */
  --primary: #3b82f6;
  --primary-hover: #60a5fa;
  --primary-soft: rgba(59, 130, 246, 0.12);
  --primary-foreground: #080b14;
  --primary-fg: #080b14;

  /* Accent — vivid green for dark */
  --accent: #34d399;
  --accent-hover: #6ee7b7;
  --accent-soft: rgba(52, 211, 153, 0.12);
  --accent-foreground: #080b14;
  --accent-fg: #080b14;

  /* Tertiary — gold */
  --tertiary: #fbbf24;
  --tertiary-hover: #fcd34d;
  --tertiary-soft: rgba(251, 191, 36, 0.12);

  /* Action — signal red */
  --action: #f87171;
  --action-hover: #fca5a5;
  --action-soft: rgba(248, 113, 113, 0.12);

  /* Secondary */
  --secondary: rgba(59, 130, 246, 0.10);
  --secondary-foreground: #93bbfd;

  /* Semantic — luminous on dark */
  --success: #34d399;
  --success-foreground: #080b14;
  --warning: #fbbf24;
  --warning-foreground: #080b14;
  --error: #f87171;
  --error-foreground: #080b14;
  --info: #60a5fa;
  --info-foreground: #080b14;
  --destructive: #f87171;
  --destructive-foreground: #080b14;

  --ring: #3b82f6;

  --chart-1: #3b82f6;
  --chart-2: #34d399;
  --chart-3: #fbbf24;
  --chart-4: #f87171;
  --chart-5: #a78bfa;

  /* Sidebar */
  --sidebar: #0a0f1c;
  --sidebar-foreground: #e8ecf4;
  --sidebar-primary: #3b82f6;
  --sidebar-primary-foreground: #080b14;
  --sidebar-accent: #141c2e;
  --sidebar-accent-foreground: #e8ecf4;
  --sidebar-border: rgba(255, 255, 255, 0.06);
  --sidebar-ring: #3b82f6;

  /* Shadows — deeper, blue-tinted */
  --shadow-2xs: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.55);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.02);
  --shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.02);
  --shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.02);
  --shadow-lg: 0 8px 24px -4px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.02);
  --shadow-xl: 0 16px 48px -8px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.03);
  --shadow-glow-primary: 0 0 0 3px rgba(59, 130, 246, 0.2), 0 8px 24px -4px rgba(59, 130, 246, 0.4);
  --shadow-glow-accent: 0 0 0 3px rgba(52, 211, 153, 0.2), 0 8px 24px -4px rgba(52, 211, 153, 0.4);
}
```

### 3.3 Color Palette Summary

| Token | Light | Dark | Use Case |
|-------|-------|------|----------|
| Primary | `#0066ff` | `#3b82f6` | CTAs, links, active states |
| Accent | `#00d26a` | `#34d399` | Success, live indicators, badges |
| Tertiary | `#ffb800` | `#fbbf24` | Premium badges, star ratings, gold |
| Action | `#ff3d00` | `#f87171` | Urgent CTAs, warnings, delete |
| Background | `#f8f9fc` | `#080b14` | Page background |
| Surface | `#ffffff` | `#0d1220` | Cards, panels |
| Surface-2 | `#f1f3f8` | `#141c2e` | Hover, interactive |
| Surface-3 | `#e2e6ef` | `#1c2640` | Elevated, dropdowns |

---

## 4. Typography System

### 4.1 Font Stack

| Role | Font | Fallback | Use |
|------|------|----------|-----|
| **Display / Headlines** | `Inter Tight` (or `Barlow Condensed`) | system-ui | Hero headlines, section titles, stat numbers |
| **Body** | `Inter` | ui-sans-serif, system-ui | Body text, paragraphs, descriptions |
| **Labels** | `Inter` (semibold, uppercase) | ui-sans-serif | Labels, badges, tags, overlines |
| **Mono** | `Geist Mono` | ui-monospace | Code, IDs, technical data |

### 4.2 Why Change from Instrument Serif?
- Instrument Serif gives a **luxury/editorial** feel — more Vogue than ESPN
- Sports media uses **condensed sans-serif** for headlines (bold, punchy, scannable)
- Inter Tight / Barlow Condensed gives the **bold, athletic** feel we need
- Sans-serif headlines are more readable at small sizes on mobile

### 4.3 Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|-------|------|--------|-------------|----------------|-----|
| `display-xl` | clamp(3rem, 8vw, 6rem) | 800 | 0.88 | -0.03em | Hero headlines |
| `display-lg` | clamp(2rem, 5vw, 4rem) | 800 | 0.90 | -0.02em | Section headlines |
| `display-md` | clamp(1.5rem, 3vw, 2.5rem) | 700 | 0.92 | -0.02em | Sub-sections |
| `heading-lg` | 1.5rem | 700 | 1.2 | -0.01em | Card titles |
| `heading-md` | 1.25rem | 600 | 1.3 | -0.01em | Subtitles |
| `heading-sm` | 1rem | 600 | 1.4 | 0 | Small headings |
| `body-lg` | 1rem | 400 | 1.6 | 0 | Large body |
| `body` | 0.875rem | 400 | 1.5 | 0 | Default body |
| `body-sm` | 0.75rem | 400 | 1.5 | 0 | Small body |
| `label-lg` | 0.75rem | 700 | 1.2 | 0.08em | Large labels |
| `label` | 0.6875rem | 700 | 1.2 | 0.10em | Default labels |
| `label-sm` | 0.625rem | 700 | 1.2 | 0.12em | Small labels/tags |
| `overline` | 0.5625rem | 800 | 1.2 | 0.16em | Overlines, category tags |
| `stat` | clamp(2rem, 4vw, 3.5rem) | 800 | 0.90 | -0.02em | Stat numbers, scores |

### 4.4 Typography Guidelines
- **Headlines:** Always use display font, always uppercase for major headings
- **Body:** Never use uppercase — it hurts readability
- **Labels/Overlines:** Always uppercase with letter-spacing for that sports-media feel
- **Stat numbers:** Always display font, extra bold, tight tracking
- **Line lengths:** Max 65 characters for body text

---

## 5. Design Principles

### 5.1 Sports-First Visual Language
Every design decision should answer: *"Does this feel like a premium sports platform?"*

### 5.2 Bold Hierarchy
- High contrast between headings and body
- Clear visual weight differences
- Stat numbers should dominate their containers

### 5.3 Data Density
- Sports users expect information-dense layouts
- Don't over-whitespace — use density intentionally
- Show more data, not less — but organize it clearly

### 5.4 Dark-First
- Dark theme is the primary experience
- Light theme is the alternative, not the default
- Design every component in dark mode first, then adapt for light

### 5.5 Motion with Purpose
- Every animation should communicate something (speed, transition, emphasis)
- No decorative-only animations
- Keep sports-energy feel: fast, decisive, impactful

### 5.6 Scannable Layouts
- Use color coding for categories/states
- Consistent icon + label patterns
- Progressive disclosure — show summary first, details on demand

---

## 6. Component Guidelines

### 6.1 Buttons
| Variant | Light | Dark | Use |
|---------|-------|------|-----|
| `default` | Blue bg, white text | Blue bg, dark text | Primary CTAs |
| `accent` | Green bg, dark text | Green bg, dark text | Live/active actions |
| `action` | Red bg, white text | Red bg, white text | Urgent/dangerous actions |
| `outline` | Border, transparent bg | Border, transparent bg | Secondary actions |
| `ghost` | Transparent | Transparent | Tertiary actions |
| `glow` | Blue bg + glow shadow | Blue bg + glow shadow | Featured/promoted CTAs |

**Button Design Rules:**
- Rounded-lg (0.75rem) — not fully rounded, not sharp
- Always use `active:scale-[0.98]` for press feedback
- Minimum touch target: 40px height
- Icon buttons: 40x40px minimum
- Text always semibold or bold — never regular weight

### 6.2 Cards
- Border: 1px solid `--border`
- Border-radius: 1rem (rounded-xl)
- Background: `--card`
- Hover: `translateY(-2px)` + shadow elevation
- No border on hover (use shadow instead for elevation)
- Image corners: Match card radius
- Content padding: 1.25rem (20px)

### 6.3 Badges & Tags
- Pill shape (rounded-full) for status badges
- Rounded-md for category tags
- Always uppercase with letter-spacing
- Font: label-sm, bold
- Color: Semantic color with soft background

### 6.4 Tables (Data Tables)
- Dark-mode default: Dark background, subtle row borders
- Header: Uppercase labels, bold, `--text-tertiary`
- Rows: Alternating subtle backgrounds (`--surface` / `--surface-2`)
- Hover: Row highlight with `--primary-soft`
- Borders: Bottom border only, `--border`
- Compact density for dashboard tables

### 6.5 Forms
- Input height: 40px (default), 48px (large)
- Border: `--border`, focus ring: `--ring`
- Labels: Uppercase overline style
- Placeholder: `--text-tertiary`
- Error: Red border + error text below
- Success: Green border briefly on valid

### 6.6 Navigation
- Header: Glass morphism with blur backdrop
- Nav links: Bold, uppercase labels, underline active indicator
- Mobile: Full-screen overlay with stagger animations
- Sidebar (dashboard): Dark panel with icon + label nav items

---

## 7. Theme Strategy

### 7.1 Default Theme
- **Dark mode is the default** (change `defaultTheme` from `"system"` to `"dark"`)
- Users can switch to light mode via toggle
- Respect `prefers-color-scheme` only as initial hint on first visit

### 7.2 Theme Switching
- Keep existing `next-themes` setup
- Smooth CSS variable transitions (already enabled)
- Theme toggle: Sun/Moon icon with rotation animation (keep current)

### 7.3 CSS Variable Architecture
- Keep the current CSS variable system in `globals.css`
- Replace all color values with the new palette
- Add new tokens: `--tertiary`, `--action`, `--tertiary-soft`, `--action-soft`
- Update the `@theme inline` bridge for Tailwind v4

---

## 8. Animation Strategy

### 8.1 Library Consolidation
**Current Problem:** Mixed usage of `framer-motion`, `motion`, and `gsap`.

**Decision:** 
- **Keep `framer-motion`/`motion`** for component-level animations (already well-established)
- **Keep `gsap`** for complex timeline animations (hero, header entrance)
- **Add `@gsap/ScrollTrigger`** for scroll-driven animations (already in use)
- **Keep `lenis`** for smooth scrolling (already in use)

### 8.2 Motion Language
| Animation | Duration | Easing | Use |
|-----------|----------|--------|-----|
| Micro-interaction | 150ms | ease-out | Button press, toggle, hover |
| State change | 200ms | ease-out | Tab switch, dropdown open |
| Page transition | 350ms | ease-out | Route changes |
| Reveal (scroll) | 500ms | ease-out | Content appearing on scroll |
| Stagger (list) | 80ms delay | ease-out | List items, grid cards |
| Spring | spring(260, 22) | spring | Bouncy elements, modals |
| Parallax | scroll-linked | linear | Hero background, sections |

### 8.3 Required Animations
1. **Card hover** — translateY(-2px) + shadow elevation (CSS transition)
2. **Button press** — scale(0.98) (CSS transition)
3. **Nav link hover** — underline slides in from left (CSS transition)
4. **Page transitions** — fade + slide up (framer-motion)
5. **Scroll reveals** — fade up with stagger (framer-motion)
6. **Hero headline** — character-by-character reveal with blur (GSAP)
7. **Stat counters** — count up animation (GSAP)
8. **Theme toggle** — sun/moon rotation (framer-motion)
9. **Mobile menu** — full-screen overlay with stagger (framer-motion)
10. **Skeleton loaders** — shimmer pulse (CSS animation)

### 8.4 Performance Rules
- Never animate `opacity` and `transform` simultaneously with heavy compositing
- Use `will-change` sparingly — only on elements that actively animate
- Respect `prefers-reduced-motion` (already implemented)
- Keep hero animations GPU-accelerated (transform + opacity only)
- Lazy-load below-fold animations

---

## 9. Responsive Strategy

### 9.1 Breakpoints
| Token | Width | Use |
|-------|-------|-----|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small desktops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

### 9.2 Mobile-First Rules
- All components designed mobile-first
- Touch targets: minimum 40x40px
- Swipe gestures for horizontal scrolling sections
- Bottom navigation for dashboard on mobile (future consideration)
- Collapse sidebar to icons on tablet

### 9.3 Layout Density
- Mobile: Single column, full-width cards, generous padding
- Tablet: 2-column grid, collapsible sidebar
- Desktop: 3-4 column grid, persistent sidebar
- Large desktop: Max-width 1280px, centered

---

## 10. Icon System

### 10.1 Current Libraries
- **Lucide React** — General UI icons (keep)
- **Tabler Icons** — Dashboard sidebar icons (keep)
- **Hugeicons** — Additional icons (keep)

### 10.2 Icon Guidelines
- Consistent stroke width: 1.5-2px
- Consistent sizing: 16px (inline), 20px (buttons), 24px (navigation)
- Always use `shrink-0` to prevent icon squishing
- Icon + label pattern for all navigation items
- Use brand icons for social links (not text abbreviations)

---

## 11. Accessibility Standards

### 11.1 Color Contrast
- All text must meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- Interactive elements must have visible focus indicators
- Don't rely on color alone to convey information

### 11.2 Keyboard Navigation
- All interactive elements must be keyboard-accessible
- Focus visible ring on all focusable elements (already implemented)
- Logical tab order following visual layout

### 11.3 Screen Readers
- All images must have meaningful alt text
- Form inputs must have associated labels
- ARIA labels for icon-only buttons
- Landmark regions for page structure

---

## 12. Confirmed Decisions

> ✅ All decisions confirmed by user on June 3, 2026.

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Primary Color** | Electric Blue `#0066ff` / `#3b82f6` + Green accent `#00d26a` / `#34d399` | Sports-data feel like SofaScore/Flashscore |
| **Display Font** | Inter Tight | Clean, modern, athletic condensed sans-serif |
| **Default Theme** | System preference (current behavior) | Neutral approach, respect user OS setting |
| **Animation Library** | Keep mixed approach (framer-motion + GSAP) | Works well, no need to change |
| **Hero Section** | Full redesign from scratch | Complete hero redesign with new brand, particles, search form, stats |
