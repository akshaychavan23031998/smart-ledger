import {
  transactionCategoryLabels,
} from '../../lib/constants';
import { formatCurrency } from '../../lib/currency';
import type { TransactionSummary } from '../../types/transaction';

interface TransactionSummaryProps {
  summary: TransactionSummary;
}

export function TransactionSummaryCards({
  summary,
}: TransactionSummaryProps) {
  const isPositiveBalance = summary.balanceMinor >= 0;

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Current balance
          </p>

          <p
            className={[
              'mt-3 text-2xl font-bold',
              isPositiveBalance
                ? 'text-slate-950'
                : 'text-red-700',
            ].join(' ')}
          >
            {formatCurrency(summary.balanceMinor)}
          </p>
        </article>

        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-emerald-700">
            Total income
          </p>

          <p className="mt-3 text-2xl font-bold text-emerald-950">
            {formatCurrency(summary.totalIncomeMinor)}
          </p>
        </article>

        <article className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-red-700">
            Total expenses
          </p>

          <p className="mt-3 text-2xl font-bold text-red-950">
            {formatCurrency(summary.totalExpenseMinor)}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Transactions
          </p>

          <p className="mt-3 text-2xl font-bold text-slate-950">
            {summary.transactionCount}
          </p>
        </article>
      </div>

      <article className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
          Smart insight
        </p>

        <p className="mt-3 text-sm leading-7 text-blue-950">
          {summary.insight}
        </p>

        {summary.topExpenseCategory ? (
          <p className="mt-3 text-xs text-blue-800">
            Top expense category:{' '}
            <span className="font-semibold">
              {
                transactionCategoryLabels[
                  summary.topExpenseCategory.category
                ]
              }
            </span>{' '}
            ({formatCurrency(
              summary.topExpenseCategory.amountMinor,
            )})
          </p>
        ) : null}
      </article>
    </section>
  );
}