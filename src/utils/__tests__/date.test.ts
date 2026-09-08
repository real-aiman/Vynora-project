import { describe, expect, it } from "vitest";
import { TODAY, addDays, daysFromToday, formatDate, formatDateLong } from "../date";

describe("addDays", () => {
  it("returns an ISO date N days ahead of the base date", () => {
    const base = new Date(2026, 0, 1); // Jan 1, 2026 (local)
    expect(addDays(base, 0)).toBe("2026-01-01");
    expect(addDays(base, 1)).toBe("2026-01-02");
    expect(addDays(base, 31)).toBe("2026-02-01");
  });

  it("does not mutate the base date", () => {
    const base = new Date(2026, 0, 1);
    const before = base.getTime();
    addDays(base, 10);
    expect(base.getTime()).toBe(before);
  });

  it("handles year rollover", () => {
    const base = new Date(2026, 11, 31); // Dec 31, 2026
    expect(addDays(base, 1)).toBe("2027-01-01");
  });
});

describe("daysFromToday", () => {
  it("returns 0 for today", () => {
    expect(daysFromToday(addDays(TODAY, 0))).toBe(0);
  });

  it("returns a positive number for future dates", () => {
    expect(daysFromToday(addDays(TODAY, 5))).toBe(5);
  });

  it("returns a negative number for past dates", () => {
    expect(daysFromToday(addDays(TODAY, -3))).toBe(-3);
  });
});

describe("formatDate / formatDateLong", () => {
  it("formats a known date in short form", () => {
    // Jan 1 2026 is a Thursday
    expect(formatDate("2026-01-01")).toBe("Thu, Jan 1");
  });

  it("formats a known date in long form", () => {
    expect(formatDateLong("2026-01-01")).toBe("Thursday, January 1, 2026");
  });
});
