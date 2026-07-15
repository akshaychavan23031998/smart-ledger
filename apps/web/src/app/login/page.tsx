import Link from 'next/link';
import { AuthForm } from '../../components/auth/auth-form';
import { APP_NAME } from '../../lib/constants';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-2">
        <section className="hidden lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            {APP_NAME}
          </p>

          <h1 className="mt-4 max-w-xl text-5xl font-bold tracking-tight text-slate-950">
            Take control of your money with a cleaner ledger.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Track income, expenses, categories, and transaction history from one
            focused dashboard.
          </p>

          <div className="mt-8 grid max-w-lg gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                Secure access
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your ledger is protected with authenticated API access.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                Simple tracking
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add and manage financial records without unnecessary complexity.
              </p>
            </div>
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
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Continue to your Smart Ledger dashboard.
              </p>
            </div>

            <div className="mt-8">
              <AuthForm mode="login" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}