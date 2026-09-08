import { describe, expect, it } from "vitest";
import type { EventItem, Filters } from "../../types";
import { applyFilters, matchesQuery, sortEvents } from "../filters";
import { addDays, TODAY } from "../date";

function makeEvent(overrides: Partial<EventItem>): EventItem {
  return {
    id: 1,
    title: "Test Event",
    category: "Music",
    date: addDays(TODAY, 5),
    time: "20:00",
    venue: "Test Venue",
    city: "Testville",
    location: "123 Test St",
    price: 20,
    image: "https://example.com/image.jpg",
    description: "A test event.",
    longDescription: "A longer description of a test event.",
    rating: 4.5,
    featured: false,
    tags: ["Test"],
    capacity: "100",
    duration: "2 hrs",
    ...overrides,
  };
}

const baseFilters: Filters = {
  categories: [],
  city: "All",
  dateFilter: "any",
  maxPrice: 250,
  featuredOnly: false,
};

describe("matchesQuery", () => {
  const event = makeEvent({ title: "Nocturne", city: "Berlin", venue: "Kraftwerk Halle" });

  it("matches on title, city, and venue, case-insensitively", () => {
    expect(matchesQuery(event, "nocturne")).toBe(true);
    expect(matchesQuery(event, "BERLIN")).toBe(true);
    expect(matchesQuery(event, "kraftwerk")).toBe(true);
  });

  it("returns true for an empty query", () => {
    expect(matchesQuery(event, "")).toBe(true);
    expect(matchesQuery(event, "   ")).toBe(true);
  });

  it("returns false for a non-matching query", () => {
    expect(matchesQuery(event, "basketball")).toBe(false);
  });
});

describe("applyFilters", () => {
  const events = [
    makeEvent({ id: 1, category: "Music", city: "Berlin", price: 30, featured: true }),
    makeEvent({ id: 2, category: "Sports", city: "London", price: 80, featured: false }),
    makeEvent({ id: 3, category: "Music", city: "London", price: 150, featured: false }),
  ];

  it("combines category and city filters (AND, not OR)", () => {
    const result = applyFilters(events, "", {
      ...baseFilters,
      categories: ["Music"],
      city: "London",
    });
    expect(result.map((e) => e.id)).toEqual([3]);
  });

  it("excludes events above the max price", () => {
    const result = applyFilters(events, "", { ...baseFilters, maxPrice: 50 });
    expect(result.map((e) => e.id)).toEqual([1]);
  });

  it("respects featuredOnly", () => {
    const result = applyFilters(events, "", { ...baseFilters, featuredOnly: true });
    expect(result.map((e) => e.id)).toEqual([1]);
  });

  it("filters by date range (week)", () => {
    const withDates = [
      makeEvent({ id: 10, date: addDays(TODAY, 0) }),
      makeEvent({ id: 11, date: addDays(TODAY, 6) }),
      makeEvent({ id: 12, date: addDays(TODAY, 8) }),
      makeEvent({ id: 13, date: addDays(TODAY, -1) }),
    ];
    const result = applyFilters(withDates, "", { ...baseFilters, dateFilter: "week" });
    expect(result.map((e) => e.id)).toEqual([10, 11]);
  });
});

describe("sortEvents", () => {
  const events = [
    makeEvent({ id: 1, price: 100, rating: 4.2, featured: false, date: addDays(TODAY, 10) }),
    makeEvent({ id: 2, price: 30, rating: 4.9, featured: true, date: addDays(TODAY, 2) }),
    makeEvent({ id: 3, price: 60, rating: 4.5, featured: false, date: addDays(TODAY, 5) }),
  ];

  it("sorts by soonest date first", () => {
    expect(sortEvents(events, "soonest").map((e) => e.id)).toEqual([2, 3, 1]);
  });

  it("sorts by lowest price first", () => {
    expect(sortEvents(events, "price-low").map((e) => e.id)).toEqual([2, 3, 1]);
  });

  it("sorts by highest price first", () => {
    expect(sortEvents(events, "price-high").map((e) => e.id)).toEqual([1, 3, 2]);
  });

  it("sorts by highest rating first", () => {
    expect(sortEvents(events, "rating").map((e) => e.id)).toEqual([2, 3, 1]);
  });

  it("recommended puts featured events first, then by rating", () => {
    expect(sortEvents(events, "recommended").map((e) => e.id)).toEqual([2, 3, 1]);
  });

  it("does not mutate the input array", () => {
    const copy = [...events];
    sortEvents(events, "price-low");
    expect(events).toEqual(copy);
  });
});
