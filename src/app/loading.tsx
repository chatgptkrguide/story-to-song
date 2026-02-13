import { Loader2 } from "lucide-react";

export default function Loading(): React.ReactElement {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 pt-14">
      <div className="animate-fade-in-up text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-600/10">
          <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
        </div>
        <p className="text-sm text-slate-400">불러오는 중...</p>
      </div>
    </div>
  );
}
