import Link from "next/link";
import { Music, Mail } from "lucide-react";

const FOOTER_LINKS = {
  service: [
    { href: "/submit", label: "이야기 보내기" },
    { href: "/my-songs", label: "내 노래" },
    { href: "/pricing", label: "가격 안내" },
  ],
  support: [
    { href: "/faq", label: "자주 묻는 질문" },
    { href: "/contact", label: "문의하기" },
    { href: "/terms", label: "이용약관" },
    { href: "/privacy", label: "개인정보처리방침" },
  ],
} as const;

export default function Footer(): React.ReactElement {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                <Music className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-lg font-bold text-transparent">
                Story to Song
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-400">
              당신의 소중한 이야기를 세상에 하나뿐인 음악으로 만들어 드립니다.
            </p>
            <a
              href="mailto:contact@storytosong.kr"
              className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-purple-400"
            >
              <Mail className="h-4 w-4" />
              contact@storytosong.kr
            </a>
          </div>

          {/* Service Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">서비스</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.service.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-purple-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">고객 지원</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-purple-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-slate-800 pt-6">
          <p className="text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Story to Song. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
