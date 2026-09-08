# VYNORA

> Discover what's worth going out for.

A polished, frontend-only event discovery and ticketing experience for concerts, exhibitions, workshops, sports, festivals, and local events. VYNORA combines fast discovery, layered filtering, personalization, event details, ticket selection, and a fully simulated checkout in one responsive interface.

### Live demo

- **Vercel:** https://vynora-project.vercel.app/
- **GitHub Pages:** https://real-aiman.github.io/Vynora-project/

> **Portfolio note:** This is intentionally a frontend-only project. There is no backend, database, real authentication, or real payment processing. The catalog and checkout are simulated so the product flow can be demonstrated safely and honestly.

## ✨ Highlights

- 🔎 Live event search with category, city, date, price, and featured filters
- 🎟️ Event → ticket tiers → checkout → confirmation flow
- ❤️ Persistent favorites and recently viewed events
- 🧠 Transparent recommendation scoring based on user activity — no fake “AI” claims
- 🗺️ Interactive venue map and calendar experience
- 📱 Responsive layouts with mobile filter sheets and full-screen event details
- ♿ Accessible forms, visible focus states, keyboard-friendly overlays, and focus trapping
- ⚡ Loading skeletons, retryable errors, empty states, toasts, and defensive deep-link handling
- 🧪 49 automated tests covering utilities, store behavior, and component integration
- 🧹 Strict TypeScript + ESLint with JSX accessibility rules

## 🛠️ Tech Stack

| Area | Technology |
| --- | --- |
| UI | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Client state | Zustand 5 + persist middleware |
| Data layer | TanStack Query 5 |
| Icons | lucide-react |
| Testing | Vitest + React Testing Library + user-event |
| Quality | ESLint + TypeScript strict mode |

## 🧩 Architecture

```text
src/
├── components/       reusable UI, events, navigation, layout
├── constants/        shared categories and filters
├── data/             static event and venue catalog
├── hooks/            data fetching + accessibility hooks
├── modals/           event detail, tickets, checkout, confirmation
├── sections/         hero, featured, explore, map, calendar, recommendations
├── store/            centralized Zustand application state
├── test/             test setup and integration coverage
├── types/            shared TypeScript models
├── utils/            pure filtering, formatting, date and ticket helpers
├── App.tsx           composition root
└── main.tsx          application bootstrap
```

The project deliberately separates **UI**, **domain data**, **pure utilities**, **cross-cutting state**, and **data fetching**. Zustand owns persistent cross-cutting client state while TanStack Query owns the event data lifecycle. This avoids prop drilling and keeps rendering concerns separate from application state.

## 🧪 Quality

```bash
npm install
npm run build
npm run lint
npm run test
```

`build` performs a TypeScript check before the Vite production build. The repository also includes a GitHub Actions quality gate that runs install, build/typecheck, lint, and tests on pushes to `main` and pull requests.

## ♿ Accessibility

Accessibility is treated as a product requirement rather than a final checklist:

- semantic HTML and real interactive elements
- labels and `aria-describedby`/`aria-invalid` for form errors
- visible `focus-visible` states
- keyboard navigation for overlays and calendar interactions
- focus trapping while overlays are open
- focus restoration after closing an overlay
- reduced-motion support through Framer Motion
- disabled out-of-month calendar padding days

## 📱 Responsive behavior

The interface is designed mobile-first. Event grids collapse to one column before expanding at responsive breakpoints; filters become a mobile bottom sheet; and event details use a full-screen mobile presentation. The calendar intentionally retains its seven-column structure because each column represents a day of the week.

## ⚡ Performance choices

- lazy-loaded event imagery
- memoized filtered, sorted, and recommended collections
- Zustand slice subscriptions to reduce unrelated re-renders
- TanStack Query caching with an intentionally infinite stale time for the static catalog
- production bundle documented in the original performance audit at approximately 406 KB JS / 122 KB gzipped and 28 KB CSS

## 🧭 Product flow

```text
Discover
   ↓
Search / Filter / Sort
   ↓
Event Details
   ↓
Choose Tickets
   ↓
Validate Checkout
   ↓
Generate Order Reference
   ↓
Confirmation
```

## Honest limitations

This project is a frontend product demonstration, not a production ticketing backend.

- no backend or database
- no real authentication
- no real payment gateway
- static mock event catalog
- checkout is client-side simulation only
- recommendation logic is a transparent weighted score, not machine learning
- deep linking uses a lightweight hash pattern rather than a routing library
- imagery uses seeded placeholder photography and can be replaced from the event data layer
- automated coverage is meaningful but not exhaustive end-to-end coverage

These limitations are explicit so the repository demonstrates engineering judgment rather than overstating functionality.

## 🚀 Local development

```bash
git clone https://github.com/real-aiman/Vynora-project.git
cd Vynora-project
npm install
npm run dev
```

Then open the local Vite URL shown in your terminal.

## 📄 License

This repository is presented as a portfolio project. See the repository terms before reusing production assets or branding.

---

Built with React, TypeScript, and a product-first approach by **Aiman Shafiq**.
