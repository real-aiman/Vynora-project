import type { ComponentType } from "react";
import { Music2, Palette, Trophy, Wrench, Landmark, PartyPopper, Moon } from "lucide-react";
import type { Category } from "../types";

export const CATEGORY_ICON: Record<Category, ComponentType<{ className?: string }>> = {
  Music: Music2,
  Art: Palette,
  Sports: Trophy,
  Workshops: Wrench,
  Culture: Landmark,
  Festivals: PartyPopper,
  Nightlife: Moon,
};

export const CATEGORIES: Category[] = [
  "Music",
  "Art",
  "Sports",
  "Workshops",
  "Culture",
  "Festivals",
  "Nightlife",
];
