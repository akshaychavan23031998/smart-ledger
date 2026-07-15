const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const dateOnlyFormatter = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
});

export function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateTimeFormatter.format(date);
}

export function formatDateOnly(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateOnlyFormatter.format(date);
}

export function toDateTimeLocalValue(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const offsetInMilliseconds =
    date.getTimezoneOffset() * 60 * 1000;

  return new Date(date.getTime() - offsetInMilliseconds)
    .toISOString()
    .slice(0, 16);
}

export function fromDateTimeLocalValue(value: string): string {
  return new Date(value).toISOString();
}