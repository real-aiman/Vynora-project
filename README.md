# VYNORA

A frontend-only event discovery and ticketing platform — concerts, exhibitions,
workshops, sports, festivals, and local events, browsable, filterable, and
"bookable" through a fully simulated checkout.

**There is no backend.** No server, no database, no real payment processing.
Data is a static mock catalog, fetched through a simulated network call; the
checkout flow is a real client-side simulation with a fake delay and a
generated order reference. Stated plainly, not hidden — see
[Limitations](#honest-limitations).

## Features

- **Discovery** — hero search with live results, category/city/date/price
  filters that combine, sorting, active-filter chips, mobile bottom sheet
- **Browsing** — asymmetric featured grid, paginated explore grid, a
  stylized interactive venue map, a real month/week calendar
- **Personalization** — favorites and recently-viewed, persisted; a
  transparent "Picked for you" scoring function driven by that activity
  (explicitly not described as machine learning — see
  `sections/RecommendationsSection.tsx`)
- **Booking flow** — event detail → ticket tiers with live quantity/subtotal
  → checkout with real client-side validation → confirmation with a
  generated order reference
- **Cart persistence** — in-progress ticket selections are saved per-event
  so a reload mid-checkout doesn't lose them, cleared once an order completes
- **Deep linking** — opening an event updates the URL to `#event/<id>`; an
  id that doesn't exist surfaces a real "not found" toast, not a crash
- **Toasts, loading skeletons, error/retry, and empty states** for every
  meaningful interaction

## Tech Stack

- React 18 + TypeScript (strict mode)
- **Zustand** — all cross-cutting client state (favorites, recently-viewed,
  cart draft, sign-in, every overlay's open/closed flag, and the full modal
  navigation/checkout flow). No Context API and no prop-drilling for any of
  it: an `EventCard` three levels deep in the favorites drawer can open an
  event and get fully-reset ticket/checkout state, because `openEvent` is a
  store action, not a prop passed down through five components.
  `zustand/middleware/persist` handles `localStorage` — no hand-rolled hook.
- **TanStack Query** — wraps the simulated event fetch for real caching
  (`staleTime: Infinity` — this mock catalog never goes stale mid-session),
  loading/error state, and manual retry via `refetch()`, instead of
  hand-rolled `useState`/`useEffect` fetch logic.
- Tailwind CSS
- Framer Motion, including `prefers-reduced-motion` support via its
  built-in `useReducedMotion()` hook
- lucide-react for icons
- Vite
- **Vitest + React Testing Library** — 49 tests across pure utils, the
  Zustand store, and a component-level integration test
- ESLint (`eslint:recommended`, `@typescript-eslint`, `react-hooks`, `jsx-a11y`)

Why Zustand over Context here: this app's cross-cutting state (favorites,
cart, modal navigation, four different overlay flags) got complex enough
that a single Context provider re-rendering on every unrelated update would
have been the wrong tool — Zustand's per-slice subscriptions mean a
component reading `favoriteIds.length` doesn't re-render when
`searchOverlayOpen` flips. Why TanStack Query for a fetch that always
returns the same static array: to demonstrate the actual pattern (cache
key, stale time, retry semantics) rather than hand-rolling a worse version
of it — the fetch itself is fake, but the data-layer code around it is real.

## UX Highlights

- Filters combine (category + city + date + price + featured) rather than
  overriding each other, with a live result count and clearable chips
- Ticket quantity, subtotal, service fee, and total all recalculate live
- Checkout validates name and email client-side with inline errors and a
  disabled/loading/success button sequence
- Every overlay (event modal, favorites drawer, filter sheet, mobile menu,
  search, profile dropdown) shares one Escape-key handler, one scroll-lock
  effect, and — new — a real **focus trap**: Tab/Shift+Tab cycles within
  the open overlay instead of escaping to the page behind it, and closing
  it returns focus to whatever triggered it. See `hooks/useFocusTrap.ts`.
- The initial event fetch genuinely simulates a ~12% random failure chance
  on the *first* attempt only (a manual retry always succeeds), so the
  loading and error UI states are real code paths, not screenshots

## Architecture

```
src/
├── types/             shared TypeScript types
├── constants/          category/filter constants
├── data/                mock events + venues
├── utils/              date, formatting, filtering, ticket-tier helpers
│                         (pure functions — unit tested)
├── hooks/              useEventsData (TanStack Query), useFocusTrap
├── store/              useAppStore — the single Zustand store
├── components/
│   ├── ui/               Badge, EmptyState, ErrorState, skeletons, icons
│   ├── events/           EventCard, filter panel/sheet, horizontal rail
│   ├── navigation/       Navbar, MobileMenu, search overlay/dropdown
│   ├── layout/            Newsletter, Footer
│   └── common/           ToastStack, FavoritesPanel
├── sections/            Hero, FeaturedEvents, ExploreSection, EventMap,
│                         EventCalendar, RecommendationsSection
├── modals/              EventDetailModal and its four step views
│                         (detail / tickets / checkout / confirmation) —
│                         each reads its own slice of the store directly
├── App.tsx              composition root — page-local state only
│                         (search query text, filters, sort, scroll
│                         position); everything cross-cutting lives in
│                         the store
└── main.tsx             wraps the app in QueryClientProvider
```

## Testing

```bash
npm run test        # runs once
npm run test:watch  # watch mode
```

49 tests across 6 files:

- **Pure utils** (`date`, `format`, `tickets`, `filters`) — the parts of
  this app with zero React dependency, tested as plain functions: date
  arithmetic, email validation, card-input masking, ticket-tier pricing
  math, and the filter/sort logic (including that category + city filters
  actually AND together rather than OR, which was worth a real test)
- **The Zustand store** — no Provider needed to test it, which is one of
  the concrete benefits of Zustand over Context here. Covers favoriting,
  opening an event (and that it correctly resets stale checkout state),
  ticket quantity clamping, and the full submit-order flow through fake
  timers (invalid form → errors; valid form → loading → success →
  confirmation, with the cart draft cleared on success)
- **One component integration test** (`EventCard`) — renders with React
  Testing Library, clicks it with `@testing-library/user-event`, and
  asserts against real store state afterward, not mocked callbacks

## Accessibility

- Semantic HTML throughout, including the footer's links (previously
  `<a href="#">`, now real buttons for the ones that don't navigate)
- Labeled form inputs with `aria-invalid`/`aria-describedby` wired to
  inline error text
- **Real focus trap on every overlay** (`useFocusTrap`), not just Escape
  and scroll-lock: Tab cycles within the open dialog/dropdown, and closing
  it restores focus to the triggering element
- Visible focus states (`focus-visible:outline`) throughout
- Calendar's out-of-month padding days are `disabled`/`tabIndex={-1}` so
  keyboard/screen-reader users can't select a day the header doesn't match

Verified with `eslint-plugin-jsx-a11y` (zero errors) — not just asserted.

## Responsive Design

Every multi-column grid starts at a single column and only expands at
`sm:`/`md:`/`lg:`, with one intentional exception: the calendar's 7-day
grid, which needs 7 columns at every breakpoint. Filters move from a
sidebar to a mobile bottom sheet; the event modal goes full-screen below
`sm:`.

**Honest caveat:** verified by static analysis (grep audit for fixed
widths, missing breakpoints, overflow-prone patterns — all clean) and a
successful production build, not by looking at it in an actual browser.
See Limitations.

## Performance

- Images are `loading="lazy"` throughout
- `useMemo` for filtered/sorted/recommended event lists
- Zustand's per-slice subscriptions mean components only re-render on the
  specific piece of state they read, not on every store update
- TanStack Query's `staleTime: Infinity` means the mock catalog is fetched
  once per session, not on every remount
- Production bundle: ~406KB JS / ~122KB gzipped, ~28KB CSS

## Installation

```bash
npm install
npm run dev
```

```bash
npm run build   # tsc --noEmit, then vite build
npm run lint    # eslint, react-hooks + jsx-a11y rules included
npm run test    # vitest, 49 tests
```

All four were run clean against this exact codebase before it was
packaged: 0 TypeScript errors (strict mode), 0 ESLint errors, 49/49 tests
passing, successful production build.

## Honest Limitations

- **No backend, no real payments, no real auth.** "Sign in" toggles a
  persisted `isSignedIn` flag and shows a toast — there is no account
  system. Checkout collects and validates name/email, but no payment is
  transmitted anywhere.
- **No visual QA was performed.** Every check above is real and was
  actually run — but none of them substitutes for looking at the rendered
  UI. No screenshot tool was available in the environment this was built
  in (confirmed by attempting real Chromium/Firefox installs — both
  resolved to snap-only packages with no usable binary).
- **Test coverage is real but not exhaustive.** 49 tests cover the pure
  logic layer, the store, and one component — not every component, and no
  end-to-end tests.
- **No routing library.** "Deep linking" is a single hash pattern handled
  by hand. There's no 404 *page* — an invalid event id surfaces as a
  toast, not a dedicated route.
- **No dark/light theme** — left out rather than added just because it's
  trendy, per the brief this was built against.
- **Images are `picsum.photos` seeded placeholders**, not curated event
  photography. Swapping them is a one-line change per event in
  `src/data/events.ts`.
- **Recommendation scoring is a simple weighted function**, not ML — the
  UI copy says "Smart Recommendations," deliberately not "AI."

## Future Improvements

- A real screenshot/visual-regression pass once a browser is available
- Broader test coverage (more components, an end-to-end smoke test)
- A proper router if the app grows past one page worth of deep-linking
- Code-splitting the event-detail modal once there's a second route to
  split against
