import Link from "next/link";
import {
  Send,
  Music,
  Headphones,
  Sparkles,
  Check,
  ArrowRight,
} from "lucide-react";

const PROCESS_STEPS = [
  {
    icon: Send,
    title: "이야기 전달",
    description:
      "연인과의 첫 만남, 가족의 추억, 친구와의 에피소드 등 음악으로 만들고 싶은 이야기를 보내주세요.",
  },
  {
    icon: Music,
    title: "음악 제작",
    description:
      "AI가 당신의 이야기를 분석하여 감정과 분위기에 맞는 세상에 하나뿐인 음악을 만들어 드립니다.",
  },
  {
    icon: Headphones,
    title: "음악 수령",
    description:
      "완성된 음악을 고음질 파일로 다운로드하고, 소중한 사람에게 특별한 선물을 전하세요.",
  },
] as const;

interface PricingPlan {
  name: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "한 곡",
    price: "29,000",
    unit: "원 / 곡",
    description: "특별한 순간을 위한 단 하나의 노래",
    features: [
      "이야기 기반 맞춤 작곡",
      "1회 수정 포함",
      "고음질 MP3 다운로드",
      "제작 소요: 24시간 이내",
    ],
    popular: false,
    cta: "한 곡 주문하기",
  },
  {
    name: "구독",
    price: "49,000",
    unit: "원 / 월",
    description: "매달 새로운 이야기를 음악으로",
    features: [
      "월 3곡 제작",
      "무제한 수정",
      "고음질 MP3 + WAV 다운로드",
      "우선 제작 (12시간 이내)",
      "전용 아티스트 매칭",
    ],
    popular: true,
    cta: "구독 시작하기",
  },
  {
    name: "저작권 양도",
    price: "99,000",
    unit: "원 / 곡",
    description: "상업적 사용이 가능한 완전한 소유권",
    features: [
      "이야기 기반 맞춤 작곡",
      "3회 수정 포함",
      "모든 포맷 다운로드",
      "저작권 완전 양도",
      "상업적 사용 가능",
    ],
    popular: false,
    cta: "저작권 양도 주문",
  },
];

export default function HomePage(): React.ReactElement {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
          <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-pink-600/20 blur-[120px]" />
          <div className="absolute bottom-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300">
              <Sparkles className="h-4 w-4" />
              AI 기반 맞춤 음악 제작 서비스
            </div>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
              당신의 이야기가
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                음악이 됩니다
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
              연인과의 첫 만남, 가족의 소중한 순간, 친구와의 잊지 못할 추억.
              <br className="hidden sm:block" />
              당신만의 이야기를 세상에 하나뿐인 노래로 만들어 드립니다.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:brightness-110"
              >
                이야기 보내기
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#process"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-8 py-4 text-lg font-semibold text-slate-300 backdrop-blur transition-colors hover:bg-slate-800 hover:text-white"
              >
                어떻게 만들어지나요?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              간단한{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                3단계
              </span>
              로 완성됩니다
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
              복잡한 과정 없이, 이야기만 보내주시면 됩니다.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="group relative rounded-2xl border border-slate-700/50 bg-slate-800/30 p-8 backdrop-blur transition-all hover:border-purple-500/50 hover:bg-slate-800/50"
                >
                  <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-semibold text-purple-400">
                      STEP {index + 1}
                    </span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                  <p className="leading-relaxed text-slate-400">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-24 sm:py-32">
        {/* Background accent */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[150px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              합리적인{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                가격
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
              당신의 이야기에 맞는 플랜을 선택하세요.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 backdrop-blur transition-all hover:scale-[1.02] ${
                  plan.popular
                    ? "border-purple-500/50 bg-slate-800/50 shadow-xl shadow-purple-500/10"
                    : "border-slate-700/50 bg-slate-800/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 text-xs font-semibold text-white">
                    인기
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {plan.description}
                  </p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="ml-1 text-slate-400">{plan.unit}</span>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/submit"
                  className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:brightness-110"
                      : "border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/80 px-8 py-16 text-center backdrop-blur sm:px-16">
            <div className="absolute inset-0 -z-10">
              <div className="absolute left-0 top-0 h-[300px] w-[300px] rounded-full bg-purple-600/15 blur-[100px]" />
              <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-pink-600/15 blur-[100px]" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              지금 당신의 이야기를 들려주세요
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
              특별한 순간을 영원히 간직할 수 있는 음악으로 만들어 드립니다.
            </p>
            <Link
              href="/submit"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:brightness-110"
            >
              이야기 보내기
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
