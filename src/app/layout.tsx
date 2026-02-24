import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import AdSenseScript from "@/components/AdSenseScript";

export const metadata: Metadata = {
  title: "살까말까 집사",
  description: "월 수입과 사용 빈도를 기준으로 소비 결정을 도와주는 서비스",
  keywords: ["소비", "가계부", "지출", "절약", "판단"],
  openGraph: {
    title: "살까말까 집사",
    description: "월 수입과 사용 빈도를 기준으로 소비 결정을 도와주는 서비스",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <AdSenseScript />
        {children}
        <footer className="border-t border-zinc-800 bg-black/95 px-4 py-4 text-xs text-zinc-400">
          <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-2">
            <p>© {new Date().getFullYear()} 살까말까 집사</p>
            <nav className="flex items-center gap-3">
              <Link href="/about" className="hover:text-zinc-200">
                서비스 소개
              </Link>
              <Link href="/privacy" className="hover:text-zinc-200">
                개인정보처리방침
              </Link>
              <Link href="/contact" className="hover:text-zinc-200">
                문의
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
