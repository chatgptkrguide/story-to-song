import { AlertCircle } from "lucide-react";

export default function SetupRequired(): React.ReactElement {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 pt-14">
      <div className="animate-fade-in-up max-w-md text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
          <AlertCircle className="h-8 w-8 text-yellow-400" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-white">
          Supabase 설정이 필요합니다
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          이 페이지를 사용하려면 Supabase 프로젝트를 생성하고
          환경변수를 설정해야 합니다.
        </p>
        <div className="mt-6 rounded-xl border border-slate-800/60 bg-slate-900/40 p-4 text-left">
          <p className="mb-2 text-xs font-medium text-slate-500">
            .env.local 파일에 아래 값을 설정하세요:
          </p>
          <code className="block whitespace-pre-wrap text-xs text-purple-400">
            {`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
          </code>
        </div>
      </div>
    </div>
  );
}
