import { Heart, MapPin, Share2, Star, Ticket } from "lucide-react";
import type { EventItem } from "../types";
import { formatDate } from "../utils/date";
import { formatPrice } from "../utils/format";
import { useAppStore } from "../store/useAppStore";
import { Badge } from "../components/ui/Badge";
import { CategoryIcon } from "../components/ui/CategoryIcon";

export function EventDetailView({
  event,
  onShare,
}: {
  event: EventItem;
  onShare: () => void;
}) {
  const isFavorite = useAppStore((s) => s.favoriteIds.includes(event.id));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const goToTickets = useAppStore((s) => s.goToTickets);

  return (
    <>
      <div className="relative h-64 w-full sm:h-80">
        <img src={event.image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
      </div>
      <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              <CategoryIcon category={event.category} className="h-3 w-3" />
              {event.category}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <Star className="h-3.5 w-3.5 fill-current text-neutral-500" />
              {event.rating} rating
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-50">
            {event.title}
          </h1>
          {event.artist && (
            <p className="mt-1 text-sm text-neutral-400">Featuring {event.artist}</p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-4 border-y border-white/10 py-5 sm:grid-cols-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Date</p>
              <p className="mt-1 text-sm font-medium text-neutral-200">
                {formatDate(event.date)}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Time</p>
              <p className="mt-1 text-sm font-medium text-neutral-200">{event.time}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Duration</p>
              <p className="mt-1 text-sm font-medium text-neutral-200">{event.duration}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Capacity</p>
              <p className="mt-1 text-sm font-medium text-neutral-200">{event.capacity}</p>
            </div>
          </div>

          <p className="mt-6 flex items-center gap-1.5 text-sm text-neutral-300">
            <MapPin className="h-4 w-4 text-neutral-500" />
            {event.venue}, {event.location}
          </p>

          <p className="mt-5 leading-relaxed text-neutral-400">{event.longDescription}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => toggleFavorite(event.id)}
              className="flex items-center gap-2 rounded-sm border border-white/15 px-4 py-2.5 text-sm font-medium text-neutral-200 hover:border-white/30"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-lime-300 text-lime-300" : ""}`} />
              {isFavorite ? "Saved" : "Save"}
            </button>
            <button
              onClick={onShare}
              className="flex items-center gap-2 rounded-sm border border-white/15 px-4 py-2.5 text-sm font-medium text-neutral-200 hover:border-white/30"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        <div className="h-fit rounded-md border border-white/15 bg-neutral-900/60 p-5 lg:sticky lg:top-4">
          <p className="text-[11px] uppercase tracking-wider text-neutral-500">From</p>
          <p className="mt-1 text-2xl font-semibold text-neutral-50">
            {formatPrice(event.price)}
          </p>
          <p className="mt-1 text-xs text-neutral-500">per ticket</p>
          <button
            onClick={goToTickets}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm bg-lime-300 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-lime-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
          >
            <Ticket className="h-4 w-4" />
            Get Tickets
          </button>
        </div>
      </div>
    </>
  );
}
