"use client";

import { ShoppingCart, Crown, FileCheck } from "lucide-react";

interface PurchaseOptionsProps {
  songId: string;
}

interface PurchaseOption {
  id: string;
  title: string;
  price: string;
  description: string;
  icon: typeof ShoppingCart;
  borderColor: string;
  iconColor: string;
  popular?: boolean;
}

const PURCHASE_OPTIONS: PurchaseOption[] = [
  {
    id: "one_time",
    title: "일회성 구매",
    price: "₩9,900",
    description: "이 노래 1곡 다운로드",
    icon: ShoppingCart,
    borderColor: "border-purple-500/50 hover:border-purple-500",
    iconColor: "text-purple-400",
  },
  {
    id: "subscription",
    title: "구독",
    price: "₩29,900/월",
    description: "매월 노래 무제한",
    icon: Crown,
    borderColor: "border-pink-500/50 hover:border-pink-500",
    iconColor: "text-pink-400",
    popular: true,
  },
  {
    id: "copyright",
    title: "저작권 구매",
    price: "₩99,000",
    description: "상업적 사용 가능한 저작권",
    icon: FileCheck,
    borderColor: "border-orange-500/50 hover:border-orange-500",
    iconColor: "text-orange-400",
  },
];

export default function PurchaseOptions({
  songId,
}: PurchaseOptionsProps): React.ReactElement {
  function handlePurchase(optionTitle: string): void {
    alert(`"${optionTitle}" 결제 기능은 준비 중입니다.`);
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-white">구매 옵션</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PURCHASE_OPTIONS.map((option) => {
          const Icon = option.icon;

          return (
            <div
              key={option.id}
              className={`relative rounded-2xl border bg-slate-800/50 p-5 transition-colors ${option.borderColor}`}
            >
              {option.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 px-3 py-0.5 text-xs font-semibold text-white">
                  인기
                </span>
              )}

              <div className={`mb-3 ${option.iconColor}`}>
                <Icon className="h-8 w-8" />
              </div>

              <h3 className="text-lg font-semibold text-white">{option.title}</h3>
              <p className="mt-1 text-2xl font-bold text-white">{option.price}</p>
              <p className="mt-1 text-sm text-slate-400">{option.description}</p>

              <button
                onClick={() => handlePurchase(option.title)}
                data-song-id={songId}
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                구매하기
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
