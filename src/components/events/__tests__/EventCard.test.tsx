import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EventCard } from "../EventCard";
import { useAppStore } from "../../../store/useAppStore";
import type { EventItem } from "../../../types";

const event: EventItem = {
  id: 42,
  title: "Analog Dreams",
  category: "Music",
  date: "2026-09-26",
  time: "20:30",
  venue: "Paradiso Loft",
  city: "Amsterdam",
  location: "Weteringschans 6, Amsterdam",
  price: 46,
  image: "https://example.com/image.jpg",
  description: "Synth-pop, played the way it sounded on the record.",
  longDescription: "A longer description.",
  rating: 4.7,
  featured: true,
  tags: ["Synth-Pop"],
  capacity: "700",
  duration: "3 hrs",
};

beforeEach(() => {
  useAppStore.setState({ favoriteIds: [], activeEventId: null, modalStep: "closed", toasts: [] });
});

describe("EventCard", () => {
  it("renders the event's title, venue, and price", () => {
    render(<EventCard event={event} variant="compact" />);
    expect(screen.getByText("Analog Dreams")).toBeInTheDocument();
    expect(screen.getByText(/Paradiso Loft/)).toBeInTheDocument();
    expect(screen.getByText("$46")).toBeInTheDocument();
  });

  it("opens the event via the store when clicked", async () => {
    const user = userEvent.setup();
    render(<EventCard event={event} variant="compact" />);

    await user.click(screen.getByRole("button", { name: /view details for analog dreams/i }));

    expect(useAppStore.getState().activeEventId).toBe(42);
    expect(useAppStore.getState().modalStep).toBe("detail");
  });

  it("toggles favorite state and reflects it in the accessible label", async () => {
    const user = userEvent.setup();
    render(<EventCard event={event} variant="compact" />);

    const favoriteButton = screen.getByRole("button", { name: /add to favorites/i });
    await user.click(favoriteButton);

    expect(useAppStore.getState().favoriteIds).toContain(42);
    expect(screen.getByRole("button", { name: /remove from favorites/i })).toBeInTheDocument();
  });
});
