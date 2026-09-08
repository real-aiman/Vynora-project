import { Search } from "lucide-react";
import type { EventItem } from "../../types";
import { formatDate } from "../../utils/date";

export function SearchResultsDropdown({
  query,
  results,
  onOpen,
}: {
  query: string;
  results: EventItem[];
  onOpen: (id: number) => void;
}) {
  if (!query.trim()) return null;
  return (
    <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-96 overflow-y-auto rounded-md border border-white/10 bg-neutral-900 shadow-2xl shadow-black/50">
      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
          <Search className="h-5 w-5 text-neutral-600" />
          <p className="text-sm font-medium text-neutral-300">No matching events.</p>
          <p className="text-xs text-neutral-500">
            Try a different name, city, or category.
          </p>
        </div>
      ) : (
        <ul>
          {results.slice(0, 6).map((e) => (
            <li key={e.id} className="border-b border-white/5 last:border-b-0">
              <button
                onClick={() => onOpen(e.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5"
              >
                <img
                  src={e.image}
                  alt=""
                  loading="lazy"
                  className="h-12 w-12 shrink-0 rounded-sm object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-100">
                    {e.title}
                  </p>
                  <p className="truncate text-xs text-neutral-500">
                    {e.category} &middot; {e.city} &middot; {formatDate(e.date)}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
