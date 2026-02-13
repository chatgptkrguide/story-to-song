"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  fullDuration: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({
  audioUrl,
  fullDuration,
}: AudioPlayerProps): React.ReactElement {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(fullDuration);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  const handleTimeUpdate = useCallback((): void => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
  }, []);

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
    if (!audio) return;

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
    if (!audio || !bar) return;

    const rect = bar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const newTime = ratio * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }

  function handleProgressKeyDown(e: React.KeyboardEvent<HTMLDivElement>): void {
    const audio = audioRef.current;
    if (!audio) return;

    const step = 5;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const newTime = Math.min(currentTime + step, duration);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const newTime = Math.max(currentTime - step, 0);
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

  return (
    <div
      className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5 backdrop-blur-sm"
      role="region"
      aria-label="오디오 플레이어"
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "일시정지" : "재생"}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Play className="ml-0.5 h-5 w-5" aria-hidden="true" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            onKeyDown={handleProgressKeyDown}
            role="slider"
            tabIndex={0}
            aria-label="재생 위치"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration)}
            aria-valuenow={Math.floor(currentTime)}
            aria-valuetext={`${formatTime(currentTime)} / ${formatTime(duration)}`}
            className="group relative h-1.5 cursor-pointer rounded-full bg-slate-700 transition-all hover:h-2 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            <div
              className="absolute top-0 h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-white opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus:opacity-100"
              style={{ left: `${progressPercent}%`, marginLeft: "-6px" }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-slate-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "음소거 해제" : "음소거"}
          className="rounded-md text-slate-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-slate-800"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Volume2 className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          aria-label="볼륨 조절"
          className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-slate-700 accent-purple-500"
        />
      </div>
    </div>
  );
}
