import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { EventItem } from "../types";
import { formatDate } from "../utils/date";
import { formatPrice } from "../utils/format";
import { useAppStore } from "../store/useAppStore";

export function ConfirmationView({
  event,
  total,
}: {
  event: EventItem;
  total: number;
}) {
  const email = useAppStore((s) => s.checkoutForm.email);
  const orderRef = useAppStore((s) => s.orderRef);
  const selectedTickets = useAppStore((s) => s.selectedTickets);
  const backToDiscover = useAppStore((s) => s.backToDiscover);

  const totalQty = Object.values(selectedTickets).reduce((a, b) => a + b, 0);

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-16 text-center sm:px-8">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-lime-300/10"
      >
        <CheckCircle2 className="h-9 w-9 text-lime-300" />
      </motion.div>
      <h2 className="mt-6 text-3xl font-semibold text-neutral-50">You’re all set.</h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-500">
        A confirmation with your tickets has been sent to {email}.
      </p>

      <div className="mt-8 w-full max-w-sm rounded-md border border-white/10 bg-neutral-900/50 p-5 text-left">
        <div className="flex gap-3 border-b border-white/10 pb-4">
          <img src={event.image} alt="" className="h-14 w-14 rounded-sm object-cover" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-neutral-100">{event.title}</p>
            <p className="text-xs text-neutral-500">
              {formatDate(event.date)} &middot; {event.venue}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-4 text-sm">
          <div className="flex justify-between text-neutral-400">
            <span>Tickets</span>
            <span className="text-neutral-200">{totalQty}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Order reference</span>
            <span className="font-mono text-neutral-200">{orderRef}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Total paid</span>
            <span className="font-semibold text-neutral-100">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={backToDiscover}
        className="mt-8 rounded-sm bg-lime-300 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-lime-200"
      >
        Back to Discover
      </button>
    </div>
  );
}
