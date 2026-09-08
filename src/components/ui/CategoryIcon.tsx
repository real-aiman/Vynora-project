import { CATEGORY_ICON } from "../../constants/categories";
import type { Category } from "../../types";

export function CategoryIcon({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  const Icon = CATEGORY_ICON[category];
  return <Icon className={className} />;
}
