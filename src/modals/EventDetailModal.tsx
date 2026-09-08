import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { EventItem } from "../types";
import { getTicketTiers } from "../utils/tickets";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useAppStore } from "../store/useAppStore";
import { EventDetailView } from "./EventDetailView";
import { TicketSelector } from "./TicketSelector";
import { CheckoutStep } from "./CheckoutStep";
import { ConfirmationView } from "./ConfirmationView";

export function EventDetailModal({
  event,
  onShare,
}: {
  event: EventItem | null;
  onShare: () => void;
}) {
  const step = useAppStore((s) => s.modalStep);
  const closeModal = useAppStore((s) => s.closeModal);
  const selectedTickets = useAppStore((s) => s.selectedTickets);

  const containerRef = useFocusTrap<HTMLDivElement>(step !== "closed" && Boolean(event));

  if (!event || step === "closed") return null;

  const tiers = getTicketTiers(event.price);
  const subtotal = tiers.reduce((sum, t) => sum + t.price * (selectedTickets[t.id] || 0), 0);
  const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.08 * 100) / 100 : 0;
  const total = subtotal + serviceFee;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={event.title}
      className="fixed inset-0 z-[60] flex items-stretch justify-end bg-black/70 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        ref={containerRef}
        tabIndex={-1}
        className="relative flex h-full w-full flex-col overflow-hidden bg-neutral-950 focus:outline-none sm:h-[90vh] sm:max-w-4xl sm:rounded-md sm:border sm:border-white/10"
      >
        <button
          aria-label="Close"
          onClick={closeModal}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === "detail" && (
              <motion.div
                key="detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <EventDetailView event={event} onShare={onShare} />
              </motion.div>
            )}

            {step === "tickets" && (
              <motion.div
                key="tickets"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
              >
                <TicketSelector event={event} tiers={tiers} subtotal={subtotal} />
              </motion.div>
            )}

            {step === "checkout" && (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
              >
                <CheckoutStep
                  event={event}
                  tiers={tiers}
                  subtotal={subtotal}
                  serviceFee={serviceFee}
                  total={total}
                />
              </motion.div>
            )}

            {step === "confirmation" && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <ConfirmationView event={event} total={total} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
