import { createClient } from "@/lib/supabase/server";
import { Music, Clock, CheckCircle, XCircle, Loader, Plus } from "lucide-react";
import Link from "next/link";
import type { Story, Song } from "@/types/database";

interface StoryRow extends Story {
  songs: Song[];
}

const STATUS_CONFIG = {
  pending: {
    label: "대기중",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: Clock,
  },
  in_progress: {
    label: "제작중",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Loader,
  },
  completed: {
    label: "완료",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: CheckCircle,
  },
  rejected: {
    label: "거절",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: XCircle,
  },
} as const;

export default async function MySongsPage(): Promise<React.ReactElement> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let stories: StoryRow[] = [];

  if (user) {
    const { data } = await supabase
      .from("stories")
      .select("*, songs(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    stories = (data ?? []) as StoryRow[];
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="text-center">
          <Music className="mx-auto mb-4 h-16 w-16 text-slate-600" />
          <h2 className="mb-2 text-2xl font-bold text-white">로그인이 필요합니다</h2>
          <p className="mb-6 text-slate-400">내 노래를 확인하려면 먼저 로그인해주세요.</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="text-center">
          <Music className="mx-auto mb-4 h-16 w-16 text-slate-600" />
          <h2 className="mb-2 text-2xl font-bold text-white">아직 이야기가 없어요</h2>
          <p className="mb-6 text-slate-400">
            당신의 이야기를 들려주시면 특별한 노래로 만들어 드릴게요.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Plus className="h-5 w-5" />
            이야기 제출하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">내 노래</h1>
            <p className="mt-1 text-slate-400">제출한 이야기와 노래 제작 현황</p>
          </div>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            새 이야기
          </Link>
        </div>

        <div className="space-y-4">
          {stories.map((story) => {
            const config = STATUS_CONFIG[story.status];
            const StatusIcon = config.icon;
            const song = story.songs?.[0] ?? null;

            return (
              <div
                key={story.id}
                className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 transition-colors hover:border-slate-600"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-semibold text-white">
                      {story.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                      {story.content}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${config.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {config.label}
                      </span>
                      <span className="text-xs text-slate-500">
                        {story.mood} / {story.genre}
                      </span>
                      <span className="text-xs text-slate-600">
                        {new Date(story.created_at).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </div>

                  {story.status === "completed" && song && (
                    <Link
                      href={`/play/${song.id}`}
                      className="shrink-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      노래 듣기
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
