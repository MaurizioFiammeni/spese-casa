import { format, subDays } from 'date-fns';
import { it } from 'date-fns/locale';

// Italian month names
const ITALIAN_MONTHS = [
  'gennaio',
  'febbraio',
  'marzo',
  'aprile',
  'maggio',
  'giugno',
  'luglio',
  'agosto',
  'settembre',
  'ottobre',
  'novembre',
  'dicembre',
] as const;

/**
 * Parse Italian date expressions
 */
export function parseItalianDate(
  text: string,
  referenceDate: Date = new Date()
): Date {
  const normalized = text.toLowerCase().trim();

  // Temporal expressions
  if (normalized.includes('oggi')) {
    return referenceDate;
  }

  if (normalized.includes('ieri')) {
    return subDays(referenceDate, 1);
  }

  if (normalized.includes("l'altro ieri") || normalized.includes('altro ieri')) {
    return subDays(referenceDate, 2);
  }

  if (normalized.includes('settimana scorsa')) {
    return subDays(referenceDate, 7);
  }

  // Parse Italian format: "16 gennaio 2026" or "16 gennaio"
  for (const [monthIndex, monthName] of ITALIAN_MONTHS.entries()) {
    // Pattern: one or two digits + month name + optional year
    const pattern = new RegExp(
      `(\\d{1,2})\\s+${monthName}(?:\\s+(\\d{4}))?`,
      'i'
    );
    const match = normalized.match(pattern);

    if (match) {
      const day = parseInt(match[1], 10);
      const year = match[2] ? parseInt(match[2], 10) : referenceDate.getFullYear();

      // Create date
      const date = new Date(year, monthIndex, day);

      // Validate date
      if (isNaN(date.getTime())) {
        continue; // Invalid date, try next pattern
      }

      return date;
    }
  }

  // Parse numeric format: "16/01/2026" or "16-01-2026"
  const numericPattern = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/;
  const numericMatch = normalized.match(numericPattern);

  if (numericMatch) {
    const day = parseInt(numericMatch[1], 10);
    const month = parseInt(numericMatch[2], 10) - 1; // 0-indexed
    const year = parseInt(numericMatch[3], 10);

    const date = new Date(year, month, day);

    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Parse short numeric: "16/01" (assume current year)
  const shortNumericPattern = /(\d{1,2})[\/\-](\d{1,2})(?!\d)/;
  const shortMatch = normalized.match(shortNumericPattern);

  if (shortMatch) {
    const day = parseInt(shortMatch[1], 10);
    const month = parseInt(shortMatch[2], 10) - 1;

    const date = new Date(referenceDate.getFullYear(), month, day);

    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Default: return reference date (today)
  return referenceDate;
}

/**
 * Format date in Italian style
 */
export function formatItalianDate(date: Date): string {
  return format(date, 'dd MMMM yyyy', { locale: it });
}

/**
 * Format date for display (short)
 */
export function formatShortDate(date: Date): string {
  return format(date, 'dd MMM yyyy', { locale: it });
}

/**
 * Convert Date to ISO string (YYYY-MM-DD)
 */
export function toISODateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
