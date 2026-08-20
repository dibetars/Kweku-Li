'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { loginAction } from '../actions';

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.ok) router.push('/admin/dashboard');
  }, [state, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-900">
      <form action={formAction} className="w-full max-w-sm space-y-4 rounded-2xl border border-neutral-200 bg-white p-8">
        <h1 className="text-xl font-bold">Kweku Li — Admin</h1>
        <input
          name="username"
          placeholder="Username"
          required
          className="w-full rounded-lg border border-neutral-300 px-4 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full rounded-lg border border-neutral-300 px-4 py-2"
        />
        {state && !state.ok && <p className="text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
