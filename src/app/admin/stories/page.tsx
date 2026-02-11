import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import Link from "next/link";
import type { Story } from "@/types/database";
import { StoryFilters } from "./story-filters";
import SetupRequired from "@/components/ui/SetupRequired";

const statusLabel: Record<Story["status"], string> = {
  pending: "대기중",
  in_progress: "제작중",
  completed: "완료",
  rejected: "거절",
};

const statusColor: Record<Story["status"], string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  in_progress: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
};

interface AdminStoriesPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}

export default async function AdminStoriesPage({
  searchParams,
}: AdminStoriesPageProps) {
  if (!isSupabaseConfigured()) {
    return <SetupRequired />;
  }

  const { status, search } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("stories")
    .select("id, title, status, mood, genre, created_at, user_id")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data: stories } = await query;

  const storyList = (stories ?? []) as Pick<
    Story,
    "id" | "title" | "status" | "mood" | "genre" | "created_at" | "user_id"
  >[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">이야기 관리</h1>
        <p className="text-slate-400 mt-1">
          총 {storyList.length}개의 이야기
        </p>
      </div>

      {/* Filters */}
      <StoryFilters currentStatus={status} currentSearch={search} />

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">
                제목
              </th>
              <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">
                분위기 / 장르
              </th>
              <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">
                상태
              </th>
              <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">
                날짜
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {storyList.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-slate-500 text-sm"
                >
                  {search || status
                    ? "검색 결과가 없습니다."
                    : "이야기가 없습니다."}
                </td>
              </tr>
            ) : (
              storyList.map((story) => (
                <tr
                  key={story.id}
                  className="bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/stories/${story.id}`}
                      className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
                    >
                      {story.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400">
                      {story.mood} / {story.genre}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[story.status]}`}
                    >
                      {statusLabel[story.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(story.created_at).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
