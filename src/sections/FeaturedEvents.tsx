import { motion } from "framer-motion";
import type { EventItem } from "../types";
import { EventCard } from "../components/events/EventCard";

export function FeaturedEvents({ events }: { events: EventItem[] }) {
  const featured = events.filter((e) => e.featured);
  if (featured.length === 0) return null;
  const [hero, ...rest] = featured;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-lime-300">
            Handpicked
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50 sm:text-3xl">
            Featured this season
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <EventCard event={hero} variant="hero" />
        </motion.div>
        <div className="flex flex-col gap-4">
          {rest.slice(0, 2).map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
            >
              <EventCard event={e} variant="medium" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
