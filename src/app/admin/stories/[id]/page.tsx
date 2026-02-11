"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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

const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav"];

interface StoryDetailData extends Story {
  song: Song | null;
  user: Pick<User, "id" | "name" | "email"> | null;
}

export default function AdminStoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;

  const [story, setStory] = useState<StoryDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

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
  const [memoSaving, setMemoSaving] = useState(false);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    const res = await fetch(`/api/stories/${storyId}`);

    if (!res.ok) {
      const body = await res.json();
      setFetchError(body.error ?? "데이터를 불러올 수 없습니다");
      setLoading(false);
      return;
    }

    const { data } = await res.json();
    setStory(data as StoryDetailData);
    if (data.admin_note) {
      setMemo(data.admin_note);
    }
    setLoading(false);
  }, [storyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (newStatus: StoryStatus): Promise<void> => {
    if (!story) return;

    const res = await fetch(`/api/stories/${story.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setStory({ ...story, status: newStatus });
    }
  };

  const handleSaveMemo = async (): Promise<void> => {
    if (!story) return;
    setMemoSaving(true);

    const res = await fetch(`/api/stories/${story.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_note: memo }),
    });

    if (res.ok) {
      setStory({ ...story, admin_note: memo });
    }
    setMemoSaving(false);
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
    if (file && ALLOWED_AUDIO_TYPES.includes(file.type)) {
      setSelectedFile(file);
      setUploadError(null);
    } else {
      setUploadError("MP3 또는 WAV 파일만 업로드할 수 있습니다.");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      if (ALLOWED_AUDIO_TYPES.includes(file.type)) {
        setSelectedFile(file);
        setUploadError(null);
      } else {
        setUploadError("MP3 또는 WAV 파일만 업로드할 수 있습니다.");
      }
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!selectedFile || !songTitle.trim() || !story) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(false);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 80) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 300);

    // 1. API 라우트를 통해 파일 업로드
    const formData = new FormData();
    formData.append("file", selectedFile);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) {
      clearInterval(progressInterval);
      const body = await uploadRes.json();
      setUploadError(body.error ?? "파일 업로드에 실패했습니다");
      setUploading(false);
      return;
    }

    const { url: audioUrl } = await uploadRes.json();
    setUploadProgress(85);

    // 2. API 라우트를 통해 노래 등록
    const songRes = await fetch("/api/songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        story_id: story.id,
        title: songTitle.trim(),
        audio_url: audioUrl,
      }),
    });

    clearInterval(progressInterval);

    if (!songRes.ok) {
      const body = await songRes.json();
      setUploadError(body.error ?? "노래 등록에 실패했습니다");
      setUploading(false);
      return;
    }

    const { data: songData } = await songRes.json();

    setUploadProgress(100);
    setStory({ ...story, song: songData as Song, status: "completed" });
    setUploadSuccess(true);
    setUploading(false);
    setSongTitle("");
    setSelectedFile(null);
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

  if (fetchError || !story) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">{fetchError ?? "이야기를 찾을 수 없습니다."}</p>
        <Link
          href="/admin/stories"
          className="text-purple-400 hover:text-purple-300 mt-4 inline-block"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const song = story.song;
  const author = story.user;

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
                    accept=".mp3,.wav,audio/mpeg,audio/wav"
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
                          MP3/WAV 파일을 드래그하거나 클릭하여 선택
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          MP3, WAV 형식 지원 (50MB 이하)
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
              maxLength={1000}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 text-sm resize-none focus:outline-none focus:border-purple-500 transition-colors"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-500">{memo.length}/1000</span>
              <button
                onClick={handleSaveMemo}
                disabled={memoSaving}
                className="text-xs text-purple-400 hover:text-purple-300 disabled:text-slate-600"
              >
                {memoSaving ? "저장 중..." : "메모 저장"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
