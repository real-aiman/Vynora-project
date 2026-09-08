import { describe, expect, it } from "vitest";
import {
  formatCardNumberInput,
  formatCvcInput,
  formatExpiryInput,
  formatPrice,
  generateOrderRef,
  isValidEmail,
} from "../format";

describe("formatPrice", () => {
  it("renders zero as Free", () => {
    expect(formatPrice(0)).toBe("Free");
  });

  it("renders a dollar amount with thousands separators", () => {
    expect(formatPrice(38)).toBe("$38");
    expect(formatPrice(1250)).toBe("$1,250");
  });
});

describe("isValidEmail", () => {
  it("accepts well-formed emails", () => {
    expect(isValidEmail("jordan@email.com")).toBe(true);
    expect(isValidEmail("a.b+c@sub.example.co")).toBe(true);
  });

  it("rejects malformed emails", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("missing@domain")).toBe(false);
    expect(isValidEmail("@nodomain.com")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("generateOrderRef", () => {
  it("matches the VYNORA-XXXXX-NNN shape", () => {
    expect(generateOrderRef()).toMatch(/^VYNORA-[A-Z0-9]{5}-\d{3}$/);
  });

  it("generates distinct refs across calls", () => {
    const refs = new Set(Array.from({ length: 5 }, () => generateOrderRef()));
    expect(refs.size).toBeGreaterThan(1);
  });
});

describe("formatCardNumberInput", () => {
  it("groups digits into blocks of 4", () => {
    expect(formatCardNumberInput("4242424242424242")).toBe("4242 4242 4242 4242");
  });

  it("strips non-digit characters", () => {
    expect(formatCardNumberInput("4242-4242-4242-4242")).toBe("4242 4242 4242 4242");
  });

  it("caps input at 16 digits", () => {
    expect(formatCardNumberInput("42424242424242424242")).toBe("4242 4242 4242 4242");
  });
});

describe("formatExpiryInput", () => {
  it("inserts a slash after two digits", () => {
    expect(formatExpiryInput("1225")).toBe("12/25");
  });

  it("leaves short input unslashed", () => {
    expect(formatExpiryInput("1")).toBe("1");
  });

  it("caps input at 4 digits", () => {
    expect(formatExpiryInput("122599")).toBe("12/25");
  });
});

describe("formatCvcInput", () => {
  it("strips non-digits and caps at 4", () => {
    expect(formatCvcInput("12a3b45")).toBe("1234");
  });
});
