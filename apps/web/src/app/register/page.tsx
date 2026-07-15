import Link from 'next/link';
import { AuthForm } from '../../components/auth/auth-form';
import { APP_NAME } from '../../lib/constants';

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-2">
        <section className="hidden lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            {APP_NAME}
          </p>

          <h1 className="mt-4 max-w-xl text-5xl font-bold tracking-tight text-slate-950">
            Build better money habits with a smarter ledger.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Create your account and start organizing income, expenses, and
            transaction history in one place.
          </p>

          <div className="mt-8 space-y-4">
            {[
              'Track income and expenses clearly',
              'Organize records by category',
              'Search, filter, sort, and paginate transactions',
            ].map((item) => (
              <div
                key={item}
                className="flex max-w-lg items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700"
                >
                  ✓
                </span>

                <p className="text-sm font-medium text-slate-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
            <Link
              href="/"
              className="inline-flex text-sm font-semibold text-slate-600 hover:text-slate-950"
            >
              ← Back to home
            </Link>

            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Get started
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Set up your Smart Ledger account in a few seconds.
              </p>
            </div>

            <div className="mt-8">
              <AuthForm mode="register" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}