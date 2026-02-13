"use client";

import { useState } from "react";
import {
  Loader2,
  Send,
  CheckCircle,
  ArrowLeft,
  ClipboardCheck,
  Search,
  Music,
  Mail,
  PenLine,
} from "lucide-react";
import Link from "next/link";

function useFieldValidation(value: string, validate: (v: string) => string | null): {
  error: string | null;
  touched: boolean;
  onBlur: () => void;
} {
  const [touched, setTouched] = useState(false);
  const error = touched ? validate(value) : null;
  return { error, touched, onBlur: () => setTouched(true) };
}

export default function SubmitPage(): React.ReactElement {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const nameField = useFieldValidation(name, (v) =>
    v.trim().length === 0 ? "이름을 입력해 주세요." : null,
  );
  const emailField = useFieldValidation(email, (v) =>
    v.trim().length === 0
      ? "이메일을 입력해 주세요."
      : !v.includes("@")
        ? "올바른 이메일 형식이 아닙니다."
        : null,
  );
  const titleField = useFieldValidation(title, (v) =>
    v.trim().length === 0 ? "제목을 입력해 주세요." : null,
  );
  const contentField = useFieldValidation(content, (v) =>
    v.length === 0
      ? "이야기를 입력해 주세요."
      : v.length < 30
        ? `최소 30자 이상 입력해 주세요. (${30 - v.length}자 더 필요)`
        : null,
  );

  const canSubmit =
    name.trim().length > 0 &&
    email.includes("@") &&
    title.trim().length > 0 &&
    content.length >= 30 &&
    agreedToPrivacy;

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setSubmitError(null);

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
      setSubmitError(
        err instanceof Error ? err.message : "제출에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const PROCESS_STEPS = [
    { icon: ClipboardCheck, label: "접수 완료", active: true },
    { icon: Search, label: "이야기 검토", active: false },
    { icon: Music, label: "음악 제작", active: false },
    { icon: Mail, label: "이메일 전달", active: false },
  ];

  function handleSubmitAnother(): void {
    setIsDone(false);
    setName("");
    setEmail("");
    setTitle("");
    setContent("");
    setAgreedToPrivacy(false);
    setSubmitError(null);
  }

  if (isDone) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4 pt-14 pb-12">
        <div className="animate-fade-in-up w-full max-w-md">
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-8 w-8 text-green-400" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-white">
              이야기가 접수되었습니다
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              음악이 완성되면 <span className="text-slate-300">{email}</span>로
              안내 드릴게요.
            </p>
          </div>

          {/* Process steps */}
          <div className="mt-8 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5">
            <p className="mb-4 text-xs font-medium text-slate-500">진행 과정</p>
            <div className="space-y-3">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                      step.active
                        ? "bg-green-500/15 text-green-400"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    <step.icon className="h-4 w-4" />
                  </div>
                  <span
                    className={`text-sm ${
                      step.active ? "font-medium text-white" : "text-slate-500"
                    }`}
                  >
                    {step.label}
                  </span>
                  {i === 0 && (
                    <span className="ml-auto rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-medium text-green-400">
                      완료
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline info */}
          <div className="mt-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5">
            <p className="text-sm text-slate-300">
              보통 <span className="font-semibold text-purple-400">3~5일 이내</span>에
              음악이 완성됩니다. 완성되면 이메일로 감상 링크를 보내드립니다.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:border-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              홈으로
            </Link>
            <button
              onClick={handleSubmitAnother}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/30 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
              다른 이야기 보내기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputBase =
    "w-full rounded-lg border bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 transition-all focus:bg-slate-900/80 focus:outline-none focus:ring-1";

  const inputNormal =
    "border-slate-700/80 focus:border-purple-500 focus:ring-purple-500/30";

  const inputError =
    "border-red-500/60 focus:border-red-500 focus:ring-red-500/30";

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 pt-14 pb-12">
      <div className="absolute inset-0 -z-10">
        <div className="animate-pulse-glow absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="animate-pulse-glow-delayed absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-pink-600/10 blur-[100px]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="animate-fade-in-up w-full max-w-md space-y-5"
        noValidate
      >
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-white">이야기 보내기</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
            당신의 이야기를 들려주세요. 음악으로 만들어 드립니다.
          </p>
        </div>

        {/* Name + Email - stack on very small screens */}
        <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
          <div className="group">
            <label
              htmlFor="submit-name"
              className="mb-1.5 block text-xs font-medium text-slate-400 transition-colors group-focus-within:text-purple-400"
            >
              이름
            </label>
            <input
              id="submit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={nameField.onBlur}
              placeholder="홍길동"
              autoComplete="name"
              aria-required="true"
              aria-invalid={nameField.error ? "true" : undefined}
              aria-describedby={nameField.error ? "name-error" : undefined}
              className={`${inputBase} ${nameField.error ? inputError : inputNormal}`}
            />
            {nameField.error && (
              <p id="name-error" className="mt-1 text-xs text-red-400" role="alert">
                {nameField.error}
              </p>
            )}
          </div>
          <div className="group">
            <label
              htmlFor="submit-email"
              className="mb-1.5 block text-xs font-medium text-slate-400 transition-colors group-focus-within:text-purple-400"
            >
              이메일
            </label>
            <input
              id="submit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={emailField.onBlur}
              placeholder="email@example.com"
              autoComplete="email"
              aria-required="true"
              aria-invalid={emailField.error ? "true" : undefined}
              aria-describedby={emailField.error ? "email-error" : undefined}
              className={`${inputBase} ${emailField.error ? inputError : inputNormal}`}
            />
            {emailField.error && (
              <p id="email-error" className="mt-1 text-xs text-red-400" role="alert">
                {emailField.error}
              </p>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="group">
          <label
            htmlFor="submit-title"
            className="mb-1.5 block text-xs font-medium text-slate-400 transition-colors group-focus-within:text-purple-400"
          >
            이야기 제목
          </label>
          <input
            id="submit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={titleField.onBlur}
            placeholder="예: 처음 만난 날의 기억"
            aria-required="true"
            aria-invalid={titleField.error ? "true" : undefined}
            aria-describedby={titleField.error ? "title-error" : undefined}
            className={`${inputBase} ${titleField.error ? inputError : inputNormal}`}
          />
          {titleField.error && (
            <p id="title-error" className="mt-1 text-xs text-red-400" role="alert">
              {titleField.error}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="group">
          <label
            htmlFor="submit-content"
            className="mb-1.5 block text-xs font-medium text-slate-400 transition-colors group-focus-within:text-purple-400"
          >
            이야기 내용
          </label>
          <textarea
            id="submit-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={contentField.onBlur}
            placeholder="어떤 이야기를 노래로 만들고 싶으신가요? 자유롭게 적어주세요."
            rows={6}
            aria-required="true"
            aria-invalid={contentField.error ? "true" : undefined}
            aria-describedby="content-hint"
            className={`${inputBase} resize-none leading-relaxed ${contentField.error ? inputError : inputNormal}`}
          />
          <div id="content-hint" className="mt-1 flex items-center justify-between gap-2">
            {contentField.error ? (
              <p className="text-xs text-red-400" role="alert">
                {contentField.error}
              </p>
            ) : (
              <span />
            )}
            <div className="flex shrink-0 items-center gap-1.5">
              {content.length > 0 && content.length < 30 && (
                <div className="h-1 w-16 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{
                      width: `${Math.min((content.length / 30) * 100, 100)}%`,
                    }}
                  />
                </div>
              )}
              <span
                className={`text-xs ${content.length >= 30 ? "text-slate-600" : "text-slate-500"}`}
              >
                {content.length}자{content.length < 30 && " / 최소 30자"}
              </span>
            </div>
          </div>
        </div>

        {/* Privacy Agreement */}
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={agreedToPrivacy}
            onChange={(e) => setAgreedToPrivacy(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-600 bg-slate-800 text-purple-500 accent-purple-500 focus:ring-1 focus:ring-purple-500/30"
          />
          <span className="text-xs leading-relaxed text-slate-400">
            <Link
              href="/privacy"
              target="_blank"
              className="text-purple-400 underline underline-offset-2 hover:text-purple-300"
            >
              개인정보처리방침
            </Link>
            에 동의합니다.
          </span>
        </label>

        {/* Submit Error */}
        {submitError && (
          <div
            className="rounded-lg border border-red-800/60 bg-red-900/20 px-3 py-2.5 text-xs text-red-300"
            role="alert"
          >
            {submitError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/30 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-purple-500/15"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              보내는 중...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              이야기 보내기
            </>
          )}
        </button>
      </form>
    </div>
  );
}
