"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle } from "lucide-react";

export default function SubmitPage(): React.ReactElement {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const canSubmit =
    name.trim().length > 0 &&
    email.includes("@") &&
    title.trim().length > 0 &&
    content.length >= 30;

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, title, content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "제출에 실패했습니다.");
      }

      setIsDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "제출에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isDone) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4 pt-14">
        <div className="text-center">
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-400" />
          <h2 className="text-xl font-bold text-white">
            이야기가 접수되었습니다
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            음악이 완성되면 {email}로 안내 드릴게요.
          </p>
          <a
            href="/"
            className="mt-6 inline-block text-sm text-purple-400 transition-colors hover:text-purple-300"
          >
            돌아가기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 pt-14">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-pink-600/10 blur-[100px]" />
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-white">이야기 보내기</h1>
          <p className="mt-1 text-sm text-slate-400">
            당신의 이야기를 들려주세요. 음악으로 만들어 드립니다.
          </p>
        </div>

        {/* Name + Email */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-slate-500">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 transition-colors focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 transition-colors focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="mb-1 block text-xs text-slate-500">
            이야기 제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 처음 만난 날의 기억"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 transition-colors focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="mb-1 block text-xs text-slate-500">
            이야기 내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="어떤 이야기를 노래로 만들고 싶으신가요? 자유롭게 적어주세요."
            rows={5}
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 transition-colors focus:border-purple-500 focus:outline-none"
          />
          <p className="mt-1 text-right text-xs text-slate-600">
            {content.length}자{content.length < 30 && " / 최소 30자"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-lg border border-red-800 bg-red-900/30 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              보내는 중...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              이야기 보내기
            </>
          )}
        </button>
      </form>
    </div>
  );
}
