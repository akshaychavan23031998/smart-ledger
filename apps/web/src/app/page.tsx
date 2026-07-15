import Link from 'next/link';
import { APP_NAME } from '../lib/constants';

const features = [
  {
    title: 'Track everything clearly',
    description:
      'Record income and expenses with categories, dates, notes, and accurate amounts.',
  },
  {
    title: 'Find transactions quickly',
    description:
      'Search, filter, sort, and paginate your ledger without scrolling through clutter.',
  },
  {
    title: 'Stay in control',
    description:
      'Keep your financial activity organized in one focused and secure dashboard.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-white"
          >
            {APP_NAME}
          </Link>

          <nav
            aria-label="Primary navigation"
            className="flex items-center gap-3"
          >
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Create account
            </Link>
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <section>
            <p className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              Smarter personal finance tracking
            </p>

            <h1 className="mt-7 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
              A clean ledger for better money decisions.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Track income, expenses, categories, and financial history from one
              simple dashboard built for clarity.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Start tracking
              </Link>

              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Open dashboard
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-8">
              <div>
                <p className="text-2xl font-bold text-white">100%</p>
                <p className="mt-1 text-xs text-slate-400">
                  Focused tracking
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">Fast</p>
                <p className="mt-1 text-xs text-slate-400">
                  Search and filters
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">Secure</p>
                <p className="mt-1 text-xs text-slate-400">
                  Authenticated access
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-7">
            <div className="rounded-2xl bg-white p-5 text-slate-950 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Current balance
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-tight">
                    ₹84,250.00
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700">
                  +12.4%
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-sm font-medium text-emerald-700">
                    Income
                  </p>
                  <p className="mt-2 text-xl font-bold text-emerald-950">
                    ₹1,25,000
                  </p>
                </div>

                <div className="rounded-2xl bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-700">
                    Expenses
                  </p>
                  <p className="mt-2 text-xl font-bold text-red-950">
                    ₹40,750
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-3">
                {[
                  ['Salary', 'Income', '+ ₹85,000'],
                  ['House rent', 'Housing', '- ₹20,000'],
                  ['Groceries', 'Food', '- ₹4,850'],
                ].map(([title, category, amount]) => (
                  <div
                    key={title}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {category}
                      </p>
                    </div>

                    <p
                      className={[
                        'text-sm font-bold',
                        amount.startsWith('+')
                          ? 'text-emerald-700'
                          : 'text-red-700',
                      ].join(' ')}
                    >
                      {amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20 text-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Built for clarity
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything required to manage a personal ledger.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-950">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}