# UI Polish: Status Bar, Search Bar & Modal Overhaul

## TL;DR

> **Quick Summary**: Visual polish of the blockchain explorer's top status bar (glow borders, value-change flash), search bar (expand-on-focus with accent glow), and all 11 modals (staggered entrance animations + internal styling facelift). Keeps existing golden accent dark theme, layout, and all data flow untouched.
> 
> **Deliverables**:
> - Enhanced stats-strip with animated glow border, per-stat hover zones, value-change flash pulse
> - Search bar with focus-triggered glow expansion and animated history dropdown
> - All 11 modals with consistent staggered content entrance and premium internal styling
> - AnimatedNumber component enhanced with optional value-change flash
> - Dialog base component with improved entrance/exit curves and stagger defaults
> - `prefers-reduced-motion` accessibility support for all new animations
> - Mobile touch interaction fallbacks (`:active` states replacing hover)
> 
> **Estimated Effort**: Medium-Large
> **Parallel Execution**: YES — 3 waves (3 + 10 + 1 tasks) + final verification
> **Critical Path**: Task 1 (CSS infra) → Task 4 (stats-strip) → Task 14 (mobile polish) → F1-F4

---

## Context

### Original Request
User wants to improve the UI of the blockchain explorer, specifically:
- The top status bar (price, fees, block height, mempool, unconfirmed TX)
- The search bar
- All popups/modals that open on click

Inspired by @ncdai/glow-card-grid (team-01) from chanhdai.com — CSS filter-based glowing card borders — and other components from chanhdai.com (shimmering text, text flip, etc.).

### Interview Summary
**Key Discussions**:
- **Status bar**: Keep unified strip, add animated glow borders, better hover effects, value-change flash animations
- **Animation intensity**: "Noticeable & alive" — animated glow borders, flash on value change, visible hover lifts, staggered modal content entrances
- **Search bar**: Expand-on-focus with glowing accent border, results animate in below
- **Modals**: Full overhaul of ALL modals — both entrance/exit animations AND internal styling/layout
- **Theme**: Keep golden accent (#FFE56C), dark surfaces, general layout and colors unchanged

**Research Findings**:
- Framer Motion 12.29 already installed — use for stagger animations and `useReducedMotion()` hook
- 11 shadcn/ui components installed, Radix UI Dialog for all modals
- Glow effects best done with `box-shadow` (GPU-composited) not `filter: blur()` (triggers repaint)
- Existing `premium-card` glassmorphism pattern in globals.css to extend
- Only 4/11 modals currently have Framer Motion stagger — 7 are instant appearance
- AnimatedNumber exists but has zero value-change visual feedback
- Search bar uses `router.push()` for navigation — keep this, visual-only changes

### Metis Review
**Identified Gaps** (addressed):
- **Modal count was 9, actually 11**: MobileSearchModal + DonationModal (both inline in home-view.tsx) added to scope
- **Zero prefers-reduced-motion**: Added as mandatory Wave 1 task — CSS media query + Framer Motion useReducedMotion()
- **Mobile hover impossible**: All hover glow effects get `:active` pseudo-class fallback for touch
- **Performance risk with filter:blur()**: Using `box-shadow` based glows instead (GPU-friendly, no repaint)
- **Search bar already full-width**: "Expand-on-focus" = visual expansion (glow + subtle max-width increase from max-w-xl to max-w-2xl), NOT architectural change
- **newBlockPulse + value-flash collision**: Coordinated timing — pulse completes (500ms) before value flash starts (100ms delay)
- **ChartModal prop inconsistency**: Explicitly excluded from scope — visual-only, no prop renames

---

## Work Objectives

### Core Objective
Make the blockchain explorer feel alive and premium by enhancing the status bar with animated glow effects and value-change feedback, making the search bar respond beautifully to focus, and giving every modal a consistent, polished entrance animation with improved internal styling.

### Concrete Deliverables
- `app/globals.css` — New keyframes (glow-pulse, value-flash), utility classes, prefers-reduced-motion media query
- `tailwind.config.ts` — New animation keyframe definitions
- `components/ui/animated-number.tsx` — Optional flash pulse on value change
- `components/ui/dialog.tsx` — Enhanced entrance/exit, stagger defaults
- `components/stats-strip.tsx` — Glow border, hover zones, value-change flash
- `components/search-bar.tsx` — Focus glow expansion, animated history
- `components/stats-modals.tsx` — FeesModal + MempoolModal overhaul
- `components/chart-modal.tsx` — Styling overhaul
- `components/block-details-modal.tsx` — Enhanced stagger + styling
- `components/network-stats-modal.tsx` — Enhanced stagger + styling
- `components/mining-stats-modal.tsx` — Add stagger + styling
- `components/search-modal.tsx` — Enhanced entrance + styling
- `components/privacy-guide-modal.tsx` — Enhanced animations + styling
- `components/projected-block-details-modal.tsx` — Add stagger + styling
- `components/home-view.tsx` — DonationModal + MobileSearchModal styling

### Definition of Done
- [ ] All 5 stat items in stats-strip have visible glow on hover and flash on value change
- [ ] Search bar visually expands with accent glow on focus
- [ ] All 11 modals have staggered content entrance animation
- [ ] All 11 modals have refreshed internal styling (consistent card borders, spacing, typography)
- [ ] `prefers-reduced-motion` disables all new animations
- [ ] Mobile touch interactions work without hover dependency
- [ ] No regressions in data fetching, routing, or existing functionality
- [ ] Lighthouse CLS < 0.1 on mobile preset

### Must Have
- Animated glow border on stats-strip (box-shadow based, golden accent, 3s ambient cycle)
- Per-stat hover zones with subtle lift + background lighten
- Value-change flash pulse on AnimatedNumber (600ms, brightness pulse)
- Search bar focus glow (accent border + expanding box-shadow, 300ms ease-out)
- Framer Motion stagger entrance on ALL modal content (0.06s between children)
- `prefers-reduced-motion` media query in globals.css
- `useReducedMotion()` from Framer Motion gating JS animations
- Mobile `:active` fallback for all hover effects
- `data-testid` attributes on all key interactive elements

### Must NOT Have (Guardrails)
- **NO prop interface changes** — ChartModal's `open`/`onOpenChange` stays as-is, no renaming
- **NO component extraction** — Don't create shared StatCard, LoadingState, ErrorState components
- **NO routing changes** — Search bar keeps `router.push()` navigation pattern
- **NO keyboard shortcuts** — No Cmd+K command palette, no arrow key navigation
- **NO semantic HTML/ARIA changes** — Beyond prefers-reduced-motion, no accessibility refactoring
- **NO data fetching changes** — Don't modify hooks, API calls, WebSocket subscriptions, polling intervals
- **NO bottom dock changes** — Leave `bottom-dock.tsx` untouched
- **NO 3D globe changes** — Leave `three-scene.tsx` untouched
- **NO lazy loading** — Don't change modal render strategy
- **NO `filter: blur()` for glow effects** — Use `box-shadow` only (GPU performance)
- **NO hardcoded colors** — Use existing CSS variables (`--accent`, `--surface-*`, `--border-*`)

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: NO
- **Framework**: None
- **Agent-Executed QA**: YES — Playwright for all visual/interaction verification

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **All UI work**: Use Playwright (playwright skill) — Navigate, interact, assert CSS properties, screenshot
- **Accessibility**: Playwright with `--force-prefers-reduced-motion` flag
- **Mobile**: Playwright with mobile viewport preset (375×812)
- **Performance**: Lighthouse CLI via Playwright

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — 3 parallel tasks, no dependencies):
├── Task 1: CSS animation infrastructure [quick]
├── Task 2: AnimatedNumber value-change flash [quick]
└── Task 3: Dialog base enhanced entrance/exit [quick]

Wave 2 (All components — 10 parallel tasks, depends on Wave 1):
├── Task 4: Stats-strip glow + hover + flash (depends: 1, 2) [visual-engineering]
├── Task 5: Search bar focus glow expansion (depends: 1) [visual-engineering]
├── Task 6: FeesModal + MempoolModal (depends: 1, 3) [visual-engineering]
├── Task 7: ChartModal styling (depends: 1, 3) [visual-engineering]
├── Task 8: BlockDetailsModal enhance (depends: 1, 3) [visual-engineering]
├── Task 9: NetworkStatsModal + MiningStatsModal (depends: 1, 3) [visual-engineering]
├── Task 10: SearchModal enhance (depends: 1, 3) [visual-engineering]
├── Task 11: PrivacyGuideModal enhance (depends: 1, 3) [visual-engineering]
├── Task 12: ProjectedBlockDetailsModal enhance (depends: 1, 3) [visual-engineering]
└── Task 13: DonationModal + MobileSearchModal (depends: 1, 3) [visual-engineering]

Wave 3 (Final polish — sequential, depends on ALL above):
└── Task 14: Mobile touch + animation consistency pass (depends: all) [visual-engineering]

Wave FINAL (Verification — 4 parallel, after ALL tasks):
├── F1: Plan compliance audit (oracle)
├── F2: Code quality review (unspecified-high)
├── F3: Real manual QA (unspecified-high)
└── F4: Scope fidelity check (deep)
-> Present results -> Get explicit user okay
```

**Critical Path**: Task 1 → Task 4 → Task 14 → F1-F4 → user okay
**Parallel Speedup**: ~75% faster than sequential
**Max Concurrent**: 10 (Wave 2)

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 4,5,6,7,8,9,10,11,12,13,14 | 1 |
| 2 | — | 4 | 1 |
| 3 | — | 6,7,8,9,10,11,12,13 | 1 |
| 4 | 1,2 | 14 | 2 |
| 5 | 1 | 14 | 2 |
| 6 | 1,3 | 14 | 2 |
| 7 | 1,3 | 14 | 2 |
| 8 | 1,3 | 14 | 2 |
| 9 | 1,3 | 14 | 2 |
| 10 | 1,3 | 14 | 2 |
| 11 | 1,3 | 14 | 2 |
| 12 | 1,3 | 14 | 2 |
| 13 | 1,3 | 14 | 2 |
| 14 | 4-13 | F1-F4 | 3 |
| F1-F4 | 14 | — | FINAL |

### Agent Dispatch Summary

- **Wave 1**: **3 tasks** — T1 → `quick`, T2 → `quick`, T3 → `quick`
- **Wave 2**: **10 tasks** — T4-T13 → `visual-engineering`
- **Wave 3**: **1 task** — T14 → `visual-engineering`
- **FINAL**: **4 tasks** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [x] 1. CSS Animation Infrastructure

  **What to do**:
  - Add new keyframes to `app/globals.css`:
    - `glow-pulse`: 3s ease-in-out infinite cycle — `box-shadow` transitions between subtle and bright accent glow (`0 0 15px hsl(var(--accent) / 0.15)` → `0 0 25px hsl(var(--accent) / 0.35)`)
    - `value-flash`: 600ms single-shot — border/background brightness pulse (200ms flash-in at `hsl(var(--accent) / 0.2)` background, 400ms fade-out to transparent)
    - `stagger-fade-in`: 300ms ease-out — opacity 0→1 + translateY 12px→0 (for modal content children)
  - Add utility classes to `app/globals.css`:
    - `.glow-border` — applies `glow-pulse` animation with golden accent box-shadow
    - `.glow-border-hover` — glow activates only on hover (`:hover`) with `:active` fallback for touch
    - `.value-flash` — triggers `value-flash` animation once, removable via JS
    - `.stat-hover` — subtle lift (translateY -1px) + background lighten + box-shadow glow, 200ms ease-out
  - Add `@media (prefers-reduced-motion: reduce)` block that sets `animation-duration: 0.01ms !important`, `animation-iteration-count: 1 !important`, `transition-duration: 0.01ms !important` for ALL animated elements
  - Add corresponding keyframe definitions to `tailwind.config.ts` under `theme.extend.keyframes` and `theme.extend.animation`
  - Ensure all new color values use existing CSS variables (`--accent`, `--surface-*`, `--border-*`) — zero hardcoded hex/hsl

  **Must NOT do**:
  - Don't use `filter: blur()` for any glow effect — `box-shadow` only
  - Don't modify existing keyframes (shimmer-sweep, sparkle-twinkle, gentle-bounce, wiggle, newBlockPulse, recommendedGlow)
  - Don't add new CSS variables — use existing ones
  - Don't change existing `.premium-card` or `.premium-modal` class definitions

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Pure CSS/config file edits, no component logic, straightforward additions
  - **Skills**: []
    - No skills needed — CSS keyframe authoring is standard knowledge
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not needed for pure CSS infrastructure work

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Tasks 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `app/globals.css:131-218` — Existing `.premium-card` class with glassmorphism, inset shadows, gradients — follow this pattern for new glow utility classes
  - `app/globals.css:460-487` — Existing shimmer animation keyframes — follow this structure for new keyframes
  - `app/globals.css:648-660` — Existing `newBlockPulse` keyframe — reference for single-shot animation pattern
  - `app/globals.css:613-633` — Existing `.search-bar-premium` focus glow — reference for accent-based box-shadow glow

  **API/Type References**:
  - `tailwind.config.ts` — Existing `keyframes` and `animation` config under `theme.extend` — add new entries in the same format

  **External References**:
  - Tailwind CSS docs: Custom animations — `https://tailwindcss.com/docs/animation#customizing-your-theme`
  - MDN prefers-reduced-motion — `https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion`

  **WHY Each Reference Matters**:
  - `globals.css:131-218` — The new glow classes must visually complement the premium-card style, using the same color variables and similar shadow techniques
  - `globals.css:460-487` — Shimmer keyframes show the project's convention for keyframe naming, duration, and CSS organization
  - `tailwind.config.ts` — New keyframes must follow the exact same object structure as existing `dialog-in`/`dialog-out` entries

  **Acceptance Criteria**:
  - [ ] `app/globals.css` contains `@keyframes glow-pulse`, `@keyframes value-flash`, `@keyframes stagger-fade-in`
  - [ ] `app/globals.css` contains `.glow-border`, `.glow-border-hover`, `.value-flash`, `.stat-hover` utility classes
  - [ ] `app/globals.css` contains `@media (prefers-reduced-motion: reduce)` block
  - [ ] `tailwind.config.ts` contains matching keyframe and animation definitions
  - [ ] Zero hardcoded color values in new CSS — all use `var(--accent)`, `var(--surface-*)`, etc.
  - [ ] `npm run build` succeeds

  **QA Scenarios**:

  ```
  Scenario: Glow pulse animation renders on element with .glow-border class
    Tool: Playwright
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000
      2. Execute JS: document.querySelector('.premium-card')?.classList.add('glow-border')
      3. Wait 500ms
      4. Evaluate computed box-shadow on the element
    Expected Result: box-shadow contains accent color hsl value (hsl(48 or similar golden hue)
    Failure Indicators: box-shadow is "none" or unchanged from default
    Evidence: .sisyphus/evidence/task-1-glow-pulse.png

  Scenario: prefers-reduced-motion disables animations
    Tool: Playwright with emulateMedia({ reducedMotion: 'reduce' })
    Preconditions: Dev server running
    Steps:
      1. Launch browser context with reducedMotion: 'reduce'
      2. Navigate to http://localhost:3000
      3. Execute JS: document.querySelector('.premium-card')?.classList.add('glow-border')
      4. Evaluate computed animation-duration on the element
    Expected Result: animation-duration is "0.01ms" or "0s"
    Failure Indicators: animation-duration is "3s" or any non-zero value
    Evidence: .sisyphus/evidence/task-1-reduced-motion.png
  ```

  **Commit**: YES
  - Message: `style(core): add animation infrastructure and prefers-reduced-motion support`
  - Files: `app/globals.css`, `tailwind.config.ts`
  - Pre-commit: `npm run build`

- [x] 2. AnimatedNumber Value-Change Flash

  **What to do**:
  - Enhance `components/ui/animated-number.tsx` to detect value changes and trigger a visual flash
  - Add an optional `flash` prop (default: `false`) that enables a brief brightness pulse when the target value changes
  - Implementation approach:
    - Track previous value via `useRef`
    - When `value` changes AND `flash` is enabled, add the `.value-flash` CSS class to the wrapper `<span>`
    - Remove the class after 600ms via `setTimeout`
    - The flash is a brightness pulse (NOT directional — no green/red color meaning)
  - Add `useReducedMotion()` from `framer-motion` — skip flash entirely when motion is reduced
  - Add a `data-testid="animated-number"` attribute to the wrapper span
  - Ensure backward compatibility — existing consumers that don't pass `flash` see zero behavior change

  **Must NOT do**:
  - Don't change the animation timing/easing of the number counter itself (keep easeOutQuart, keep configurable duration)
  - Don't add directional color coding (green up / red down) — this is visual polish, not a feature
  - Don't change the component API signature beyond adding the optional `flash` prop
  - Don't extract this into a separate component

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single-file component enhancement, < 20 lines of new code, clear API addition
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Overkill for a single prop addition to an existing component

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Task 4
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `components/ui/animated-number.tsx:1-69` — The full current component. Uses `useRef` for previous value, `requestAnimationFrame` for animation, `easeOutQuart` easing. The flash logic must integrate with the existing `useEffect` that drives the animation.

  **API/Type References**:
  - `components/ui/animated-number.tsx:3-9` — Current props interface: `{ value: number; duration?: number; formatFn?: (value: number) => string; decimals?: number }`. Add `flash?: boolean` to this.

  **External References**:
  - Framer Motion `useReducedMotion()` — `https://motion.dev/docs/react-use-reduced-motion`

  **WHY Each Reference Matters**:
  - `animated-number.tsx:1-69` — Must understand the full component to add flash without breaking the existing rAF animation loop. The `useRef(previousValue)` pattern is already there — extend it for change detection.
  - The props interface line is where the new `flash` prop gets added.

  **Acceptance Criteria**:
  - [ ] `animated-number.tsx` accepts optional `flash?: boolean` prop
  - [ ] When `flash={true}` and value changes, wrapper span gets `.value-flash` class for 600ms
  - [ ] When `flash={false}` or omitted, zero behavior change from current
  - [ ] `useReducedMotion()` imported and used — flash skipped when reduced motion active
  - [ ] `data-testid="animated-number"` present on wrapper span
  - [ ] `npm run build` succeeds

  **QA Scenarios**:

  ```
  Scenario: Value change triggers flash when flash prop is true
    Tool: Playwright
    Preconditions: Dev server running, stats-strip visible on page
    Steps:
      1. Navigate to http://localhost:3000
      2. Wait for stats to load (wait for selector '[data-testid="animated-number"]')
      3. Evaluate: document.querySelector('[data-testid="animated-number"]').className
      4. Wait for a natural data update (up to 120s) or force via page.evaluate to change the displayed value
      5. Check if wrapper span has 'value-flash' class within 200ms
      6. Wait 700ms and check class is removed
    Expected Result: 'value-flash' class appears on value change and disappears after ~600ms
    Failure Indicators: Class never appears, or persists indefinitely
    Evidence: .sisyphus/evidence/task-2-value-flash.png

  Scenario: Flash does not fire when reduced motion is preferred
    Tool: Playwright with emulateMedia({ reducedMotion: 'reduce' })
    Preconditions: Dev server running
    Steps:
      1. Launch context with reducedMotion: 'reduce'
      2. Navigate to http://localhost:3000
      3. Wait for stats to load
      4. Force value change via page.evaluate
      5. Check wrapper span classes over 1s
    Expected Result: 'value-flash' class never appears
    Failure Indicators: 'value-flash' class detected on wrapper
    Evidence: .sisyphus/evidence/task-2-flash-reduced-motion.png
  ```

  **Commit**: YES
  - Message: `feat(ui): add value-change flash to AnimatedNumber`
  - Files: `components/ui/animated-number.tsx`
  - Pre-commit: `npm run build`

- [x] 3. Dialog Base Enhanced Entrance/Exit

  **What to do**:
  - Enhance `components/ui/dialog.tsx` to provide smoother entrance/exit animations and a stagger system for content children
  - Improve the existing `dialog-in`/`dialog-out` keyframes in the component's CSS classes:
    - Entrance: Adjust from 0.3s ease-out to 0.35s with a custom cubic-bezier for a spring-like feel (`cubic-bezier(0.32, 0.72, 0, 1)`)
    - Exit: Keep 0.2s but use `cubic-bezier(0.32, 0, 0.67, 0)` for snappier close
  - Add a `data-stagger` attribute system to `DialogContent`:
    - When `DialogContent` renders, direct children with `data-stagger-item` attribute get sequential `animation-delay` (0.06s × index)
    - Applied via CSS using `:nth-child()` selectors (not JS) — up to 15 children
    - Uses the `stagger-fade-in` keyframe from Task 1
  - Enhance the overlay backdrop: smoother fade-in (0→0.6 opacity, 250ms ease-out)
  - Import and use `useReducedMotion()` from framer-motion — when active, set all animation durations to 0
  - Add `data-testid="dialog-overlay"` and `data-testid="dialog-content"` attributes

  **Must NOT do**:
  - Don't change the origin-based animation system (CSS variables `--slide-from-x`, `--slide-from-y`) — it works well
  - Don't change the component's props interface beyond optional additions
  - Don't add Framer Motion `<motion.div>` wrappers — keep it CSS-based to match current pattern
  - Don't change how `originRect` is processed

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single-file component enhancement, CSS animation adjustments, clear scope
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Component already exists, just tuning animation parameters

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Tasks 6, 7, 8, 9, 10, 11, 12, 13
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `components/ui/dialog.tsx` — Full current dialog component with Radix UI wrapper, origin-based animation system, DialogOverlay, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
  - `tailwind.config.ts` — Existing `dialog-in`/`dialog-out` keyframe definitions (the current 0.3s/0.2s timings that we're refining)

  **API/Type References**:
  - `components/ui/dialog.tsx` — DialogContent props (className, originRect, children) — don't break these
  - Radix UI Dialog — `https://www.radix-ui.com/primitives/docs/components/dialog`

  **External References**:
  - Custom cubic-bezier curves — `https://cubic-bezier.com/#.32,.72,0,1` (spring-like entrance)
  - CSS stagger with nth-child — `https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child`

  **WHY Each Reference Matters**:
  - `dialog.tsx` — Must understand the full existing animation system (origin-based zoom + slide) to enhance without breaking it. The `originRect` → CSS variable transform is the core mechanic to preserve.
  - `tailwind.config.ts` keyframes — These define the current `dialog-in`/`dialog-out` and need their easing values updated.

  **Acceptance Criteria**:
  - [ ] Dialog entrance uses cubic-bezier(0.32, 0.72, 0, 1) at 0.35s
  - [ ] Dialog exit uses cubic-bezier(0.32, 0, 0.67, 0) at 0.2s
  - [ ] `data-stagger-item` children inside `DialogContent` get sequential animation-delay (0.06s increments)
  - [ ] CSS handles up to 15 stagger children via `:nth-child()` selectors
  - [ ] Overlay fades in at 250ms ease-out to 0.6 opacity
  - [ ] `useReducedMotion()` gates all animations — zero duration when active
  - [ ] Origin-based animation still works correctly
  - [ ] `npm run build` succeeds

  **QA Scenarios**:

  ```
  Scenario: Dialog opens with spring-like entrance
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Click on the fees stat button to open FeesModal
      3. Capture screenshot at 0ms (click moment)
      4. Capture screenshot at 175ms
      5. Capture screenshot at 350ms
    Expected Result: Modal visually scales in from origin with spring feel — visible at 175ms (partially scaled), fully open at 350ms
    Failure Indicators: Modal appears instantly (no animation) or animation feels linear
    Evidence: .sisyphus/evidence/task-3-dialog-entrance-0ms.png, task-3-dialog-entrance-175ms.png, task-3-dialog-entrance-350ms.png

  Scenario: Stagger children animate sequentially
    Tool: Playwright
    Preconditions: Dev server running, a modal with data-stagger-item children exists
    Steps:
      1. Navigate to http://localhost:3000
      2. Click on a stat that opens a modal with multiple content sections
      3. Wait 100ms, capture screenshot
      4. Wait 300ms, capture screenshot
    Expected Result: At 100ms, first 1-2 content items visible; at 300ms, all items visible
    Failure Indicators: All items appear simultaneously
    Evidence: .sisyphus/evidence/task-3-stagger-100ms.png, task-3-stagger-300ms.png
  ```

  **Commit**: YES
  - Message: `style(ui): enhance dialog entrance/exit animations with stagger`
  - Files: `components/ui/dialog.tsx`, `tailwind.config.ts`
  - Pre-commit: `npm run build`

- [x] 4. Stats-Strip Glow Borders, Hover Zones & Value Flash

  **What to do**:
  - Add the `.glow-border` class (from Task 1) to the stats-strip's outer container to create an ambient golden glow border cycling at 3s
  - Enhance each stat button with the `.stat-hover` class:
    - Hover: translateY(-1px), background lighten to `hsl(var(--surface-3) / 0.7)`, box-shadow glow `0 0 12px hsl(var(--accent) / 0.15)`, 200ms ease-out
    - Active (touch): same visual treatment via `:active` pseudo-class
  - Pass `flash={true}` to all `<AnimatedNumber>` instances (price, fees, mempool size, unconfirmed count)
  - Coordinate newBlockPulse + value flash timing:
    - When a new block arrives (blockHeight changes), the `new-block-celebration` class fires its 500ms pulse
    - Value-change flash on other stats should delay 100ms to avoid visual collision — add a `setTimeout` wrapper
  - Add `data-testid` attributes to each stat button:
    - `data-testid="stat-price"`, `data-testid="stat-fees"`, `data-testid="stat-blockheight"`, `data-testid="stat-mempool"`, `data-testid="stat-unconfirmed"`
  - Ensure the dividers between stats still look clean with the new hover zones

  **Must NOT do**:
  - Don't change the stats-strip layout (keep horizontal flex, keep absolute positioning)
  - Don't modify data fetching or WebSocket subscriptions
  - Don't change what modals are opened on click
  - Don't use `filter: blur()` — box-shadow only
  - Don't add new stat items or remove existing ones

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Primarily visual work with animation timing coordination, requires design sensibility for hover states and glow effects
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not needed during implementation — QA is separate

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5-13)
  - **Blocks**: Task 14
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `components/stats-strip.tsx:1-236` — Full current component. 5 stat buttons in a flex row with dividers, each with hover:bg, AnimatedNumber, and modal triggers. Lines ~80-160 contain the main render with stat buttons.
  - `app/globals.css:131-218` — `.premium-card` class that the strip already uses — the new `.glow-border` will add on top of this
  - `app/globals.css:648-660` — `newBlockPulse` keyframe and `.new-block-celebration` class — must coordinate timing with value flash

  **API/Type References**:
  - `components/ui/animated-number.tsx` — After Task 2, accepts `flash?: boolean` prop — pass `flash={true}` to all instances
  - `components/stats-strip.tsx` — Props: `{ blockHeight: number | null }` — don't change

  **WHY Each Reference Matters**:
  - `stats-strip.tsx` — The executor needs to see the exact button structure (lines ~80-160) to know where to add `.stat-hover` classes and `data-testid` attributes, and where `<AnimatedNumber>` is called to add `flash={true}`
  - `globals.css:648-660` — The `newBlockPulse` is 500ms — the value flash timing coordination depends on knowing this exact duration

  **Acceptance Criteria**:
  - [ ] Stats-strip container has `.glow-border` class with visible ambient golden glow
  - [ ] Each of the 5 stat buttons has `.stat-hover` with lift + glow on hover
  - [ ] All 4 AnimatedNumber instances pass `flash={true}`
  - [ ] Value flash on stats delays 100ms when a new block triggers newBlockPulse
  - [ ] 5 `data-testid` attributes present on stat buttons
  - [ ] Mobile: `:active` triggers the same visual as hover
  - [ ] `npm run build` succeeds

  **QA Scenarios**:

  ```
  Scenario: Stats-strip has ambient glow border
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Wait for stats to load (selector: '[data-testid="stat-price"]')
      3. Evaluate box-shadow on the stats-strip container
    Expected Result: box-shadow contains hsl value with accent hue (golden, ~48deg)
    Failure Indicators: No box-shadow or no accent color in shadow
    Evidence: .sisyphus/evidence/task-4-glow-border.png

  Scenario: Stat hover shows lift and glow
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Hover over '[data-testid="stat-price"]'
      3. Evaluate computed transform and box-shadow
    Expected Result: transform contains translateY(-1px) or translate(0px, -1px); box-shadow contains accent color
    Failure Indicators: No transform change, no shadow change
    Evidence: .sisyphus/evidence/task-4-stat-hover.png

  Scenario: Mobile tap shows active state
    Tool: Playwright with mobile viewport (375x812)
    Preconditions: Dev server running
    Steps:
      1. Set viewport to 375x812
      2. Navigate to http://localhost:3000
      3. Tap (click) '[data-testid="stat-fees"]'
      4. Screenshot during active state
    Expected Result: Visual feedback visible on tap (background lighten + shadow)
    Failure Indicators: No visual change on tap, modal opens without feedback
    Evidence: .sisyphus/evidence/task-4-mobile-tap.png
  ```

  **Commit**: YES
  - Message: `style(stats): add glow border, hover zones, and value flash to stats-strip`
  - Files: `components/stats-strip.tsx`
  - Pre-commit: `npm run build`

- [x] 5. Search Bar Focus Glow Expansion

  **What to do**:
  - Enhance `components/search-bar.tsx` with a focus-triggered visual expansion:
    - On focus: max-width transitions from `max-w-xl` (36rem) to `max-w-2xl` (42rem), 300ms ease-out
    - On focus: border transitions to bright accent `hsl(var(--accent) / 0.6)` (up from 0.15)
    - On focus: box-shadow expands to `0 0 0 4px hsl(var(--accent) / 0.1), 0 0 24px hsl(var(--accent) / 0.08)`
    - On blur: all transitions reverse smoothly (300ms ease-out)
  - Update the `.search-bar-premium` CSS class in `app/globals.css` OR apply inline/tailwind styles on the component — whichever is cleaner
  - Animate the search history dropdown:
    - When dropdown opens, items stagger in (opacity 0→1, translateY 8px→0, 0.05s delay between items)
    - Use Framer Motion `AnimatePresence` + stagger variant (Framer Motion is already imported in the project)
  - Improve the query type indicator dot:
    - Add a subtle pulse animation to the indicator dot when a valid type is detected (tx or address)
    - Pulse: scale 1→1.3→1 over 400ms, once
  - Add `data-testid="search-input"` on the input, `data-testid="search-container"` on wrapper
  - Ensure the expansion doesn't cause layout shift for elements below (use transform-based scaling or min-height on container)

  **Must NOT do**:
  - Don't change the routing behavior (`router.push()` stays)
  - Don't add Cmd+K shortcut or command palette behavior
  - Don't change the query type detection logic
  - Don't modify search history storage (localStorage)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Focus animation, stagger dropdown, indicator pulse — design-sensitive visual work
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `vercel-react-best-practices`: Not performance-critical work

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 6-13)
  - **Blocks**: Task 14
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `components/search-bar.tsx:1-175` — Full current component. Input with query type detection, search history dropdown, clear button. Uses `search-bar-premium` CSS class.
  - `app/globals.css:613-633` — `.search-bar-premium` CSS class with current focus styles (border-color and box-shadow transition) — enhance these values
  - `hooks/use-search-history.ts` — Search history hook — don't modify, just understand what data it provides for the dropdown

  **API/Type References**:
  - `components/search-bar.tsx` — Props interface (if any) — keep unchanged
  - Framer Motion `AnimatePresence` + `motion.div` — `https://motion.dev/docs/react-animate-presence`

  **WHY Each Reference Matters**:
  - `search-bar.tsx:1-175` — Executor needs to see the full component to know where to add the Framer Motion stagger wrapper around history items and where to add data-testid attributes
  - `globals.css:613-633` — The existing `.search-bar-premium` focus styles are the starting point — enhance the values, don't replace the pattern
  - `hooks/use-search-history.ts` — Understanding what array the dropdown maps over is needed to add stagger animation

  **Acceptance Criteria**:
  - [ ] Search bar widens from ~36rem to ~42rem on focus, 300ms transition
  - [ ] Focus border brightens to `hsl(var(--accent) / 0.6)` with expanded box-shadow
  - [ ] Blur reverses all transitions smoothly
  - [ ] Search history dropdown items stagger in with 0.05s delay
  - [ ] Query type indicator dot pulses once on valid type detection
  - [ ] No layout shift below the search bar during expansion
  - [ ] `data-testid="search-input"` and `data-testid="search-container"` present
  - [ ] `npm run build` succeeds

  **QA Scenarios**:

  ```
  Scenario: Search bar expands on focus with accent glow
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Evaluate initial width of '[data-testid="search-container"]'
      3. Click '[data-testid="search-input"]' to focus
      4. Wait 350ms for transition
      5. Evaluate width again
      6. Evaluate border-color and box-shadow
    Expected Result: Width increased (>36rem or pixel equivalent); border-color contains accent hue; box-shadow contains accent hue with larger spread
    Failure Indicators: Width unchanged; border-color unchanged
    Evidence: .sisyphus/evidence/task-5-search-focus.png

  Scenario: Search bar contracts on blur
    Tool: Playwright
    Preconditions: Dev server running, search bar focused
    Steps:
      1. Focus search input
      2. Wait 350ms
      3. Click elsewhere to blur
      4. Wait 350ms
      5. Evaluate width
    Expected Result: Width returns to original (~36rem equivalent)
    Failure Indicators: Width stays expanded
    Evidence: .sisyphus/evidence/task-5-search-blur.png

  Scenario: No layout shift during expansion
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Note Y position of element below search bar
      3. Focus search input
      4. Wait 400ms
      5. Note Y position of same element
    Expected Result: Y position unchanged (zero layout shift)
    Failure Indicators: Element below moved vertically
    Evidence: .sisyphus/evidence/task-5-no-layout-shift.png
  ```

  **Commit**: YES
  - Message: `style(search): add focus glow expansion to search bar`
  - Files: `components/search-bar.tsx`, `app/globals.css` (if modifying .search-bar-premium)
  - Pre-commit: `npm run build`

- [x] 6. FeesModal + MempoolModal Overhaul

  **What to do**:
  - Both modals live in `components/stats-modals.tsx` — overhaul both in one task
  - **FeesModal** enhancements:
    - Add `data-stagger-item` attribute to each fee tier row (High Priority, Medium, Low, Economy) for the dialog stagger system from Task 3
    - Restyle fee tier cards: add subtle border-left accent color (golden for high priority, dimming for lower tiers), rounded corners, `hsl(var(--surface-2))` backgrounds with hover brighten
    - Add micro-interaction: fee value text gets `.value-flash` class on data update
    - Add icon per tier (use existing lucide-react icons: Zap for high, TrendingUp for medium, Clock for low, Timer for economy)
    - Improve typography: tier label should be `text-sm font-medium text-[hsl(var(--text-secondary))]`, value should be `text-lg font-mono tabular-nums text-white`
  - **MempoolModal** enhancements:
    - Add `data-stagger-item` to each stat row (tx count, total size, total fees)
    - Restyle stat rows with the same card treatment as FeesModal
    - Add subtle progress-bar-like visual for mempool fullness (if data available — check `useBitcoinStats` for max capacity reference, otherwise skip)
    - Improve number formatting: use `<AnimatedNumber flash={true}>` for live-updating values inside the modal
  - Both modals: add `data-testid="fees-modal"` and `data-testid="mempool-modal"` to their `DialogContent`

  **Must NOT do**:
  - Don't change the data being displayed (same stats, same source)
  - Don't change modal trigger behavior
  - Don't change the Dialog/DialogContent wrapper pattern
  - Don't split into separate files

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Internal modal styling, card layout, icon integration, visual hierarchy — design work
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5, 7-13)
  - **Blocks**: Task 14
  - **Blocked By**: Tasks 1, 3

  **References**:

  **Pattern References**:
  - `components/stats-modals.tsx` — Full current file containing both FeesModal and MempoolModal. FeesModal shows 4 fee tiers + min relay fee. MempoolModal shows tx count, size, fees.
  - `components/block-details-modal.tsx` — Reference for how a well-styled modal with stagger animation looks in this codebase (existing Framer Motion stagger pattern to follow)

  **API/Type References**:
  - `components/stats-modals.tsx` — FeesModal props: `{ isOpen, onClose, fees }`, MempoolModal props: `{ isOpen, onClose, mempool }` — don't change
  - `lib/types.ts` — Types for fee data and mempool data structures

  **External References**:
  - Lucide React icons: `https://lucide.dev/icons/` — Zap, TrendingUp, Clock, Timer

  **WHY Each Reference Matters**:
  - `stats-modals.tsx` — Executor needs to see current layout to know what to enhance. These are currently plain text displays — the task adds cards, icons, and visual hierarchy.
  - `block-details-modal.tsx` — Shows the stagger pattern already used in this project (Framer Motion variants + staggerChildren) — use the same approach for consistency.

  **Acceptance Criteria**:
  - [ ] FeesModal: 4 fee tier rows have `data-stagger-item`, left accent border, icons, improved typography
  - [ ] MempoolModal: stat rows have `data-stagger-item`, card styling, AnimatedNumber with flash
  - [ ] Both modals stagger content on entrance (0.06s between items)
  - [ ] `data-testid="fees-modal"` and `data-testid="mempool-modal"` present
  - [ ] `npm run build` succeeds

  **QA Scenarios**:

  ```
  Scenario: FeesModal opens with staggered fee tier cards
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Click '[data-testid="stat-fees"]' to open FeesModal
      3. Wait for '[data-testid="fees-modal"]' to be visible
      4. Screenshot the modal content
      5. Verify 4 fee tier rows are visible with icons and styled borders
    Expected Result: Modal shows 4 styled fee cards with left accent borders, icons (Zap etc.), and stagger entrance animation
    Failure Indicators: Plain text list without cards/icons, no stagger animation
    Evidence: .sisyphus/evidence/task-6-fees-modal.png

  Scenario: MempoolModal shows animated numbers
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Click '[data-testid="stat-mempool"]' to open MempoolModal
      2. Wait for '[data-testid="mempool-modal"]' to be visible
      3. Verify AnimatedNumber components are present (check for data-testid="animated-number")
    Expected Result: Mempool stats display with AnimatedNumber components, stagger entrance, card styling
    Failure Indicators: Static numbers, no card styling
    Evidence: .sisyphus/evidence/task-6-mempool-modal.png
  ```

  **Commit**: YES
  - Message: `style(modals): overhaul FeesModal and MempoolModal with stagger + styling`
  - Files: `components/stats-modals.tsx`
  - Pre-commit: `npm run build`

- [x] 7. ChartModal Styling Overhaul

  **What to do**:
  - Enhance `components/chart-modal.tsx` internal styling:
    - Improve the USD/EUR toggle buttons: use a segmented control style with animated indicator (sliding background highlight between options, 200ms ease-out)
    - Add `data-stagger-item` to the header controls and the chart container for entrance animation
    - Refine the modal header: better spacing, accent-colored title, refined close button hover state
    - Add a subtle loading state while TradingView widget initializes (shimmer placeholder matching widget dimensions)
    - Improve the overall padding and border treatment — consistent with the premium-modal style
  - Add `data-testid="chart-modal"` to DialogContent

  **Must NOT do**:
  - Don't change ChartModal's prop interface (`open`/`onOpenChange` — NOT `isOpen`/`onClose`)
  - Don't modify the TradingView widget configuration
  - Don't change the symbol toggle logic (USD/EUR switching)
  - Don't lazy-load the TradingView widget

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Segmented control animation, shimmer loading state, visual refinement
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4-6, 8-13)
  - **Blocks**: Task 14
  - **Blocked By**: Tasks 1, 3

  **References**:

  **Pattern References**:
  - `components/chart-modal.tsx` — Full current component. Uses `Dialog` with `open`/`onOpenChange` props (different from other modals). Has USD/EUR toggle buttons and TradingView widget embed.
  - `app/globals.css:460-487` — Shimmer animation for loading state reference

  **API/Type References**:
  - `components/chart-modal.tsx` — Props: `{ open, onOpenChange }` — MUST keep this exact interface

  **WHY Each Reference Matters**:
  - `chart-modal.tsx` — Executor must understand the different prop naming (`open` vs `isOpen`) to avoid accidentally breaking it. The TradingView widget is an iframe — the shimmer placeholder covers it during load.

  **Acceptance Criteria**:
  - [ ] USD/EUR toggle has segmented control with sliding animated indicator
  - [ ] Header and chart container have `data-stagger-item` for entrance animation
  - [ ] Loading shimmer visible while TradingView initializes
  - [ ] Improved spacing, padding, border consistency
  - [ ] `data-testid="chart-modal"` present
  - [ ] Props interface unchanged (`open`/`onOpenChange`)
  - [ ] `npm run build` succeeds

  **QA Scenarios**:

  ```
  Scenario: ChartModal opens with styled toggle and stagger
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Click '[data-testid="stat-price"]' to open ChartModal
      3. Wait for '[data-testid="chart-modal"]' to be visible
      4. Screenshot modal content
      5. Click the EUR toggle button
      6. Verify sliding indicator animation (screenshot after 100ms)
    Expected Result: Modal shows segmented toggle control with animated sliding indicator between USD/EUR
    Failure Indicators: Toggle buttons are plain/unstyled, no sliding animation
    Evidence: .sisyphus/evidence/task-7-chart-modal.png, task-7-chart-toggle.png
  ```

  **Commit**: YES
  - Message: `style(modals): overhaul ChartModal styling`
  - Files: `components/chart-modal.tsx`
  - Pre-commit: `npm run build`

- [x] 8. BlockDetailsModal Enhancement

  **What to do**:
  - Enhance `components/block-details-modal.tsx` — this modal already has Framer Motion stagger, so focus on improving internal styling:
    - Refine the existing stagger timing (currently staggerChildren: 0.05-0.06 — keep, but ensure all content sections use it consistently)
    - Restyle the fee statistics section: use horizontal bar chart visualization for fee distribution (min/avg/max) using pure CSS (gradient bars with accent color, no new chart library)
    - Improve the transaction details section: better card styling, clearer hierarchy between block height, timestamp, size, weight, tx count
    - Add accent-colored left borders on info cards (consistent with FeesModal from Task 6)
    - Improve number displays: ensure `tabular-nums` on all numeric values, consistent formatting
    - Add subtle hover states on info cards (background lighten + shadow, 150ms)
  - Also add `data-stagger-item` attributes to any sections not already using Framer Motion variants (for CSS-level stagger fallback)
  - Add `data-testid="block-details-modal"` to DialogContent

  **Must NOT do**:
  - Don't change the data displayed or how it's fetched
  - Don't remove the existing Framer Motion animation — enhance it
  - Don't add new dependencies for charts (use CSS gradient bars)
  - Don't change modal size or positioning

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Complex internal styling with data visualization (CSS bar charts), hierarchy refinement, visual consistency
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4-7, 9-13)
  - **Blocks**: Task 14
  - **Blocked By**: Tasks 1, 3

  **References**:

  **Pattern References**:
  - `components/block-details-modal.tsx` — Full component with existing Framer Motion stagger. Has fee stats, tx details, technical info sections. Already uses `motion.div` with `variants` and `staggerChildren`.
  - `components/stats-modals.tsx` — After Task 6, the fee tier card styling pattern — replicate the accent-left-border card pattern here

  **API/Type References**:
  - `components/block-details-modal.tsx` — Props: `{ isOpen, onClose, blockHash, originRect }` — don't change
  - `lib/types.ts` — Block data types used in this modal

  **WHY Each Reference Matters**:
  - `block-details-modal.tsx` — Already has Framer Motion — executor must enhance, not replace. Understanding existing variant names and stagger config is critical.
  - Task 6 output — The card styling pattern (accent border, bg, typography) should be consistent across modals.

  **Acceptance Criteria**:
  - [ ] Fee distribution has CSS gradient bar visualization (min/avg/max)
  - [ ] Info cards have accent-left-border, hover states, consistent with FeesModal pattern
  - [ ] All numeric values use `tabular-nums` and consistent formatting
  - [ ] Existing Framer Motion stagger preserved and applied consistently
  - [ ] `data-testid="block-details-modal"` present
  - [ ] `npm run build` succeeds

  **QA Scenarios**:

  ```
  Scenario: BlockDetailsModal shows fee bar visualization
    Tool: Playwright
    Preconditions: Dev server running, at least 1 block loaded
    Steps:
      1. Navigate to http://localhost:3000
      2. Click on block height stat to open BlockDetailsModal
      3. Wait for '[data-testid="block-details-modal"]' to be visible
      4. Screenshot fee statistics section
      5. Verify presence of gradient bar elements (CSS background with linear-gradient)
    Expected Result: Fee stats show visual bars with accent color gradients for min/avg/max
    Failure Indicators: Plain text numbers without visualization
    Evidence: .sisyphus/evidence/task-8-block-details.png

  Scenario: Info cards have hover states
    Tool: Playwright
    Preconditions: BlockDetailsModal open
    Steps:
      1. Hover over an info card within the modal
      2. Evaluate computed background-color and box-shadow
    Expected Result: Background lightens, subtle shadow appears
    Failure Indicators: No visual change on hover
    Evidence: .sisyphus/evidence/task-8-card-hover.png
  ```

  **Commit**: YES
  - Message: `style(modals): enhance BlockDetailsModal animations and styling`
  - Files: `components/block-details-modal.tsx`
  - Pre-commit: `npm run build`

- [x] 9. NetworkStatsModal + MiningStatsModal Enhancement

  **What to do**:
  - **NetworkStatsModal** (`components/network-stats-modal.tsx`):
    - Already has Framer Motion stagger — refine timing consistency with new dialog stagger system
    - Restyle the difficulty adjustment progress bar: add accent glow effect at the current progress point, smooth the fill animation (match 500ms ease-out from existing `duration-500`)
    - Improve the halving countdown section: use larger, bolder typography for the countdown number, add subtle ambient glow around the date
    - Restyle stat cards: accent-left-border pattern (consistent with Tasks 6, 8), hover states
    - Add `data-stagger-item` attributes alongside existing Framer Motion variants for CSS fallback
  - **MiningStatsModal** (`components/mining-stats-modal.tsx`):
    - Currently NO Framer Motion stagger — add stagger entrance animation for the chart and stat sections
    - Wrap content sections in `motion.div` with `variants` matching the `BlockDetailsModal` pattern (opacity 0→1, y: 20→0, staggerChildren: 0.06)
    - Improve chart container styling: better border, subtle shadow, rounded corners consistent with premium-modal
    - Add loading shimmer while Recharts data renders
    - Style the chart legend/axis labels for consistency with the golden accent theme
  - Add `data-testid="network-stats-modal"` and `data-testid="mining-stats-modal"` to respective DialogContent

  **Must NOT do**:
  - Don't change Recharts configuration or data processing
  - Don't change chart type (composed chart with dual axes stays)
  - Don't modify difficulty/halving data calculations
  - Don't change modal trigger behavior

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Chart styling, progress bar effects, stagger animation addition, visual consistency across 2 related modals
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4-8, 10-13)
  - **Blocks**: Task 14
  - **Blocked By**: Tasks 1, 3

  **References**:

  **Pattern References**:
  - `components/network-stats-modal.tsx` — Has Framer Motion stagger, progress bars with `duration-500 ease-out`, halving countdown, mining stats trigger
  - `components/mining-stats-modal.tsx` — NO stagger currently. Has Recharts composed chart with hashrate (left axis) and difficulty (right axis). Simpler modal.
  - `components/block-details-modal.tsx` — Reference for the Framer Motion stagger pattern to add to MiningStatsModal

  **API/Type References**:
  - `components/network-stats-modal.tsx` — Props: `{ isOpen, onClose }` — don't change
  - `components/mining-stats-modal.tsx` — Props: `{ isOpen, onClose }` — don't change

  **WHY Each Reference Matters**:
  - `network-stats-modal.tsx` — Already has stagger — executor needs to understand existing implementation to enhance, not break
  - `mining-stats-modal.tsx` — Has NO stagger — executor needs to add it following the BlockDetailsModal pattern
  - `block-details-modal.tsx` — The canonical stagger pattern in this project

  **Acceptance Criteria**:
  - [ ] NetworkStatsModal: progress bar has accent glow at current point, stat cards have accent border + hover
  - [ ] NetworkStatsModal: halving countdown uses large bold typography
  - [ ] MiningStatsModal: content sections stagger on entrance (Framer Motion)
  - [ ] MiningStatsModal: chart container has improved border/shadow styling
  - [ ] Both modals: `data-stagger-item` attributes present on content sections
  - [ ] `data-testid` attributes present on both modal containers
  - [ ] `npm run build` succeeds

  **QA Scenarios**:

  ```
  Scenario: MiningStatsModal opens with stagger animation
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Trigger MiningStatsModal open (via NetworkStatsModal's mining stats button)
      3. Wait for '[data-testid="mining-stats-modal"]' to be visible
      4. Screenshot at 150ms and 400ms after open
    Expected Result: At 150ms, partial content visible; at 400ms, all content visible with chart rendered
    Failure Indicators: All content appears instantly (no stagger)
    Evidence: .sisyphus/evidence/task-9-mining-stagger-150ms.png, task-9-mining-stagger-400ms.png

  Scenario: NetworkStatsModal progress bar has accent glow
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Trigger NetworkStatsModal
      2. Wait for it to be visible
      3. Screenshot progress bar section
      4. Evaluate box-shadow on progress bar fill element
    Expected Result: Progress bar has golden accent glow at current fill point
    Failure Indicators: Plain progress bar without glow
    Evidence: .sisyphus/evidence/task-9-network-progress.png
  ```

  **Commit**: YES
  - Message: `style(modals): enhance NetworkStatsModal and MiningStatsModal`
  - Files: `components/network-stats-modal.tsx`, `components/mining-stats-modal.tsx`
  - Pre-commit: `npm run build`

- [x] 10. SearchModal Enhancement

  **What to do**:
  - Enhance `components/search-modal.tsx` entrance and internal styling:
    - Add Framer Motion stagger entrance for search results (transaction inputs/outputs, address UTXOs)
    - Each result section should animate in with opacity 0→1, translateY 12→0, staggerChildren: 0.04 (slightly faster than modals — search results should feel snappy)
    - Restyle result cards: accent-left-border, surface-2 background, hover brighten, consistent with other modals
    - Improve the transaction input/output layout: clearer visual separation between inputs and outputs (use accent border direction — left for inputs, right for outputs)
    - Improve address UTXO display: better card styling with subtle hover
    - Add `data-stagger-item` attributes on result sections
    - Improve typography hierarchy: transaction hash in `font-mono text-sm`, values in `tabular-nums`, labels in `text-xs text-[hsl(var(--text-muted))]`
  - Add `data-testid="search-modal"` to DialogContent

  **Must NOT do**:
  - Don't change search logic or routing
  - Don't change result data structure or API calls
  - Don't add pagination or infinite scroll
  - Don't change how results are fetched

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Complex internal layout with data cards, visual hierarchy for financial data, stagger animation
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4-9, 11-13)
  - **Blocks**: Task 14
  - **Blocked By**: Tasks 1, 3

  **References**:

  **Pattern References**:
  - `components/search-modal.tsx` — Full component. Displays transaction details (inputs/outputs, fee, size, status) or address details (UTXOs, balance). Has `animate-in fade-in slide-in-from-bottom-4 duration-300` on results.
  - `components/block-details-modal.tsx` — Framer Motion stagger pattern reference
  - `components/stats-modals.tsx` — After Task 6, the accent-left-border card pattern to follow

  **API/Type References**:
  - `components/search-modal.tsx` — Props interface, result data types — don't change
  - `lib/types.ts` — Transaction and address types

  **WHY Each Reference Matters**:
  - `search-modal.tsx` — Complex modal with conditional rendering (tx vs address results). Executor needs to understand the branching to add stagger to both paths.
  - The card pattern from Tasks 6/8 ensures visual consistency across all modals.

  **Acceptance Criteria**:
  - [ ] Search results stagger in with 0.04s delay between sections
  - [ ] Result cards have accent-left-border, surface background, hover states
  - [ ] Transaction inputs/outputs have clear visual separation (left vs right accent border)
  - [ ] Typography hierarchy: mono for hashes, tabular-nums for values, muted for labels
  - [ ] `data-stagger-item` present on result sections
  - [ ] `data-testid="search-modal"` present
  - [ ] `npm run build` succeeds

  **QA Scenarios**:

  ```
  Scenario: SearchModal shows styled results with stagger
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Focus search bar, type a known transaction ID or address
      3. Submit search (press Enter)
      4. Wait for '[data-testid="search-modal"]' to be visible
      5. Screenshot result content
    Expected Result: Results display with card styling, accent borders, stagger entrance animation
    Failure Indicators: Plain unstyled text results, no animation
    Evidence: .sisyphus/evidence/task-10-search-results.png

  Scenario: Transaction inputs and outputs are visually distinct
    Tool: Playwright
    Preconditions: SearchModal open with transaction result
    Steps:
      1. Screenshot the inputs section
      2. Screenshot the outputs section
      3. Compare accent border direction
    Expected Result: Inputs have left accent border, outputs have right accent border (or other clear visual distinction)
    Failure Indicators: Both sections look identical
    Evidence: .sisyphus/evidence/task-10-inputs-outputs.png
  ```

  **Commit**: YES
  - Message: `style(modals): enhance SearchModal entrance and styling`
  - Files: `components/search-modal.tsx`
  - Pre-commit: `npm run build`

- [x] 11. PrivacyGuideModal Enhancement

  **What to do**:
  - Enhance `components/privacy-guide-modal.tsx` — this is the most complex modal with multi-view navigation (overview → detail):
    - **Overview grid**: Each privacy technique card gets the accent-left-border treatment + hover lift/glow (matching other modals)
    - Enhance the existing `AnimatePresence mode="wait"` transitions between overview and detail views — ensure smooth cross-fade (not just slide)
    - **Detail view**: Improve step-by-step guide styling — numbered steps with accent circle indicators, clearer typography hierarchy
    - Improve the recommended tools section: tool cards with subtle glow on hover
    - Add `data-stagger-item` to technique cards in overview grid for stagger entrance
    - Ensure back navigation animation is smooth (detail → overview should feel natural)
    - Refine the search/filter within the modal if it exists — consistent with search-bar focus styling
  - Add `data-testid="privacy-guide-modal"` to DialogContent

  **Must NOT do**:
  - Don't change the privacy technique content or data
  - Don't add/remove techniques
  - Don't change the overview/detail navigation pattern
  - Don't modify the view state management

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Complex multi-view modal with grid layout, view transitions, step indicators — needs design sensibility
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4-10, 12-13)
  - **Blocks**: Task 14
  - **Blocked By**: Tasks 1, 3

  **References**:

  **Pattern References**:
  - `components/privacy-guide-modal.tsx` — Full component. Multi-view with `AnimatePresence mode="wait"`, slide animations (x: -20/20), technique grid, detail view with steps and tools. Already uses Framer Motion extensively.
  - `components/stats-modals.tsx` — After Task 6, accent-left-border card pattern
  - `components/block-details-modal.tsx` — Stagger pattern reference

  **API/Type References**:
  - `components/privacy-guide-modal.tsx` — Props: `{ isOpen, onClose }` — don't change

  **WHY Each Reference Matters**:
  - `privacy-guide-modal.tsx` — Already heavily animated with AnimatePresence. Executor must enhance the existing patterns, not fight them. Understanding the view state (overview/detail) is critical.

  **Acceptance Criteria**:
  - [ ] Technique cards in overview have accent-left-border + hover lift/glow
  - [ ] View transitions (overview↔detail) are smooth cross-fades
  - [ ] Detail view steps have numbered accent circle indicators
  - [ ] Tool cards have hover glow effect
  - [ ] `data-stagger-item` on technique cards
  - [ ] `data-testid="privacy-guide-modal"` present
  - [ ] `npm run build` succeeds

  **QA Scenarios**:

  ```
  Scenario: PrivacyGuideModal technique cards have hover effects
    Tool: Playwright
    Preconditions: Dev server running, privacy guide modal open
    Steps:
      1. Open PrivacyGuideModal
      2. Wait for '[data-testid="privacy-guide-modal"]' to be visible
      3. Hover over first technique card
      4. Evaluate computed transform and box-shadow
    Expected Result: Card lifts (translateY) and shows accent glow shadow
    Failure Indicators: No visual change on hover
    Evidence: .sisyphus/evidence/task-11-privacy-hover.png

  Scenario: View transition from overview to detail is smooth
    Tool: Playwright
    Preconditions: PrivacyGuideModal open in overview
    Steps:
      1. Click on a technique card
      2. Capture screenshot at 0ms, 100ms, 200ms
    Expected Result: Smooth cross-fade transition from grid to detail view
    Failure Indicators: Instant switch or jerky animation
    Evidence: .sisyphus/evidence/task-11-view-transition.png
  ```

  **Commit**: YES
  - Message: `style(modals): enhance PrivacyGuideModal animations and styling`
  - Files: `components/privacy-guide-modal.tsx`
  - Pre-commit: `npm run build`

- [x] 12. ProjectedBlockDetailsModal Enhancement

  **What to do**:
  - Enhance `components/projected-block-details-modal.tsx`:
    - Already has Framer Motion stagger (like BlockDetailsModal) — refine and ensure consistency
    - Restyle the fee range visualization: add CSS gradient bar for fee range (min→max) with accent color, matching BlockDetailsModal's fee bars from Task 8
    - Improve info cards (projected height, size, tx count): accent-left-border, hover states, consistent with other modals
    - Add `data-stagger-item` attributes for CSS stagger fallback
    - Improve number formatting: `tabular-nums`, consistent decimal places, `<AnimatedNumber flash={true}>` for live-updating projected values
    - Refine the "projected" label styling — use a subtle badge/tag to distinguish from confirmed blocks
  - Add `data-testid="projected-block-modal"` to DialogContent

  **Must NOT do**:
  - Don't change data displayed or fetching logic
  - Don't change the originRect animation system
  - Don't modify how projected blocks are calculated

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Fee visualization, card styling, visual consistency with BlockDetailsModal
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4-11, 13)
  - **Blocks**: Task 14
  - **Blocked By**: Tasks 1, 3

  **References**:

  **Pattern References**:
  - `components/projected-block-details-modal.tsx` — Full component. Similar to BlockDetailsModal but for mempool projected blocks. Has Framer Motion stagger, fee range display, projected block info.
  - `components/block-details-modal.tsx` — After Task 8, the enhanced fee bar visualization and card pattern — match this closely for consistency between confirmed and projected block modals

  **API/Type References**:
  - `components/projected-block-details-modal.tsx` — Props: `{ isOpen, onClose, projectedBlock, originRect }` — don't change

  **WHY Each Reference Matters**:
  - `projected-block-details-modal.tsx` — Close sibling of BlockDetailsModal — styling must be consistent between the two
  - Task 8 output — The fee visualization pattern must match

  **Acceptance Criteria**:
  - [ ] Fee range has CSS gradient bar visualization consistent with BlockDetailsModal
  - [ ] Info cards have accent-left-border + hover states
  - [ ] "Projected" label uses a styled badge/tag
  - [ ] Numbers use `tabular-nums`, AnimatedNumber with flash where applicable
  - [ ] `data-stagger-item` attributes present
  - [ ] `data-testid="projected-block-modal"` present
  - [ ] `npm run build` succeeds

  **QA Scenarios**:

  ```
  Scenario: ProjectedBlockDetailsModal has consistent styling with BlockDetailsModal
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Click on a projected mempool block to open ProjectedBlockDetailsModal
      3. Wait for '[data-testid="projected-block-modal"]' to be visible
      4. Screenshot the modal content
      5. Compare card styling pattern with BlockDetailsModal screenshots
    Expected Result: Card styling (accent borders, hover states, fee bars) visually consistent with BlockDetailsModal
    Failure Indicators: Inconsistent styling between confirmed and projected block modals
    Evidence: .sisyphus/evidence/task-12-projected-block.png

  Scenario: Projected label has badge styling
    Tool: Playwright
    Preconditions: ProjectedBlockDetailsModal open
    Steps:
      1. Locate the "projected" label/tag element
      2. Evaluate computed styles (background-color, border-radius, padding)
    Expected Result: Label has badge-like styling (rounded, background, distinct from plain text)
    Failure Indicators: Plain text label without visual distinction
    Evidence: .sisyphus/evidence/task-12-projected-badge.png
  ```

  **Commit**: YES
  - Message: `style(modals): enhance ProjectedBlockDetailsModal with stagger`
  - Files: `components/projected-block-details-modal.tsx`
  - Pre-commit: `npm run build`

- [x] 13. DonationModal + MobileSearchModal Polish

  **What to do**:
  - Both modals are inline in `components/home-view.tsx` — polish both:
  - **DonationModal** (CashuDonation dialog):
    - Add `data-stagger-item` to content sections for entrance stagger
    - Improve internal styling: accent-themed header, consistent card borders, better spacing
    - Add subtle glow to the donation QR/link area to draw attention
    - Ensure the dialog uses the enhanced entrance animation from Task 3
  - **MobileSearchModal**:
    - Add focus glow on the mobile search input (match search-bar-premium focus styles from Task 5)
    - Stagger the search suggestions/history items if present
    - Improve the close button styling
    - Ensure touch interactions feel responsive (active states, no hover dependency)
  - Add `data-testid="donation-modal"` and `data-testid="mobile-search-modal"` to respective DialogContent wrappers
  - Be careful editing `home-view.tsx` — it's the main orchestrator component. Only modify the JSX for these two modals, don't touch the state management, event handlers, or other component renders.

  **Must NOT do**:
  - Don't modify state management in home-view.tsx
  - Don't change how these modals are triggered
  - Don't extract these modals into separate files (tempting but out of scope)
  - Don't change the donation/payment logic
  - Don't change anything in home-view.tsx besides these two modal's JSX/styling

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Styling work across two inline modals in a large orchestrator file — needs careful editing
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4-12)
  - **Blocks**: Task 14
  - **Blocked By**: Tasks 1, 3

  **References**:

  **Pattern References**:
  - `components/home-view.tsx` — Large orchestrator component (~500+ lines). DonationModal and MobileSearchModal are defined inline within the JSX. Executor MUST carefully identify and only modify these sections.
  - `components/stats-modals.tsx` — After Task 6, the card/styling pattern to follow
  - `components/search-bar.tsx` — After Task 5, the focus glow pattern for the mobile search input

  **API/Type References**:
  - `components/home-view.tsx` — Internal state variables that trigger these modals — DO NOT MODIFY

  **WHY Each Reference Matters**:
  - `home-view.tsx` — This is a large file. The executor must locate the DonationModal and MobileSearchModal JSX sections without modifying adjacent code. Use search for "Donation" and "MobileSearch" or "mobile-search" to find them.
  - Tasks 5 and 6 — The visual patterns to match for consistency.

  **Acceptance Criteria**:
  - [ ] DonationModal: stagger entrance, styled header, consistent borders, donation area glow
  - [ ] MobileSearchModal: focus glow on input, stagger for history items, responsive active states
  - [ ] `data-testid` attributes present on both modals
  - [ ] No changes to home-view.tsx state management or event handlers
  - [ ] No changes to other components rendered in home-view.tsx
  - [ ] `npm run build` succeeds

  **QA Scenarios**:

  ```
  Scenario: DonationModal has enhanced styling
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Trigger DonationModal (via dock button)
      3. Wait for '[data-testid="donation-modal"]' to be visible
      4. Screenshot modal content
    Expected Result: Styled header, card borders, donation area with accent glow, stagger entrance
    Failure Indicators: Plain unstyled dialog
    Evidence: .sisyphus/evidence/task-13-donation-modal.png

  Scenario: MobileSearchModal has focus glow on mobile
    Tool: Playwright with mobile viewport (375x812)
    Preconditions: Dev server running
    Steps:
      1. Set viewport to 375x812
      2. Navigate to http://localhost:3000
      3. Trigger MobileSearchModal
      4. Wait for '[data-testid="mobile-search-modal"]' to be visible
      5. Focus the search input
      6. Evaluate border-color and box-shadow
    Expected Result: Input has accent glow matching search-bar-premium focus styles
    Failure Indicators: Plain input without glow
    Evidence: .sisyphus/evidence/task-13-mobile-search.png
  ```

  **Commit**: YES
  - Message: `style(modals): polish DonationModal and MobileSearchModal`
  - Files: `components/home-view.tsx`
  - Pre-commit: `npm run build`

- [x] 14. Mobile Touch Interactions & Final Consistency Pass

  **What to do**:
  - Final sweep across ALL modified components to ensure mobile and cross-component consistency:
  - **Mobile touch audit** (Playwright at 375×812 viewport):
    - Verify every hover effect in stats-strip has a working `:active` fallback
    - Verify search bar focus glow works on touch-focus
    - Verify all modal open/close animations play smoothly on mobile
    - Verify no elements overflow the mobile viewport with new styling (check for horizontal scroll)
    - Verify tap targets are ≥44px minimum (accessibility touch target size)
  - **Animation consistency audit**:
    - All modals should stagger at the same rate (0.06s between children)
    - All hover lifts should be the same magnitude (translateY -1px or -2px — pick one and apply globally)
    - All accent borders should use the same color value (`hsl(var(--accent) / N)`) — verify no hardcoded hex
    - All info cards across modals should have matching padding, border-radius, background color
  - **prefers-reduced-motion audit**:
    - Use Playwright with `reducedMotion: 'reduce'`
    - Navigate the full app: hover stats, open each modal, focus search bar
    - Verify zero visible animations (no glow pulse, no stagger, no value flash, no hover lift beyond color change)
  - **Performance audit**:
    - Run Lighthouse on mobile preset
    - Verify CLS < 0.1 (no layout shift from new animations)
    - Verify no janky animations (no dropped frames on modal open)
  - Fix any inconsistencies found during the audit by editing the affected component files

  **Must NOT do**:
  - Don't add new features during the consistency pass
  - Don't refactor component structure
  - Don't change data fetching or routing
  - Don't change desktop behavior to fix mobile issues — add mobile-specific overrides

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Cross-component visual consistency, mobile interaction QA, accessibility verification — needs holistic design perspective
  - **Skills**: [`playwright`]
    - `playwright`: Needed for mobile viewport testing, reduced-motion testing, Lighthouse audit

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (sequential, after all Wave 2 tasks)
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 4, 5, 6, 7, 8, 9, 10, 11, 12, 13

  **References**:

  **Pattern References**:
  - ALL files modified in Tasks 1-13 — this is a cross-cutting consistency pass
  - `app/globals.css` — The `@media (prefers-reduced-motion: reduce)` block from Task 1
  - All `data-testid` attributes added in Tasks 2-13

  **WHY Each Reference Matters**:
  - This task reads all previously modified files to verify consistency. It's the quality gate before final verification.

  **Acceptance Criteria**:
  - [ ] All hover effects have `:active` fallback on mobile
  - [ ] All tap targets ≥ 44px on mobile
  - [ ] No horizontal overflow on mobile viewport
  - [ ] All modals stagger at 0.06s consistently
  - [ ] All hover lifts use same translateY value
  - [ ] All accent borders use CSS variables, zero hardcoded colors
  - [ ] All info cards across modals have matching padding/border-radius/background
  - [ ] prefers-reduced-motion: zero visible animations
  - [ ] Lighthouse CLS < 0.1 on mobile
  - [ ] `npm run build` succeeds

  **QA Scenarios**:

  ```
  Scenario: All hover effects work as active states on mobile
    Tool: Playwright with mobile viewport (375x812)
    Preconditions: Dev server running
    Steps:
      1. Set viewport to 375x812
      2. Navigate to http://localhost:3000
      3. Tap each of the 5 stat buttons in sequence
      4. Verify each shows active state visual feedback
      5. Focus search bar via tap
      6. Verify glow appears
    Expected Result: All elements respond to touch with visual feedback matching desktop hover
    Failure Indicators: No visual feedback on any tap, stuck hover states
    Evidence: .sisyphus/evidence/task-14-mobile-active-states.png

  Scenario: prefers-reduced-motion disables all animations globally
    Tool: Playwright with emulateMedia({ reducedMotion: 'reduce' })
    Preconditions: Dev server running
    Steps:
      1. Launch context with reducedMotion: 'reduce'
      2. Navigate to http://localhost:3000
      3. Hover over stat buttons — verify no lift/glow animation
      4. Open FeesModal — verify no stagger animation (all content appears instantly)
      5. Focus search bar — verify border change but no animated glow pulse
    Expected Result: Zero CSS or JS animations active. All state changes are instant. Functional behavior (modals open, hover states change color) still works.
    Failure Indicators: Any visible animation timing (glow pulses, stagger delays, lift transitions)
    Evidence: .sisyphus/evidence/task-14-reduced-motion-stats.png, task-14-reduced-motion-modal.png

  Scenario: No layout shift on mobile
    Tool: Playwright Lighthouse
    Preconditions: Dev server running
    Steps:
      1. Set viewport to 375x812
      2. Run Lighthouse performance audit
      3. Extract CLS metric
    Expected Result: CLS < 0.1
    Failure Indicators: CLS >= 0.1
    Evidence: .sisyphus/evidence/task-14-lighthouse.json
  ```

  **Commit**: YES
  - Message: `style(mobile): add touch interaction fallbacks and consistency pass`
  - Files: Multiple (any files needing consistency fixes)
  - Pre-commit: `npm run build`

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, inspect CSS classes, check Framer Motion props). For each "Must NOT Have": search codebase for forbidden patterns (prop renames, component extractions, routing changes, filter:blur usage, hardcoded colors) — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `npx next build` (or `npm run build`). Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic variable names (data/result/item/temp). Verify all new CSS classes follow existing naming conventions. Verify no hardcoded colors — all must use CSS variables.
  Output: `Build [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start dev server. Execute EVERY QA scenario from EVERY task — follow exact Playwright steps, capture evidence screenshots. Test cross-component integration (stats hover + modal open sequence, search focus + type + results). Test on mobile viewport (375×812). Test with prefers-reduced-motion enabled. Save all evidence to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Mobile [N/N] | Reduced Motion [PASS/FAIL] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual git diff. Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance for every task. Specifically verify: no prop interface changes, no routing changes, no component extractions, no keyboard shortcuts, no filter:blur usage. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Guardrail violations [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| Commit | Message | Files | Pre-commit Check |
|--------|---------|-------|-----------------|
| 1 | `style(core): add animation infrastructure and prefers-reduced-motion support` | globals.css, tailwind.config.ts | `npm run build` |
| 2 | `feat(ui): add value-change flash to AnimatedNumber` | animated-number.tsx | `npm run build` |
| 3 | `style(ui): enhance dialog entrance/exit animations with stagger` | dialog.tsx | `npm run build` |
| 4 | `style(stats): add glow border, hover zones, and value flash to stats-strip` | stats-strip.tsx | `npm run build` |
| 5 | `style(search): add focus glow expansion to search bar` | search-bar.tsx | `npm run build` |
| 6 | `style(modals): overhaul FeesModal and MempoolModal with stagger + styling` | stats-modals.tsx | `npm run build` |
| 7 | `style(modals): overhaul ChartModal styling` | chart-modal.tsx | `npm run build` |
| 8 | `style(modals): enhance BlockDetailsModal animations and styling` | block-details-modal.tsx | `npm run build` |
| 9 | `style(modals): enhance NetworkStatsModal and MiningStatsModal` | network-stats-modal.tsx, mining-stats-modal.tsx | `npm run build` |
| 10 | `style(modals): enhance SearchModal entrance and styling` | search-modal.tsx | `npm run build` |
| 11 | `style(modals): enhance PrivacyGuideModal animations and styling` | privacy-guide-modal.tsx | `npm run build` |
| 12 | `style(modals): enhance ProjectedBlockDetailsModal with stagger` | projected-block-details-modal.tsx | `npm run build` |
| 13 | `style(modals): polish DonationModal and MobileSearchModal` | home-view.tsx | `npm run build` |
| 14 | `style(mobile): add touch interaction fallbacks and consistency pass` | multiple files | `npm run build` |

---

## Success Criteria

### Verification Commands
```bash
npm run build              # Expected: Build succeeds with no errors
npx playwright test        # Expected: All QA scenarios pass (after QA task creates them)
```

### Final Checklist
- [ ] All 5 stats in strip have hover glow + value-change flash
- [ ] Stats-strip has ambient glow border (3s cycle)
- [ ] Search bar expands with accent glow on focus
- [ ] All 11 modals have staggered content entrance
- [ ] All 11 modals have refreshed internal styling
- [ ] prefers-reduced-motion disables all animations
- [ ] Mobile :active states work on all hover elements
- [ ] No filter:blur() used for glow effects (box-shadow only)
- [ ] No hardcoded colors (all CSS variables)
- [ ] No prop interface changes
- [ ] No routing changes
- [ ] Build passes cleanly
- [ ] Lighthouse CLS < 0.1
