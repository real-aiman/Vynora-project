import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { EventItem, Filters, SortOption } from "../types";
import { DEFAULT_FILTERS, MAX_PRICE_CEILING } from "../constants/filters";
import { useAppStore } from "../store/useAppStore";
import { FilterPanelContent } from "../components/events/FilterPanelContent";
import { EventCard } from "../components/events/EventCard";
import { EmptyState } from "../components/ui/EmptyState";

const PAGE_SIZE = 9;

export function ExploreSection({
  filters,
  setFilters,
  sort,
  setSort,
  results,
  query,
}: {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  sort: SortOption;
  setSort: (s: SortOption) => void;
  results: EventItem[];
  query: string;
}) {
  const setFilterSheetOpen = useAppStore((s) => s.setFilterSheetOpen);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const shown = results.slice(0, visibleCount);
  const activeFilterCount =
    filters.categories.length +
    (filters.city !== "All" ? 1 : 0) +
    (filters.dateFilter !== "any" ? 1 : 0) +
    (filters.featuredOnly ? 1 : 0) +
    (filters.maxPrice < MAX_PRICE_CEILING ? 1 : 0);

  function clearAll() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <section id="explore" className="border-t border-white/10 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-lime-300">
              Browse
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50 sm:text-3xl">
              Explore events
            </h2>
          </div>
          <button
            onClick={() => setFilterSheetOpen(true)}
            className="flex items-center gap-2 rounded-sm border border-white/15 px-4 py-2.5 text-sm font-medium text-neutral-200 hover:border-white/30 md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lime-300 text-[10px] font-bold text-neutral-950">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[240px_1fr]">
          <aside className="hidden md:block">
            <div className="sticky top-24 rounded-md border border-white/10 bg-neutral-900/40 p-5">
              <FilterPanelContent
                filters={filters}
                setFilters={setFilters}
                sort={sort}
                setSort={setSort}
              />
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <p className="text-sm text-neutral-400">
                <span className="font-semibold text-neutral-100">{results.length}</span>{" "}
                {results.length === 1 ? "event" : "events"} found
                {query.trim() && (
                  <>
                    {" "}
                    for “<span className="text-neutral-200">{query}</span>”
                  </>
                )}
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs font-medium text-lime-300 hover:text-lime-200"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {activeFilterCount > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {filters.categories.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-full border border-lime-300/40 bg-lime-300/10 px-3 py-1 text-xs text-lime-300"
                  >
                    {c}
                    <button
                      onClick={() =>
                        setFilters((f) => ({
                          ...f,
                          categories: f.categories.filter((x) => x !== c),
                        }))
                      }
                      aria-label={`Remove ${c} filter`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {filters.city !== "All" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-300/40 bg-lime-300/10 px-3 py-1 text-xs text-lime-300">
                    {filters.city}
                    <button
                      onClick={() => setFilters((f) => ({ ...f, city: "All" }))}
                      aria-label="Remove city filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {results.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No matching events."
                message="Try widening your filters or searching a different term."
                action={
                  <button
                    onClick={clearAll}
                    className="mt-1 rounded-sm bg-lime-300 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-lime-200"
                  >
                    Clear filters
                  </button>
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {shown.map((e) => (
                    <EventCard key={e.id} event={e} variant="compact" />
                  ))}
                </div>
                {visibleCount < results.length && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                      className="rounded-sm border border-white/15 px-6 py-2.5 text-sm font-medium text-neutral-200 hover:border-white/30"
                    >
                      Show more events
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
