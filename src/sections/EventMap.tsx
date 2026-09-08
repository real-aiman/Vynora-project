import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { EventItem, MapVenue } from "../types";
import { MAP_VENUES } from "../data/venues";
import { formatDate } from "../utils/date";
import { EmptyState } from "../components/ui/EmptyState";

export function EventMap({
  events,
  onOpen,
}: {
  events: EventItem[];
  onOpen: (id: number) => void;
}) {
  const [selected, setSelected] = useState<MapVenue | null>(null);
  const relatedEvent = selected ? events.find((e) => e.id === selected.eventId) : null;

  return (
    <section id="map" className="border-t border-white/10 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-lime-300">
            Venues
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50 sm:text-3xl">
            Explore by location
          </h2>
          <p className="mt-2 max-w-md text-sm text-neutral-500">
            An illustrative map of venues currently hosting VYNORA events. Select a
            point to preview what’s on.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="relative h-[420px] overflow-hidden rounded-md border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_45%)]">
            <svg className="absolute inset-0 h-full w-full opacity-[0.15]" aria-hidden="true">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {MAP_VENUES.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelected(v)}
                aria-label={`View ${v.name} in ${v.city}`}
                style={{ left: `${v.x}%`, top: `${v.y}%` }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
              >
                <span
                  className={`block h-3 w-3 rounded-full border-2 transition ${
                    selected?.id === v.id
                      ? "scale-150 border-lime-300 bg-lime-300"
                      : "border-white/60 bg-neutral-950 group-hover:scale-125 group-hover:border-lime-300"
                  }`}
                />
                <span className="pointer-events-none absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap rounded-sm bg-black/80 px-2 py-1 text-[10px] text-neutral-200 opacity-0 transition group-hover:opacity-100">
                  {v.name}
                </span>
              </button>
            ))}

            <div className="absolute bottom-3 left-3 flex gap-2 rounded-sm border border-white/10 bg-black/50 px-2 py-1.5 text-[10px] text-neutral-400 backdrop-blur">
              <span>{MAP_VENUES.length} venues live</span>
            </div>
          </div>

          <div className="rounded-md border border-white/10 bg-neutral-900/50 p-5">
            {selected && relatedEvent ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
                  {selected.city}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-neutral-50">{selected.name}</h3>
                <p className="mt-1 text-xs text-neutral-500">1 upcoming event</p>

                <div className="mt-4 overflow-hidden rounded-sm border border-white/10">
                  <img
                    src={relatedEvent.image}
                    alt=""
                    loading="lazy"
                    className="h-28 w-full object-cover"
                  />
                  <div className="p-3">
                    <p className="text-[11px] uppercase tracking-wider text-lime-300">
                      {relatedEvent.category}
                    </p>
                    <p className="text-sm font-semibold text-neutral-100">
                      {relatedEvent.title}
                    </p>
                    <p className="text-xs text-neutral-500">{formatDate(relatedEvent.date)}</p>
                  </div>
                </div>

                <button
                  onClick={() => onOpen(relatedEvent.id)}
                  className="mt-4 w-full rounded-sm bg-lime-300 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-lime-200"
                >
                  View event
                </button>
              </motion.div>
            ) : (
              <EmptyState
                icon={MapPin}
                title="No venue selected"
                message="Click a point on the map to preview the venue and its event."
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
