export type Category =
  | "Music"
  | "Art"
  | "Sports"
  | "Workshops"
  | "Culture"
  | "Festivals"
  | "Nightlife";

export interface EventItem {
  id: number;
  title: string;
  category: Category;
  date: string; // ISO yyyy-mm-dd
  time: string;
  venue: string;
  city: string;
  location: string;
  price: number;
  image: string;
  description: string;
  longDescription: string;
  rating: number;
  featured: boolean;
  tags: string[];
  artist?: string;
  capacity: string;
  duration: string;
}

export interface TicketTier {
  id: "standard" | "premium" | "vip";
  name: string;
  description: string;
  price: number;
  available: number;
}

export type SortOption =
  | "recommended"
  | "soonest"
  | "price-low"
  | "price-high"
  | "rating";

export type DateFilter = "any" | "today" | "week" | "month";

export interface Filters {
  categories: Category[];
  city: string;
  dateFilter: DateFilter;
  maxPrice: number;
  featuredOnly: boolean;
}

export interface ToastMessage {
  id: number;
  message: string;
  tone: "success" | "info" | "error";
}

export type ModalStep = "closed" | "detail" | "tickets" | "checkout" | "confirmation";

export interface CheckoutForm {
  name: string;
  email: string;
}

export interface CheckoutErrors {
  name?: string;
  email?: string;
}

export interface MapVenue {
  id: string;
  name: string;
  city: string;
  x: number;
  y: number;
  category: Category;
  eventId: number;
}

/** Per-event ticket quantity selections, persisted as a lightweight cart draft. */
export type TicketSelection = Record<string, number>;
export type CartDraft = Record<number, TicketSelection>;
