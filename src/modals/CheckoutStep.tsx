import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { EventItem, TicketTier } from "../types";
import { formatDate } from "../utils/date";
import {
  formatCardNumberInput,
  formatCvcInput,
  formatExpiryInput,
  formatPrice,
} from "../utils/format";
import { useAppStore } from "../store/useAppStore";

export function CheckoutStep({
  event,
  tiers,
  subtotal,
  serviceFee,
  total,
}: {
  event: EventItem;
  tiers: TicketTier[];
  subtotal: number;
  serviceFee: number;
  total: number;
}) {
  const selectedTickets = useAppStore((s) => s.selectedTickets);
  const checkoutForm = useAppStore((s) => s.checkoutForm);
  const setCheckoutForm = useAppStore((s) => s.setCheckoutForm);
  const checkoutErrors = useAppStore((s) => s.checkoutErrors);
  const checkoutStatus = useAppStore((s) => s.checkoutStatus);
  const backToTickets = useAppStore((s) => s.backToTickets);
  const submitOrder = useAppStore((s) => s.submitOrder);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  return (
    <div className="p-6 sm:p-8">
      <button
        onClick={backToTickets}
        disabled={checkoutStatus === "loading"}
        className="mb-6 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100 disabled:opacity-40"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to tickets
      </button>
      <h2 className="text-2xl font-semibold text-neutral-50">Checkout</h2>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitOrder();
          }}
          noValidate
          className="flex flex-col gap-5"
        >
          <div>
            <label
              htmlFor="checkout-name"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-500"
            >
              Full name
            </label>
            <input
              id="checkout-name"
              type="text"
              value={checkoutForm.name}
              onChange={(e) => setCheckoutForm((f) => ({ ...f, name: e.target.value }))}
              aria-invalid={Boolean(checkoutErrors.name)}
              aria-describedby={checkoutErrors.name ? "name-error" : undefined}
              className={`w-full rounded-sm border bg-neutral-900 px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:ring-1 ${
                checkoutErrors.name
                  ? "border-red-400 focus:ring-red-400"
                  : "border-white/15 focus:ring-lime-300"
              }`}
              placeholder="Jordan Lee"
            />
            {checkoutErrors.name && (
              <p id="name-error" className="mt-1.5 text-xs text-red-400">
                {checkoutErrors.name}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="checkout-email"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-500"
            >
              Email
            </label>
            <input
              id="checkout-email"
              type="email"
              value={checkoutForm.email}
              onChange={(e) => setCheckoutForm((f) => ({ ...f, email: e.target.value }))}
              aria-invalid={Boolean(checkoutErrors.email)}
              aria-describedby={checkoutErrors.email ? "email-error" : undefined}
              className={`w-full rounded-sm border bg-neutral-900 px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:ring-1 ${
                checkoutErrors.email
                  ? "border-red-400 focus:ring-red-400"
                  : "border-white/15 focus:ring-lime-300"
              }`}
              placeholder="jordan@email.com"
            />
            {checkoutErrors.email && (
              <p id="email-error" className="mt-1.5 text-xs text-red-400">
                {checkoutErrors.email}
              </p>
            )}
          </div>

          <div className="mt-2 rounded-md border border-white/10 bg-neutral-900/40 p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
              Payment
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumberInput(e.target.value))}
                placeholder="Card number"
                aria-label="Card number (demo only, not processed)"
                autoComplete="cc-number"
                className="rounded-sm border border-white/15 bg-neutral-950 px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-lime-300 sm:col-span-2"
              />
              <input
                type="text"
                inputMode="numeric"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiryInput(e.target.value))}
                placeholder="MM / YY"
                aria-label="Expiry date (demo only, not processed)"
                autoComplete="cc-exp"
                className="rounded-sm border border-white/15 bg-neutral-950 px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-lime-300"
              />
              <input
                type="text"
                inputMode="numeric"
                value={cvc}
                onChange={(e) => setCvc(formatCvcInput(e.target.value))}
                placeholder="CVC"
                aria-label="Security code (demo only, not processed)"
                autoComplete="cc-csc"
                className="rounded-sm border border-white/15 bg-neutral-950 px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-lime-300"
              />
            </div>
            <p className="mt-2 text-[11px] text-neutral-600">
              Demo checkout — no payment is processed.
            </p>
          </div>

          <button
            type="submit"
            disabled={checkoutStatus === "loading"}
            className="mt-2 flex items-center justify-center gap-2 rounded-sm bg-lime-300 py-3.5 text-sm font-semibold text-neutral-950 transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {checkoutStatus === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing order...
              </>
            ) : (
              <>Place order &middot; {formatPrice(total)}</>
            )}
          </button>
        </form>

        <div className="h-fit rounded-md border border-white/10 bg-neutral-900/50 p-5">
          <p className="mb-4 text-sm font-semibold text-neutral-100">Order summary</p>
          <div className="flex gap-3 border-b border-white/10 pb-4">
            <img src={event.image} alt="" className="h-14 w-14 rounded-sm object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-neutral-100">{event.title}</p>
              <p className="text-xs text-neutral-500">
                {formatDate(event.date)} &middot; {event.venue}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-b border-white/10 py-4 text-sm">
            {tiers
              .filter((t) => (selectedTickets[t.id] || 0) > 0)
              .map((t) => (
                <div key={t.id} className="flex justify-between text-neutral-400">
                  <span>
                    {t.name} &times; {selectedTickets[t.id]}
                  </span>
                  <span className="text-neutral-200">
                    {formatPrice(t.price * (selectedTickets[t.id] || 0))}
                  </span>
                </div>
              ))}
          </div>
          <div className="flex flex-col gap-1.5 pt-4 text-sm">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Service fee</span>
              <span>{formatPrice(serviceFee)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-white/10 pt-2 text-base font-semibold text-neutral-50">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
