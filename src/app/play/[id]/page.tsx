import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Music } from "lucide-react";
import AudioPlayer from "@/components/music/AudioPlayer";
import type { SongWithStory } from "@/types/database";
import SetupRequired from "@/components/ui/SetupRequired";

interface PlayPageProps {
  params: Promise<{ id: string }>;
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
      <div className="w-full max-w-md">
        {/* Cover */}
        <div className="mx-auto mb-6 flex h-56 w-56 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 shadow-2xl sm:h-64 sm:w-64">
          {songData.cover_image_url ? (
            <Image
              src={songData.cover_image_url}
              alt={songData.title}
              width={256}
              height={256}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <Music className="h-16 w-16 text-slate-600" />
          )}
        </div>

        {/* Info */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-white">{songData.title}</h1>
          <p className="mt-1 text-sm text-slate-400">{songData.artist_name}</p>
        </div>

        {/* Player */}
        <AudioPlayer
          audioUrl={songData.audio_url}
          fullDuration={songData.full_duration}
        />

        {/* Story excerpt */}
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="mb-1 text-xs font-medium text-slate-500">원작 이야기</p>
          <p className="text-xs leading-relaxed text-slate-400">
            &ldquo;{songData.story.title}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
