import type { EventItem, Filters, SortOption } from "../types";
import { daysFromToday } from "./date";

export function matchesQuery(event: EventItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    event.title.toLowerCase().includes(q) ||
    event.venue.toLowerCase().includes(q) ||
    event.city.toLowerCase().includes(q) ||
    event.category.toLowerCase().includes(q) ||
    (event.artist ? event.artist.toLowerCase().includes(q) : false) ||
    event.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function applyFilters(
  events: EventItem[],
  query: string,
  filters: Filters
): EventItem[] {
  return events.filter((e) => {
    if (!matchesQuery(e, query)) return false;
    if (filters.categories.length > 0 && !filters.categories.includes(e.category))
      return false;
    if (filters.city !== "All" && e.city !== filters.city) return false;
    if (e.price > filters.maxPrice) return false;
    if (filters.featuredOnly && !e.featured) return false;
    if (filters.dateFilter !== "any") {
      const diff = daysFromToday(e.date);
      if (filters.dateFilter === "today" && diff !== 0) return false;
      if (filters.dateFilter === "week" && (diff < 0 || diff > 7)) return false;
      if (filters.dateFilter === "month" && (diff < 0 || diff > 30)) return false;
    }
    return true;
  });
}

export function sortEvents(events: EventItem[], sort: SortOption): EventItem[] {
  const copy = [...events];
  switch (sort) {
    case "soonest":
      return copy.sort((a, b) => a.date.localeCompare(b.date));
    case "price-low":
      return copy.sort((a, b) => a.price - b.price);
    case "price-high":
      return copy.sort((a, b) => b.price - a.price);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "recommended":
    default:
      return copy.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return b.rating - a.rating;
      });
  }
}
