"use client";

import { useState, Suspense, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Lock } from "lucide-react";

function LoginForm(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="animate-fade-in-up w-full max-w-md">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20">
          <Lock className="h-5 w-5 text-purple-400" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-white">관리자 로그인</h1>
        <p className="mt-1.5 text-xs text-slate-500">관리자 전용 페이지입니다</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="group">
          <label
            htmlFor="login-email"
            className="mb-1.5 block text-xs font-medium text-slate-400 transition-colors group-focus-within:text-purple-400"
          >
            이메일
          </label>
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 transition-all focus:border-purple-500 focus:bg-slate-900/80 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
            placeholder="you@example.com"
          />
        </div>

        <div className="group">
          <label
            htmlFor="login-password"
            className="mb-1.5 block text-xs font-medium text-slate-400 transition-colors group-focus-within:text-purple-400"
          >
            비밀번호
          </label>
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 transition-all focus:border-purple-500 focus:bg-slate-900/80 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        {error && (
          <div
            className="rounded-lg border border-red-800/60 bg-red-900/20 px-3 py-2.5 text-xs text-red-300"
            role="alert"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/30 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              로그인 중...
            </>
          ) : (
            "로그인"
          )}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage(): React.ReactElement {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 pt-14 pb-12">
      <div className="absolute inset-0 -z-10">
        <div className="animate-pulse-glow absolute left-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-purple-600/8 blur-[120px]" />
      </div>
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            로딩 중...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
