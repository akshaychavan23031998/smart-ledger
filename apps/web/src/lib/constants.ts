import {
  TransactionCategory,
  TransactionType,
  type SortOrder,
  type TransactionSortField,
} from '../types/transaction';

export const APP_NAME = 'Smart Ledger';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_SORT_BY: TransactionSortField = 'occurredAt';
export const DEFAULT_SORT_ORDER: SortOrder = 'desc';

export const TRANSACTION_TYPES = Object.values(TransactionType);

export const TRANSACTION_CATEGORIES =
  Object.values(TransactionCategory);

export const transactionTypeLabels: Record<
  TransactionType,
  string
> = {
  INCOME: 'Income',
  EXPENSE: 'Expense',
};

export const transactionCategoryLabels: Record<
  TransactionCategory,
  string
> = {
  SALARY: 'Salary',
  FREELANCE: 'Freelance',
  INVESTMENT: 'Investment',
  GIFT: 'Gift',
  REFUND: 'Refund',
  FOOD: 'Food and Dining',
  TRANSPORT: 'Transport',
  HOUSING: 'Housing',
  HEALTHCARE: 'Healthcare',
  EDUCATION: 'Education',
  ENTERTAINMENT: 'Entertainment',
  SHOPPING: 'Shopping',
  TRAVEL: 'Travel',
  SUBSCRIPTIONS: 'Subscriptions',
  OTHER: 'Other',
};

export const sortFieldLabels: Record<
  TransactionSortField,
  string
> = {
  occurredAt: 'Transaction date',
  createdAt: 'Created date',
  amountMinor: 'Amount',
  title: 'Title',
};

export const sortOrderLabels: Record<
  SortOrder,
  string
> = {
  asc: 'Ascending',
  desc: 'Descending',
};