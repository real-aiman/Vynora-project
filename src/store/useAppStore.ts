import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartDraft, CheckoutErrors, CheckoutForm, ModalStep, TicketSelection, ToastMessage } from "../types";
import { generateOrderRef, isValidEmail } from "../utils/format";

let toastCounter = 0;

interface AppState {
  // favorites — persisted
  favoriteIds: number[];
  toggleFavorite: (id: number) => void;

  // recently viewed — persisted
  recentlyViewed: number[];
  addRecentlyViewed: (id: number) => void;
  clearRecentlyViewed: () => void;

  // per-event ticket selections — persisted lightweight cart draft
  cartDraft: CartDraft;
  setCartDraftFor: (eventId: number, selection: TicketSelection) => void;
  clearCartDraftFor: (eventId: number) => void;

  // sign-in (demo only — no backend) — persisted
  isSignedIn: boolean;
  toggleSignIn: () => void;

  // overlay/UI state — NOT persisted
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  searchOverlayOpen: boolean;
  setSearchOverlayOpen: (v: boolean) => void;
  filterSheetOpen: boolean;
  setFilterSheetOpen: (v: boolean) => void;
  favoritesPanelOpen: boolean;
  setFavoritesPanelOpen: (v: boolean) => void;

  // modal navigation + checkout flow — NOT persisted (a stale in-progress
  // checkout resurfacing after a reload would be confusing). Centralizing
  // this here — rather than in App-local state — means any component
  // (e.g. an EventCard three levels deep in the favorites drawer) can open
  // an event and get fully-reset ticket/checkout state, with no risk of
  // bypassing that reset by calling a different "open" path.
  activeEventId: number | null;
  modalStep: ModalStep;
  selectedTickets: TicketSelection;
  checkoutForm: CheckoutForm;
  checkoutErrors: CheckoutErrors;
  checkoutStatus: "idle" | "loading" | "success";
  orderRef: string;

  openEvent: (id: number) => void;
  closeModal: () => void;
  goToTickets: () => void;
  goToCheckout: () => void;
  backToDetail: () => void;
  backToTickets: () => void;
  updateTicketQty: (tierId: string, delta: number, max: number) => void;
  setCheckoutForm: (updater: (form: CheckoutForm) => CheckoutForm) => void;
  submitOrder: () => void;
  backToDiscover: () => void;

  // toasts — NOT persisted (ephemeral by nature)
  toasts: ToastMessage[];
  addToast: (message: string, tone?: ToastMessage["tone"]) => void;
  dismissToast: (id: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (id) => {
        const exists = get().favoriteIds.includes(id);
        set({
          favoriteIds: exists
            ? get().favoriteIds.filter((x) => x !== id)
            : [...get().favoriteIds, id],
        });
        get().addToast(
          exists ? "Removed from favorites" : "Added to favorites",
          exists ? "info" : "success"
        );
      },

      recentlyViewed: [],
      addRecentlyViewed: (id) =>
        set({
          recentlyViewed: [id, ...get().recentlyViewed.filter((x) => x !== id)].slice(0, 8),
        }),
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),

      cartDraft: {},
      setCartDraftFor: (eventId, selection) =>
        set({ cartDraft: { ...get().cartDraft, [eventId]: selection } }),
      clearCartDraftFor: (eventId) => {
        const next = { ...get().cartDraft };
        delete next[eventId];
        set({ cartDraft: next });
      },

      isSignedIn: false,
      toggleSignIn: () => {
        const next = !get().isSignedIn;
        set({ isSignedIn: next });
        get().addToast(next ? "Signed in as Guest" : "Signed out", next ? "success" : "info");
      },

      mobileMenuOpen: false,
      setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
      searchOverlayOpen: false,
      setSearchOverlayOpen: (v) => set({ searchOverlayOpen: v }),
      filterSheetOpen: false,
      setFilterSheetOpen: (v) => set({ filterSheetOpen: v }),
      favoritesPanelOpen: false,
      setFavoritesPanelOpen: (v) => set({ favoritesPanelOpen: v }),

      activeEventId: null,
      modalStep: "closed",
      selectedTickets: {},
      checkoutForm: { name: "", email: "" },
      checkoutErrors: {},
      checkoutStatus: "idle",
      orderRef: "",

      openEvent: (id) => {
        set({
          activeEventId: id,
          modalStep: "detail",
          selectedTickets: get().cartDraft[id] || {},
          checkoutForm: { name: "", email: "" },
          checkoutErrors: {},
          checkoutStatus: "idle",
          favoritesPanelOpen: false,
        });
        get().addRecentlyViewed(id);
        get().addToast("Event opened", "info");
        window.history.replaceState(null, "", `#event/${id}`);
      },
      closeModal: () => {
        set({ modalStep: "closed", activeEventId: null });
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      },
      goToTickets: () => set({ modalStep: "tickets" }),
      goToCheckout: () => set({ modalStep: "checkout" }),
      backToDetail: () => set({ modalStep: "detail" }),
      backToTickets: () => set({ modalStep: "tickets" }),

      updateTicketQty: (tierId, delta, max) => {
        const current = get().selectedTickets[tierId] || 0;
        const next = Math.max(0, Math.min(max, current + delta));
        const updated = { ...get().selectedTickets, [tierId]: next };
        set({ selectedTickets: updated });
        const id = get().activeEventId;
        if (id !== null) get().setCartDraftFor(id, updated);
      },

      setCheckoutForm: (updater) => set({ checkoutForm: updater(get().checkoutForm) }),

      submitOrder: () => {
        const { checkoutForm } = get();
        const errs: CheckoutErrors = {};
        if (checkoutForm.name.trim().length < 2) errs.name = "Enter your full name.";
        if (!isValidEmail(checkoutForm.email)) errs.email = "Enter a valid email address.";
        set({ checkoutErrors: errs });
        if (Object.keys(errs).length > 0) return;

        set({ checkoutStatus: "loading" });
        setTimeout(() => {
          set({ checkoutStatus: "success", orderRef: generateOrderRef() });
          get().addToast("Checkout completed", "success");
          const id = get().activeEventId;
          if (id !== null) get().clearCartDraftFor(id);
          setTimeout(() => set({ modalStep: "confirmation" }), 400);
        }, 1300);
      },

      backToDiscover: () => {
        get().closeModal();
        set({
          selectedTickets: {},
          checkoutForm: { name: "", email: "" },
          checkoutStatus: "idle",
        });
      },

      toasts: [],
      addToast: (message, tone = "info") => {
        toastCounter += 1;
        const id = toastCounter;
        set({ toasts: [...get().toasts, { id, message, tone }] });
        setTimeout(() => {
          set({ toasts: get().toasts.filter((t) => t.id !== id) });
        }, 3000);
      },
      dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
    }),
    {
      name: "vynora:store",
      partialize: (state) => ({
        favoriteIds: state.favoriteIds,
        recentlyViewed: state.recentlyViewed,
        cartDraft: state.cartDraft,
        isSignedIn: state.isSignedIn,
      }),
    }
  )
);
