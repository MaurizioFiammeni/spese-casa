import type { Category } from '../../types/category';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../utils/constants';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full text-white font-medium ${
        CATEGORY_COLORS[category]
      } ${sizeClasses[size]}`}
      title={category}
    >
      <span>{CATEGORY_ICONS[category]}</span>
      <span className="hidden sm:inline">{category}</span>
    </span>
  );
}
