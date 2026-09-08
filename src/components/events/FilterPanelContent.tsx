import type { Dispatch, SetStateAction } from "react";
import type { Category, DateFilter, Filters, SortOption } from "../../types";
import { CATEGORIES } from "../../constants/categories";
import { CITIES } from "../../data/events";
import { CategoryIcon } from "../ui/CategoryIcon";
import { formatPrice } from "../../utils/format";
import { MAX_PRICE_CEILING } from "../../constants/filters";

export function FilterPanelContent({
  filters,
  setFilters,
  sort,
  setSort,
}: {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  sort: SortOption;
  setSort: (s: SortOption) => void;
}) {
  function toggleCategory(cat: Category) {
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories, cat],
    }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = filters.categories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-lime-300 bg-lime-300/10 text-lime-300"
                    : "border-white/15 text-neutral-400 hover:border-white/30 hover:text-neutral-200"
                }`}
              >
                <CategoryIcon category={cat} className="h-3.5 w-3.5" />
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          City
        </p>
        <select
          value={filters.city}
          onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
          className="w-full rounded-sm border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-lime-300"
        >
          <option value="All">All cities</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          When
        </p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "any", label: "Any time" },
              { key: "today", label: "Today" },
              { key: "week", label: "This week" },
              { key: "month", label: "This month" },
            ] as { key: DateFilter; label: string }[]
          ).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilters((f) => ({ ...f, dateFilter: opt.key }))}
              aria-pressed={filters.dateFilter === opt.key}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                filters.dateFilter === opt.key
                  ? "border-lime-300 bg-lime-300/10 text-lime-300"
                  : "border-white/15 text-neutral-400 hover:border-white/30 hover:text-neutral-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Max price
          </p>
          <span className="text-xs font-medium text-neutral-300">
            {filters.maxPrice >= MAX_PRICE_CEILING
              ? `$${MAX_PRICE_CEILING}+`
              : formatPrice(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={MAX_PRICE_CEILING}
          step={5}
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))
          }
          aria-label="Maximum price"
          className="w-full accent-lime-300"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={filters.featuredOnly}
          onChange={(e) =>
            setFilters((f) => ({ ...f, featuredOnly: e.target.checked }))
          }
          className="h-4 w-4 accent-lime-300"
        />
        <span className="text-sm text-neutral-300">Featured only</span>
      </label>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Sort by
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="w-full rounded-sm border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-lime-300"
        >
          <option value="recommended">Recommended</option>
          <option value="soonest">Soonest</option>
          <option value="price-low">Lowest Price</option>
          <option value="price-high">Highest Price</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
}
