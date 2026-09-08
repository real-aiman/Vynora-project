import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import type { EventItem } from "../../types";
import { formatDate } from "../../utils/date";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useAppStore } from "../../store/useAppStore";

export function SearchOverlay({
  query,
  setQuery,
  results,
}: {
  query: string;
  setQuery: (v: string) => void;
  results: EventItem[];
}) {
  const open = useAppStore((s) => s.searchOverlayOpen);
  const setSearchOverlayOpen = useAppStore((s) => s.setSearchOverlayOpen);
  const openEvent = useAppStore((s) => s.openEvent);
  const onClose = () => setSearchOverlayOpen(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useFocusTrap<HTMLDivElement>(open);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Search events"
            ref={containerRef}
            tabIndex={-1}
            className="fixed inset-x-0 top-0 z-[70] px-4 pt-6 focus:outline-none sm:pt-20"
          >
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center gap-2 rounded-md border border-white/15 bg-neutral-900 p-2.5 shadow-2xl shadow-black/50">
                <Search className="ml-1.5 h-4 w-4 shrink-0 text-neutral-500" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search events, artists, venues..."
                  aria-label="Search events, artists, or venues"
                  className="w-full bg-transparent py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
                />
                <button
                  aria-label="Close search"
                  onClick={onClose}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-neutral-400 hover:bg-white/5 hover:text-neutral-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 max-h-[65vh] overflow-y-auto rounded-md border border-white/10 bg-neutral-900 shadow-2xl shadow-black/50">
                {!query.trim() ? (
                  <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
                    <Search className="h-5 w-5 text-neutral-600" />
                    <p className="text-sm text-neutral-500">
                      Start typing to search events, artists, or venues.
                    </p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
                    <Search className="h-5 w-5 text-neutral-600" />
                    <p className="text-sm font-medium text-neutral-300">
                      No matching events.
                    </p>
                    <p className="text-xs text-neutral-500">
                      Try a different name, city, or category.
                    </p>
                  </div>
                ) : (
                  <ul>
                    {results.slice(0, 8).map((e) => (
                      <li key={e.id} className="border-b border-white/5 last:border-b-0">
                        <button
                          onClick={() => {
                            openEvent(e.id);
                            onClose();
                          }}
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
