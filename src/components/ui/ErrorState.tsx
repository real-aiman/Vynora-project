import { AlertCircle, RefreshCw } from "lucide-react";

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-white/10 bg-neutral-900/60 px-6 py-20 text-center">
      <AlertCircle className="h-8 w-8 text-neutral-500" />
      <div>
        <p className="text-lg font-semibold text-neutral-100">
          We couldn’t load the events.
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          Something interrupted the connection. This usually resolves on retry.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-sm bg-lime-300 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-lime-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
