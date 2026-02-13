# Blockchain Explorer Refactor Plan

## Phase 1: Security & Stability

### 1.1 Lock CORS on financial endpoints
- `app/api/cashu-donation/route.ts` line 87: `"*"` -> `"https://babd.space"`
- `app/api/cashu-redeem/route.ts` line 158: `"*"` -> `"https://babd.space"`
- `app/api/cashu-rate-limit/route.ts` line 105: `"*"` -> `"https://babd.space"`

### 1.2 Fix auth bypass
- `app/api/cashu-donation/route.ts` line 21: change `if (expectedKey && authHeader !== ...)` to `if (!expectedKey || authHeader !== ...)` so missing env var = deny

### 1.3 Pin packages
- Replace all 38 `"latest"` entries in package.json with resolved versions from lock file

### 1.4 Remove build error suppression
- `next.config.mjs`: remove `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors`

## Phase 2: Cleanup

### 2.1 Remove unused npm packages
react-day-picker, react-hook-form, @hookform/resolvers, embla-carousel-react, input-otp, react-resizable-panels, vaul, zod, react-is

### 2.2 Remove unused UI components (43 files)
accordion, alert-dialog, alert, avatar, aspect-ratio, breadcrumb, button-group, calendar, carousel, chart, checkbox, collapsible, command, context-menu, drawer, dropdown-menu, empty, field, form, hover-card, input-group, input-otp, item, kbd, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, sheet, sidebar, slider, sonner, spinner, switch, table, tabs, textarea, toggle-group, toaster

### 2.3 Remove unused Radix packages (22 packages)
After removing UI components, uninstall: @radix-ui/react-accordion, alert-dialog, aspect-ratio, avatar, checkbox, collapsible, context-menu, dropdown-menu, hover-card, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, slider, switch, tabs, toast, toggle, toggle-group

### 2.4 Fix Tailwind conflict
- Remove @tailwindcss/postcss and tw-animate-css from package.json
- Remove or clean up styles/globals.css

### 2.5 ReactQueryDevtools
- Wrap in `process.env.NODE_ENV === 'development'` check in providers.tsx

## Phase 3: Code Deduplication

### 3.1 Create shared utilities
- `lib/shared-types.ts` - StoredToken, Proof interfaces
- `lib/get-client-ip.ts` - getClientIP function
- `lib/tokens-file.ts` - TOKENS_FILE constant + read/write helpers
- `lib/cors.ts` - CORS headers helper

### 3.2 Update API routes to use shared utilities
- cashu-donation/route.ts
- cashu-redeem/route.ts
- cashu-rate-limit/route.ts
- admin/tokens/route.ts
- admin/login/route.ts

### 3.3 Remove console.log
- Remove 9 console.log calls (keep console.error)

## Phase 4: Accessibility
### 4.1 Re-enable zoom
- layout.tsx: remove maximumScale: 1 and userScalable: "no"

## Phase 5: Mobile
### 5.1 Mobile donation drawer
### 5.2 Mobile stats panel
### 5.3 Mobile privacy guide

## Phase 6: Build verification
### 6.1 Full build + fix type errors
