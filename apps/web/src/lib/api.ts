import {
  getAccessToken,
  removeAccessToken,
} from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiErrorDetails = string | Record<string, unknown>;

interface ApiRequestOptions
  extends Omit<RequestInit, 'body'> {
  body?: unknown;
  authenticated?: boolean;
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getApiUrl(): string {
  if (!API_URL) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is not configured.',
    );
  }

  return API_URL.replace(/\/+$/, '');
}

function extractMessage(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  if (Array.isArray(value)) {
    const messages = value.filter(
      (item): item is string =>
        typeof item === 'string' &&
        item.trim().length > 0,
    );

    return messages.length > 0
      ? messages.join(', ')
      : null;
  }

  return null;
}

function normalizeErrorMessage(
  payload: unknown,
): string {
  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  if (!isRecord(payload)) {
    return 'Something went wrong. Please try again.';
  }

  return (
    extractMessage(payload.message) ??
    extractMessage(payload.error) ??
    'Something went wrong. Please try again.'
  );
}

function normalizeErrorDetails(
  payload: unknown,
): ApiErrorDetails | undefined {
  if (typeof payload === 'string') {
    return payload;
  }

  if (isRecord(payload)) {
    return payload;
  }

  return undefined;
}

async function parseResponse(
  response: Response,
): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType =
    response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return undefined;
    }
  }

  try {
    const text = await response.text();
    return text || undefined;
  } catch {
    return undefined;
  }
}

export class ApiError extends Error {
  readonly status: number;
  readonly details?: ApiErrorDetails;

  constructor(
    message: string,
    status: number,
    details?: ApiErrorDetails,
  ) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
    this.details = details;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    body,
    authenticated = false,
    headers: customHeaders,
    ...requestOptions
  } = options;

  const headers = new Headers(customHeaders);

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (authenticated) {
    const accessToken = getAccessToken();

    if (!accessToken) {
      throw new ApiError(
        'Authentication is required.',
        401,
      );
    }

    headers.set(
      'Authorization',
      `Bearer ${accessToken}`,
    );
  }

  let response: Response;

  try {
    response = await fetch(
      `${getApiUrl()}${
        path.startsWith('/') ? path : `/${path}`
      }`,
      {
        ...requestOptions,
        headers,
        body:
          body === undefined
            ? undefined
            : JSON.stringify(body),
      },
    );
  } catch {
    throw new ApiError(
      'Unable to connect to the server.',
      0,
    );
  }

  const payload = await parseResponse(response);

  if (!response.ok) {
    if (
      response.status === 401 &&
      authenticated
    ) {
      removeAccessToken();
    }

    throw new ApiError(
      normalizeErrorMessage(payload),
      response.status,
      normalizeErrorDetails(payload),
    );
  }

  return payload as T;
}

export function apiGet<T>(
  path: string,
  authenticated = false,
): Promise<T> {
  return apiRequest<T>(path, {
    method: 'GET',
    authenticated,
  });
}

export function apiPost<
  TResponse,
  TBody = unknown,
>(
  path: string,
  body: TBody,
  authenticated = false,
): Promise<TResponse> {
  return apiRequest<TResponse>(path, {
    method: 'POST',
    body,
    authenticated,
  });
}

export function apiPatch<
  TResponse,
  TBody = unknown,
>(
  path: string,
  body: TBody,
  authenticated = false,
): Promise<TResponse> {
  return apiRequest<TResponse>(path, {
    method: 'PATCH',
    body,
    authenticated,
  });
}

export function apiDelete(
  path: string,
  authenticated = false,
): Promise<void> {
  return apiRequest<void>(path, {
    method: 'DELETE',
    authenticated,
  });
}

export function getApiErrorMessage(
  error: unknown,
): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (
    error instanceof Error &&
    error.message.trim()
  ) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}