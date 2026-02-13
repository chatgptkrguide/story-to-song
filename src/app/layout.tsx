import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const BASE_URL = "https://story-to-song-xi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Story to Song | 당신의 이야기가 음악이 됩니다",
    template: "%s | Story to Song",
  },
  description:
    "소중한 이야기를 AI 음악으로 만들어 드립니다. 연인, 가족, 친구에게 세상에 하나뿐인 노래를 선물하세요.",
  openGraph: {
    title: "Story to Song | 당신의 이야기가 음악이 됩니다",
    description:
      "소중한 이야기를 세상에 하나뿐인 노래로 만들어 드립니다.",
    type: "website",
    locale: "ko_KR",
    url: BASE_URL,
    siteName: "Story to Song",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${notoSansKR.variable} min-h-screen bg-slate-950 font-sans text-white antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-purple-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none"
        >
          본문으로 건너뛰기
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
