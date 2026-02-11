"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Upload,
  Music,
  Play,
  Pause,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import type { Story, Song, User } from "@/types/database";

type StoryStatus = Story["status"];

const statusLabel: Record<StoryStatus, string> = {
  pending: "대기중",
  in_progress: "제작중",
  completed: "완료",
  rejected: "거절",
};

const statusColor: Record<StoryStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  in_progress: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
};

export default function AdminStoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;
  const supabase = createClient();

  const [story, setStory] = useState<Story | null>(null);
  const [author, setAuthor] = useState<Pick<User, "id" | "name" | "email"> | null>(null);
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);

  // Upload state
  const [songTitle, setSongTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Admin memo
  const [memo, setMemo] = useState("");

  // Drag state
  const [isDragging, setIsDragging] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);

    const { data: storyData } = await supabase
      .from("stories")
      .select("*")
      .eq("id", storyId)
      .single();

    if (storyData) {
      setStory(storyData as Story);

      const { data: userData } = await supabase
        .from("users")
        .select("id, name, email")
        .eq("id", storyData.user_id)
        .single();

      if (userData) {
        setAuthor(userData as Pick<User, "id" | "name" | "email">);
      }
    }

    const { data: songData } = await supabase
      .from("songs")
      .select("*")
      .eq("story_id", storyId)
      .maybeSingle();

    if (songData) {
      setSong(songData as Song);
    }

    setLoading(false);
  }, [storyId, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (newStatus: StoryStatus): Promise<void> => {
    if (!story) return;

    const { error } = await supabase
      .from("stories")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", story.id);

    if (!error) {
      setStory({ ...story, status: newStatus });
    }
  };

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "audio/mpeg") {
      setSelectedFile(file);
      setUploadError(null);
    } else {
      setUploadError("MP3 파일만 업로드할 수 있습니다.");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "audio/mpeg") {
        setSelectedFile(file);
        setUploadError(null);
      } else {
        setUploadError("MP3 파일만 업로드할 수 있습니다.");
      }
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!selectedFile || !songTitle.trim() || !story) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(false);

    const filePath = `songs/${story.id}/${selectedFile.name}`;

    // Simulate progress steps
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    const { error: storageError } = await supabase.storage
      .from("songs")
      .upload(filePath, selectedFile, {
        cacheControl: "3600",
        upsert: true,
      });

    if (storageError) {
      clearInterval(progressInterval);
      setUploadError(`업로드 실패: ${storageError.message}`);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("songs")
      .getPublicUrl(filePath);

    setUploadProgress(95);

    const { data: songData, error: insertError } = await supabase
      .from("songs")
      .insert({
        story_id: story.id,
        title: songTitle.trim(),
        artist_name: "Story to Song",
        audio_url: publicUrlData.publicUrl,
        preview_duration: 60,
        full_duration: 0,
        status: "draft",
      })
      .select()
      .single();

    clearInterval(progressInterval);

    if (insertError) {
      setUploadError(`저장 실패: ${insertError.message}`);
      setUploading(false);
      return;
    }

    setUploadProgress(100);
    setSong(songData as Song);
    setUploadSuccess(true);
    setUploading(false);
    setSongTitle("");
    setSelectedFile(null);

    // Auto update story status to completed
    await handleStatusChange("completed");
  };

  const togglePlay = (): void => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">이야기를 찾을 수 없습니다.</p>
        <Link
          href="/admin/stories"
          className="text-purple-400 hover:text-purple-300 mt-4 inline-block"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/stories")}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{story.title}</h1>
          <p className="text-sm text-slate-400 mt-1">
            {new Date(story.created_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Story content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              이야기 내용
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {story.content}
              </p>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-700">
              <span className="text-xs px-3 py-1 rounded-full bg-slate-700 text-slate-300">
                {story.mood}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-700 text-slate-300">
                {story.genre}
              </span>
            </div>
          </div>

          {/* Upload section */}
          {!song ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                MP3 업로드
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">
                    노래 제목
                  </label>
                  <input
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    placeholder="노래 제목을 입력하세요"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                    isDragging
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-slate-600 hover:border-purple-500"
                  }`}
                >
                  <input
                    type="file"
                    accept="audio/mpeg"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                    {selectedFile ? (
                      <div>
                        <p className="text-sm font-medium text-white">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-slate-400">
                          MP3 파일을 드래그하거나 클릭하여 선택
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          MP3 형식만 지원
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">업로드 중...</span>
                      <span className="text-purple-400">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {uploadError && (
                  <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-xl">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {uploadError}
                  </div>
                )}

                {uploadSuccess && (
                  <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 p-3 rounded-xl">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    업로드가 완료되었습니다.
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || !songTitle.trim() || uploading}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      업로드 중...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      업로드
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Audio player */
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                업로드된 노래
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {song.title}
                  </p>
                  <p className="text-xs text-slate-400">{song.artist_name}</p>
                </div>
                <Music className="w-5 h-5 text-slate-500" />
              </div>
              <audio
                ref={audioRef}
                src={song.audio_url}
                onEnded={() => setIsPlaying(false)}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author info */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3">작성자</h3>
            {author ? (
              <div>
                <p className="text-sm text-white">{author.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{author.email}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">정보 없음</p>
            )}
          </div>

          {/* Status change */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3">상태 관리</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">현재:</span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[story.status]}`}
                >
                  {statusLabel[story.status]}
                </span>
              </div>
              <select
                value={story.status}
                onChange={(e) =>
                  handleStatusChange(e.target.value as StoryStatus)
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-600 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="pending">대기중</option>
                <option value="in_progress">제작중</option>
                <option value="completed">완료</option>
                <option value="rejected">거절</option>
              </select>
            </div>
          </div>

          {/* Admin memo */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3">관리자 메모</h3>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="메모를 입력하세요..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 text-sm resize-none focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
