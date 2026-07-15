'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_TYPES,
  transactionCategoryLabels,
  transactionTypeLabels,
} from '../../lib/constants';
import {
  fromDateTimeLocalValue,
  toDateTimeLocalValue,
} from '../../lib/date';
import {
  majorToMinor,
  minorToMajor,
} from '../../lib/currency';
import type {
  CreateTransactionInput,
  Transaction,
  TransactionCategory,
  TransactionType,
  UpdateTransactionInput,
} from '../../types/transaction';
import { Alert } from '../ui/alert';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type TransactionFormMode = 'create' | 'edit';

interface TransactionFormProps {
  mode: TransactionFormMode;
  transaction?: Transaction | null;
  isSubmitting?: boolean;
  error?: string;
  onSubmit: (
    payload: CreateTransactionInput | UpdateTransactionInput,
  ) => Promise<void> | void;
  onCancel?: () => void;
}

interface FormErrors {
  amount?: string;
  title?: string;
  occurredAt?: string;
}

function getDefaultOccurredAt(): string {
  return toDateTimeLocalValue(new Date().toISOString());
}

export function TransactionForm({
  mode,
  transaction = null,
  isSubmitting = false,
  error = '',
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const isEditMode = mode === 'edit';

  const [type, setType] = useState<TransactionType>(
    transaction?.type ?? 'EXPENSE',
  );
  const [category, setCategory] =
    useState<TransactionCategory>(
      transaction?.category ?? 'OTHER',
    );
  const [amount, setAmount] = useState(
    transaction
      ? minorToMajor(transaction.amountMinor)
      : '',
  );
  const [title, setTitle] = useState(
    transaction?.title ?? '',
  );
  const [description, setDescription] = useState(
    transaction?.description ?? '',
  );
  const [occurredAt, setOccurredAt] = useState(
    transaction
      ? toDateTimeLocalValue(transaction.occurredAt)
      : getDefaultOccurredAt(),
  );
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setType(transaction?.type ?? 'EXPENSE');
    setCategory(transaction?.category ?? 'OTHER');
    setAmount(
      transaction
        ? minorToMajor(transaction.amountMinor)
        : '',
    );
    setTitle(transaction?.title ?? '');
    setDescription(transaction?.description ?? '');
    setOccurredAt(
      transaction
        ? toDateTimeLocalValue(transaction.occurredAt)
        : getDefaultOccurredAt(),
    );
    setErrors({});
  }, [transaction, mode]);

  function validate(): {
    isValid: boolean;
    amountMinor: number | null;
  } {
    const nextErrors: FormErrors = {};
    const amountMinor = majorToMinor(amount);

    if (amountMinor === null) {
      nextErrors.amount =
        'Enter a valid amount greater than zero.';
    }

    if (!title.trim()) {
      nextErrors.title = 'Title is required.';
    } else if (title.trim().length > 120) {
      nextErrors.title =
        'Title must be 120 characters or fewer.';
    }

    if (!occurredAt) {
      nextErrors.occurredAt =
        'Transaction date and time are required.';
    }

    setErrors(nextErrors);

    return {
      isValid: Object.keys(nextErrors).length === 0,
      amountMinor,
    };
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const validation = validate();

    if (
      !validation.isValid ||
      validation.amountMinor === null
    ) {
      return;
    }

    const payload: CreateTransactionInput = {
      type,
      category,
      amountMinor: validation.amountMinor,
      title: title.trim(),
      description: description.trim() || undefined,
      occurredAt: fromDateTimeLocalValue(occurredAt),
    };

    await onSubmit(
      isEditMode
        ? (payload satisfies UpdateTransactionInput)
        : payload,
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
    >
      {error ? (
        <Alert variant="error">
          {error}
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="transaction-form-type"
            className="block text-sm font-medium text-slate-700"
          >
            Type
          </label>

          <select
            id="transaction-form-type"
            value={type}
            onChange={(event) =>
              setType(
                event.target.value as TransactionType,
              )
            }
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {TRANSACTION_TYPES.map((item) => (
              <option key={item} value={item}>
                {transactionTypeLabels[item]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="transaction-form-category"
            className="block text-sm font-medium text-slate-700"
          >
            Category
          </label>

          <select
            id="transaction-form-category"
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value as TransactionCategory,
              )
            }
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {TRANSACTION_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {transactionCategoryLabels[item]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input
        label="Amount"
        name="amount"
        type="number"
        inputMode="decimal"
        min="0.01"
        step="0.01"
        placeholder="0.00"
        value={amount}
        onChange={(event) =>
          setAmount(event.target.value)
        }
        error={errors.amount}
        hint="Enter the amount in rupees."
        disabled={isSubmitting}
        required
      />

      <Input
        label="Title"
        name="title"
        type="text"
        maxLength={120}
        value={title}
        onChange={(event) =>
          setTitle(event.target.value)
        }
        error={errors.title}
        disabled={isSubmitting}
        required
      />

      <div className="space-y-2">
        <label
          htmlFor="transaction-description"
          className="block text-sm font-medium text-slate-700"
        >
          Description
        </label>

        <textarea
          id="transaction-description"
          name="description"
          rows={4}
          maxLength={500}
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          disabled={isSubmitting}
          className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="Optional notes about this transaction"
        />

        <p className="text-xs text-slate-500">
          {description.length}/500 characters
        </p>
      </div>

      <Input
        label="Transaction date and time"
        name="occurredAt"
        type="datetime-local"
        value={occurredAt}
        onChange={(event) =>
          setOccurredAt(event.target.value)
        }
        error={errors.occurredAt}
        disabled={isSubmitting}
        required
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        ) : null}

        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingText={
            isEditMode
              ? 'Saving changes...'
              : 'Creating transaction...'
          }
        >
          {isEditMode
            ? 'Save changes'
            : 'Create transaction'}
        </Button>
      </div>
    </form>
  );
}