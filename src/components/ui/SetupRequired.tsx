import { AlertCircle } from "lucide-react";

export default function SetupRequired(): React.ReactElement {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-yellow-400" />
        <h2 className="text-xl font-bold text-white mb-2">
          Supabase 설정이 필요합니다
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          이 페이지를 사용하려면 Supabase 프로젝트를 생성하고
          환경변수를 설정해야 합니다.
        </p>
        <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-left">
          <p className="text-xs text-slate-500 mb-2">
            .env.local 파일에 아래 값을 설정하세요:
          </p>
          <code className="text-xs text-purple-400 block whitespace-pre-wrap">
            {`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
          </code>
        </div>
      </div>
    </div>
  );
}
