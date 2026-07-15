import { Button } from '../ui/button';
import {
  transactionCategoryLabels,
  transactionTypeLabels,
} from '../../lib/constants';
import { formatCurrency } from '../../lib/currency';
import { formatDateTime } from '../../lib/date';
import type { Transaction } from '../../types/transaction';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  isDeleting?: boolean;
}

export function TransactionCard({
  transaction,
  onEdit,
  onDelete,
  isDeleting = false,
}: TransactionCardProps) {
  const isIncome = transaction.type === 'INCOME';

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={[
                'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                isIncome
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700',
              ].join(' ')}
            >
              {transactionTypeLabels[transaction.type]}
            </span>

            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {transactionCategoryLabels[transaction.category]}
            </span>
          </div>

          <h2 className="mt-3 break-words text-lg font-semibold text-slate-950">
            {transaction.title}
          </h2>

          {transaction.description ? (
            <p className="mt-2 break-words text-sm leading-6 text-slate-600">
              {transaction.description}
            </p>
          ) : null}

          <p className="mt-3 text-xs text-slate-500">
            {formatDateTime(transaction.occurredAt)}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:items-end">
          <p
            className={[
              'text-xl font-bold',
              isIncome
                ? 'text-emerald-700'
                : 'text-red-700',
            ].join(' ')}
          >
            {isIncome ? '+' : '-'}{' '}
            {formatCurrency(transaction.amountMinor)}
          </p>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => onEdit(transaction)}
              disabled={isDeleting}
            >
              Edit
            </Button>

            <Button
              variant="danger"
              onClick={() => onDelete(transaction)}
              isLoading={isDeleting}
              loadingText="Deleting..."
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}