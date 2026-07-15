'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { TransactionFilters } from '../../components/transactions/transaction-filters';
import { TransactionForm } from '../../components/transactions/transaction-form';
import { TransactionList } from '../../components/transactions/transaction-list';
import { TransactionSummaryCards } from '../../components/transactions/transaction-summary';
import { Alert } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { LoadingState } from '../../components/ui/loading-state';
import {
  ApiError,
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  getApiErrorMessage,
} from '../../lib/api';
import {
  getAccessToken,
  removeAccessToken,
} from '../../lib/auth';
import {
  APP_NAME,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
} from '../../lib/constants';
import type { User } from '../../types/auth';
import type {
  CreateTransactionInput,
  Transaction,
  TransactionListResponse,
  TransactionQuery,
  TransactionSummary,
  UpdateTransactionInput,
} from '../../types/transaction';

const initialQuery: TransactionQuery = {
  page: DEFAULT_PAGE,
  limit: DEFAULT_PAGE_SIZE,
  sortBy: DEFAULT_SORT_BY,
  sortOrder: DEFAULT_SORT_ORDER,
};

function buildQueryString(query: TransactionQuery): string {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ''
    ) {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

export default function TransactionsPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);

  const [summary, setSummary] =
    useState<TransactionSummary | null>(null);

  const [query, setQuery] =
    useState<TransactionQuery>(initialQuery);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  const [isInitialLoading, setIsInitialLoading] =
    useState(true);

  const [isListLoading, setIsListLoading] =
    useState(false);

  const [isSummaryLoading, setIsSummaryLoading] =
    useState(false);

  const [isFormSubmitting, setIsFormSubmitting] =
    useState(false);

  const [
    deletingTransactionId,
    setDeletingTransactionId,
  ] = useState<string | null>(null);

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] =
    useState('');

  const handleUnauthorized = useCallback(() => {
    removeAccessToken();
    router.replace('/login');
  }, [router]);

  const loadTransactions = useCallback(
    async (nextQuery: TransactionQuery) => {
      setIsListLoading(true);
      setError('');

      try {
        const queryString =
          buildQueryString(nextQuery);

        const response =
          await apiGet<TransactionListResponse>(
            `/transactions?${queryString}`,
            true,
          );

        setTransactions(response.items);
        setPagination(response.pagination);
      } catch (requestError) {
        if (
          requestError instanceof ApiError &&
          requestError.status === 401
        ) {
          handleUnauthorized();
          return;
        }

        setError(
          getApiErrorMessage(requestError),
        );
      } finally {
        setIsListLoading(false);
      }
    },
    [handleUnauthorized],
  );

  const loadSummary = useCallback(async () => {
    setIsSummaryLoading(true);

    try {
      const response =
        await apiGet<TransactionSummary>(
          '/transactions/summary',
          true,
        );

      setSummary(response);
    } catch (requestError) {
      if (
        requestError instanceof ApiError &&
        requestError.status === 401
      ) {
        handleUnauthorized();
        return;
      }

      setError(
        getApiErrorMessage(requestError),
      );
    } finally {
      setIsSummaryLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    let isMounted = true;

    async function initializePage() {
      if (!getAccessToken()) {
        handleUnauthorized();
        return;
      }

      try {
        const currentUser = await apiGet<User>(
          '/auth/me',
          true,
        );

        if (!isMounted) {
          return;
        }

        setUser(currentUser);

        await Promise.all([
          loadTransactions(initialQuery),
          loadSummary(),
        ]);
      } catch (requestError) {
        if (
          requestError instanceof ApiError &&
          requestError.status === 401
        ) {
          handleUnauthorized();
          return;
        }

        if (isMounted) {
          setError(
            getApiErrorMessage(requestError),
          );
        }
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }
    }

    void initializePage();

    return () => {
      isMounted = false;
    };
  }, [
    handleUnauthorized,
    loadSummary,
    loadTransactions,
  ]);

  async function refreshTransactions(
    nextQuery: TransactionQuery = query,
  ) {
    setQuery(nextQuery);
    await loadTransactions(nextQuery);
  }

  async function refreshDashboard(
    nextQuery: TransactionQuery = query,
  ) {
    setQuery(nextQuery);

    await Promise.all([
      loadTransactions(nextQuery),
      loadSummary(),
    ]);
  }

  function openCreateForm() {
    setEditingTransaction(null);
    setFormError('');
    setSuccessMessage('');
    setIsFormOpen(true);
  }

  function openEditForm(
    transaction: Transaction,
  ) {
    setEditingTransaction(transaction);
    setFormError('');
    setSuccessMessage('');
    setIsFormOpen(true);
  }

  function closeForm() {
    if (isFormSubmitting) {
      return;
    }

    setEditingTransaction(null);
    setFormError('');
    setIsFormOpen(false);
  }

  async function handleFormSubmit(
    payload:
      | CreateTransactionInput
      | UpdateTransactionInput,
  ) {
    setIsFormSubmitting(true);
    setFormError('');
    setSuccessMessage('');

    const transactionBeingEdited =
      editingTransaction;

    try {
      if (transactionBeingEdited) {
        await apiPatch<
          Transaction,
          UpdateTransactionInput
        >(
          `/transactions/${transactionBeingEdited.id}`,
          payload,
          true,
        );

        setSuccessMessage(
          'Transaction updated successfully.',
        );
      } else {
        await apiPost<
          Transaction,
          CreateTransactionInput
        >(
          '/transactions',
          payload as CreateTransactionInput,
          true,
        );

        setSuccessMessage(
          'Transaction created successfully.',
        );
      }

      setIsFormOpen(false);
      setEditingTransaction(null);

      await refreshDashboard({
        ...query,
        page: transactionBeingEdited
          ? query.page
          : 1,
      });
    } catch (requestError) {
      if (
        requestError instanceof ApiError &&
        requestError.status === 401
      ) {
        handleUnauthorized();
        return;
      }

      setFormError(
        getApiErrorMessage(requestError),
      );
    } finally {
      setIsFormSubmitting(false);
    }
  }

  async function handleDelete(
    transaction: Transaction,
  ) {
    const confirmed = window.confirm(
      `Delete "${transaction.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingTransactionId(transaction.id);
    setError('');
    setSuccessMessage('');

    try {
      await apiDelete(
        `/transactions/${transaction.id}`,
        true,
      );

      setSuccessMessage(
        'Transaction deleted successfully.',
      );

      const nextPage =
        transactions.length === 1 &&
        (query.page ?? 1) > 1
          ? (query.page ?? 1) - 1
          : query.page ?? 1;

      await refreshDashboard({
        ...query,
        page: nextPage,
      });
    } catch (requestError) {
      if (
        requestError instanceof ApiError &&
        requestError.status === 401
      ) {
        handleUnauthorized();
        return;
      }

      setError(
        getApiErrorMessage(requestError),
      );
    } finally {
      setDeletingTransactionId(null);
    }
  }

  async function handleApplyFilters(
    nextQuery: TransactionQuery,
  ) {
    setSuccessMessage('');
    await refreshTransactions(nextQuery);
  }

  async function handleResetFilters() {
    setSuccessMessage('');
    await refreshTransactions(initialQuery);
  }

  async function handlePageChange(
    page: number,
  ) {
    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === pagination.page
    ) {
      return;
    }

    await refreshTransactions({
      ...query,
      page,
    });
  }

  function handleLogout() {
    removeAccessToken();
    router.replace('/login');
  }

  if (isInitialLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <LoadingState message="Loading your ledger..." />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-xl font-bold tracking-tight text-slate-950">
              {APP_NAME}
            </p>

            {user ? (
              <p className="mt-1 text-sm text-slate-600">
                Signed in as{' '}
                <span className="font-medium text-slate-900">
                  {user.name}
                </span>{' '}
                ({user.email})
              </p>
            ) : null}
          </div>

          <Button
            variant="secondary"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Transactions
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Track your income, expenses,
              balance, and financial insights.
            </p>
          </div>

          <Button onClick={openCreateForm}>
            Add transaction
          </Button>
        </section>

        {successMessage ? (
          <div className="mt-6">
            <Alert variant="success">
              {successMessage}
            </Alert>
          </div>
        ) : null}

        {error ? (
          <div className="mt-6">
            <Alert
              variant="error"
              title="Unable to load ledger data"
            >
              {error}
            </Alert>
          </div>
        ) : null}

        <section className="mt-8">
          {isSummaryLoading && !summary ? (
            <LoadingState message="Loading financial summary..." />
          ) : summary ? (
            <TransactionSummaryCards
              summary={summary}
            />
          ) : null}
        </section>

        <section className="mt-8">
          <TransactionFilters
            query={query}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            isLoading={isListLoading}
          />
        </section>

        {isFormOpen ? (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-950">
                {editingTransaction
                  ? 'Edit transaction'
                  : 'Create transaction'}
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                {editingTransaction
                  ? 'Update the selected ledger entry.'
                  : 'Add a new income or expense entry.'}
              </p>
            </div>

            <TransactionForm
              mode={
                editingTransaction
                  ? 'edit'
                  : 'create'
              }
              transaction={editingTransaction}
              isSubmitting={isFormSubmitting}
              error={formError}
              onSubmit={handleFormSubmit}
              onCancel={closeForm}
            />
          </section>
        ) : null}

        <section className="mt-8">
          {isListLoading ? (
            <LoadingState message="Loading transactions..." />
          ) : (
            <TransactionList
              transactions={transactions}
              onEdit={openEditForm}
              onDelete={handleDelete}
              deletingTransactionId={
                deletingTransactionId
              }
            />
          )}
        </section>

        {pagination.totalPages > 0 ? (
          <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Page {pagination.page} of{' '}
              {pagination.totalPages}
              {' · '}
              {pagination.total} total transactions
            </p>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={
                  isListLoading ||
                  pagination.page <= 1
                }
                onClick={() =>
                  void handlePageChange(
                    pagination.page - 1,
                  )
                }
              >
                Previous
              </Button>

              <Button
                variant="secondary"
                disabled={
                  isListLoading ||
                  pagination.page >=
                    pagination.totalPages
                }
                onClick={() =>
                  void handlePageChange(
                    pagination.page + 1,
                  )
                }
              >
                Next
              </Button>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}