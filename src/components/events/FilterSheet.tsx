import type { Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Filters, SortOption } from "../../types";
import { DEFAULT_FILTERS } from "../../constants/filters";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useAppStore } from "../../store/useAppStore";
import { FilterPanelContent } from "./FilterPanelContent";

export function FilterSheet({
  filters,
  setFilters,
  sort,
  setSort,
  resultCount,
}: {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  sort: SortOption;
  setSort: (s: SortOption) => void;
  resultCount: number;
}) {
  const open = useAppStore((s) => s.filterSheetOpen);
  const setFilterSheetOpen = useAppStore((s) => s.setFilterSheetOpen);
  const onClose = () => setFilterSheetOpen(false);
  const containerRef = useFocusTrap<HTMLDivElement>(open);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 md:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            ref={containerRef}
            tabIndex={-1}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-lg border-t border-white/10 bg-neutral-950 p-5 focus:outline-none md:hidden"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-50">Filters</h2>
              <button
                aria-label="Close filters"
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterPanelContent
              filters={filters}
              setFilters={setFilters}
              sort={sort}
              setSort={setSort}
            />
            <div className="mt-6 flex gap-3 pb-2">
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="flex-1 rounded-sm border border-white/15 py-3 text-sm font-medium text-neutral-300 hover:border-white/30"
              >
                Reset
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-sm bg-lime-300 py-3 text-sm font-semibold text-neutral-950 hover:bg-lime-200"
              >
                Show {resultCount} events
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
