import Link from "next/link";
import { ArrowRight, PenLine, Wand2, Headphones } from "lucide-react";

const STEPS = [
  {
    icon: PenLine,
    title: "이야기를 들려주세요",
    desc: "소중한 순간, 잊지 못할 추억을 글로 적어주세요.",
  },
  {
    icon: Wand2,
    title: "음악으로 만들어요",
    desc: "당신의 이야기에 어울리는 곡을 정성껏 제작합니다.",
  },
  {
    icon: Headphones,
    title: "세상에 하나뿐인 노래",
    desc: "완성된 음악을 듣고, 소중한 사람에게 선물하세요.",
  },
] as const;

export default function HomePage(): React.ReactElement {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-dvh items-center justify-center overflow-hidden pt-14">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/3 top-1/4 h-[420px] w-[420px] rounded-full bg-purple-600/15 blur-[120px]" />
          <div className="absolute right-1/3 bottom-1/4 h-[320px] w-[320px] rounded-full bg-pink-600/15 blur-[100px]" />
        </div>

        <div className="px-4 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            당신의 이야기가
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              음악이 됩니다
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-slate-400 sm:text-lg">
            소중한 이야기를 세상에 하나뿐인 노래로 만들어 드립니다.
          </p>
          <div className="mt-8">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40 hover:brightness-110"
            >
              이야기 보내기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto w-full max-w-3xl px-4 py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="flex flex-col items-center rounded-2xl border border-slate-800/60 bg-slate-900/40 px-5 py-8 text-center"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 text-purple-400">
                <step.icon className="h-5 w-5" />
              </div>
              <span className="mb-1 text-xs font-medium text-slate-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-sm font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
