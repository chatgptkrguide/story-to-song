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

export const metadata: Metadata = {
  title: "Story to Song | 당신의 이야기가 음악이 됩니다",
  description:
    "소중한 이야기를 AI 음악으로 만들어 드립니다. 연인, 가족, 친구에게 세상에 하나뿐인 노래를 선물하세요.",
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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
