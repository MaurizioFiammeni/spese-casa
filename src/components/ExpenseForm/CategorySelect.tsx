import { CATEGORIES } from '../../types/category';
import type { Category } from '../../types/category';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../utils/constants';

interface CategorySelectProps {
  value: string;
  onChange: (category: Category) => void;
  disabled?: boolean;
}

export function CategorySelect({ value, onChange, disabled = false }: CategorySelectProps) {
  return (
    <div>
      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
        Categoria *
      </label>
      <select
        id="category"
        value={value}
        onChange={(e) => onChange(e.target.value as Category)}
        disabled={disabled}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition appearance-none bg-white"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {CATEGORY_ICONS[cat]} {cat}
          </option>
        ))}
      </select>

      {/* Visual indicator */}
      <div className="mt-2">
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium ${
            CATEGORY_COLORS[value as Category] || 'bg-gray-500'
          }`}
        >
          <span>{CATEGORY_ICONS[value as Category]}</span>
          <span>{value}</span>
        </span>
      </div>
    </div>
  );
}
