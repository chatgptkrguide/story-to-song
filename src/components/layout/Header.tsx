import Link from "next/link";
import { Music } from "lucide-react";

export default function Header(): React.ReactElement {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
            <Music className="h-4 w-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-base font-bold text-transparent">
            Story to Song
          </span>
        </Link>
      </div>
    </header>
  );
}
