import { Globe, Rss, Send } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="flex items-center gap-1.5 text-lg font-bold text-neutral-50">
              VYNORA
              <span className="mb-2.5 h-1.5 w-1.5 rounded-full bg-lime-300" />
            </span>
            <p className="mt-3 max-w-[220px] text-sm text-neutral-500">
              Discover what’s worth going out for.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                aria-label="VYNORA on Instagram"
                className="text-neutral-500 hover:text-neutral-200"
              >
                <Globe className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="VYNORA on Twitter"
                className="text-neutral-500 hover:text-neutral-200"
              >
                <Send className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="VYNORA on Facebook"
                className="text-neutral-500 hover:text-neutral-200"
              >
                <Rss className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Product
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-neutral-500">
              <li>
                <a href="#top" className="hover:text-neutral-200">
                  Discover
                </a>
              </li>
              <li>
                <a href="#explore" className="hover:text-neutral-200">
                  Events
                </a>
              </li>
              <li>
                <a href="#map" className="hover:text-neutral-200">
                  Venues
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Support
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-neutral-500">
              <li>
                <button type="button" className="hover:text-neutral-200">
                  Help Center
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-neutral-200">
                  Contact
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-neutral-200">
                  Refund Policy
                </button>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Legal
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-neutral-500">
              <li>
                <button type="button" className="hover:text-neutral-200">
                  Terms
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-neutral-200">
                  Privacy
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {year} VYNORA. All rights reserved.</span>
          <span>A fictional product built for demonstration purposes.</span>
        </div>
      </div>
    </footer>
  );
}
