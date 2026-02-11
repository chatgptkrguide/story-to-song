import Link from "next/link";
import { Music, Mail } from "lucide-react";

export default function Footer(): React.ReactElement {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
              <Music className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-lg font-bold text-transparent">
              Story to Song
            </span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-slate-500">
            당신의 소중한 이야기를 세상에 하나뿐인 음악으로 만들어 드립니다.
          </p>
          <a
            href="mailto:contact@storytosong.kr"
            className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-purple-400"
          >
            <Mail className="h-4 w-4" />
            contact@storytosong.kr
          </a>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-slate-800 pt-6 flex items-center justify-center">
          <Link
            href="/auth/login"
            className="text-[10px] text-slate-700 transition-colors hover:text-slate-500"
          >
            &copy; {new Date().getFullYear()} Story to Song
          </Link>
        </div>
      </div>
    </footer>
  );
}
