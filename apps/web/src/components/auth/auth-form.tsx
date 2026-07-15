'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { apiPost, getApiErrorMessage } from '../../lib/api';
import { setAccessToken } from '../../lib/auth';
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
} from '../../types/auth';
import { Alert } from '../ui/alert';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type AuthMode = 'login' | 'register';

interface AuthFormProps {
  mode: AuthMode;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();

  const isRegister = mode === 'register';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function validate(): boolean {
    const nextErrors: FormErrors = {};

    if (isRegister && name.trim().length < 2) {
      nextErrors.name =
        'Name must contain at least 2 characters.';
    }

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      nextErrors.email = 'Email is required.';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail,
      )
    ) {
      nextErrors.email =
        'Enter a valid email address.';
    }

    if (password.length < 8) {
      nextErrors.password =
        'Password must contain at least 8 characters.';
    }

    if (
      isRegister &&
      confirmPassword !== password
    ) {
      nextErrors.confirmPassword =
        'Passwords do not match.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setApiError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let response: AuthResponse;

      if (isRegister) {
        const payload: RegisterInput = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        };

        response = await apiPost<
          AuthResponse,
          RegisterInput
        >('/auth/register', payload);
      } else {
        const payload: LoginInput = {
          email: email.trim().toLowerCase(),
          password,
        };

        response = await apiPost<
          AuthResponse,
          LoginInput
        >('/auth/login', payload);
      }

      setAccessToken(response.accessToken);
      router.replace('/transactions');
    } catch (error) {
      setApiError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
    >
      {apiError ? (
        <Alert variant="error">
          {apiError}
        </Alert>
      ) : null}

      {isRegister ? (
        <Input
          label="Full name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          error={errors.name}
          disabled={isSubmitting}
          required
        />
      ) : null}

      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) =>
          setEmail(event.target.value)
        }
        error={errors.email}
        disabled={isSubmitting}
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete={
          isRegister
            ? 'new-password'
            : 'current-password'
        }
        value={password}
        onChange={(event) =>
          setPassword(event.target.value)
        }
        error={errors.password}
        hint={
          isRegister
            ? 'Use at least 8 characters.'
            : undefined
        }
        disabled={isSubmitting}
        required
      />

      {isRegister ? (
        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(event.target.value)
          }
          error={errors.confirmPassword}
          disabled={isSubmitting}
          required
        />
      ) : null}

      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
        loadingText={
          isRegister
            ? 'Creating account...'
            : 'Signing in...'
        }
      >
        {isRegister
          ? 'Create account'
          : 'Sign in'}
      </Button>

      <p className="text-center text-sm text-slate-600">
        {isRegister
          ? 'Already have an account?'
          : 'Need an account?'}{' '}
        <Link
          href={isRegister ? '/login' : '/register'}
          className="font-semibold text-slate-900 underline-offset-4 hover:underline"
        >
          {isRegister ? 'Sign in' : 'Create one'}
        </Link>
      </p>
    </form>
  );
}