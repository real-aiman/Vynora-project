import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps keyboard focus inside a container while `active` is true: moves
 * focus into the container on activation, cycles Tab/Shift+Tab between its
 * focusable elements (so focus can't escape to the page behind an open
 * modal), and restores focus to whatever was focused before activation
 * once it deactivates. Used by every overlay (event modal, favorites
 * drawer, filter sheet, mobile menu, search) instead of each one
 * reimplementing this by hand.
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const containerRef = useRef<T>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    if (!container) return;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    const initial = focusables()[0];
    // Give the entrance animation a tick before stealing focus, so screen
    // readers announce the dialog rather than fighting a mid-transition
    // element for attention.
    const focusTimer = setTimeout(() => {
      (initial ?? container).focus();
    }, 50);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const elements = focusables();
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];
      const current = document.activeElement;

      if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    }

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      container.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [active]);

  return containerRef;
}
