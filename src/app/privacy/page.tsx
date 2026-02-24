import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 살까말까 집사",
  description: "개인정보 처리 기준을 안내합니다.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-3xl px-4 py-10 text-zinc-100">
      <h1 className="text-2xl font-semibold">개인정보처리방침</h1>
      <div className="mt-4 space-y-3 leading-7 text-zinc-300">
        <p>본 서비스는 로그인 기능을 제공하지 않으며, 입력한 상담 데이터는 서버 DB에 저장하지 않습니다.</p>
        <p>서비스 운영 과정에서 트래픽 분석 및 광고 제공을 위해 쿠키가 사용될 수 있습니다.</p>
        <p>
          Google AdSense를 사용하는 경우, Google은 광고 개인화를 위해 쿠키를 사용할 수 있습니다.
          사용자는 Google 광고 설정에서 개인화 광고를 관리할 수 있습니다.
        </p>
        <p>정책 문의: contact 페이지의 이메일을 통해 문의해 주세요.</p>
      </div>
    </main>
  );
}
