import Link from "next/link";

export default function Footer(): React.ReactElement {
  return (
    <footer className="border-t border-slate-800/50 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <Link
            href="/auth/login"
            className="transition-colors hover:text-slate-400"
          >
            &copy; {new Date().getFullYear()} Story to Song
          </Link>
          <a
            href="mailto:contact@storytosong.kr"
            className="transition-colors hover:text-slate-400"
          >
            contact@storytosong.kr
          </a>
        </div>
      </div>
    </footer>
  );
}
