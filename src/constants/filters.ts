import type { Filters } from "../types";

export const MAX_PRICE_CEILING = 250;

export const DEFAULT_FILTERS: Filters = {
  categories: [],
  city: "All",
  dateFilter: "any",
  maxPrice: MAX_PRICE_CEILING,
  featuredOnly: false,
};
