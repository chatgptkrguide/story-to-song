"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Send,
  Smile,
  Heart,
  Sun,
  Sparkles,
  Zap,
  Cloud,
  Music,
  Mic,
  Guitar,
  Disc3,
  Headphones,
  Piano,
  Radio,
  Volume2,
  Check,
} from "lucide-react";

const TOTAL_STEPS = 4;

const MOOD_OPTIONS = [
  { value: "행복한", label: "행복한", icon: Smile, color: "from-yellow-500 to-orange-500" },
  { value: "슬픈", label: "슬픈", icon: Cloud, color: "from-blue-500 to-indigo-500" },
  { value: "희망찬", label: "희망찬", icon: Sun, color: "from-amber-400 to-yellow-500" },
  { value: "감성적", label: "감성적", icon: Heart, color: "from-pink-500 to-rose-500" },
  { value: "에너지틱", label: "에너지틱", icon: Zap, color: "from-orange-500 to-red-500" },
  { value: "평화로운", label: "평화로운", icon: Sparkles, color: "from-emerald-400 to-teal-500" },
] as const;

const GENRE_OPTIONS = [
  { value: "팝", label: "팝", icon: Music, color: "from-purple-500 to-pink-500" },
  { value: "발라드", label: "발라드", icon: Mic, color: "from-blue-500 to-purple-500" },
  { value: "록", label: "록", icon: Guitar, color: "from-red-500 to-orange-500" },
  { value: "R&B", label: "R&B", icon: Disc3, color: "from-violet-500 to-purple-500" },
  { value: "힙합", label: "힙합", icon: Headphones, color: "from-yellow-500 to-amber-600" },
  { value: "재즈", label: "재즈", icon: Piano, color: "from-amber-500 to-yellow-600" },
  { value: "클래식", label: "클래식", icon: Radio, color: "from-emerald-500 to-green-600" },
  { value: "EDM", label: "EDM", icon: Volume2, color: "from-cyan-500 to-blue-500" },
] as const;

export default function SubmitPage(): React.ReactElement {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [genre, setGenre] = useState("");

  function canGoNext(): boolean {
    switch (step) {
      case 1: return title.trim().length > 0;
      case 2: return content.length >= 50;
      case 3: return mood !== "";
      case 4: return genre !== "";
      default: return false;
    }
  }

  function handleNext(): void {
    if (step < TOTAL_STEPS && canGoNext()) {
      setStep(step + 1);
    }
  }

  function handleBack(): void {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  async function handleSubmit(): Promise<void> {
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

  function handleKeyDown(e: React.KeyboardEvent): void {
    if (e.key === "Enter" && !e.shiftKey && step !== 2) {
      e.preventDefault();
      if (step === TOTAL_STEPS && canGoNext()) {
        handleSubmit();
      } else {
        handleNext();
      }
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-pink-600/15 blur-[100px]" />
      </div>

      <div className="w-full max-w-lg" onKeyDown={handleKeyDown}>
        {/* Progress bar */}
        <div className="mb-8 flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i < step
                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                  : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Step counter */}
        <p className="mb-2 text-sm text-slate-500">{step} / {TOTAL_STEPS}</p>

        {/* Step content */}
        <div className="min-h-[340px]">
          {/* Step 1: Title */}
          {step === 1 && (
            <div className="animate-fade-in-right">
              <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
                이야기의 제목을 알려주세요
              </h2>
              <p className="mb-8 text-slate-400">
                어떤 이야기를 노래로 만들고 싶으신가요?
              </p>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 처음 만난 날의 기억"
                autoFocus
                className="w-full border-b-2 border-slate-700 bg-transparent pb-3 text-xl text-white placeholder-slate-600 transition-colors focus:border-purple-500 focus:outline-none"
              />
            </div>
          )}

          {/* Step 2: Content */}
          {step === 2 && (
            <div className="animate-fade-in-right">
              <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
                이야기를 들려주세요
              </h2>
              <p className="mb-8 text-slate-400">
                자유롭게 적어주세요. 길수록 더 특별한 노래가 됩니다.
              </p>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="그날은 비가 오고 있었어요..."
                rows={6}
                autoFocus
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-600 transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <div className="mt-2 flex justify-end">
                <span
                  className={`text-sm transition-colors ${
                    content.length >= 50 ? "text-green-400" : "text-slate-500"
                  }`}
                >
                  {content.length}자 / 최소 50자
                </span>
              </div>
            </div>
          )}

          {/* Step 3: Mood */}
          {step === 3 && (
            <div className="animate-fade-in-right">
              <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
                어떤 느낌의 노래를 원하세요?
              </h2>
              <p className="mb-8 text-slate-400">
                이야기의 분위기를 골라주세요.
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {MOOD_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const selected = mood === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setMood(option.value)}
                      className={`group relative flex flex-col items-center gap-2 rounded-2xl border p-5 transition-all ${
                        selected
                          ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/10"
                          : "border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50"
                      }`}
                    >
                      {selected && (
                        <div className="absolute right-2 top-2">
                          <Check className="h-4 w-4 text-purple-400" />
                        </div>
                      )}
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${option.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className={`text-sm font-medium ${selected ? "text-white" : "text-slate-300"}`}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Genre */}
          {step === 4 && (
            <div className="animate-fade-in-right">
              <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
                어떤 장르가 좋을까요?
              </h2>
              <p className="mb-8 text-slate-400">
                원하는 음악 장르를 선택해주세요.
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {GENRE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const selected = genre === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setGenre(option.value)}
                      className={`group relative flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all ${
                        selected
                          ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/10"
                          : "border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50"
                      }`}
                    >
                      {selected && (
                        <div className="absolute right-2 top-2">
                          <Check className="h-4 w-4 text-purple-400" />
                        </div>
                      )}
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${option.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className={`text-xs font-medium ${selected ? "text-white" : "text-slate-300"}`}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-slate-400 transition-colors hover:text-white ${
              step === 1 ? "invisible" : ""
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            이전
          </button>

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canGoNext() || isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  제출 중...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  이야기 보내기
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
