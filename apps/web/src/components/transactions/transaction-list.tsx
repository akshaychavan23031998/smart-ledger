import type { Transaction } from '../../types/transaction';
import { EmptyState } from '../ui/empty-state';
import { TransactionCard } from './transaction-card';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  deletingTransactionId?: string | null;
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
  deletingTransactionId = null,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions found"
        description="Create your first transaction or adjust the current filters."
      />
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={deletingTransactionId === transaction.id}
        />
      ))}
    </div>
  );
}