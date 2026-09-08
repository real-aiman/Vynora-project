import { useState } from "react";
import type { FormEvent } from "react";
import { Check, Mail } from "lucide-react";
import { isValidEmail } from "../../utils/format";

export function Newsletter({ onSubscribe }: { onSubscribe: () => void }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setStatus("success");
    onSubscribe();
  }

  return (
    <section className="border-t border-white/10 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-50 sm:text-3xl">
              Stay curious.
            </h2>
            <p className="mt-2 max-w-md text-sm text-neutral-500">
              One email a week — new venues, under-the-radar events, and the
              occasional early ticket window.
            </p>
          </div>
          <div className="lg:min-w-[360px]">
            {status === "success" ? (
              <p className="flex items-center gap-2 text-sm font-medium text-lime-300">
                <Check className="h-4 w-4" />
                You’re subscribed — welcome in.
              </p>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    aria-invalid={Boolean(error)}
                    className="flex-1 rounded-sm border border-white/15 bg-neutral-900 px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-lime-300"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-lime-300 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-lime-200"
                  >
                    <Mail className="h-4 w-4" />
                    Subscribe
                  </button>
                </div>
                {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
