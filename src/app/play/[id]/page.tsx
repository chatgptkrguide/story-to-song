import type { Metadata } from "next";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Music, ArrowLeft } from "lucide-react";
import AudioPlayer from "@/components/music/AudioPlayer";
import type { SongWithStory } from "@/types/database";
import SetupRequired from "@/components/ui/SetupRequired";

interface PlayPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PlayPageProps): Promise<Metadata> {
  if (!isSupabaseConfigured()) {
    return { title: "노래 재생" };
  }

  const { id } = await params;
  const supabase = await createClient();

  const { data: song } = await supabase
    .from("songs")
    .select("title, artist_name")
    .eq("id", id)
    .single();

  if (!song) {
    return { title: "노래를 찾을 수 없습니다" };
  }

  return {
    title: `${song.title} - ${song.artist_name}`,
    description: `${song.artist_name}의 "${song.title}" - Story to Song에서 만들어진 세상에 하나뿐인 노래를 들어보세요.`,
    openGraph: {
      title: `${song.title} - ${song.artist_name}`,
      description: `Story to Song에서 만들어진 세상에 하나뿐인 노래를 들어보세요.`,
      type: "music.song",
    },
    alternates: {
      canonical: `/play/${id}`,
    },
  };
}

export default async function PlayPage({ params }: PlayPageProps): Promise<React.ReactElement> {
  if (!isSupabaseConfigured()) {
    return <SetupRequired />;
  }

  const { id } = await params;
  const supabase = await createClient();

  const { data: song } = await supabase
    .from("songs")
    .select("*, story:stories(id, title, content)")
    .eq("id", id)
    .single();

  if (!song) {
    notFound();
  }

  const songData = song as unknown as SongWithStory;

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 pt-14 pb-12">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-pink-600/8 blur-[100px]" />
      </div>

      <div className="animate-fade-in-up w-full max-w-md">
        {/* Cover */}
        <div className="mx-auto mb-8 flex h-60 w-60 items-center justify-center overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/50 shadow-2xl shadow-purple-500/5 sm:h-72 sm:w-72">
          {songData.cover_image_url ? (
            <Image
              src={songData.cover_image_url}
              alt={`${songData.title} 앨범 커버`}
              width={288}
              height={288}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                <Music className="h-8 w-8 text-purple-400" aria-hidden="true" />
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            {songData.title}
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            {songData.artist_name}
          </p>
        </div>

        {/* Player */}
        <AudioPlayer
          audioUrl={songData.audio_url}
          fullDuration={songData.full_duration}
        />

        {/* Story excerpt */}
        <div className="mt-6 rounded-xl border border-slate-800/60 bg-slate-900/40 p-5">
          <p className="mb-2 text-xs font-medium text-slate-500">
            원작 이야기
          </p>
          <p className="text-sm leading-relaxed text-slate-400">
            &ldquo;{songData.story.title}&rdquo;
          </p>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-purple-400 transition-colors hover:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
