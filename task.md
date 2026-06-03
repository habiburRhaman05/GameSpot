# GameSpot (Court Connect) — UI/UX Rebranding Task Breakdown

**CRITICAL RULES FOR ALL TASKS:**
1. **Zero Business Logic Changes:** Do NOT modify API integrations, data fetching, state management (TanStack Query), backend communication, or existing feature sets. 
2. **Preserve Functionality:** Click actions, search, theme toggles, filters, and forms must work exactly as before.
3. **Sports Media Aesthetic:** The design must feel like a premium, top-tier sports platform (ESPN, Bleacher Report, SofaScore). Use dark-first, high-contrast, energetic visual language.
4. **Ultra-Modern Polish:** Incorporate premium effects like glassmorphism for floating elements and headers, and structured bento-grid layouts for dashboards and stat cards.
5. **Animation:** Use `motion` (Framer Motion) and `gsap` for smooth micro-interactions, page transitions, and hover states. Ensure 60fps performance.

---

## Step 1: Foundation & Design System Initialization
**Goal:** Establish the root design tokens, typography, and clean up motion dependencies.

* **Task 1.1: Dependency Cleanup**
    * *File:* `package.json`
    * *Action:* Remove redundant `framer-motion` if `motion` is the primary package. Ensure `@gsap/react`, `gsap`, and `lenis` are properly configured.
* **Task 1.2: Typography Integration**
    * *File:* `src/app/layout.tsx`
    * *Action:* Replace `Instrument Serif` with `Inter Tight` (or `Barlow Condensed`) for headlines. Keep `Inter` for body. Update CSS font variables.
* **Task 1.3: Global Color System (Sports Palette)**
    * *File:* `src/app/globals.css`
    * *Action:* Implement the new "Stadium Night" (Dark) and "Daylight Arena" (Light) themes.
    * *Tokens:* Primary Blue (`#0066ff`/`#3b82f6`), Accent Green (`#00d26a`/`#34d399`), Action Red (`#ff3d00`), Tertiary Gold (`#ffb800`).
* **Task 1.4: Base Shadow & Utility Classes**
    * *File:* `src/app/globals.css`
    * *Action:* Add blue-tinted shadows, `.text-gradient-sports`, and refine `.glass` utilities to ensure ultra-modern blurring and border-white/10 styling.

## Step 2: Core UI Components Revamp
**Goal:** Update all foundational `shadcn/ui` components to match the premium sports aesthetic.

* **Task 2.1: Buttons & Interactive Triggers**
    * *File:* `src/components/ui/button.tsx`
    * *Action:* Update default rounding (`rounded-lg`). Add an `action` variant (Red). Enhance `glow` variant with sports-blue shadows. Ensure `active:scale-[0.98]` interaction.
* **Task 2.2: Cards & Bento Grid Building Blocks**
    * *File:* `src/components/ui/card.tsx`
    * *Action:* Update border colors, add hover elevation (`translate-y` with expanded shadow). Ensure components are ready to be composed into clean bento-grids.
* **Task 2.3: Inputs, Badges, & Avatars**
    * *Files:* `input.tsx`, `badge.tsx`, `avatar.tsx`
    * *Action:* Apply new focus rings to inputs. Add a `live` badge variant (green pulse). Add status rings to avatars.
* **Task 2.4: Data Display (Tables, Tabs, Charts)**
    * *Files:* `table.tsx`, `tabs.tsx`, `chart.tsx`
    * *Action:* Convert tables to alternating row colors with uppercase headers. Sync Recharts colors to the new sports palette. Add a pill-variant for tabs.

## Step 3: Shared Layouts & Navigation
**Goal:** Redesign global wrappers for an immersive, app-like navigation experience.

* **Task 3.1: Desktop Header & Logo**
    * *Files:* `header.tsx`, `logo.tsx`
    * *Action:* Build a glassmorphic header. Replace magnetic links with an athletic underline slide-in hover effect. Update the logo typography and glow effect.
* **Task 3.2: Immersive Mobile Navigation**
    * *File:* `mobile-nav.tsx`
    * *Action:* Replace the standard side sheet with a full-screen, dark overlay menu featuring staggered entrance animations (Framer Motion) and bold typography.
* **Task 3.3: Sports Media Footer**
    * *File:* `footer.tsx`
    * *Action:* Redesign with a 4-column layout, proper Lucide/brand icons for social links, and structured sections (e.g., Live Scores, Standings).
* **Task 3.4: Micro-interactions & Floating Widgets**
    * *Files:* `ChatAssistant.tsx`, `theme-toggle.tsx`, `PageTransition.tsx`
    * *Action:* Update floating action buttons and theme toggles to the new palette. Tune page transition speeds to 250ms for a snappier feel.

## Step 4: Public Pages & Venue Discovery
**Goal:** Transform the marketing and discovery flow into a high-energy user acquisition funnel.

* **Task 4.1: Hero Section Rebuild**
    * *File:* `hero-section.tsx`
    * *Action:* Create a dynamic entrance using GSAP. Integrate bold Inter Tight headlines, vibrant gradient orbs, and updated search input styling without breaking the existing search context.
* **Task 4.2: Home Page Content Blocks**
    * *Files:* `trending-venues-section.tsx`, `how-it-works-section.tsx`, etc.
    * *Action:* Convert trending venues into horizontal scrolling cards. Update step cards, testimonial marquees, and dynamic sport pills.
* **Task 4.3: Venue Catalog & Search UI**
    * *Files:* `venueCatalouge.tsx`, `filtering-sidebar.tsx`, `venue-grid.tsx`
    * *Action:* Redesign the grid with new card components. Ensure the filtering sidebar uses the updated inputs, range sliders, and active states. Add skeleton loading variants.
* **Task 4.4: Venue Details & Booking Flow UI**
    * *Files:* `VenueDetails.tsx`, `VenueBookingSidebar.tsx`, `VenueReviews.tsx`
    * *Action:* Reorganize into a clear 2-column layout on desktop (sticky booking sidebar). Update review star displays, progress bars, and nested reply styling.

## Step 5: Authentication & Dashboard Refactoring
**Goal:** Deliver a professional, data-rich experience for Admin, Organizer, and User roles.

* **Task 5.1: Auth Split Layouts**
    * *Files:* `signin-form.tsx`, `signup-form.tsx`, `auth-split-layout.tsx`
    * *Action:* Keep the entrance animations but redesign the visual branding side of the split layout with sports graphics. Ensure error states use the new Action Red.
* **Task 5.2: Dashboard Shell & Sidebar**
    * *Files:* `DashboardShell.tsx`, `AppSidebar.tsx`
    * *Action:* Apply a deep dark theme to the sidebar. Redesign navigation items with Tabler icons and left-border active indicators.
* **Task 5.3: Analytics & Stat Cards**
    * *Files:* `DashboardStatCard.tsx`, `AdminDashboardOverview.tsx`, `OrganizerAnalyticsPage.tsx`
    * *Action:* Restructure dashboards using a bento-grid approach. Upgrade sparklines and Recharts tooltips. Use bold typography for metric readouts.
* **Task 5.4: Management Tables & Forms**
    * *Files:* `UserManagementTable.tsx`, `UniversalBookingTable.tsx`, Organizer venue forms.
    * *Action:* Implement the new compact table design for dense data management. Ensure multi-step venue creation forms use proper step indicators and transition animations.

## Step 6: Checkout Flow & Final Polish
**Goal:** Finalize the payment funnel and conduct rigorous quality assurance.

* **Task 6.1: Checkout Experience**
    * *Files:* `checkout/page.tsx`, `CheckoutOrderPanel.tsx`, `CheckoutPaymentContent.tsx`
    * *Action:* Restyle the Stripe element container, order summary panel, and discount inputs. Update the success celebration animation.
* **Task 6.2: Accessibility (A11y) Pass**
    * *Action:* Audit WCAG AA contrast ratios, ensure proper keyboard focus states (blue ring) across all new custom inputs and buttons, and verify `prefers-reduced-motion` compliance.
* **Task 6.3: Responsive & Interaction Audit**
    * *Action:* Test all layout shifts across breakpoints (mobile, tablet, desktop). Ensure touch targets are at least 40px and hover interactions don't cause layout thrashing.
