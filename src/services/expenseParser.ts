// date-fns functions used in dateParser
import type { ParsedExpense } from '../types/expense';
import type { Category } from '../types/category';
import { CATEGORIES } from '../types/category';
import { CATEGORY_KEYWORDS } from '../utils/constants';
import { parseItalianDate, toISODateString } from '../utils/dateParser';

export class ExpenseParser {
  /**
   * Main parsing function
   */
  parseExpenseText(text: string, currentDate: Date = new Date()): ParsedExpense {
    const normalized = text.toLowerCase().trim();

    // Extract components
    const amount = this.extractAmount(normalized);
    const category = this.extractCategory(normalized);
    const date = this.extractDate(normalized, currentDate);
    const description = this.generateDescription(text, category);

    // Calculate confidence score
    const confidence = this.calculateConfidence(amount, category, date, normalized);

    return {
      amount,
      category,
      date: toISODateString(date),
      description,
      confidence,
    };
  }

  /**
   * Extract amount from text
   */
  private extractAmount(text: string): number {
    // Remove spaces between digits and decimals for better matching
    const cleanText = text.replace(/(\d)\s+([.,])\s+(\d)/g, '$1$2$3');

    // Regex patterns for Italian amounts
    const patterns = [
      // "45.50 euro" or "45,50 euro" or "45.50 €" or "45,50€"
      /(\d+[.,]\d{1,2})\s*(?:euro|€)/i,
      // "euro 45.50" or "€ 45.50"
      /(?:euro|€)\s*(\d+[.,]\d{1,2})/i,
      // "45 euro" (no decimals)
      /(\d+)\s+euro/i,
      // "€45" (no space)
      /€\s*(\d+(?:[.,]\d{1,2})?)/i,
      // Just number with decimals: "45.50" or "45,50" (fallback)
      /\b(\d+[.,]\d{1,2})\b/,
      // Just integer: "45" (last resort)
      /\b(\d+)\b/,
    ];

    for (const pattern of patterns) {
      const match = cleanText.match(pattern);
      if (match) {
        // Replace comma with dot for parsing
        const numStr = match[1].replace(',', '.');
        const amount = parseFloat(numStr);

        // Validate amount
        if (!isNaN(amount) && amount > 0 && amount < 100000) {
          return amount;
        }
      }
    }

    return 0; // Invalid amount
  }

  /**
   * Extract category from text using keywords
   */
  private extractCategory(text: string): string {
    let bestMatch: { category: string; score: number } = {
      category: 'Varie',
      score: 0,
    };

    // Check each category's keywords
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          // Score based on keyword length (longer = more specific)
          const score = keyword.length;

          if (score > bestMatch.score) {
            bestMatch = { category, score };
          }
        }
      }
    }

    return bestMatch.category;
  }

  /**
   * Extract date from text
   */
  private extractDate(text: string, currentDate: Date): Date {
    return parseItalianDate(text, currentDate);
  }

  /**
   * Generate description from original text
   */
  private generateDescription(_originalText: string, category: string): string {
    // Default: use only category name
    // User can add more details manually if needed
    return category;
  }

  /**
   * Calculate confidence score (0-1)
   */
  private calculateConfidence(
    amount: number,
    category: string,
    date: Date,
    originalText: string
  ): number {
    let confidence = 0;

    // Amount confidence (40%)
    if (amount > 0) {
      // Check if amount was explicitly mentioned with "euro" or "€"
      if (originalText.match(/\d+[.,]?\d*\s*(?:euro|€)/i)) {
        confidence += 0.4;
      } else {
        confidence += 0.2; // Lower confidence for implicit amounts
      }
    } else {
      return 0; // Invalid expense without amount
    }

    // Category confidence (30%)
    if (category !== 'Varie') {
      // Matched a specific category
      confidence += 0.3;
    } else {
      // Defaulted to 'Varie'
      confidence += 0.1;
    }

    // Date confidence (30%)
    if (date) {
      // Check if date was explicitly mentioned
      if (
        originalText.match(/\b(?:oggi|ieri|giorno|gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre|\d{1,2}[\/\-]\d{1,2})\b/i)
      ) {
        confidence += 0.3;
      } else {
        // Defaulted to today
        confidence += 0.15;
      }
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Validate parsed expense
   */
  validateParsedExpense(parsed: ParsedExpense): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (parsed.amount <= 0) {
      errors.push('Importo non valido o non trovato');
    }

    if (parsed.amount > 100000) {
      errors.push('Importo troppo alto (max €100.000)');
    }

    if (!CATEGORIES.includes(parsed.category as Category)) {
      errors.push('Categoria non valida');
    }

    // Check if date is not too far in the future
    const parsedDate = new Date(parsed.date);
    const maxFutureDate = new Date();
    maxFutureDate.setDate(maxFutureDate.getDate() + 30);

    if (parsedDate > maxFutureDate) {
      errors.push('La data non può essere più di 30 giorni nel futuro');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Singleton instance
export const expenseParser = new ExpenseParser();
