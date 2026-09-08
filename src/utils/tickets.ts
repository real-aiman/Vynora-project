import type { TicketTier } from "../types";

export function getTicketTiers(basePrice: number): TicketTier[] {
  return [
    {
      id: "standard",
      name: "Standard",
      description: "General admission access",
      price: basePrice,
      available: 120,
    },
    {
      id: "premium",
      name: "Premium",
      description: "Priority entry and reserved area",
      price: Math.round(basePrice * 1.6),
      available: 45,
    },
    {
      id: "vip",
      name: "VIP",
      description: "Front access, lounge, and a complimentary drink",
      price: Math.round(basePrice * 2.4),
      available: 12,
    },
  ];
}
