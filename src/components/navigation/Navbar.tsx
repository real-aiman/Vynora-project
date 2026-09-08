import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, User } from "lucide-react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useAppStore } from "../../store/useAppStore";

export function Navbar({
  scrolled,
  onNavigate,
}: {
  scrolled: boolean;
  onNavigate: (id: string) => void;
}) {
  const favoritesCount = useAppStore((s) => s.favoriteIds.length);
  const isSignedIn = useAppStore((s) => s.isSignedIn);
  const toggleSignIn = useAppStore((s) => s.toggleSignIn);
  const setFavoritesPanelOpen = useAppStore((s) => s.setFavoritesPanelOpen);
  const setSearchOverlayOpen = useAppStore((s) => s.setSearchOverlayOpen);
  const setMobileMenuOpen = useAppStore((s) => s.setMobileMenuOpen);

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useFocusTrap<HTMLDivElement>(profileOpen);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && profileOpen) setProfileOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [profileOpen]);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled
          ? "border-white/10 bg-neutral-950/90 backdrop-blur-md"
          : "border-transparent bg-neutral-950/40 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate("top")}
          className="flex items-center gap-1.5 text-lg font-bold tracking-tight text-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
        >
          VYNORA
          <span className="mb-3 h-1.5 w-1.5 rounded-full bg-lime-300" />
        </button>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          <button
            onClick={() => onNavigate("explore")}
            className="text-sm font-medium text-neutral-300 transition hover:text-neutral-50"
          >
            Discover
          </button>
          <button
            onClick={() => onNavigate("explore")}
            className="text-sm font-medium text-neutral-300 transition hover:text-neutral-50"
          >
            Events
          </button>
          <button
            onClick={() => onNavigate("map")}
            className="text-sm font-medium text-neutral-300 transition hover:text-neutral-50"
          >
            Venues
          </button>
          <button
            onClick={() => onNavigate("calendar")}
            className="text-sm font-medium text-neutral-300 transition hover:text-neutral-50"
          >
            Calendar
          </button>
        </nav>

        <div className="flex items-center gap-1">
          <button
            aria-label="Search events"
            onClick={() => setSearchOverlayOpen(true)}
            className="hidden h-9 w-9 items-center justify-center rounded-sm text-neutral-300 transition hover:bg-white/5 hover:text-neutral-50 sm:flex"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
          <button
            aria-label={`Favorites, ${favoritesCount} saved`}
            onClick={() => setFavoritesPanelOpen(true)}
            className="relative hidden h-9 w-9 items-center justify-center rounded-sm text-neutral-300 transition hover:bg-white/5 hover:text-neutral-50 sm:flex"
          >
            <Heart className="h-[18px] w-[18px]" />
            {favoritesCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-lime-300 text-[9px] font-bold text-neutral-950">
                {favoritesCount}
              </span>
            )}
          </button>
          <div ref={profileRef} className="relative hidden sm:block">
            <button
              aria-label="Profile"
              aria-haspopup="true"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-sm text-neutral-300 transition hover:bg-white/5 hover:text-neutral-50"
            >
              <User className="h-[18px] w-[18px]" />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  role="menu"
                  ref={dropdownRef}
                  tabIndex={-1}
                  className="absolute right-0 top-full mt-2 w-56 rounded-md border border-white/10 bg-neutral-900 p-2 shadow-xl shadow-black/40 focus:outline-none"
                >
                  {isSignedIn ? (
                    <>
                      <p className="px-2 pt-1 text-[11px] uppercase tracking-wider text-neutral-500">
                        Signed in as
                      </p>
                      <p className="px-2 pb-2 pt-0.5 text-sm font-medium text-neutral-100">
                        Guest
                      </p>
                      <button
                        role="menuitem"
                        onClick={() => {
                          toggleSignIn();
                          setProfileOpen(false);
                        }}
                        className="w-full rounded-sm px-2 py-2 text-left text-sm text-neutral-300 transition hover:bg-white/5"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="px-2 pb-2 pt-1 text-xs text-neutral-500">
                        You’re browsing as a guest.
                      </p>
                      <button
                        role="menuitem"
                        onClick={() => {
                          toggleSignIn();
                          setProfileOpen(false);
                        }}
                        className="w-full rounded-sm bg-lime-300 px-2 py-2 text-left text-sm font-semibold text-neutral-950 transition hover:bg-lime-200"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            aria-label="Search events"
            onClick={() => setSearchOverlayOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-sm text-neutral-300 sm:hidden"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
          <button
            aria-label={`Favorites, ${favoritesCount} saved`}
            onClick={() => setFavoritesPanelOpen(true)}
            className="relative flex h-9 w-9 items-center justify-center rounded-sm text-neutral-300 sm:hidden"
          >
            <Heart className="h-[18px] w-[18px]" />
            {favoritesCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-lime-300 text-[9px] font-bold text-neutral-950">
                {favoritesCount}
              </span>
            )}
          </button>
          <button
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-sm text-neutral-300 md:hidden"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
