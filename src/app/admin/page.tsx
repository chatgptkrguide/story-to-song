import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  BookOpen,
  Clock,
  Loader2,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import type { Story } from "@/types/database";
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

export default async function AdminDashboardPage() {
  if (!isSupabaseConfigured()) {
    return <SetupRequired />;
  }

  const supabase = await createClient();

  const [totalRes, pendingRes, progressRes, completedRes, recentRes] =
    await Promise.all([
      supabase.from("stories").select("*", { count: "exact", head: true }),
      supabase
        .from("stories")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("stories")
        .select("*", { count: "exact", head: true })
        .eq("status", "in_progress"),
      supabase
        .from("stories")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed"),
      supabase
        .from("stories")
        .select("id, title, status, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const stats = [
    {
      label: "총 이야기",
      value: totalRes.count ?? 0,
      icon: BookOpen,
      color: "text-purple-400",
      bg: "bg-purple-500/20",
    },
    {
      label: "대기중",
      value: pendingRes.count ?? 0,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-500/20",
    },
    {
      label: "제작중",
      value: progressRes.count ?? 0,
      icon: Loader2,
      color: "text-blue-400",
      bg: "bg-blue-500/20",
    },
    {
      label: "완료",
      value: completedRes.count ?? 0,
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-500/20",
    },
  ];

  const recentStories = (recentRes.data ?? []) as Pick<
    Story,
    "id" | "title" | "status" | "created_at" | "user_id"
  >[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">대시보드</h1>
        <p className="text-slate-400 mt-1">Story to Song 관리 현황</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent stories */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">최근 이야기</h2>
          <Link
            href="/admin/stories"
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            전체 보기
          </Link>
        </div>

        {recentStories.length === 0 ? (
          <p className="text-slate-500 text-sm">아직 이야기가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {recentStories.map((story) => (
              <Link
                key={story.id}
                href={`/admin/stories/${story.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {story.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(story.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[story.status]}`}
                >
                  {statusLabel[story.status]}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
