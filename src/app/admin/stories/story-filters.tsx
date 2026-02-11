"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Search } from "lucide-react";

const statusOptions = [
  { value: "all", label: "전체" },
  { value: "pending", label: "대기중" },
  { value: "in_progress", label: "제작중" },
  { value: "completed", label: "완료" },
  { value: "rejected", label: "거절" },
];

interface StoryFiltersProps {
  currentStatus?: string;
  currentSearch?: string;
}

export function StoryFilters({
  currentStatus,
  currentSearch,
}: StoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(currentSearch ?? "");

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/admin/stories?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    updateParams("search", searchValue);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Status filter */}
      <div className="flex gap-1 bg-slate-900/50 rounded-xl p-1">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => updateParams("status", option.value)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              (currentStatus ?? "all") === option.value
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="제목으로 검색..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </form>
    </div>
  );
}
