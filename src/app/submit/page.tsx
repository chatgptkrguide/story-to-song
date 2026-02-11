"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Music, Send, Loader2 } from "lucide-react";

const MOOD_OPTIONS = [
  "행복한",
  "슬픈",
  "희망찬",
  "감성적",
  "에너지틱",
  "평화로운",
] as const;

const GENRE_OPTIONS = [
  "팝",
  "발라드",
  "록",
  "R&B",
  "힙합",
  "재즈",
  "클래식",
  "EDM",
] as const;

export default function SubmitPage(): React.ReactElement {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [genre, setGenre] = useState("");

  const isValid = title.trim().length > 0 && content.length >= 50 && mood && genre;

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, mood, genre }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "제출에 실패했습니다.");
      }

      router.push("/my-songs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "제출에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600">
            <Music className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">나만의 노래 만들기</h1>
          <p className="mt-2 text-slate-400">
            당신의 이야기를 들려주세요. AI가 특별한 노래로 만들어 드립니다.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-700 bg-slate-800/50 p-8"
        >
          {error && (
            <div className="rounded-xl border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-300">
              제목
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="이야기의 제목을 입력해주세요"
              className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="mb-2 block text-sm font-medium text-slate-300">
              이야기 내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="당신의 이야기를 자유롭게 적어주세요 (최소 50자)"
              rows={6}
              className="w-full resize-none rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
            <div className="mt-1 flex justify-end">
              <span
                className={`text-sm ${
                  content.length >= 50 ? "text-green-400" : "text-slate-500"
                }`}
              >
                {content.length}자 / 최소 50자
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="mood" className="mb-2 block text-sm font-medium text-slate-300">
                분위기
              </label>
              <select
                id="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-white transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                required
              >
                <option value="" disabled>
                  분위기를 선택해주세요
                </option>
                {MOOD_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="genre" className="mb-2 block text-sm font-medium text-slate-300">
                장르
              </label>
              <select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-white transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                required
              >
                <option value="" disabled>
                  장르를 선택해주세요
                </option>
                {GENRE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                제출 중...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                이야기 제출하기
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
