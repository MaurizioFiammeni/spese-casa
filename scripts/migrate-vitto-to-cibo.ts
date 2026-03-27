/**
 * Migration script to rename category "Vitto" to "Cibo"
 * This script updates all existing expenses in the GitHub repository
 *
 * Usage:
 * 1. Set your GitHub token as an environment variable: GITHUB_TOKEN
 * 2. Run: npx tsx scripts/migrate-vitto-to-cibo.ts
 */

import { GitHubStorage } from '../src/services/githubStorage';
import type { ExpensesData } from '../src/types/expense';

async function migrateVittoToCibo() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('Error: GITHUB_TOKEN environment variable is required');
    console.log('Usage: GITHUB_TOKEN=your_token npx tsx scripts/migrate-vitto-to-cibo.ts');
    process.exit(1);
  }

  console.log('Starting migration: Vitto → Cibo');
  console.log('=====================================\n');

  try {
    // Initialize GitHub storage with a dummy user (we'll keep the original createdBy)
    const storage = new GitHubStorage(token, 'migration-script');

    // Get current expenses data
    console.log('Fetching expenses from GitHub...');
    const { data, sha } = await storage.getExpenses();

    // Find all expenses with "Vitto" category
    const vittoExpenses = data.expenses.filter(expense => expense.category === 'Vitto');

    if (vittoExpenses.length === 0) {
      console.log('✅ No expenses found with "Vitto" category. Migration not needed.');
      return;
    }

    console.log(`Found ${vittoExpenses.length} expense(s) with "Vitto" category:\n`);

    vittoExpenses.forEach((expense, index) => {
      console.log(`${index + 1}. ${expense.date} - €${expense.amount} - ${expense.description}`);
    });

    console.log('\n📝 Updating all "Vitto" expenses to "Cibo"...');

    // Update all expenses
    const updatedData: ExpensesData = {
      ...data,
      expenses: data.expenses.map(expense => {
        if (expense.category === 'Vitto') {
          return {
            ...expense,
            category: 'Cibo' as any, // Type will be correct after category.ts is updated
            updatedAt: new Date().toISOString(),
          };
        }
        return expense;
      }),
      version: data.version + 1,
    };

    // Encode and update the file
    const content = JSON.stringify(updatedData, null, 2);
    const encoder = new TextEncoder();
    const bytes = encoder.encode(content);

    let binary = '';
    bytes.forEach(byte => {
      binary += String.fromCharCode(byte);
    });
    const base64Content = btoa(binary);

    // Use Octokit directly to update the file
    const { Octokit } = await import('octokit');
    const octokit = new Octokit({ auth: token });

    await octokit.rest.repos.createOrUpdateFileContents({
      owner: 'MaurizioFiammeni',
      repo: 'spese-casa-data',
      path: 'expenses.json',
      message: 'Migrate category: Vitto → Cibo',
      content: base64Content,
      sha: sha,
    });

    console.log('\n✅ Migration completed successfully!');
    console.log(`Updated ${vittoExpenses.length} expense(s) from "Vitto" to "Cibo"`);
    console.log(`New version: ${updatedData.version}`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    process.exit(1);
  }
}

// Run the migration
migrateVittoToCibo();
