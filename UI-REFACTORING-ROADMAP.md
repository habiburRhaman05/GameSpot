# GameSpot — Component-by-Component Refactoring Roadmap

> **Status:** Planning · Awaiting Approval  
> **Scope:** UI/UX-only refactor — zero business logic changes  
> **Date:** June 3, 2026  
> **Prerequisite:** [UI Rebranding Strategy](./UI-REBRAND-STRATEGY.md)

---

## Implementation Phases

### Phase 0: Foundation (Do First)
### Phase 1: Core UI Components
### Phase 2: Shared Layout Components
### Phase 3: Home Page Sections
### Phase 4: Venue Discovery & Details
### Phase 5: Authentication Pages
### Phase 6: Dashboard Shell & Navigation
### Phase 7: Dashboard Pages (Admin/Organizer/User)
### Phase 8: Checkout & Booking Flow
### Phase 9: Polish & Testing

---

## Phase 0: Foundation

### 0.1 Global Styles & Theme System
**File:** `src/app/globals.css`

**Current Problems:**
- Color palette is generic SaaS (indigo/coral), not sports-oriented
- No `--tertiary` or `--action` color tokens
- Typography uses Instrument Serif for headings (luxury feel, not sports)
- Glass morphism effects are generic, not sports-branded

**Proposed Redesign:**
- Replace entire color palette with sports-oriented system (blue primary, green accent, gold tertiary, red action)
- Add new color tokens: `--tertiary`, `--action`, `--tertiary-soft`, `--action-soft`
- Update all shadow values to be blue-tinted
- Update chart colors to sports palette
- Keep existing utility classes (`.glass`, `.skeleton`, `.text-gradient-*`)
- Add new utility: `.text-gradient-sports` (blue → green gradient)

**UX Improvements:**
- Better color contrast for dark mode (primary blue brighter on dark)
- More visible focus rings with blue tint
- Stronger visual hierarchy through color

**Visual Improvements:**
- Complete color palette overhaul
- Updated shadow system with blue tinting
- New gradient utilities for sports feel
- Updated scrollbar styling

**Interaction Improvements:**
- Keep existing reduced motion support
- Keep existing focus-visible system

**Responsive Behavior:** No changes needed (CSS variables are responsive by nature)

---

### 0.2 Typography System
**File:** `src/app/layout.tsx`

**Current Problems:**
- Instrument Serif used for headings gives editorial/luxury feel
- 4 Google Fonts loaded (Inter, Instrument Serif, DM Sans, Geist Mono)
- No condensed/bold display font for sports headlines

**Proposed Redesign:**
- Replace Instrument Serif with Inter Tight (or Barlow Condensed) for display/headings
- Keep Inter for body text
- Keep Geist Mono for code
- Consider removing DM Sans (Inter can serve as label font)
- Update `--font-display`, `--font-heading`, `--font-serif` CSS variables

**UX Improvements:**
- More readable headlines at small sizes (sans-serif vs serif)
- Better mobile readability with condensed font
- Consistent typographic hierarchy

**Visual Improvements:**
- Bold, athletic headlines instead of editorial serif
- Tighter letter-spacing for display text
- More sports-media feel across all headings

**Interaction Improvements:** None (purely visual change)

**Responsive Behavior:**
- Headlines use `clamp()` for fluid sizing
- Condensed font maintains readability at small sizes

---

### 0.3 Package Dependencies
**File:** `package.json`

**Current State:**
- `framer-motion: ^12.29.2` and `motion: ^12.29.2` (both installed — redundant)
- `gsap: ^3.14.2` and `@gsap/react: ^2.1.2`
- `lenis: ^1.3.17`
- Multiple icon libraries: `lucide-react`, `@tabler/icons-react`, `@hugeicons/react`

**Proposed Changes:**
- Remove `framer-motion` (keep only `motion` — they're the same package, `motion` is the newer name)
- Keep `gsap` + `@gsap/react` for complex animations
- Keep all icon libraries (used in different contexts)
- Add `next/font` import for Inter Tight / Barlow Condensed

**UX Improvements:** Smaller bundle size

**Visual Improvements:** None

**Interaction Improvements:** None

**Responsive Behavior:** None

---

## Phase 1: Core UI Components

### 1.1 Button
**File:** `src/components/ui/button.tsx`

**Current Problems:**
- 8 variants but `glow` and `glass` rarely used
- `accent` variant uses coral accent (not sports-oriented)
- No `action` variant for urgent/dangerous CTAs
- Button sizes feel generic — not sports-bold enough

**Proposed Redesign:**
- Update `default` variant colors to new blue primary
- Replace `accent` variant with sports green accent
- Add `action` variant for signal red (urgent CTAs)
- Update `glow` to use new blue glow shadow
- Update `outline` hover state to use `--surface-2`
- Keep `ghost`, `link`, `destructive`, `secondary`
- Make default button slightly bolder (semibold → bold)

**UX Improvements:**
- Clearer visual distinction between button types
- Better hover states with stronger feedback
- More intentional color coding (blue = primary, green = positive, red = urgent)

**Visual Improvements:**
- New color palette applied to all variants
- Slightly more rounded corners (keep rounded-lg)
- Bolder text weight
- Stronger hover shadows

**Interaction Improvements:**
- Keep existing `active:scale-[0.98]`
- Keep existing focus-visible ring
- Keep disabled state styling

**Responsive Behavior:** No changes needed

---

### 1.2 Card
**File:** `src/components/ui/card.tsx`

**Current Problems:**
- Card hover lifts up (`-translate-y-0.5`) which can feel generic
- Border color changes on hover — could be stronger
- Glass variant is underused
- No sport-specific card variants (score card, stat card, live card)

**Proposed Redesign:**
- Update border colors to new palette
- Stronger hover elevation (shadow-lg → shadow-xl)
- Add optional `accent` border-left for highlighted cards
- Update glass variant with new glass colors
- Keep `default` and `sm` size variants
- Consider adding `live` variant for real-time data cards

**UX Improvements:**
- Better visual hierarchy with stronger elevation
- Clearer distinction between interactive and static cards
- Accent border for important/promoted cards

**Visual Improvements:**
- Updated border colors
- Stronger shadow on hover
- New accent variant

**Interaction Improvements:**
- Keep hover translate effect
- Keep transition-all duration-200

**Responsive Behavior:** No changes needed

---

### 1.3 Avatar
**File:** `src/components/ui/avatar.tsx`

**Current Problems:**
- Uses Radix Avatar (fine)
- Badge positioning could be more refined
- No status indicator beyond online/offline

**Proposed Redesign:**
- Keep Radix Avatar structure
- Update badge colors to new accent green
- Add optional status ring (colored border for role/status)
- Ensure consistent sizing across all usages

**UX Improvements:**
- Clearer role indication through avatar styling
- Better visual feedback for online status

**Visual Improvements:**
- Updated accent colors on badges
- Consistent border styling

**Interaction Improvements:** None

**Responsive Behavior:** No changes needed

---

### 1.4 Badge
**File:** `src/components/ui/badge.tsx`

**Current Problems:**
- Generic badge styling
- Not sports-oriented

**Proposed Redesign:**
- Add sports-specific color variants: `live` (green pulse), `premium` (gold), `trending` (blue)
- Keep existing variants: `default`, `secondary`, `destructive`, `outline`
- Update colors to new palette
- Make badges slightly bolder (font weight)

**UX Improvements:**
- Better color coding for different badge types
- Live badge with pulse animation for real-time data

**Visual Improvements:**
- New sports-oriented color variants
- Bolder typography
- Updated colors

**Interaction Improvements:**
- Live badge: subtle pulse animation

**Responsive Behavior:** No changes needed

---

### 1.5 Input
**File:** `src/components/ui/input.tsx`

**Current Problems:**
- Standard input styling
- No sports-specific styling

**Proposed Redesign:**
- Update border colors to new palette
- Stronger focus ring (blue primary)
- Update placeholder color to `--text-tertiary`
- Keep existing error/success states (update colors)

**UX Improvements:**
- Better focus indication with blue ring
- Clearer error/success states

**Visual Improvements:**
- Updated colors throughout
- Slightly more refined border styling

**Interaction Improvements:**
- Keep existing focus transition
- Keep existing disabled state

**Responsive Behavior:**
- Ensure 40px minimum height on mobile (touch target)

---

### 1.6 Dialog / Sheet / Drawer
**Files:** `src/components/ui/dialog.tsx`, `src/components/ui/sheet.tsx`

**Current Problems:**
- Standard Radix dialog/sheet styling
- Could feel more sports-oriented

**Proposed Redesign:**
- Update backdrop blur and opacity
- Update dialog background to `--card`
- Update border colors to new palette
- Add subtle entrance animation (scale-in)
- Update close button styling

**UX Improvements:**
- Smoother entrance animations
- Better backdrop treatment
- More consistent with sports theme

**Visual Improvements:**
- Updated colors
- Refined backdrop blur
- Better shadow treatment

**Interaction Improvements:**
- Keep existing keyboard behavior
- Keep existing focus trap

**Responsive Behavior:**
- Sheet: Full-width on mobile, max-width on desktop

---

### 1.7 Table
**File:** `src/components/ui/table.tsx`

**Current Problems:**
- Basic table styling
- Not optimized for data-dense sports layouts

**Proposed Redesign:**
- Update header to uppercase labels with bold weight
- Alternating row backgrounds using `--surface` / `--surface-2`
- Subtle bottom borders only (not full grid)
- Hover state: row highlight with `--primary-soft`
- Update border colors to new palette
- Add compact density option for dashboard tables

**UX Improvements:**
- Better scannability with alternating rows
- Clearer header distinction
- Hover highlight for row tracking

**Visual Improvements:**
- Updated colors
- Better typography hierarchy
- More refined borders

**Interaction Improvements:**
- Row hover highlight

**Responsive Behavior:**
- Horizontal scroll on mobile with sticky first column

---

### 1.8 Tabs
**File:** `src/components/ui/tabs.tsx`

**Current Problems:**
- Standard tabs with motion underline indicator
- Could be more sports-oriented

**Proposed Redesign:**
- Update tab indicator to use primary blue
- Keep motion underline animation
- Update active/inactive colors to new palette
- Add optional `pills` variant for dashboard tabs

**UX Improvements:**
- Clearer active state indication
- Better color coding

**Visual Improvements:**
- Updated colors
- New pills variant

**Interaction Improvements:**
- Keep existing animation

**Responsive Behavior:**
- Horizontal scroll for many tabs on mobile

---

### 1.9 Tooltip / Popover / Dropdown
**Files:** `src/components/ui/tooltip.tsx`, `src/components/ui/dropdown-menu.tsx`

**Current Problems:**
- Standard Radix styling
- Could be more refined

**Proposed Redesign:**
- Update background to `--popover`
- Update border to `--border`
- Update shadow to new shadow system
- Add subtle entrance animation

**UX Improvements:**
- Better visual treatment
- Smoother animations

**Visual Improvements:**
- Updated colors and shadows

**Interaction Improvements:**
- Keep existing keyboard behavior

**Responsive Behavior:** No changes needed

---

### 1.10 Chart
**File:** `src/components/ui/chart.tsx`

**Current Problems:**
- Uses Recharts with basic config
- Chart colors may not match new palette

**Proposed Redesign:**
- Update chart config colors to new palette
- Add grid line styling for dark mode
- Update tooltip styling to match new design system
- Ensure chart text uses correct font stack

**UX Improvements:**
- Better readability with updated colors
- Consistent styling with rest of UI

**Visual Improvements:**
- New sports-oriented color palette for charts
- Updated tooltip styling

**Interaction Improvements:**
- Keep existing Recharts interactivity

**Responsive Behavior:**
- Ensure charts resize properly on mobile

---

### 1.11 Loading Spinner / Skeleton
**Files:** `src/components/ui/loading-spinner.tsx`, `src/app/globals.css` (skeleton)

**Current Problems:**
- Loading spinner uses framer-motion (heavy for a spinner)
- Skeleton uses CSS shimmer (fine)

**Proposed Redesign:**
- Simplify loading spinner to pure CSS animation
- Update skeleton shimmer colors to new palette
- Add sports-themed loading states (optional)
- Keep reduced motion fallback

**UX Improvements:**
- Faster loading spinner (no JS overhead)
- Better skeleton appearance

**Visual Improvements:**
- Updated colors
- Cleaner spinner design

**Interaction Improvements:**
- Keep reduced motion support

**Responsive Behavior:** No changes needed

---

## Phase 2: Shared Layout Components

### 2.1 Header
**File:** `src/components/shared/header.tsx`

**Current Problems:**
- GSAP entrance animation adds complexity
- Magnetic nav link effect is nice but may not feel sports-oriented
- "Elite Sports Network" tagline is generic
- Mobile menu duplicates desktop nav logic
- Small text sizes (13px nav links) may be hard to tap

**Proposed Redesign:**
- **Redesign completely** with sports-media header feel
- Keep glass morphism backdrop (works well)
- Replace magnetic nav effect with simpler underline hover (sports feel)
- Update nav link styling: bolder, slightly larger, uppercase
- Add sport category quick-filters in header (optional)
- Redesign mobile menu: full-screen overlay with bold typography
- Update logo treatment in header
- Add live indicator dot for active events (optional)

**UX Improvements:**
- Larger touch targets for mobile nav
- Clearer active state indication
- Simpler, faster nav interactions
- Better mobile menu experience

**Visual Improvements:**
- Bolder, more athletic nav links
- Updated glass morphism treatment
- Sports-media header feel
- Better visual hierarchy

**Interaction Improvements:**
- Simpler hover effects (underline slide-in)
- Faster mobile menu transitions
- Keep scroll-based glass enhancement

**Responsive Behavior:**
- Mobile: Hamburger → full-screen overlay
- Tablet: Condensed nav with essential links
- Desktop: Full nav with all links

---

### 2.2 Footer
**File:** `src/components/shared/footer.tsx`

**Current Problems:**
- Newsletter form has no functionality (just UI)
- Social links are text abbreviations ("IG", "TW") instead of icons
- Typography is very small (9px, 11px labels)
- "SKILLEX Network" branding feels disconnected

**Proposed Redesign:**
- **Redesign** with sports-media footer feel
- Replace text social links with proper social icons (lucide or brand icons)
- Update typography to use new font system
- Add sports-specific footer sections (Live Scores, Standings links)
- Update "CourtConnect" heading to use new display font
- Improve newsletter form visual treatment
- Add proper brand partnership section

**UX Improvements:**
- Larger, more tappable link targets
- Better social link recognition with icons
- Clearer section hierarchy

**Visual Improvements:**
- Updated typography system
- New color palette
- Sports-media footer design
- Proper social icons

**Interaction Improvements:**
- Hover effects on social links
- Newsletter form focus states

**Responsive Behavior:**
- Mobile: 2-column grid
- Tablet: 3-column grid
- Desktop: 4-column grid with newsletter in header area

---

### 2.3 Logo
**File:** `src/components/shared/logo.tsx`

**Current Problems:**
- GSAP glow animation adds bundle weight
- "G" icon mark is generic
- "Elite Sports Network" tagline may change

**Proposed Redesign:**
- **Redesign** with bolder, more athletic logo treatment
- Keep the "G" icon mark but update styling to new primary blue
- Update text to use new display font (Inter Tight)
- Simplify GSAP animation (reduce to CSS or simpler GSAP)
- Update glow colors to match new palette
- Consider adding a subtle sport-related detail to the icon

**UX Improvements:**
- Better recognition with bolder styling
- Faster load with simpler animation

**Visual Improvements:**
- Updated colors
- Bolder typography
- New font system

**Interaction Improvements:**
- Simplified hover animation
- Keep glow effect (updated colors)

**Responsive Behavior:** No changes needed

---

### 2.4 Theme Toggle
**File:** `src/components/shared/theme-toggle.tsx`

**Current Problems:**
- Works well, minimal issues
- Could use slightly larger hit area

**Proposed Redesign:**
- Keep current functionality and animation
- Update border/background colors to new palette
- Ensure consistent sizing across all usages
- No major redesign needed

**UX Improvements:**
- Larger touch target (keep 40px)

**Visual Improvements:**
- Updated colors

**Interaction Improvements:**
- Keep existing animation

**Responsive Behavior:** No changes needed

---

### 2.5 Mobile Nav
**File:** `src/components/shared/mobile-nav.tsx`

**Current Problems:**
- Duplicates logic from header mobile menu
- Standard sheet-based mobile nav
- Could feel more immersive

**Proposed Redesign:**
- **Redesign** as full-screen overlay (not side sheet)
- Bold, large typography for nav items
- Stagger animation for menu items
- User card at top with avatar
- Theme toggle integrated
- Sign out at bottom
- Sports-branded header in mobile menu

**UX Improvements:**
- More immersive mobile navigation
- Larger, easier-to-tap targets
- Better visual hierarchy

**Visual Improvements:**
- Full-screen dark overlay
- Bold typography
- Sports-branded design

**Interaction Improvements:**
- Stagger animations for menu items
- Smooth slide-in transition
- Haptic-like press feedback

**Responsive Behavior:**
- Mobile: Full-screen overlay
- Tablet: Can use same or sidebar variant

---

### 2.6 Page Transition
**File:** `src/components/shared/PageTransition.tsx`

**Current Problems:**
- Uses framer-motion (fine)
- Simple fade-up transition (could be more dynamic)

**Proposed Redesign:**
- Keep framer-motion implementation
- Update transition to be slightly faster (250ms)
- Add optional direction-aware transitions
- Keep reduced motion support

**UX Improvements:**
- Faster page transitions feel more responsive

**Visual Improvements:**
- Slightly more refined animation

**Interaction Improvements:**
- Faster transition timing

**Responsive Behavior:** No changes needed

---

### 2.7 Reveal (Scroll Animation)
**File:** `src/components/shared/Reveal.tsx`

**Current Problems:**
- Uses framer-motion (fine)
- Multiple variant options (good)
- Could add more sports-oriented variants

**Proposed Redesign:**
- Keep existing variants
- Add `slideUp` variant (more dramatic than fadeUp)
- Add `scaleUp` variant for cards
- Update default duration to 500ms
- Keep reduced motion support

**UX Improvements:**
- More animation options for different content types

**Visual Improvements:**
- New variant options

**Interaction Improvements:**
- Keep existing IntersectionObserver behavior

**Responsive Behavior:** No changes needed

---

### 2.8 Chat Assistant
**File:** `src/components/shared/ChatAssistant.tsx`

**Current Problems:**
- Floating chat button
- Uses motion/react

**Proposed Redesign:**
- Update button styling to new primary blue
- Update chat panel styling to new design system
- Keep existing functionality

**UX Improvements:**
- Better visual integration with new theme

**Visual Improvements:**
- Updated colors

**Interaction Improvements:**
- Keep existing animations

**Responsive Behavior:** No changes needed

---

## Phase 3: Home Page Sections

### 3.1 Hero Section
**File:** `src/components/features/home/hero-section.tsx`

**Current Problems:**
- Already dark-themed (good start)
- Uses GSAP for complex animations (good)
- Particle canvas is nice but may hurt performance
- Search form styling could be more sports-oriented
- Sport pills are functional but could be more visually appealing
- Stats bar uses GSAP counter animation (good)

**Proposed Redesign:**
- **Major redesign** with new sports branding
- Update particle colors to new primary blue
- Update gradient orbs to new palette (blue, green, gold)
- Update headline font to new display font (Inter Tight)
- Update search form with new input styling
- Update sport pills with new accent colors
- Update CTA buttons with new button variants
- Add live scores ticker (optional, future)
- Update stats bar with new typography
- Keep GSAP animations (they work well)

**UX Improvements:**
- Better search form usability
- Clearer CTA hierarchy
- More engaging sport pills
- Better stat presentation

**Visual Improvements:**
- Complete color palette update
- New typography system
- Sports-branded hero design
- Updated particle colors

**Interaction Improvements:**
- Keep GSAP entrance animations
- Keep particle interaction
- Keep parallax scrolling

**Responsive Behavior:**
- Mobile: Simplified search, stacked layout
- Tablet: 2-column search
- Desktop: Full search bar with sport pills

---

### 3.2 Announcement Section
**File:** `src/components/features/home/announcement-section.tsx`

**Current Problems:**
- Basic announcement display
- Could be more visually engaging

**Proposed Redesign:**
- Update styling to new design system
- Add motion for announcement entrance
- Update colors and typography

**UX Improvements:**
- Better visual treatment
- Clearer announcement hierarchy

**Visual Improvements:**
- Updated colors and typography

**Interaction Improvements:**
- Add entrance animation

**Responsive Behavior:** Standard responsive behavior

---

### 3.3 How It Works Section
**File:** `src/components/features/home/how-it-works-section.tsx`

**Current Problems:**
- Uses framer-motion (fine)
- Standard step-by-step layout
- Could feel more sports-oriented

**Proposed Redesign:**
- Update step cards with new card styling
- Update typography to new font system
- Update colors to new palette
- Add sport-themed step icons
- Improve visual hierarchy

**UX Improvements:**
- Clearer step progression
- Better visual hierarchy

**Visual Improvements:**
- Updated card design
- New colors and typography
- Sports-themed icons

**Interaction Improvements:**
- Keep stagger animations

**Responsive Behavior:**
- Mobile: Stacked steps
- Tablet: 2-column
- Desktop: Horizontal steps

---

### 3.4 Featured Spotlight Section
**File:** `src/components/features/home/featured-spotlight-section.tsx`

**Current Problems:**
- Standard featured content layout
- Could be more visually striking

**Proposed Redesign:**
- Update styling to new design system
- Add sports-themed visual treatments
- Update typography and colors
- Improve visual impact

**UX Improvements:**
- Better content hierarchy
- More engaging presentation

**Visual Improvements:**
- Updated design
- Sports-branded treatment

**Interaction Improvements:**
- Keep motion animations

**Responsive Behavior:** Standard responsive behavior

---

### 3.5 Trending Venues Section
**File:** `src/components/features/home/trending-venues-section.tsx`

**Current Problems:**
- Uses framer-motion for stagger animations (good)
- Venue cards are functional but could be more sports-oriented
- Horizontal scroll on mobile works but could be smoother
- "Trending" badge could be more prominent

**Proposed Redesign:**
- Update venue cards with new card styling
- Update "Trending" badge to use new badge system (gold/tertiary)
- Update "Verified" badge to use accent green
- Update price display with new typography
- Update "Explore" button with new button variants
- Add ranking numbers with sport-style treatment
- Update section header with new display font
- Keep horizontal scroll on mobile

**UX Improvements:**
- Better card interactions
- Clearer ranking hierarchy
- More engaging trending presentation

**Visual Improvements:**
- Updated card design
- New badge styling
- Sports-themed ranking numbers

**Interaction Improvements:**
- Keep stagger animations
- Better hover states on cards

**Responsive Behavior:**
- Mobile: Horizontal scroll (keep)
- Tablet: 2-column grid
- Desktop: 4-column grid

---

### 3.6 Global Presence Section
**File:** `src/components/features/home/global-presence-section.tsx`

**Current Problems:**
- Map/dotted map visualization
- Could be more visually engaging

**Proposed Redesign:**
- Update styling to new design system
- Update map colors to new palette
- Improve visual treatment

**UX Improvements:**
- Better visual impact

**Visual Improvements:**
- Updated colors

**Interaction Improvements:** Keep existing interactions

**Responsive Behavior:** Standard responsive behavior

---

### 3.7 Testimonials Section
**File:** `src/components/features/home/testimonials-section.tsx`

**Current Problems:**
- Marquee-based testimonials
- Could feel more premium

**Proposed Redesign:**
- Update card styling to new design system
- Update typography and colors
- Improve visual treatment of testimonial cards
- Add avatar/profile styling updates

**UX Improvements:**
- Better readability
- More premium feel

**Visual Improvements:**
- Updated card design
- New colors and typography

**Interaction Improvements:**
- Keep marquee animation

**Responsive Behavior:** Standard responsive behavior

---

### 3.8 Discount Section
**File:** `src/components/features/home/discount-section.tsx`

**Current Problems:**
- Standard CTA section
- Could be more visually striking

**Proposed Redesign:**
- Update CTA styling with new button variants
- Update background treatment
- Update typography
- Make more sports-oriented

**UX Improvements:**
- Stronger CTA visual hierarchy
- Better conversion potential

**Visual Improvements:**
- Updated design
- Sports-branded treatment

**Interaction Improvements:**
- Keep motion animations

**Responsive Behavior:** Standard responsive behavior

---

### 3.9 Organizer CTA Section
**File:** `src/components/features/home/organizer-cta-section.tsx`

**Current Problems:**
- Standard CTA section
- Could be more visually engaging

**Proposed Redesign:**
- Update CTA styling with new button variants
- Update background treatment
- Update typography
- Make more sports-oriented

**UX Improvements:**
- Stronger CTA visual hierarchy

**Visual Improvements:**
- Updated design

**Interaction Improvements:**
- Keep motion animations

**Responsive Behavior:** Standard responsive behavior

---

## Phase 4: Venue Discovery & Details

### 4.1 Venue Catalog
**File:** `src/components/features/venues/venueCatalouge.tsx`

**Current Problems:**
- Grid/Map view toggle works but styling is basic
- Pagination styling is minimal
- Section header could be more sports-oriented
- Filter sidebar integration is functional

**Proposed Redesign:**
- Update section header with new display font and typography
- Update view toggle with new button styling
- Update pagination with new button styling
- Update count text with new typography
- Improve overall visual hierarchy

**UX Improvements:**
- Clearer view toggle states
- Better pagination UX
- Improved visual hierarchy

**Visual Improvements:**
- Updated typography
- New button styling
- Sports-branded header

**Interaction Improvements:**
- Keep existing filter interactions

**Responsive Behavior:**
- Mobile: Full-width with filter drawer
- Tablet: Sidebar filter
- Desktop: Persistent sidebar filter

---

### 4.2 Filtering Sidebar
**File:** `src/components/features/venues/components/filtering-sidebar.tsx`

**Current Problems:**
- Standard filter sidebar
- Could be more visually refined

**Proposed Redesign:**
- Update input styling with new input component
- Update checkbox/radio styling
- Update price range slider
- Update sport type pills
- Update sort dropdown
- Add clear filters button with new button styling
- Improve visual hierarchy

**UX Improvements:**
- Better filter interactions
- Clearer active filter states
- Improved visual hierarchy

**Visual Improvements:**
- Updated form controls
- New color palette
- Better typography

**Interaction Improvements:**
- Keep existing filter logic

**Responsive Behavior:**
- Mobile: Slide-in drawer
- Desktop: Persistent sidebar

---

### 4.3 Venue Grid
**File:** `src/components/features/venues/components/venue-grid.tsx`

**Current Problems:**
- Standard grid layout
- Could be more visually engaging

**Proposed Redesign:**
- Update grid item styling
- Improve loading states with new skeleton
- Update empty state
- Update error state
- Add sports-themed visual treatments

**UX Improvements:**
- Better loading experience
- Clearer empty/error states

**Visual Improvements:**
- Updated card design
- New skeleton styling

**Interaction Improvements:**
- Keep existing grid interactions

**Responsive Behavior:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

---

### 4.4 Venue Card
**File:** `src/components/features/venues/components/venue-card.tsx`

**Current Problems:**
- Standard venue card
- Could be more visually appealing

**Proposed Redesign:**
- Update card styling with new card component
- Update image treatment
- Update price display with new typography
- Update badges (verified, trending)
- Add sport type indicator
- Improve hover states

**UX Improvements:**
- Better visual hierarchy
- Clearer information presentation
- More engaging hover states

**Visual Improvements:**
- Updated card design
- New typography
- Sports-themed badges

**Interaction Improvements:**
- Enhanced hover states
- Smooth image zoom

**Responsive Behavior:**
- Mobile: Full-width card
- Desktop: Grid card

---

### 4.5 Venue Details Page
**File:** `src/components/features/venues/details/VenueDetails.tsx`

**Current Problems:**
- Multiple sub-components (Header, About, BookingSidebar, BookingSlot, Review)
- Could be more visually refined
- Booking sidebar could be more prominent

**Proposed Redesign:**
- Update all sub-components with new design system
- Improve visual hierarchy
- Update typography and colors
- Make booking sidebar more prominent
- Add sports-themed visual treatments
- Update review section styling

**UX Improvements:**
- Better booking flow visibility
- Clearer information hierarchy
- More engaging details presentation

**Visual Improvements:**
- Updated component design
- New colors and typography
- Sports-branded treatment

**Interaction Improvements:**
- Keep existing booking interactions
- Improve hover states

**Responsive Behavior:**
- Mobile: Stacked layout
- Desktop: 2-column with sticky sidebar

---

### 4.6 Venue Reviews
**Files:** `src/components/features/venues/details/review/VenueReviews.tsx`, `VenueReviewForm.tsx`, `VenueReviewItem.tsx`, `VenueReviewList.tsx`, `VenueReviewStats.tsx`

**Current Problems:**
- Standard review components
- Could be more visually refined

**Proposed Redesign:**
- Update review card styling
- Update star rating display
- Update review form styling
- Update stats display
- Add sports-themed visual treatments

**UX Improvements:**
- Better review presentation
- Clearer rating display

**Visual Improvements:**
- Updated component design
- New colors and typography

**Interaction Improvements:**
- Keep existing form interactions

**Responsive Behavior:** Standard responsive behavior

---

## Phase 5: Authentication Pages

### 5.1 Sign In Page
**File:** `src/components/features/auth/signin/signin-form.tsx`

**Current Problems:**
- Standard sign-in form
- Uses motion for entrance animation (good)
- Split layout with auth-split-layout

**Proposed Redesign:**
- Update form styling with new input/button components
- Update typography
- Update visual treatment of split layout
- Add sports-themed branding on split side
- Update error states
- Update social login buttons (if any)

**UX Improvements:**
- Better form usability
- Clearer error messages
- More engaging branding side

**Visual Improvements:**
- Updated form design
- New colors and typography
- Sports-branded split layout

**Interaction Improvements:**
- Keep existing form animations
- Improve focus states

**Responsive Behavior:**
- Mobile: Full-width form (no split)
- Desktop: Split layout

---

### 5.2 Sign Up Page
**File:** `src/components/features/auth/signup/signup-form.tsx`

**Current Problems:**
- Standard sign-up form
- Uses motion for entrance animation (good)
- Multi-step form (if applicable)

**Proposed Redesign:**
- Update form styling with new input/button components
- Update typography
- Update visual treatment
- Add sports-themed branding
- Update step indicators (if multi-step)
- Update success state

**UX Improvements:**
- Better form usability
- Clearer step progression
- More engaging branding

**Visual Improvements:**
- Updated form design
- New colors and typography

**Interaction Improvements:**
- Keep existing form animations
- Improve focus states

**Responsive Behavior:**
- Mobile: Full-width form
- Desktop: Centered form with branding

---

## Phase 6: Dashboard Shell & Navigation

### 6.1 Dashboard Shell
**File:** `src/components/features/dashboard/shared/DashboardShell.tsx`

**Current Problems:**
- Uses SidebarProvider with glass top bar
- Background dot pattern is subtle (good)
- Weather chip integration
- Theme toggle in top bar

**Proposed Redesign:**
- Update top bar styling with new glass treatment
- Update sidebar trigger styling
- Update role label typography
- Update background pattern
- Improve visual hierarchy

**UX Improvements:**
- Better top bar readability
- Clearer role indication

**Visual Improvements:**
- Updated glass treatment
- New typography
- Updated background pattern

**Interaction Improvements:**
- Keep existing sidebar behavior

**Responsive Behavior:**
- Mobile: Collapsed sidebar
- Desktop: Persistent sidebar

---

### 6.2 App Sidebar
**File:** `src/components/features/dashboard/shared/AppSidebar.tsx`

**Current Problems:**
- Dark sidebar (good for sports feel)
- "COURT CONNECT" branding in header
- Standard nav items
- "Become an Organizer" CTA

**Proposed Redesign:**
- Update sidebar background to new dark palette
- Update branding with new logo/typography
- Update nav items with new icon styling
- Update CTA button with new button variants
- Add sport-themed visual treatments
- Improve visual hierarchy

**UX Improvements:**
- Better nav item readability
- Clearer active states
- More engaging branding

**Visual Improvements:**
- Updated dark palette
- New typography
- Sports-branded sidebar

**Interaction Improvements:**
- Keep existing sidebar interactions
- Improve hover states

**Responsive Behavior:**
- Mobile: Off-canvas
- Tablet: Collapsible
- Desktop: Persistent

---

### 6.3 Nav Main
**File:** `src/components/features/dashboard/shared/nav-main.tsx`

**Current Problems:**
- Standard sidebar navigation
- Uses Tabler icons
- Active state with left border indicator (good)
- Expandable sub-items

**Proposed Redesign:**
- Update nav item styling with new design system
- Update active state indicator (keep left border, update color)
- Update sub-item styling
- Update icon colors
- Improve visual hierarchy

**UX Improvements:**
- Better nav item readability
- Clearer active states
- Improved sub-item navigation

**Visual Improvements:**
- Updated colors and typography
- New active indicator color

**Interaction Improvements:**
- Keep existing expand/collapse behavior
- Improve hover states

**Responsive Behavior:** No changes needed

---

### 6.4 Nav User
**File:** `src/components/features/dashboard/shared/nav-user.tsx`

**Current Problems:**
- Standard user dropdown
- Avatar with fallback
- Menu items: Profile, Settings, Log out

**Proposed Redesign:**
- Update user card styling with new design system
- Update dropdown styling
- Update avatar treatment
- Update menu items
- Improve visual hierarchy

**UX Improvements:**
- Better user card presentation
- Clearer menu items

**Visual Improvements:**
- Updated styling

**Interaction Improvements:**
- Keep existing dropdown behavior

**Responsive Behavior:** No changes needed

---

### 6.5 Dashboard Stat Card
**File:** `src/components/features/dashboard/shared/DashboardStatCard.tsx`

**Current Problems:**
- Good component with sparkline, trend indicator, animated counter
- Uses recharts for sparkline
- Could be more sports-oriented

**Proposed Redesign:**
- Update card styling with new card component
- Update icon treatment
- Update value typography with new display font
- Update trend indicator colors
- Update sparkline colors
- Add sports-themed visual treatments

**UX Improvements:**
- Better data presentation
- Clearer trend indication
- More engaging sparkline

**Visual Improvements:**
- Updated card design
- New typography
- Sports-themed treatment

**Interaction Improvements:**
- Keep existing hover states
- Improve card elevation

**Responsive Behavior:** No changes needed

---

### 6.6 Dashboard Weather Chip
**File:** `src/components/features/dashboard/shared/DashboardWeatherChip.tsx`

**Current Problems:**
- Uses motion for animations
- Weather display integration

**Proposed Redesign:**
- Update styling with new design system
- Update icon treatment
- Update typography

**UX Improvements:**
- Better visual integration

**Visual Improvements:**
- Updated styling

**Interaction Improvements:**
- Keep existing animations

**Responsive Behavior:** No changes needed

---

### 6.7 Profile Settings
**Files:** `src/components/features/dashboard/shared/ProfileSettingsPage.tsx`, `ProfileSettingsHeader.tsx`, `ProfileSettingsMainColumn.tsx`, `ProfileSettingsSidebar.tsx`

**Current Problems:**
- Multi-column layout
- Uses motion for animations
- Standard profile settings

**Proposed Redesign:**
- Update all sub-components with new design system
- Update form styling
- Update avatar upload styling
- Update save/cancel buttons
- Improve visual hierarchy

**UX Improvements:**
- Better form usability
- Clearer section hierarchy

**Visual Improvements:**
- Updated styling
- New typography

**Interaction Improvements:**
- Keep existing form interactions
- Improve save button feedback

**Responsive Behavior:**
- Mobile: Stacked layout
- Desktop: Multi-column layout

---

## Phase 7: Dashboard Pages

### 7.1 Admin Dashboard Overview
**File:** `src/components/features/dashboard/admin/AdminDashboardOverview.tsx`

**Current Problems:**
- Uses stat cards and charts
- Standard admin overview

**Proposed Redesign:**
- Update stat cards with new design
- Update chart styling
- Update page header
- Add sports-themed visual treatments
- Improve data density

**UX Improvements:**
- Better data presentation
- More scannable layout

**Visual Improvements:**
- Updated component design
- New colors and typography

**Interaction Improvements:**
- Keep existing chart interactions

**Responsive Behavior:**
- Mobile: Stacked cards
- Desktop: Grid layout

---

### 7.2 Admin Dashboard Charts
**File:** `src/components/features/dashboard/admin/AdminDashboardCharts.tsx`

**Current Problems:**
- Uses recharts
- Standard chart display

**Proposed Redesign:**
- Update chart colors to new palette
- Update chart container styling
- Update legend styling
- Update tooltip styling

**UX Improvements:**
- Better chart readability
- Clearer data presentation

**Visual Improvements:**
- New chart colors
- Updated styling

**Interaction Improvements:**
- Keep existing chart interactions

**Responsive Behavior:** Standard responsive behavior

---

### 7.3 Admin Reports Page
**File:** `src/components/features/dashboard/admin/AdminReportsPage.tsx`

**Current Problems:**
- Standard reports page
- Uses charts and tables

**Proposed Redesign:**
- Update page header
- Update chart styling
- Update table styling
- Update filter controls
- Improve visual hierarchy

**UX Improvements:**
- Better data presentation
- Clearer report sections

**Visual Improvements:**
- Updated styling
- New colors and typography

**Interaction Improvements:**
- Keep existing interactions

**Responsive Behavior:** Standard responsive behavior

---

### 7.4 User Management Table
**File:** `src/components/features/dashboard/admin/users/UserManagementTable.tsx`

**Current Problems:**
- Standard admin table
- Could be more visually refined

**Proposed Redesign:**
- Update table styling with new table component
- Update action buttons
- Update status badges
- Update search/filter controls
- Improve visual hierarchy

**UX Improvements:**
- Better table readability
- Clearer action buttons

**Visual Improvements:**
- Updated table design
- New colors and typography

**Interaction Improvements:**
- Keep existing table interactions

**Responsive Behavior:**
- Mobile: Card view or horizontal scroll
- Desktop: Full table

---

### 7.5 Organizer Management Table
**File:** `src/components/features/dashboard/admin/organizers/OrganizerManagementTable.tsx`

**Current Problems:**
- Standard admin table
- Uses stat cards

**Proposed Redesign:**
- Update table styling
- Update stat cards
- Update action buttons
- Improve visual hierarchy

**UX Improvements:**
- Better data presentation

**Visual Improvements:**
- Updated styling

**Interaction Improvements:**
- Keep existing interactions

**Responsive Behavior:** Standard responsive behavior

---

### 7.6 Organizer Dashboard
**Files:** `src/components/features/dashboard/organizer/OrganizerDashboardOverview.tsx`, `OrganizerDashboardCharts.tsx`, `OrganizerAnalyticsPage.tsx`

**Current Problems:**
- Standard organizer dashboard
- Uses charts and stats

**Proposed Redesign:**
- Update all components with new design system
- Update chart styling
- Update stat cards
- Update page headers
- Add sports-themed visual treatments

**UX Improvements:**
- Better data presentation
- More engaging dashboard

**Visual Improvements:**
- Updated styling
- New colors and typography

**Interaction Improvements:**
- Keep existing interactions

**Responsive Behavior:** Standard responsive behavior

---

### 7.7 Venue Management (Organizer)
**Files:** `src/components/features/dashboard/organizer/venues/` (all files)

**Current Problems:**
- Venue form with multiple sections
- Schedule management
- Court details

**Proposed Redesign:**
- Update all form components
- Update section styling
- Update button styling
- Update card styling
- Improve form usability

**UX Improvements:**
- Better form experience
- Clearer section hierarchy

**Visual Improvements:**
- Updated styling
- New colors and typography

**Interaction Improvements:**
- Keep existing form interactions
- Improve save/submit feedback

**Responsive Behavior:** Standard responsive behavior

---

### 7.8 User Dashboard
**Files:** `src/components/features/dashboard/user/UserDashboardOverview.tsx`, `UserDashboardCharts.tsx`

**Current Problems:**
- Standard user dashboard
- Uses charts and stats

**Proposed Redesign:**
- Update all components with new design system
- Update chart styling
- Update stat cards
- Update page headers

**UX Improvements:**
- Better data presentation

**Visual Improvements:**
- Updated styling

**Interaction Improvements:**
- Keep existing interactions

**Responsive Behavior:** Standard responsive behavior

---

### 7.9 Bookings Table
**File:** `src/components/features/bookings/UniversalBookingTable.tsx`, `RoleBookingsView.tsx`

**Current Problems:**
- Universal booking table for all roles
- Standard table display

**Proposed Redesign:**
- Update table styling
- Update status badges
- Update action buttons
- Update filter controls
- Improve visual hierarchy

**UX Improvements:**
- Better table readability
- Clearer booking status

**Visual Improvements:**
- Updated styling

**Interaction Improvements:**
- Keep existing table interactions

**Responsive Behavior:** Standard responsive behavior

---

### 7.10 Announcements Management
**File:** `src/components/features/dashboard/announcements/AnnouncementManagementPage.tsx`

**Current Problems:**
- Standard announcement management
- Form for creating/editing

**Proposed Redesign:**
- Update page styling
- Update form styling
- Update list styling
- Improve visual hierarchy

**UX Improvements:**
- Better form usability
- Clearer announcement list

**Visual Improvements:**
- Updated styling

**Interaction Improvements:**
- Keep existing interactions

**Responsive Behavior:** Standard responsive behavior

---

### 7.11 Coupons Management
**File:** `src/components/features/dashboard/admin/coupons/CouponManagementPage.tsx`

**Current Problems:**
- Standard coupon management

**Proposed Redesign:**
- Update page styling
- Update form styling
- Update table styling
- Improve visual hierarchy

**UX Improvements:**
- Better data presentation

**Visual Improvements:**
- Updated styling

**Interaction Improvements:**
- Keep existing interactions

**Responsive Behavior:** Standard responsive behavior

---

## Phase 8: Checkout & Booking Flow

### 8.1 Checkout Page
**File:** `src/app/(CommonLayout)/checkout/page.tsx`

**Current Problems:**
- Uses motion for animations
- Multi-step checkout

**Proposed Redesign:**
- Update page styling
- Update step indicators
- Update form styling
- Update button styling
- Improve visual hierarchy

**UX Improvements:**
- Better checkout flow
- Clearer step progression

**Visual Improvements:**
- Updated styling

**Interaction Improvements:**
- Keep existing animations
- Improve form feedback

**Responsive Behavior:** Standard responsive behavior

---

### 8.2 Checkout Components
**Files:** `src/components/features/checkout/CheckoutOrderPanel.tsx`, `CheckoutPaymentContent.tsx`, `CheckoutSidebarPanel.tsx`

**Current Problems:**
- Uses motion for animations
- Standard checkout components

**Proposed Redesign:**
- Update all components with new design system
- Update order summary styling
- Update payment form styling
- Update sidebar panel styling
- Improve visual hierarchy

**UX Improvements:**
- Better checkout experience
- Clearer order information

**Visual Improvements:**
- Updated styling

**Interaction Improvements:**
- Keep existing animations

**Responsive Behavior:** Standard responsive behavior

---

### 8.3 Checkout Success
**File:** `src/app/(CommonLayout)/checkout/success/page.tsx`

**Current Problems:**
- Uses motion for animations
- Success confirmation page

**Proposed Redesign:**
- Update success animation
- Update booking details display
- Update action buttons
- Improve visual celebration

**UX Improvements:**
- More engaging success experience

**Visual Improvements:**
- Updated styling
- Better celebration animation

**Interaction Improvements:**
- Keep existing animations

**Responsive Behavior:** Standard responsive behavior

---

## Phase 9: Polish & Testing

### 9.1 Global Accessibility Audit
- Verify all color contrast ratios (WCAG AA)
- Test keyboard navigation across all pages
- Test screen reader compatibility
- Verify focus indicators on all interactive elements
- Test with prefers-reduced-motion

### 9.2 Responsive Testing
- Test all breakpoints: mobile (375px), tablet (768px), desktop (1280px), large desktop (1536px)
- Verify touch targets (40px minimum)
- Test horizontal scroll behavior
- Verify no layout breaks

### 9.3 Performance Testing
- Check bundle size impact
- Verify animation performance (60fps)
- Test lazy loading of below-fold content
- Verify image optimization

### 9.4 Cross-Browser Testing
- Chrome, Firefox, Safari, Edge
- Verify glass morphism fallbacks
- Test backdrop-filter support

### 9.5 Visual Regression
- Compare before/after for key pages
- Verify consistent styling across all components
- Check dark mode / light mode consistency

---

## Implementation Priority

| Priority | Phase | Estimated Effort | Impact |
|----------|-------|-----------------|--------|
| 🔴 Critical | Phase 0: Foundation | 2-3 hours | High — affects everything |
| 🔴 Critical | Phase 1: Core UI Components | 3-4 hours | High — used everywhere |
| 🟠 High | Phase 2: Shared Layout | 2-3 hours | High — visible on every page |
| 🟠 High | Phase 3: Home Page | 3-4 hours | High — first impression |
| 🟡 Medium | Phase 4: Venues | 2-3 hours | Medium — core feature |
| 🟡 Medium | Phase 5: Auth | 1-2 hours | Medium — conversion path |
| 🟡 Medium | Phase 6: Dashboard Shell | 2-3 hours | Medium — user dashboard |
| 🟢 Normal | Phase 7: Dashboard Pages | 3-4 hours | Normal — internal pages |
| 🟢 Normal | Phase 8: Checkout | 1-2 hours | Normal — conversion flow |
| ⚪ Final | Phase 9: Polish & Testing | 2-3 hours | Critical for quality |

**Total Estimated Effort:** 20-30 hours

---

## Files Modified (Complete List)

### Foundation (Phase 0)
- `src/app/globals.css`
- `src/app/layout.tsx`
- `package.json`

### Core UI (Phase 1)
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/avatar.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/sheet.tsx`
- `src/components/ui/table.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/ui/tooltip.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/chart.tsx`
- `src/components/ui/loading-spinner.tsx`

### Shared Layout (Phase 2)
- `src/components/shared/header.tsx`
- `src/components/shared/footer.tsx`
- `src/components/shared/logo.tsx`
- `src/components/shared/theme-toggle.tsx`
- `src/components/shared/mobile-nav.tsx`
- `src/components/shared/PageTransition.tsx`
- `src/components/shared/Reveal.tsx`
- `src/components/shared/ChatAssistant.tsx`

### Home Page (Phase 3)
- `src/components/features/home/hero-section.tsx`
- `src/components/features/home/announcement-section.tsx`
- `src/components/features/home/how-it-works-section.tsx`
- `src/components/features/home/featured-spotlight-section.tsx`
- `src/components/features/home/trending-venues-section.tsx`
- `src/components/features/home/global-presence-section.tsx`
- `src/components/features/home/testimonials-section.tsx`
- `src/components/features/home/discount-section.tsx`
- `src/components/features/home/organizer-cta-section.tsx`
- `src/components/features/home/home-sections.tsx`

### Venues (Phase 4)
- `src/components/features/venues/venueCatalouge.tsx`
- `src/components/features/venues/components/filtering-sidebar.tsx`
- `src/components/features/venues/components/venue-grid.tsx`
- `src/components/features/venues/components/venue-card.tsx`
- `src/components/features/venues/details/VenueDetails.tsx`
- `src/components/features/venues/details/VenueHeader.tsx`
- `src/components/features/venues/details/VenueAbout.tsx`
- `src/components/features/venues/details/VenueBookingSidebar.tsx`
- `src/components/features/venues/details/VenueBookingSlot.tsx`
- `src/components/features/venues/details/review/*.tsx`

### Auth (Phase 5)
- `src/components/features/auth/signin/signin-form.tsx`
- `src/components/features/auth/signup/signup-form.tsx`
- `src/components/features/auth/shared/auth-split-layout.tsx`

### Dashboard (Phase 6-7)
- `src/components/features/dashboard/shared/DashboardShell.tsx`
- `src/components/features/dashboard/shared/AppSidebar.tsx`
- `src/components/features/dashboard/shared/nav-main.tsx`
- `src/components/features/dashboard/shared/nav-user.tsx`
- `src/components/features/dashboard/shared/DashboardStatCard.tsx`
- `src/components/features/dashboard/shared/DashboardWeatherChip.tsx`
- `src/components/features/dashboard/shared/ProfileSettingsPage.tsx`
- `src/components/features/dashboard/shared/ProfileSettingsHeader.tsx`
- `src/components/features/dashboard/shared/ProfileSettingsMainColumn.tsx`
- `src/components/features/dashboard/shared/ProfileSettingsSidebar.tsx`
- `src/components/features/dashboard/admin/*.tsx`
- `src/components/features/dashboard/organizer/*.tsx`
- `src/components/features/dashboard/user/*.tsx`
- `src/components/features/bookings/*.tsx`
- `src/components/features/dashboard/announcements/*.tsx`
- `src/components/features/dashboard/admin/coupons/*.tsx`

### Checkout (Phase 8)
- `src/app/(CommonLayout)/checkout/page.tsx`
- `src/app/(CommonLayout)/checkout/success/page.tsx`
- `src/components/features/checkout/*.tsx`

### Pages (Various)
- `src/app/(CommonLayout)/page.tsx`
- `src/app/(CommonLayout)/about/page.tsx`
- `src/app/(CommonLayout)/organizers/page.tsx`
- `src/app/(CommonLayout)/organizers/[organizerId]/page.tsx`
- `src/app/(CommonLayout)/venues/page.tsx`
- `src/app/(CommonLayout)/venues/[slug]/page.tsx`
- `src/app/(auth)/signin/page.tsx`
- `src/app/(auth)/signup/page.tsx`
- `src/app/error.tsx`
- `src/app/not-found.tsx`
- `src/app/loading.tsx`
