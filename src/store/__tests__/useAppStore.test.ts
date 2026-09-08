import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAppStore } from "../useAppStore";

// Reset the store to its initial values before every test so state doesn't
// leak between tests (Zustand stores are module-level singletons).
function resetStore() {
  useAppStore.setState({
    favoriteIds: [],
    recentlyViewed: [],
    cartDraft: {},
    isSignedIn: false,
    mobileMenuOpen: false,
    searchOverlayOpen: false,
    filterSheetOpen: false,
    favoritesPanelOpen: false,
    activeEventId: null,
    modalStep: "closed",
    selectedTickets: {},
    checkoutForm: { name: "", email: "" },
    checkoutErrors: {},
    checkoutStatus: "idle",
    orderRef: "",
    toasts: [],
  });
}

beforeEach(() => {
  resetStore();
});

describe("toggleFavorite", () => {
  it("adds an id when not favorited, removes it when favorited", () => {
    useAppStore.getState().toggleFavorite(1);
    expect(useAppStore.getState().favoriteIds).toEqual([1]);

    useAppStore.getState().toggleFavorite(1);
    expect(useAppStore.getState().favoriteIds).toEqual([]);
  });

  it("surfaces a toast on toggle", () => {
    useAppStore.getState().toggleFavorite(5);
    const toasts = useAppStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe("Added to favorites");
  });
});

describe("openEvent", () => {
  it("sets the active event and modal step, and restores a saved cart draft", () => {
    useAppStore.getState().setCartDraftFor(7, { standard: 2 });
    useAppStore.getState().openEvent(7);

    const s = useAppStore.getState();
    expect(s.activeEventId).toBe(7);
    expect(s.modalStep).toBe("detail");
    expect(s.selectedTickets).toEqual({ standard: 2 });
  });

  it("resets the checkout form and closes the favorites panel", () => {
    useAppStore.setState({
      favoritesPanelOpen: true,
      checkoutForm: { name: "Stale Name", email: "stale@example.com" },
    });
    useAppStore.getState().openEvent(3);

    const s = useAppStore.getState();
    expect(s.favoritesPanelOpen).toBe(false);
    expect(s.checkoutForm).toEqual({ name: "", email: "" });
  });
});

describe("updateTicketQty", () => {
  it("clamps quantity between 0 and the available max", () => {
    useAppStore.getState().openEvent(1);
    useAppStore.getState().updateTicketQty("standard", -1, 10); // can't go below 0
    expect(useAppStore.getState().selectedTickets.standard).toBe(0);

    useAppStore.getState().updateTicketQty("standard", 1, 2);
    useAppStore.getState().updateTicketQty("standard", 1, 2);
    useAppStore.getState().updateTicketQty("standard", 1, 2); // should clamp at 2
    expect(useAppStore.getState().selectedTickets.standard).toBe(2);
  });

  it("persists the updated selection into the cart draft for the active event", () => {
    useAppStore.getState().openEvent(9);
    useAppStore.getState().updateTicketQty("vip", 1, 5);
    expect(useAppStore.getState().cartDraft[9]).toEqual({ vip: 1 });
  });
});

describe("submitOrder", () => {
  it("rejects an invalid form without entering the loading state", () => {
    useAppStore.getState().openEvent(1);
    useAppStore.getState().submitOrder();

    const s = useAppStore.getState();
    expect(s.checkoutErrors.name).toBeTruthy();
    expect(s.checkoutErrors.email).toBeTruthy();
    expect(s.checkoutStatus).toBe("idle");
  });

  it("accepts a valid form and eventually reaches confirmation", async () => {
    vi.useFakeTimers();
    useAppStore.getState().openEvent(4);
    useAppStore.getState().setCheckoutForm(() => ({
      name: "Jordan Lee",
      email: "jordan@example.com",
    }));
    useAppStore.getState().updateTicketQty("standard", 1, 5);

    useAppStore.getState().submitOrder();
    expect(useAppStore.getState().checkoutStatus).toBe("loading");

    await vi.advanceTimersByTimeAsync(1300);
    expect(useAppStore.getState().checkoutStatus).toBe("success");
    expect(useAppStore.getState().orderRef).toMatch(/^VYNORA-/);
    // the cart draft for this event should be cleared once the order lands
    expect(useAppStore.getState().cartDraft[4]).toBeUndefined();

    await vi.advanceTimersByTimeAsync(400);
    expect(useAppStore.getState().modalStep).toBe("confirmation");

    vi.useRealTimers();
  });
});
