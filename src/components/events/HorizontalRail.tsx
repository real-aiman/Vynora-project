import type { EventItem } from "../../types";
import { EventCard } from "./EventCard";

export function HorizontalRail({ items }: { items: EventItem[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
      {items.map((e) => (
        <div key={e.id} className="w-56 shrink-0">
          <EventCard event={e} variant="compact" />
        </div>
      ))}
    </div>
  );
}
