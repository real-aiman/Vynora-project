import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";

import type { DateFilter, Filters, SortOption } from "./types";
import { DEFAULT_FILTERS } from "./constants/filters";
import { applyFilters, sortEvents } from "./utils/filters";

import { useEventsData } from "./hooks/useEventsData";
import { useAppStore } from "./store/useAppStore";

import { Navbar } from "./components/navigation/Navbar";
import { MobileMenu } from "./components/navigation/MobileMenu";
import { SearchOverlay } from "./components/navigation/SearchOverlay";
import { FilterSheet } from "./components/events/FilterSheet";
import { FavoritesPanel } from "./components/common/FavoritesPanel";
import { ToastStack } from "./components/common/ToastStack";
import { EventCardSkeleton } from "./components/ui/EventCardSkeleton";
import { ErrorState } from "./components/ui/ErrorState";
import { Newsletter } from "./components/layout/Newsletter";
import { Footer } from "./components/layout/Footer";

import { Hero } from "./sections/Hero";
import { FeaturedEvents } from "./sections/FeaturedEvents";
import { ExploreSection } from "./sections/ExploreSection";
import { EventMap } from "./sections/EventMap";
import { EventCalendar } from "./sections/EventCalendar";
import { RecommendationsSection } from "./sections/RecommendationsSection";

import { EventDetailModal } from "./modals/EventDetailModal";

const EVENT_HASH_PATTERN = /^#event\/(\d+)$/;

export default function App() {
  const { events, loading, error, retry } = useEventsData();

  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>("recommended");

  const favoriteIds = useAppStore((s) => s.favoriteIds);
  const recentlyViewed = useAppStore((s) => s.recentlyViewed);
  const clearRecentlyViewed = useAppStore((s) => s.clearRecentlyViewed);
  const activeEventId = useAppStore((s) => s.activeEventId);
  const modalStep = useAppStore((s) => s.modalStep);
  const openEvent = useAppStore((s) => s.openEvent);
  const toasts = useAppStore((s) => s.toasts);
  const dismissToast = useAppStore((s) => s.dismissToast);
  const addToast = useAppStore((s) => s.addToast);

  const favorites = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  // scroll listener
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Centralized overlay behavior: locks background scroll while any overlay
  // is open, and closes whichever is topmost on Escape. Reads overlay flags
  // straight from the store rather than App-local state, since that's now
  // the single source of truth for them.
  useEffect(() => {
    const unsubscribe = useAppStore.subscribe((state) => {
      const anyOpen =
        state.modalStep !== "closed" ||
        state.favoritesPanelOpen ||
        state.filterSheetOpen ||
        state.mobileMenuOpen ||
        state.searchOverlayOpen;
      document.body.style.overflow = anyOpen ? "hidden" : "";
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      const s = useAppStore.getState();
      if (s.searchOverlayOpen) {
        s.setSearchOverlayOpen(false);
      } else if (s.modalStep !== "closed") {
        s.closeModal();
      } else if (s.filterSheetOpen) {
        s.setFilterSheetOpen(false);
      } else if (s.favoritesPanelOpen) {
        s.setFavoritesPanelOpen(false);
      } else if (s.mobileMenuOpen) {
        s.setMobileMenuOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredResults = useMemo(
    () => sortEvents(applyFilters(events, query, filters), sort),
    [events, query, filters, sort]
  );

  const heroSearchResults = useMemo(
    () =>
      query.trim()
        ? applyFilters(events, query, {
            ...filters,
            categories: [],
            city: "All",
            dateFilter: "any",
            maxPrice: 100000,
            featuredOnly: false,
          })
        : [],
    [events, query, filters]
  );

  const favoriteEvents = useMemo(
    () => events.filter((e) => favorites.has(e.id)),
    [events, favorites]
  );

  const activeEvent = useMemo(
    () => events.find((e) => e.id === activeEventId) || null,
    [events, activeEventId]
  );

  function scrollToSection(id: string) {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Hash-based deep linking: once events have loaded, honor a #event/<id>
  // link in the URL (shared or bookmarked). An id that doesn't match any
  // event surfaces a real "not found" toast instead of silently doing
  // nothing or crashing.
  const handledInitialHash = useRef(false);
  useEffect(() => {
    if (handledInitialHash.current) return;
    if (loading || error) return;
    handledInitialHash.current = true;

    const match = window.location.hash.match(EVENT_HASH_PATTERN);
    if (!match) return;
    const id = Number(match[1]);
    const exists = events.some((e) => e.id === id);
    if (exists) {
      openEvent(id);
    } else {
      addToast("That event couldn’t be found — it may have ended.", "error");
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, [loading, error, events, openEvent, addToast]);

  const spotlightEvent = events[0];

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100 antialiased">
      <a
        href="#explore"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-lime-300 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-neutral-950"
      >
        Skip to events
      </a>

      <Navbar scrolled={scrolled} onNavigate={scrollToSection} />
      <MobileMenu onNavigate={scrollToSection} />

      <main>
        {!loading && !error && spotlightEvent && (
          <Hero
            query={query}
            setQuery={setQuery}
            results={heroSearchResults}
            onOpen={openEvent}
            city={filters.city}
            setCity={(c) => setFilters((f) => ({ ...f, city: c }))}
            onQuickDate={(d: DateFilter) => setFilters((f) => ({ ...f, dateFilter: d }))}
            activeQuickDate={filters.dateFilter}
            onExplore={() => scrollToSection("explore")}
            totalEvents={events.length}
            spotlightEvent={spotlightEvent}
          />
        )}

        {loading ? (
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <EventCardSkeleton tall />
              </div>
              <div className="flex flex-col gap-4">
                <EventCardSkeleton />
                <EventCardSkeleton />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <ErrorState onRetry={retry} />
          </div>
        ) : (
          <>
            <FeaturedEvents events={events} />

            <ExploreSection
              filters={filters}
              setFilters={setFilters}
              sort={sort}
              setSort={setSort}
              results={filteredResults}
              query={query}
            />

            <EventMap events={events} onOpen={openEvent} />

            <EventCalendar events={events} />

            <RecommendationsSection
              events={events}
              favorites={favorites}
              recentlyViewed={recentlyViewed}
              onClearRecent={clearRecentlyViewed}
            />
          </>
        )}

        <Newsletter onSubscribe={() => addToast("Newsletter subscribed", "success")} />
      </main>

      <Footer />

      <SearchOverlay query={query} setQuery={setQuery} results={heroSearchResults} />

      <FilterSheet
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
        resultCount={filteredResults.length}
      />

      <FavoritesPanel favoriteEvents={favoriteEvents} />

      <AnimatePresence>
        {modalStep !== "closed" && activeEvent && (
          <EventDetailModal
            event={activeEvent}
            onShare={() => {
              if (activeEventId !== null) {
                const url = `${window.location.origin}${window.location.pathname}#event/${activeEventId}`;
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(url).catch(() => {});
                }
              }
              addToast("Link copied to clipboard", "info");
            }}
          />
        )}
      </AnimatePresence>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
