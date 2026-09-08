import { useMemo } from "react";
import { Heart, History } from "lucide-react";
import type { Category, EventItem } from "../types";
import { HorizontalRail } from "../components/events/HorizontalRail";
import { EmptyState } from "../components/ui/EmptyState";

export function RecommendationsSection({
  events,
  favorites,
  recentlyViewed,
  onClearRecent,
}: {
  events: EventItem[];
  favorites: Set<number>;
  recentlyViewed: number[];
  onClearRecent: () => void;
}) {
  const signalCategories = useMemo(() => {
    const ids = new Set([...favorites, ...recentlyViewed]);
    const cats = new Set<Category>();
    events.filter((e) => ids.has(e.id)).forEach((e) => cats.add(e.category));
    return cats;
  }, [events, favorites, recentlyViewed]);

  const hasSignal = signalCategories.size > 0;

  const recommended = useMemo(() => {
    const excluded = new Set([...favorites, ...recentlyViewed]);
    const pool = events.filter((e) => !excluded.has(e.id));
    const scored = pool.map((e) => ({
      event: e,
      score: (signalCategories.has(e.category) ? 10 : 0) + e.rating + (e.featured ? 1 : 0),
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 6).map((s) => s.event);
  }, [events, favorites, recentlyViewed, signalCategories]);

  const recentEvents = recentlyViewed
    .map((id) => events.find((e) => e.id === id))
    .filter((e): e is EventItem => Boolean(e));

  return (
    <section className="border-t border-white/10 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-lime-300">
            {hasSignal ? "Smart Recommendations" : "Just for you"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50 sm:text-3xl">
            Picked for you
          </h2>
        </div>
        {!hasSignal ? (
          <EmptyState
            icon={Heart}
            title="Not enough activity yet."
            message="Favorite or open a few events and recommendations will tune to your taste."
          />
        ) : (
          <HorizontalRail items={recommended} />
        )}

        <div className="mt-14 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-neutral-100">
            <History className="h-4 w-4 text-neutral-500" />
            Recently viewed
          </h3>
          {recentEvents.length > 0 && (
            <button
              onClick={onClearRecent}
              className="text-xs font-medium text-neutral-500 hover:text-neutral-300"
            >
              Clear
            </button>
          )}
        </div>
        <div className="mt-4">
          {recentEvents.length === 0 ? (
            <p className="text-sm text-neutral-500">
              Events you open will appear here for quick access.
            </p>
          ) : (
            <HorizontalRail items={recentEvents} />
          )}
        </div>
      </div>
    </section>
  );
}
