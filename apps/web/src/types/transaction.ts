export const TransactionType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export const TransactionCategory = {
  SALARY: 'SALARY',
  FREELANCE: 'FREELANCE',
  INVESTMENT: 'INVESTMENT',
  GIFT: 'GIFT',
  REFUND: 'REFUND',
  FOOD: 'FOOD',
  TRANSPORT: 'TRANSPORT',
  HOUSING: 'HOUSING',
  HEALTHCARE: 'HEALTHCARE',
  EDUCATION: 'EDUCATION',
  ENTERTAINMENT: 'ENTERTAINMENT',
  SHOPPING: 'SHOPPING',
  TRAVEL: 'TRAVEL',
  SUBSCRIPTIONS: 'SUBSCRIPTIONS',
  OTHER: 'OTHER',
} as const;

export type TransactionCategory =
  (typeof TransactionCategory)[keyof typeof TransactionCategory];

export type TransactionSortField =
  | 'occurredAt'
  | 'createdAt'
  | 'amountMinor'
  | 'title';

export type SortOrder = 'asc' | 'desc';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  amountMinor: number;
  title: string;
  description: string | null;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TransactionListResponse {
  items: Transaction[];
  pagination: TransactionPagination;
}

export interface TransactionQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: TransactionType;
  category?: TransactionCategory;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: TransactionSortField;
  sortOrder?: SortOrder;
}

export interface CreateTransactionInput {
  type: TransactionType;
  category: TransactionCategory;
  amountMinor: number;
  title: string;
  description?: string;
  occurredAt: string;
}

export type UpdateTransactionInput =
  Partial<CreateTransactionInput>;

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
