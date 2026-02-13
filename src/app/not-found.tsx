import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound(): React.ReactElement {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 pt-14">
      <div className="animate-fade-in-up text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/60">
          <Search className="h-8 w-8 text-slate-500" />
        </div>
        <h2 className="text-xl font-bold text-white">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-purple-400 transition-colors hover:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-slate-950 rounded-md px-2 py-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
