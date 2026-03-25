import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import type { Expense } from '../types/expense';

interface ExcelExportOptions {
  filename?: string;
  sheetName?: string;
}

/**
 * Export expenses to Excel (.xlsx) file
 */
export function exportToExcel(
  expenses: Expense[],
  options: ExcelExportOptions = {}
): void {
  const {
    filename = `spese_${format(new Date(), 'yyyy-MM-dd')}.xlsx`,
    sheetName = 'Spese',
  } = options;

  // Transform expenses to Excel format
  const excelData = expenses.map((expense) => ({
    Data: format(new Date(expense.date), 'dd/MM/yyyy', { locale: it }),
    Categoria: expense.category,
    Descrizione: expense.description,
    Importo: expense.amount,
    'Creato da': expense.createdBy,
    'Data creazione': format(new Date(expense.createdAt), 'dd/MM/yyyy HH:mm', {
      locale: it,
    }),
  }));

  // Sort by date (oldest first for Excel)
  excelData.sort((a, b) => {
    const dateA = a.Data.split('/').reverse().join('');
    const dateB = b.Data.split('/').reverse().join('');
    return dateA.localeCompare(dateB);
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 12 }, // Data
    { wch: 22 }, // Categoria
    { wch: 35 }, // Descrizione
    { wch: 12 }, // Importo
    { wch: 18 }, // Creato da
    { wch: 18 }, // Data creazione
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Download file
  XLSX.writeFile(workbook, filename);
}

/**
 * Export expenses for a specific month
 */
export function exportMonthToExcel(
  expenses: Expense[],
  month: Date
): void {
  const monthName = format(month, 'MMMM_yyyy', { locale: it });
  const filename = `spese_${monthName}.xlsx`;

  exportToExcel(expenses, { filename, sheetName: 'Spese' });
}

/**
 * Get available months from expenses
 */
export function getAvailableMonths(expenses: Expense[]): Date[] {
  const monthsSet = new Set<string>();

  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthsSet.add(monthKey);
  });

  // Convert to dates and sort descending
  return Array.from(monthsSet)
    .map((key) => {
      const [year, month] = key.split('-');
      return new Date(parseInt(year), parseInt(month) - 1, 1);
    })
    .sort((a, b) => b.getTime() - a.getTime());
}
