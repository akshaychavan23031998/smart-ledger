import type { TransactionCategory } from '../../../generated/prisma/enums';

export interface TransactionSummary {
  totalIncomeMinor: number;
  totalExpenseMinor: number;
  balanceMinor: number;
  transactionCount: number;

  currentMonthExpenseMinor: number;
  previousMonthExpenseMinor: number;
  monthlyExpenseChangePercentage: number | null;

  topExpenseCategory: {
    category: TransactionCategory;
    amountMinor: number;
  } | null;

  insight: string;
}