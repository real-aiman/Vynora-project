import type { ComponentType, ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-white/15 px-6 py-14 text-center">
      <Icon className="h-7 w-7 text-neutral-600" />
      <p className="text-base font-medium text-neutral-200">{title}</p>
      <p className="max-w-xs text-sm text-neutral-500">{message}</p>
      {action}
    </div>
  );
}
