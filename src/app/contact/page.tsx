import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의 | 살까말까 집사",
  description: "서비스 관련 문의 방법을 안내합니다.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-3xl px-4 py-10 text-zinc-100">
      <h1 className="text-2xl font-semibold">문의</h1>
      <p className="mt-4 leading-7 text-zinc-300">서비스 개선 제안이나 광고 관련 문의는 아래 메일로 보내주세요.</p>
      <p className="mt-3 font-medium text-zinc-100">jh080481@gmail.com</p>
    </main>
  );
}
