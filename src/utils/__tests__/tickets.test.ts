import { describe, expect, it } from "vitest";
import { getTicketTiers } from "../tickets";

describe("getTicketTiers", () => {
  it("returns standard, premium, and vip tiers in that order", () => {
    const tiers = getTicketTiers(50);
    expect(tiers.map((t) => t.id)).toEqual(["standard", "premium", "vip"]);
  });

  it("prices standard at the base price", () => {
    expect(getTicketTiers(50)[0].price).toBe(50);
  });

  it("prices premium and vip as multiples of the base price", () => {
    const [standard, premium, vip] = getTicketTiers(50);
    expect(premium.price).toBe(Math.round(standard.price * 1.6));
    expect(vip.price).toBe(Math.round(standard.price * 2.4));
  });

  it("keeps a strict ascending price order", () => {
    const [standard, premium, vip] = getTicketTiers(38);
    expect(standard.price).toBeLessThan(premium.price);
    expect(premium.price).toBeLessThan(vip.price);
  });
});
