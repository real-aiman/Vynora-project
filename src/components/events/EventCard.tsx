import { motion } from "framer-motion";
import { Clock, Heart, MapPin, Star } from "lucide-react";
import type { EventItem } from "../../types";
import { formatDate } from "../../utils/date";
import { formatPrice } from "../../utils/format";
import { useAppStore } from "../../store/useAppStore";

export type CardVariant = "hero" | "medium" | "compact" | "row";

export function EventCard({
  event,
  variant,
}: {
  event: EventItem;
  variant: CardVariant;
}) {
  const isFavorite = useAppStore((s) => s.favoriteIds.includes(event.id));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const openEvent = useAppStore((s) => s.openEvent);

  const heightClass =
    variant === "hero"
      ? "h-[420px] sm:h-[520px]"
      : variant === "medium"
      ? "h-64"
      : variant === "compact"
      ? "h-40"
      : "h-28";

  if (variant === "row") {
    return (
      <div className="group flex items-center gap-4 border-b border-white/10 py-4 last:border-b-0">
        <button
          onClick={() => openEvent(event.id)}
          className="relative h-20 w-28 shrink-0 overflow-hidden rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
          aria-label={`Open ${event.title}`}
        >
          <img
            src={event.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
            {event.category} &middot; {event.city}
          </p>
          <button
            onClick={() => openEvent(event.id)}
            className="block truncate text-left text-base font-semibold text-neutral-100 hover:text-lime-300"
          >
            {event.title}
          </button>
          <p className="text-sm text-neutral-500">
            {formatDate(event.date)} &middot; {event.venue}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="text-sm font-semibold text-neutral-100">
            {formatPrice(event.price)}
          </span>
          <button
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
            onClick={() => toggleFavorite(event.id)}
            className="text-neutral-500 transition hover:text-lime-300"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-lime-300 text-lime-300" : ""}`} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-md border border-white/10 bg-neutral-900 transition duration-300 hover:border-white/25">
      <div className={`relative overflow-hidden ${heightClass}`}>
        <button
          onClick={() => openEvent(event.id)}
          className="absolute inset-0 h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
          aria-label={`View details for ${event.title}`}
        >
          <img
            src={event.image}
            alt={event.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        </button>

        <button
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          onClick={() => toggleFavorite(event.id)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
        >
          <motion.span
            key={isFavorite ? "on" : "off"}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? "fill-lime-300 text-lime-300" : "text-white"
              }`}
            />
          </motion.span>
        </button>

        {event.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-lime-300 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-950">
            Featured
          </span>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-lime-300">
              {event.category}
            </p>
            <h3
              className={`truncate font-semibold text-white ${
                variant === "hero" ? "text-2xl sm:text-3xl" : "text-lg"
              }`}
            >
              {event.title}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-300">
              <MapPin className="h-3 w-3 shrink-0" />
              {event.venue}, {event.city}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
          <Clock className="h-3.5 w-3.5" />
          {formatDate(event.date)}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-neutral-400">
            <Star className="h-3.5 w-3.5 fill-current text-neutral-500" />
            {event.rating}
          </span>
          <span className="text-sm font-semibold text-neutral-100">
            {formatPrice(event.price)}
          </span>
        </div>
      </div>
    </article>
  );
}
