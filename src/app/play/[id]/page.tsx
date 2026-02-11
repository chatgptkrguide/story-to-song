import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Music } from "lucide-react";
import AudioPlayer from "@/components/music/AudioPlayer";
import PurchaseOptions from "@/components/music/PurchaseOptions";
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
    <div className="min-h-screen bg-slate-950">
      {/* Background blur cover */}
      <div className="relative">
        {songData.cover_image_url && (
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={songData.cover_image_url}
              alt=""
              fill
              className="object-cover opacity-20 blur-3xl"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 to-slate-950" />
          </div>
        )}

        <div className="relative mx-auto max-w-2xl px-4 pb-12 pt-16">
          {/* Cover image */}
          <div className="mx-auto mb-8 flex h-64 w-64 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 shadow-2xl sm:h-80 sm:w-80">
            {songData.cover_image_url ? (
              <Image
                src={songData.cover_image_url}
                alt={songData.title}
                width={320}
                height={320}
                className="h-full w-full object-cover"
                priority
              />
            ) : (
              <Music className="h-20 w-20 text-slate-600" />
            )}
          </div>

          {/* Song info */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {songData.title}
            </h1>
            <p className="mt-1 text-slate-400">{songData.artist_name}</p>
            <p className="mt-2 text-sm text-slate-500">
              원작: {songData.story.title}
            </p>
          </div>

          {/* Audio player */}
          <AudioPlayer
            audioUrl={songData.audio_url}
            previewDuration={songData.preview_duration}
            fullDuration={songData.full_duration}
          />

          {/* Original story excerpt */}
          <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
            <h3 className="mb-2 text-sm font-medium text-slate-400">원작 이야기</h3>
            <p className="line-clamp-4 text-sm leading-relaxed text-slate-300">
              {songData.story.content}
            </p>
          </div>

          {/* Purchase options */}
          <div className="mt-8">
            <PurchaseOptions songId={songData.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
