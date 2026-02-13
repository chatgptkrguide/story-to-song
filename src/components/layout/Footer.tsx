import Link from "next/link";

export default function Footer(): React.ReactElement {
  return (
    <footer className="border-t border-slate-800/50 bg-slate-950" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <Link
            href="/auth/login"
            className="rounded-sm transition-colors hover:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-slate-950"
            aria-label="관리자 로그인"
          >
            &copy; {new Date().getFullYear()} Story to Song
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/privacy"
              className="rounded-sm transition-colors hover:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              개인정보처리방침
            </Link>
            <span className="text-slate-800">|</span>
            <Link
              href="/terms"
              className="rounded-sm transition-colors hover:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              이용약관
            </Link>
            <span className="text-slate-800">|</span>
            <a
              href="mailto:contact@storytosong.kr"
              className="rounded-sm transition-colors hover:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-slate-950"
              aria-label="이메일 문의"
            >
              contact@storytosong.kr
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
