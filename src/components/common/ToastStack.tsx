import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { ToastMessage } from "../../types";

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.22, ease: "easeOut" }}
            className="pointer-events-auto flex items-center gap-2.5 rounded-sm border border-white/10 bg-neutral-900 px-4 py-3 shadow-xl shadow-black/40"
            role="status"
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                t.tone === "success"
                  ? "bg-lime-300"
                  : t.tone === "error"
                  ? "bg-red-400"
                  : "bg-neutral-400"
              }`}
            />
            <p className="flex-1 text-sm text-neutral-100">{t.message}</p>
            <button
              aria-label="Dismiss notification"
              onClick={() => onDismiss(t.id)}
              className="text-neutral-500 transition hover:text-neutral-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
