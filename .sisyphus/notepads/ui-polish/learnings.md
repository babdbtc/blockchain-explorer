# Learnings — ui-polish

## 2026-04-04 Session Start

### CSS Architecture
- `globals.css` has 711 lines, organized in logical sections
- Existing keyframes: shimmer-sweep (3.5s), sparkle-twinkle (5s), gentle-bounce (3.5s), wiggle (3s), newBlockPulse (0.5s), strokeMove (5s), numberRoll (0.5s), fadeIn, fillUp, shimmer (2s), recommendedGlow (3s)
- Key CSS classes: `.premium-card`, `.premium-modal`, `.premium-button`, `.premium-button-accent`, `.shimmer-skeleton`, `.hover-lift`, `.block-height-display`, `.search-bar-premium`, `.new-block-celebration`, `.recommended-card`
- `.search-bar-premium` already has focus glow at `hsl(var(--accent)/0.5)` with `0 0 0 3px` box-shadow

### Tailwind Config
- Only has: accordion-down, accordion-up, dialog-in, dialog-out keyframes
- dialog-in: 0.3s ease-out (from opacity:0, scale:0.5 + slide offset)
- dialog-out: 0.2s ease-in (reverse)
- Uses CSS vars --slide-from-x, --slide-from-y for origin-based animation

### Dialog
- Has custom `originRect` prop for origin-based zoom animation
- `getOriginStyles()` calculates transform-origin + --slide-from-x/y CSS vars
- Two animation paths: with originRect (dialog-in/out) vs without (standard radix animations)
- Close button already in DialogContent

### AnimatedNumber
- Props: `{ value, className, decimals, duration, formatFn }`
- Uses rAF + easeOutQuart (1-(1-progress)^4)
- Uses `prevValueRef` already — easy to detect change
- Default duration: 1000ms

### CSS Variables
- `--accent: 48 96% 72%` (golden yellow)
- `--surface-1/2/3` for surface layers
- `--text-primary/secondary/muted` for text
- `--border-subtle`, `--border-accent` for borders
- NO hardcoded hex allowed — always use CSS variables

## Task 1: Animation Infrastructure & Accessibility (COMPLETED)

### Changes Made
- **`app/globals.css`**: Added 3 new keyframes + 4 utility classes + prefers-reduced-motion block
  - `@keyframes glow-pulse`: 3s cycle, box-shadow from 0.1/0.05 opacity to 0.25/0.12
  - `@keyframes value-flash`: 600ms single-shot, background flash at 20% mark
  - `@keyframes stagger-fade-in`: 300ms fade + translateY(12px) entrance
  - `.glow-border`: Applies glow-pulse animation (3s infinite)
  - `.glow-border-hover`: Glow only on :hover/:active (200ms transition)
  - `.value-flash`: Applies value-flash animation (600ms forwards)
  - `.stat-hover`: Subtle lift (-1px) + background + glow on :hover/:active
  - `@media (prefers-reduced-motion: reduce)`: Disables all animations for accessibility

- **`tailwind.config.ts`**: Added matching keyframe + animation entries
  - `glow-pulse`, `value-flash`, `stagger-fade-in` in `theme.extend.keyframes`
  - `animate-glow-pulse`, `animate-value-flash`, `animate-stagger-fade-in` in `theme.extend.animation`

### Key Decisions
- All colors use CSS variables (`var(--accent)`, `var(--surface-3)`) — no hardcoded hex/rgb/hsl
- Followed existing codebase style: section header comments (/* ── NEW: ... ── */)
- Placed keyframes after `recommendedGlow` (line 699), utility classes after `.recommended-card` (line 711)
- `prefers-reduced-motion` block at end of file for accessibility compliance
- Used `box-shadow` for glow effects (no `filter: blur()`)

### Verification
- `npm run build` succeeded with exit code 0
- No TypeScript or CSS errors
- Commit: `09e26b1` — "style(core): add animation infrastructure and prefers-reduced-motion support"

### Next Steps
- Task 2: Add `.value-flash` trigger logic to AnimatedNumber component
- Task 3: Apply `.glow-border` / `.glow-border-hover` to stat cards
- Task 4: Apply `.stat-hover` to stat buttons
- Task 5: Apply `.stagger-fade-in` to modal content children
