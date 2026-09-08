import { useMemo, useState } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import type { EventItem } from "../types";
import { TODAY, formatDateLong } from "../utils/date";
import { EventCard } from "../components/events/EventCard";
import { EmptyState } from "../components/ui/EmptyState";

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function EventCalendar({
  events,
}: {
  events: EventItem[];
}) {
  const [view, setView] = useState<"month" | "week">("month");
  const [cursor, setCursor] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const eventsByDate = useMemo(() => {
    const map: Record<string, EventItem[]> = {};
    events.forEach((e) => {
      map[e.date] = map[e.date] ? [...map[e.date], e] : [e];
    });
    return map;
  }, [events]);

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
    const result: { date: Date; inMonth: boolean }[] = [];
    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - startOffset + 1;
      const date = new Date(year, month, dayNum);
      result.push({ date, inMonth: date.getMonth() === month });
    }
    return result;
  }, [cursor]);

  const weekDays = useMemo(() => {
    const base = selectedDate ? new Date(`${selectedDate}T00:00:00`) : TODAY;
    const start = new Date(base);
    start.setDate(base.getDate() - base.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];
  const isToday = (d: Date) => toISO(d) === toISO(TODAY);

  return (
    <section id="calendar" className="border-t border-white/10 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-lime-300">
              Plan ahead
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50 sm:text-3xl">
              Calendar
            </h2>
          </div>
          <div className="flex rounded-sm border border-white/15 p-1">
            {(["month", "week"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`rounded-sm px-3 py-1.5 text-xs font-medium capitalize transition ${
                  view === v
                    ? "bg-lime-300 text-neutral-950"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-md border border-white/10 bg-neutral-900/40 p-5">
            {view === "month" ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      aria-label="Previous month"
                      onClick={() =>
                        setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-sm text-neutral-400 hover:bg-white/5 hover:text-neutral-100"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Next month"
                      onClick={() =>
                        setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-sm text-neutral-400 hover:bg-white/5 hover:text-neutral-100"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <span className="ml-2 text-sm font-semibold text-neutral-100">
                      {monthLabel}
                    </span>
                  </div>
                  <button
                    onClick={() => setCursor(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))}
                    className="text-xs font-medium text-lime-300 hover:text-lime-200"
                  >
                    Today
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-wider text-neutral-500">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="py-2">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {cells.map(({ date, inMonth }, i) => {
                    const iso = toISO(date);
                    const dayEvents = eventsByDate[iso] || [];
                    const isSelected = selectedDate === iso;
                    return (
                      <button
                        key={i}
                        onClick={() => inMonth && setSelectedDate(iso)}
                        disabled={!inMonth}
                        aria-label={inMonth ? formatDateLong(iso) : undefined}
                        aria-hidden={!inMonth}
                        tabIndex={inMonth ? 0 : -1}
                        className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-sm text-sm transition ${
                          !inMonth
                            ? "cursor-default text-neutral-800"
                            : isSelected
                            ? "bg-lime-300 text-neutral-950 font-semibold"
                            : isToday(date)
                            ? "border border-lime-300/50 text-neutral-100"
                            : "text-neutral-300 hover:bg-white/5"
                        }`}
                      >
                        {date.getDate()}
                        {dayEvents.length > 0 && (
                          <span
                            className={`h-1 w-1 rounded-full ${
                              isSelected ? "bg-neutral-950" : "bg-lime-300"
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((d) => {
                  const iso = toISO(d);
                  const dayEvents = eventsByDate[iso] || [];
                  const isSelected = selectedDate === iso;
                  return (
                    <button
                      key={iso}
                      onClick={() => setSelectedDate(iso)}
                      className={`flex flex-col items-center gap-2 rounded-sm border p-3 transition ${
                        isSelected
                          ? "border-lime-300 bg-lime-300/10"
                          : "border-white/10 hover:border-white/25"
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-wider text-neutral-500">
                        {d.toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <span
                        className={`text-lg font-semibold ${
                          isSelected ? "text-lime-300" : "text-neutral-100"
                        }`}
                      >
                        {d.getDate()}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {dayEvents.length > 0 ? `${dayEvents.length} on` : "—"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-md border border-white/10 bg-neutral-900/50 p-5">
            <p className="mb-4 text-sm font-semibold text-neutral-100">
              {selectedDate ? formatDateLong(selectedDate) : "Select a date"}
            </p>
            {!selectedDate ? (
              <p className="text-sm text-neutral-500">
                Choose a date on the calendar to see what’s happening.
              </p>
            ) : selectedEvents.length === 0 ? (
              <EmptyState
                icon={CalendarIcon}
                title="No events for selected date."
                message="Try another date, or browse everything below."
              />
            ) : (
              <div className="flex flex-col">
                {selectedEvents.map((e) => (
                  <EventCard key={e.id} event={e} variant="row" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
