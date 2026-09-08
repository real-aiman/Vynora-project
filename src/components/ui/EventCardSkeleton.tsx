export function EventCardSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div className="animate-pulse overflow-hidden rounded-md border border-white/10 bg-neutral-900">
      <div className={`w-full bg-neutral-800 ${tall ? "h-72" : "h-40"}`} />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 rounded bg-neutral-800" />
        <div className="h-4 w-4/5 rounded bg-neutral-800" />
        <div className="h-3 w-2/5 rounded bg-neutral-800" />
      </div>
    </div>
  );
}
