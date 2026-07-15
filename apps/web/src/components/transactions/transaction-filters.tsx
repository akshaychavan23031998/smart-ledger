'use client';

import { FormEvent, useState } from 'react';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  sortFieldLabels,
  sortOrderLabels,
  TRANSACTION_CATEGORIES,
  TRANSACTION_TYPES,
  transactionCategoryLabels,
  transactionTypeLabels,
} from '../../lib/constants';
import type {
  SortOrder,
  TransactionCategory,
  TransactionQuery,
  TransactionSortField,
  TransactionType,
} from '../../types/transaction';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface TransactionFiltersProps {
  query: TransactionQuery;
  onApply: (query: TransactionQuery) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function TransactionFilters({
  query,
  onApply,
  onReset,
  isLoading = false,
}: TransactionFiltersProps) {
  const [search, setSearch] = useState(query.search ?? '');
  const [type, setType] = useState<TransactionType | ''>(
    query.type ?? '',
  );
  const [category, setCategory] = useState<
    TransactionCategory | ''
  >(query.category ?? '');
  const [dateFrom, setDateFrom] = useState(
    query.dateFrom?.slice(0, 10) ?? '',
  );
  const [dateTo, setDateTo] = useState(
    query.dateTo?.slice(0, 10) ?? '',
  );
  const [sortBy, setSortBy] =
    useState<TransactionSortField>(
      query.sortBy ?? DEFAULT_SORT_BY,
    );
  const [sortOrder, setSortOrder] =
    useState<SortOrder>(
      query.sortOrder ?? DEFAULT_SORT_ORDER,
    );

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    onApply({
      page: 1,
      limit: query.limit ?? DEFAULT_PAGE_SIZE,
      search: search.trim() || undefined,
      type: type || undefined,
      category: category || undefined,
      dateFrom: dateFrom
        ? new Date(`${dateFrom}T00:00:00`).toISOString()
        : undefined,
      dateTo: dateTo
        ? new Date(`${dateTo}T23:59:59.999`).toISOString()
        : undefined,
      sortBy,
      sortOrder,
    });
  }

  function handleReset() {
    setSearch('');
    setType('');
    setCategory('');
    setDateFrom('');
    setDateTo('');
    setSortBy(DEFAULT_SORT_BY);
    setSortOrder(DEFAULT_SORT_ORDER);

    onReset();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Input
          label="Search"
          name="search"
          type="search"
          placeholder="Title or description"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          disabled={isLoading}
        />

        <div className="space-y-2">
          <label
            htmlFor="transaction-type"
            className="block text-sm font-medium text-slate-700"
          >
            Type
          </label>

          <select
            id="transaction-type"
            value={type}
            onChange={(event) =>
              setType(
                event.target.value as TransactionType | '',
              )
            }
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">All types</option>

            {TRANSACTION_TYPES.map((item) => (
              <option key={item} value={item}>
                {transactionTypeLabels[item]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="transaction-category"
            className="block text-sm font-medium text-slate-700"
          >
            Category
          </label>

          <select
            id="transaction-category"
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value as
                  | TransactionCategory
                  | '',
              )
            }
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">All categories</option>

            {TRANSACTION_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {transactionCategoryLabels[item]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="transaction-sort-by"
            className="block text-sm font-medium text-slate-700"
          >
            Sort by
          </label>

          <select
            id="transaction-sort-by"
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target.value as TransactionSortField,
              )
            }
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {Object.entries(sortFieldLabels).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </select>
        </div>

        <Input
          label="From date"
          name="dateFrom"
          type="date"
          value={dateFrom}
          onChange={(event) =>
            setDateFrom(event.target.value)
          }
          disabled={isLoading}
        />

        <Input
          label="To date"
          name="dateTo"
          type="date"
          value={dateTo}
          onChange={(event) =>
            setDateTo(event.target.value)
          }
          disabled={isLoading}
        />

        <div className="space-y-2">
          <label
            htmlFor="transaction-sort-order"
            className="block text-sm font-medium text-slate-700"
          >
            Sort order
          </label>

          <select
            id="transaction-sort-order"
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(
                event.target.value as SortOrder,
              )
            }
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {Object.entries(sortOrderLabels).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={handleReset}
          disabled={isLoading}
        >
          Reset filters
        </Button>

        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Applying..."
        >
          Apply filters
        </Button>
      </div>
    </form>
  );
}