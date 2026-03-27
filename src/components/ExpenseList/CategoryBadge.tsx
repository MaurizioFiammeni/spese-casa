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

  // Fallback for missing category
  const color = CATEGORY_COLORS[category] || 'bg-gray-500';
  const icon = CATEGORY_ICONS[category] || '📦';

  // Debug log
  if (!CATEGORY_COLORS[category]) {
    console.warn(`Category not found in constants: "${category}"`);
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full text-white font-medium ${color} ${sizeClasses[size]}`}
      title={category}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{category}</span>
    </span>
  );
}
