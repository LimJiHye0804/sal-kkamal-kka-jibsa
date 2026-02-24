# 살까말까 집사

월 수입, 가격, 사용 빈도를 기준으로 소비 부담도를 계산해 결정을 도와주는 Next.js 앱입니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## 검증

```bash
npm run lint
npm run build
```

## Google AdSense 설정

1. `.env.local` 파일 생성
2. 아래 변수 입력

```bash
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_RESULT=1234567890
```

3. 재실행 후 결과 화면에서 광고 슬롯 확인

`NEXT_PUBLIC_ADSENSE_CLIENT`가 비어 있으면 스크립트/광고 컴포넌트는 렌더링되지 않습니다.

## 정책/신뢰 페이지

- `/about`
- `/privacy`
- `/contact`
