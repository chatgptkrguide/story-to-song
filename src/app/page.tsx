import Link from "next/link";
import {
  ArrowRight,
  PenLine,
  Wand2,
  Headphones,
  Clock,
  Heart,
  Shield,
  ChevronDown,
  Gift,
  Sparkles,
  MessageCircle,
} from "lucide-react";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Story to Song",
      url: "https://story-to-song-xi.vercel.app",
      description:
        "소중한 이야기를 AI 음악으로 만들어 드립니다.",
    },
    {
      "@type": "WebSite",
      name: "Story to Song",
      url: "https://story-to-song-xi.vercel.app",
      description:
        "당신의 이야기가 음악이 됩니다. 소중한 이야기를 세상에 하나뿐인 노래로 만들어 드립니다.",
      inLanguage: "ko-KR",
    },
  ],
};

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

const TRUST_POINTS = [
  {
    icon: Heart,
    title: "진심을 담은 제작",
    desc: "모든 곡은 이야기의 감정과 분위기를 깊이 이해한 후 제작됩니다.",
  },
  {
    icon: Shield,
    title: "이야기 보호",
    desc: "제출하신 이야기는 음악 제작 목적으로만 사용되며 안전하게 보호됩니다.",
  },
  {
    icon: Gift,
    title: "특별한 선물",
    desc: "생일, 기념일, 프로포즈 등 소중한 순간을 위한 최고의 선물이 됩니다.",
  },
] as const;

const FAQ_ITEMS = [
  {
    q: "어떤 이야기든 노래로 만들 수 있나요?",
    a: "네, 연애 이야기, 가족의 추억, 우정, 여행 경험 등 어떤 이야기든 음악으로 만들 수 있습니다. 이야기가 구체적일수록 더 감동적인 곡이 탄생합니다.",
  },
  {
    q: "완성까지 얼마나 걸리나요?",
    a: "보통 3~5일 이내에 완성됩니다. 이야기 접수 후 제작 과정을 거쳐, 완성되면 이메일로 감상 링크를 보내드립니다.",
  },
  {
    q: "비용은 얼마인가요?",
    a: "현재는 무료 베타 서비스로 운영 중입니다. 정식 출시 후에도 합리적인 가격으로 제공할 예정입니다.",
  },
  {
    q: "완성된 노래를 다른 사람에게 공유할 수 있나요?",
    a: "물론입니다! 완성된 노래의 전용 링크를 받으시면 누구에게든 공유할 수 있습니다. 카카오톡, SNS 등으로 간편하게 선물하세요.",
  },
  {
    q: "노래 스타일을 선택할 수 있나요?",
    a: "이야기를 제출할 때 원하는 분위기나 장르를 함께 적어주시면, 최대한 반영하여 제작합니다.",
  },
  {
    q: "제출한 이야기를 수정하거나 취소할 수 있나요?",
    a: "제작이 시작되기 전이라면 이메일로 연락 주시면 수정 또는 취소가 가능합니다.",
  },
] as const;

function FAQItem({ q, a }: { q: string; a: string }): React.ReactElement {
  return (
    <details className="group rounded-xl border border-slate-800/60 bg-slate-900/30 transition-all duration-300 hover:border-purple-500/20 hover:bg-slate-900/50">
      <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-white [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-3">
          <MessageCircle className="h-4 w-4 flex-shrink-0 text-purple-400" />
          {q}
        </span>
        <ChevronDown className="h-4 w-4 flex-shrink-0 text-slate-500 transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <div className="px-5 pb-4 pl-12 text-sm leading-relaxed text-slate-400">
        {a}
      </div>
    </details>
  );
}

export default function HomePage(): React.ReactElement {
  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="relative flex min-h-dvh items-center justify-center overflow-hidden pt-14">
        {/* Animated background blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="animate-pulse-glow animate-float absolute left-1/3 top-1/4 h-[420px] w-[420px] rounded-full bg-purple-600/15 blur-[120px]" />
          <div className="animate-pulse-glow-delayed animate-float-delayed absolute right-1/3 bottom-1/4 h-[320px] w-[320px] rounded-full bg-pink-600/15 blur-[100px]" />
          <div className="animate-pulse-glow animate-float-delayed absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[80px]" />
        </div>

        <div className="px-4 text-center">
          <h1 className="animate-fade-in-up text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            당신의 이야기가
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              음악이 됩니다
            </span>
          </h1>
          <p className="animate-fade-in-up animate-delay-200 mx-auto mt-5 max-w-md text-base leading-relaxed text-slate-400 sm:text-lg">
            소중한 이야기를 세상에 하나뿐인 노래로 만들어 드립니다.
          </p>
          <div className="animate-fade-in-up animate-delay-400 mt-8">
            <Link
              href="/submit"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              이야기 보내기
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <div className="h-6 w-3.5 rounded-full border-2 border-slate-600 p-0.5">
            <div className="mx-auto h-1.5 w-0.5 rounded-full bg-slate-500" />
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto w-full max-w-3xl px-4 py-20">
        <h2 className="animate-fade-in-up mb-10 text-center text-lg font-semibold text-white sm:text-xl">
          간단한 <span className="text-purple-400">3단계</span>로 만들어집니다
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="animate-fade-in-up group flex flex-col items-center rounded-2xl border border-slate-800/60 bg-slate-900/40 px-5 py-8 text-center transition-all duration-300 hover:border-purple-500/30 hover:bg-slate-900/70 hover:shadow-lg hover:shadow-purple-500/5"
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 text-purple-400 transition-all duration-300 group-hover:scale-110 group-hover:from-purple-600/30 group-hover:to-pink-600/30 group-hover:shadow-lg group-hover:shadow-purple-500/10">
                <step.icon className="h-5 w-5" aria-hidden="true" />
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

      {/* Pricing / Timeline */}
      <section className="relative py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/5 blur-[100px]" />
        </div>
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="mb-10 text-center text-lg font-semibold text-white sm:text-xl">
            <span className="text-purple-400">무료 베타</span> 서비스 안내
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-600/15">
                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">현재 무료</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  베타 기간 동안 모든 곡 제작이 무료입니다. 부담 없이 이야기를 보내주세요.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-pink-600/15">
                <Clock className="h-5 w-5 text-pink-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">3~5일 이내 제작</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  이야기 접수 후 보통 3~5일 이내에 완성됩니다. 완성 시 이메일로 안내드립니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto w-full max-w-3xl px-4 py-20">
        <h2 className="mb-10 text-center text-lg font-semibold text-white sm:text-xl">
          안심하고 맡겨주세요
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {TRUST_POINTS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center rounded-2xl border border-slate-800/60 bg-slate-900/40 px-5 py-7 text-center transition-all duration-300 hover:border-purple-500/20 hover:bg-slate-900/60"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600/15 to-pink-600/15 text-purple-400">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-2xl px-4 py-20">
        <h2 className="mb-10 text-center text-lg font-semibold text-white sm:text-xl">
          자주 묻는 질문
        </h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/8 blur-[100px]" />
        </div>
        <div className="mx-auto max-w-md px-4 text-center">
          <p className="text-sm text-slate-400">
            지금 바로 이야기를 보내고, 세상에 하나뿐인 노래를 받아보세요.
          </p>
          <Link
            href="/submit"
            className="mt-5 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-purple-400 transition-colors hover:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            이야기 보내기
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
