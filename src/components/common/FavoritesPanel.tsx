import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import type { EventItem } from "../../types";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useAppStore } from "../../store/useAppStore";
import { EventCard } from "../events/EventCard";
import { EmptyState } from "../ui/EmptyState";

export function FavoritesPanel({ favoriteEvents }: { favoriteEvents: EventItem[] }) {
  const open = useAppStore((s) => s.favoritesPanelOpen);
  const setFavoritesPanelOpen = useAppStore((s) => s.setFavoritesPanelOpen);
  const onClose = () => setFavoritesPanelOpen(false);
  const containerRef = useFocusTrap<HTMLDivElement>(open);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Favorites"
            ref={containerRef}
            tabIndex={-1}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/10 bg-neutral-950 focus:outline-none"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-50">
                <Heart className="h-4 w-4 fill-lime-300 text-lime-300" />
                Favorites ({favoriteEvents.length})
              </h2>
              <button
                aria-label="Close favorites"
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {favoriteEvents.length === 0 ? (
                <EmptyState
                  icon={Heart}
                  title="No saved events yet."
                  message="Tap the heart on any event to save it here for later."
                />
              ) : (
                <div className="flex flex-col">
                  {favoriteEvents.map((e) => (
                    <EventCard key={e.id} event={e} variant="row" />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
