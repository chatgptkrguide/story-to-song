"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Lock } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  previewDuration: number;
  fullDuration: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({
  audioUrl,
  previewDuration,
  fullDuration,
}: AudioPlayerProps): React.ReactElement {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(fullDuration);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isPreviewEnded, setIsPreviewEnded] = useState(false);

  const handleTimeUpdate = useCallback((): void => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentTime(audio.currentTime);

    if (audio.currentTime >= previewDuration) {
      audio.pause();
      setIsPlaying(false);
      setIsPreviewEnded(true);
    }
  }, [previewDuration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoaded = (): void => {
      setDuration(audio.duration || fullDuration);
    };

    const handleEnded = (): void => {
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoaded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [fullDuration, handleTimeUpdate]);

  function togglePlay(): void {
    const audio = audioRef.current;
    if (!audio || isPreviewEnded) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>): void {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || isPreviewEnded) return;

    const rect = bar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const newTime = ratio * duration;

    if (newTime < previewDuration) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  }

  function toggleMute(): void {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 0.7;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const previewPercent = duration > 0 ? (previewDuration / duration) * 100 : 0;

  return (
    <div className="relative rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Play button + time */}
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          disabled={isPreviewEnded}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-transform hover:scale-105 disabled:opacity-50"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="ml-1 h-6 w-6" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          {/* Progress bar */}
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="relative h-2 cursor-pointer rounded-full bg-slate-700"
          >
            {/* Preview limit marker */}
            <div
              className="absolute top-0 h-full rounded-full bg-slate-600"
              style={{ width: `${previewPercent}%` }}
            />
            {/* Current progress */}
            <div
              className="absolute top-0 h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${Math.min(progressPercent, previewPercent)}%` }}
            />
            {/* Preview limit line */}
            <div
              className="absolute top-[-4px] h-[16px] w-[2px] bg-slate-400"
              style={{ left: `${previewPercent}%` }}
            />
          </div>

          {/* Time display */}
          <div className="mt-1 flex justify-between text-xs text-slate-500">
            <span>{formatTime(currentTime)}</span>
            <span>
              미리듣기 {formatTime(previewDuration)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Volume control */}
      <div className="mt-4 flex items-center gap-2">
        <button onClick={toggleMute} className="text-slate-400 hover:text-white">
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-slate-700 accent-purple-500"
        />
      </div>

      {/* Preview ended overlay */}
      {isPreviewEnded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-slate-900/90 backdrop-blur-sm">
          <Lock className="mb-3 h-10 w-10 text-purple-400" />
          <p className="text-lg font-semibold text-white">미리듣기가 끝났어요</p>
          <p className="mt-1 text-sm text-slate-400">
            전체 듣기를 원하시면 구매해주세요
          </p>
          <button
            onClick={() => {
              setIsPreviewEnded(false);
              setCurrentTime(0);
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
              }
            }}
            className="mt-4 rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
          >
            처음부터 다시 듣기
          </button>
        </div>
      )}
    </div>
  );
}
