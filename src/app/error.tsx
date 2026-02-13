"use client";

import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorPageProps {
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps): React.ReactElement {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 pt-14">
      <div className="animate-fade-in-up text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white">
          문제가 발생했습니다
        </h2>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">
          일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-800/60 px-5 py-2.5 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-purple-500/30 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <RotateCcw className="h-4 w-4" />
          다시 시도
        </button>
      </div>
    </div>
  );
}
