import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Search } from "lucide-react";
import type { DateFilter, EventItem } from "../types";
import { CITIES } from "../data/events";
import { formatDate } from "../utils/date";
import { SearchResultsDropdown } from "../components/navigation/SearchResultsDropdown";

export function Hero({
  query,
  setQuery,
  results,
  onOpen,
  city,
  setCity,
  onQuickDate,
  activeQuickDate,
  onExplore,
  totalEvents,
  spotlightEvent,
}: {
  query: string;
  setQuery: (v: string) => void;
  results: EventItem[];
  onOpen: (id: number) => void;
  city: string;
  setCity: (v: string) => void;
  onQuickDate: (v: DateFilter) => void;
  activeQuickDate: DateFilter;
  onExplore: () => void;
  totalEvents: number;
  spotlightEvent: EventItem;
}) {
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <section id="top" className="relative overflow-hidden border-b border-white/10 bg-neutral-950">
      <div className="pointer-events-none absolute inset-0">
        <img
          src="https://picsum.photos/seed/vynora-hero/2000/1200"
          alt=""
          className="h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/85 to-neutral-950/40" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:grid-cols-12 lg:px-8">
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.6, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-lime-300">
            Event Discovery
          </p>
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-50 sm:text-5xl lg:text-6xl">
            Find something worth going out for.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-400">
            Concerts, exhibitions, workshops, and everything in between —
            curated from venues across the city and beyond, updated daily.
          </p>

          <div ref={wrapperRef} className="relative mt-8 max-w-xl">
            <div className="flex flex-col gap-2 rounded-md border border-white/15 bg-neutral-900/80 p-2 backdrop-blur sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2 px-2">
                <Search className="h-4 w-4 shrink-0 text-neutral-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setFocused(false);
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  placeholder="Search events, artists, venues..."
                  aria-label="Search events, artists, or venues"
                  className="w-full bg-transparent py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
                />
              </div>
              <div className="hidden h-6 w-px bg-white/10 sm:block" />
              <div className="flex items-center gap-2 px-2">
                <MapPin className="h-4 w-4 shrink-0 text-neutral-500" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  aria-label="Filter by city"
                  className="bg-transparent py-2.5 text-sm text-neutral-100 focus:outline-none"
                >
                  <option value="All" className="bg-neutral-900">
                    All cities
                  </option>
                  {CITIES.map((c) => (
                    <option key={c} value={c} className="bg-neutral-900">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={onExplore}
                className="rounded-sm bg-lime-300 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-lime-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
              >
                Explore
              </button>
            </div>
            {focused && (
              <SearchResultsDropdown
                query={query}
                results={results}
                onOpen={(id) => {
                  setFocused(false);
                  onOpen(id);
                }}
              />
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(
              [
                { key: "today", label: "Today" },
                { key: "week", label: "This week" },
                { key: "month", label: "This month" },
              ] as { key: DateFilter; label: string }[]
            ).map((opt) => (
              <button
                key={opt.key}
                onClick={() => onQuickDate(activeQuickDate === opt.key ? "any" : opt.key)}
                aria-pressed={activeQuickDate === opt.key}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  activeQuickDate === opt.key
                    ? "border-lime-300 bg-lime-300/10 text-lime-300"
                    : "border-white/15 text-neutral-400 hover:border-white/30 hover:text-neutral-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <p className="mt-8 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-300">
              {(totalEvents * 733 + 9480).toLocaleString()}+
            </span>{" "}
            events happening this month across 12 cities
          </p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.6, delay: reduceMotion ? 0 : 0.15, ease: "easeOut" }}
          className="hidden lg:col-span-5 lg:block"
        >
          <div className="relative ml-auto h-full max-h-[480px] w-full max-w-sm overflow-hidden rounded-md border border-white/10">
            <img src={spotlightEvent.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-lime-300">
                Tonight in {spotlightEvent.city}
              </p>
              <p className="mt-1 text-xl font-semibold text-white">{spotlightEvent.title}</p>
              <p className="mt-1 text-xs text-neutral-300">
                {spotlightEvent.venue} &middot; {formatDate(spotlightEvent.date)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
