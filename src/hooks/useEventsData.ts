import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { EventItem } from "../types";
import { EVENTS } from "../data/events";

/**
 * There is no backend (VYNORA is frontend-only by design), so this simulates
 * a network fetch for the mock catalog: a real delay and a genuine ~12%
 * random failure chance on the *first* attempt only (a manual retry always
 * succeeds, so the demo is recoverable) — the loading and error UI states
 * are exercised rather than always resolving instantly.
 *
 * Using TanStack Query here (rather than hand-rolled loading/error state)
 * gets real caching, deduping, and retry semantics for free — the query
 * result is cached under ["events"], so remounting a component that reads
 * it doesn't refetch, and the "Try Again" button below simply calls
 * `refetch()` instead of re-implementing retry logic.
 */
function fetchEventsSimulated(isFirstAttempt: boolean): Promise<EventItem[]> {
  const shouldFail = isFirstAttempt && Math.random() < 0.12;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Network request failed"));
      } else {
        resolve(EVENTS);
      }
    }, 1000);
  });
}

export function useEventsData() {
  const attempted = useRef(false);

  const query = useQuery({
    queryKey: ["events"],
    queryFn: () => {
      const isFirstAttempt = !attempted.current;
      attempted.current = true;
      return fetchEventsSimulated(isFirstAttempt);
    },
    retry: false, // retries are user-initiated via the "Try Again" button, not silent
    staleTime: Infinity, // static mock data — never goes stale within a session
  });

  return {
    events: query.data ?? [],
    loading: query.isLoading,
    error: query.isError,
    retry: () => query.refetch(),
  };
}
