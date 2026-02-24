import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 소개 | 살까말까 집사",
  description: "서비스 목적과 이용 방식을 안내합니다.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-3xl px-4 py-10 text-zinc-100">
      <h1 className="text-2xl font-semibold">서비스 소개</h1>
      <p className="mt-4 leading-7 text-zinc-300">
        살까말까 집사는 지출 결정을 돕기 위한 간단한 상담형 도구입니다. 입력된 월 수입, 가격,
        사용 빈도를 바탕으로 부담도를 계산해 결과를 제시합니다.
      </p>
      <p className="mt-3 leading-7 text-zinc-300">
        본 서비스의 결과는 참고용이며, 실제 소비 결정은 사용자의 책임하에 이루어집니다.
      </p>
    </main>
  );
}
