import Link from "next/link";
import { Music } from "lucide-react";

export default function Header(): React.ReactElement {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/40 bg-slate-950/70 backdrop-blur-xl"
      role="banner"
    >
      <nav
        className="mx-auto flex h-14 max-w-7xl items-center justify-center px-4"
        aria-label="메인 내비게이션"
      >
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-1 py-1 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-slate-950"
          aria-label="Story to Song 홈으로 이동"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 shadow-sm shadow-purple-500/20">
            <Music className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-base font-bold text-transparent">
            Story to Song
          </span>
        </Link>
      </nav>
    </header>
  );
}
