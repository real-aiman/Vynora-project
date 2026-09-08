import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useAppStore } from "../../store/useAppStore";

export function MobileMenu({ onNavigate }: { onNavigate: (id: string) => void }) {
  const open = useAppStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useAppStore((s) => s.setMobileMenuOpen);
  const favoritesCount = useAppStore((s) => s.favoriteIds.length);
  const isSignedIn = useAppStore((s) => s.isSignedIn);
  const toggleSignIn = useAppStore((s) => s.toggleSignIn);
  const setFavoritesPanelOpen = useAppStore((s) => s.setFavoritesPanelOpen);

  const onClose = () => setMobileMenuOpen(false);
  const containerRef = useFocusTrap<HTMLDivElement>(open);

  const links = [
    { label: "Discover", id: "top" },
    { label: "Events", id: "explore" },
    { label: "Venues", id: "map" },
    { label: "Calendar", id: "calendar" },
  ];
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
            transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            ref={containerRef}
            tabIndex={-1}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-neutral-950 p-6 focus:outline-none"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="text-lg font-bold text-neutral-50">VYNORA</span>
              <button
                aria-label="Close menu"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center text-neutral-400 hover:text-neutral-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1" aria-label="Mobile primary">
              {links.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    onNavigate(l.id);
                    onClose();
                  }}
                  className="rounded-sm px-3 py-3 text-left text-lg font-medium text-neutral-200 hover:bg-white/5"
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setFavoritesPanelOpen(true);
                  onClose();
                }}
                className="flex items-center justify-between rounded-sm px-3 py-3 text-left text-lg font-medium text-neutral-200 hover:bg-white/5"
              >
                Favorites
                {favoritesCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lime-300 text-[10px] font-bold text-neutral-950">
                    {favoritesCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  toggleSignIn();
                  onClose();
                }}
                className="flex items-center justify-between rounded-sm px-3 py-3 text-left text-lg font-medium text-neutral-200 hover:bg-white/5"
              >
                {isSignedIn ? "Sign out" : "Sign in"}
              </button>
            </nav>
            <div className="mt-auto text-xs text-neutral-600">
              VYNORA &middot; Discover what’s on
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
