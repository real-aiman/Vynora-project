import { ArrowLeft, ArrowRight, Minus, Plus } from "lucide-react";
import type { EventItem, TicketTier } from "../types";
import { formatPrice } from "../utils/format";
import { useAppStore } from "../store/useAppStore";

export function TicketSelector({
  event,
  tiers,
  subtotal,
}: {
  event: EventItem;
  tiers: TicketTier[];
  subtotal: number;
}) {
  const selectedTickets = useAppStore((s) => s.selectedTickets);
  const updateTicketQty = useAppStore((s) => s.updateTicketQty);
  const backToDetail = useAppStore((s) => s.backToDetail);
  const goToCheckout = useAppStore((s) => s.goToCheckout);

  const totalQty = Object.values(selectedTickets).reduce((a, b) => a + b, 0);

  return (
    <div className="p-6 sm:p-8">
      <button
        onClick={backToDetail}
        className="mb-6 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to event
      </button>
      <h2 className="text-2xl font-semibold text-neutral-50">Select tickets</h2>
      <p className="mt-1 text-sm text-neutral-500">{event.title}</p>

      <div className="mt-6 flex flex-col gap-4">
        {tiers.map((tier) => {
          const qty = selectedTickets[tier.id] || 0;
          return (
            <div
              key={tier.id}
              className={`flex items-center justify-between gap-4 rounded-md border p-4 transition ${
                qty > 0 ? "border-lime-300/50 bg-lime-300/5" : "border-white/10"
              }`}
            >
              <div className="min-w-0">
                <p className="font-semibold text-neutral-100">{tier.name}</p>
                <p className="mt-0.5 text-sm text-neutral-500">{tier.description}</p>
                <p className="mt-1.5 text-sm font-medium text-neutral-200">
                  {formatPrice(tier.price)}
                </p>
                <p className="mt-0.5 text-xs text-neutral-600">{tier.available} left</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  aria-label={`Decrease ${tier.name} quantity`}
                  onClick={() => updateTicketQty(tier.id, -1, tier.available)}
                  disabled={qty === 0}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-neutral-300 transition hover:border-white/30 disabled:opacity-30"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-4 text-center text-sm font-medium text-neutral-100">
                  {qty}
                </span>
                <button
                  aria-label={`Increase ${tier.name} quantity`}
                  onClick={() => updateTicketQty(tier.id, 1, tier.available)}
                  disabled={qty >= tier.available}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-neutral-300 transition hover:border-white/30 disabled:opacity-30"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-neutral-500">Subtotal</p>
          <p className="text-xl font-semibold text-neutral-50">{formatPrice(subtotal)}</p>
        </div>
        <button
          onClick={goToCheckout}
          disabled={totalQty === 0}
          className="flex items-center gap-2 rounded-sm bg-lime-300 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue to Checkout
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
