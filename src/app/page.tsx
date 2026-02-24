"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import AdSlot from "@/components/AdSlot";

/** ===== 설정 ===== */
const USER_TITLE = "아가씨";

/** ===== ACT 상태 ===== */
type Act =
  | "INTRO"
  | "BALANCE"
  | "INCOME"
  | "ITEM"
  | "PRICE"
  | "USAGE"
  | "CALC"
  | "RESULT";

type Decision = "OK" | "HOLD" | "NO";

/** ===== UI ===== */
function Page({
  children,
  topbar,
}: {
  children: React.ReactNode;
  topbar?: React.ReactNode;
}) {
  return (
    <main className="min-h-dvh bg-black text-zinc-100 md:p-4">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-black md:min-h-[calc(100dvh-2rem)] md:max-w-2xl md:rounded-2xl md:border md:border-white/10 lg:max-w-3xl">
        {/* 1) 배경 */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src="/bg/mansion.jpeg"
            alt="mansion background"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* 2) 오버레이 (가독성) */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/15 via-black/45 to-black/80" />

        {/* 3) 집사 (오버레이 위, UI 아래) */}
        <div className="pointer-events-none absolute inset-0 z-20">
          <Image
            src="/char/butler.png"
            alt="butler"
            fill
            priority
            className="object-contain object-bottom opacity-90"
            sizes="(min-width: 1024px) 1200px, (min-width: 768px) 900px, 100vw"
          />
        </div>

        {/* 상단바 */}
        <div className="sticky top-0 z-30 border-b border-white/10 bg-zinc-900/25 backdrop-blur">
          <div className="p-3">{topbar}</div>
        </div>

        {/* 4) UI */}
        <div className="relative z-30 flex flex-1 flex-col justify-end overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </main>
  );
}

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 rounded-2xl bg-zinc-800 p-4 shadow">
      <p className="whitespace-pre-line leading-relaxed">{children}</p>
    </div>
  );
}

function Option({
  label,
  onClick,
  selected,
  disabled,
}: {
  label: string;
  onClick: () => void;
  selected?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected === undefined ? undefined : selected}
      disabled={disabled}
      onClick={onClick}
      className={[
        "mb-2 w-full rounded-xl border py-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-200",
        disabled
          ? "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-500"
          : selected
            ? "border-zinc-300 bg-zinc-800"
            : "border-zinc-700 hover:bg-zinc-800",
      ].join(" ")}
    >
      <div className="flex items-center justify-between px-3">
        <span>{label}</span>
        {selected ? <span className="text-zinc-200">✓</span> : <span />}
      </div>
    </button>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-sm">
      {children}
    </div>
  );
}

function NumberPanel({
  title,
  placeholder,
  value,
  onChange,
  onCancel,
  onConfirm,
  confirmDisabled,
  helper,
}: {
  title: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  helper?: string;
}) {
  return (
    <div className="mt-3 rounded-2xl border border-zinc-700 bg-zinc-800 p-4">
      <div className="mb-2 text-sm text-zinc-200">{title}</div>

      <input
        autoFocus
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 p-3 outline-none"
        placeholder={placeholder ?? "숫자만 입력"}
        value={value}
        inputMode="numeric"
        pattern="[0-9]*"
        onChange={(e) => onChange(e.currentTarget.value)}
      />

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          className="rounded-xl border border-zinc-700 py-3 hover:bg-zinc-900/40"
          onClick={onCancel}
        >
          취소
        </button>
        <button
          type="button"
          disabled={confirmDisabled}
          className={[
            "rounded-xl border py-3",
            confirmDisabled
              ? "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-500"
              : "border-zinc-300 bg-zinc-100 text-zinc-900 hover:bg-white",
          ].join(" ")}
          onClick={onConfirm}
        >
          확인
        </button>
      </div>

      <div className="mt-2 text-xs text-zinc-400">
        {helper ?? "예: 259000 (원 단위)"}
      </div>
    </div>
  );
}

/** ===== Home ===== */
export default function Home() {
  const [act, setAct] = useState<Act>("INTRO");

  const [history, setHistory] = useState<Act[]>([]);
  const itemInputRef = useRef<HTMLInputElement>(null);
  const calcTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCalcTimer = () => {
    if (calcTimerRef.current !== null) {
      clearTimeout(calcTimerRef.current);
      calcTimerRef.current = null;
    }
  };

  const pushAndGo = (next: Act) => {
    clearCalcTimer();
    setHistory((prev) => [...prev, act]);
    setAct(next);
  };

  const goBack = () => {
    clearCalcTimer();
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const prevAct = next.pop();
      if (prevAct) setAct(prevAct);
      return next;
    });
  };

  useEffect(() => {
    return () => {
      clearCalcTimer();
    };
  }, []);

  /** ====== 상태 ====== */

  // 재정 정보 (Retry 때만 유지, 그 외는 resetAll로 싹 초기화)
  const [balance, setBalance] = useState<number | null>(null);
  const [income, setIncome] = useState<number | null>(null);

  // BALANCE manual panel
  const [showBalanceManual, setShowBalanceManual] = useState(false);
  const [balanceManualText, setBalanceManualText] = useState("");

  // INCOME manual panel
  const [showIncomeManual, setShowIncomeManual] = useState(false);
  const [incomeManualText, setIncomeManualText] = useState("");

  // ITEM (IME 안전: uncontrolled 유지 + draft로 버튼 활성화만)
  const [itemText, setItemText] = useState("");
  const [itemDraft, setItemDraft] = useState("");
  const [itemKey, setItemKey] = useState(0);

  // PRICE
  const [price, setPrice] = useState<number | null>(null);
  const [showPriceManual, setShowPriceManual] = useState(false);
  const [priceManualText, setPriceManualText] = useState("");

  // USAGE (직접입력 없음)
  const [usagePerMonth, setUsagePerMonth] = useState<number | null>(null);

  // 결과
  const [decision, setDecision] = useState<Decision | null>(null);
  const [costPerUse, setCostPerUse] = useState<number | null>(null);
  const [burden, setBurden] = useState<number | null>(null);

  /** ====== 리셋 정책 ======
   * - "Retry"만 재정(balance/income) 유지
   * - 그 외 모든 상황(처음 버튼, 재정수정 버튼, 재접속/새로고침 등)은 항상 초기화
   */

  const resetAll = (goTo: Act = "INTRO") => {
    clearCalcTimer();

    // history
    setHistory([]);

    // finance
    setBalance(null);
    setIncome(null);

    // panels
    setShowBalanceManual(false);
    setBalanceManualText("");
    setShowIncomeManual(false);
    setIncomeManualText("");
    setShowPriceManual(false);
    setPriceManualText("");

    // today
    setItemText("");
    setItemDraft("");
    setItemKey((k) => k + 1);
    if (itemInputRef.current) itemInputRef.current.value = "";
    setPrice(null);
    setUsagePerMonth(null);

    // result
    setDecision(null);
    setCostPerUse(null);
    setBurden(null);

    // act
    setAct(goTo);
  };

  const resetTodayOnlyKeepFinance = () => {
    // ✅ Retry 전용: 재정은 유지하고 오늘의 고민만 초기화
    clearCalcTimer();
    setHistory([]);

    setItemText("");
    setItemDraft("");
    setItemKey((k) => k + 1);
    if (itemInputRef.current) itemInputRef.current.value = "";

    setPrice(null);
    setUsagePerMonth(null);
    setDecision(null);
    setCostPerUse(null);
    setBurden(null);

    setShowPriceManual(false);
    setPriceManualText("");

    setAct("ITEM");
  };

  /** 판단 */
  const calculate = (nextPrice: number, nextUsagePerMonth: number, nextIncome: number) => {
    const cpu = nextPrice / nextUsagePerMonth;
    const burdenRate = nextPrice / nextIncome;

    setCostPerUse(cpu);
    setBurden(burdenRate);

    let d: Decision = "OK";
    if (burdenRate > 0.3 && cpu > 3000) d = "NO";
    else if (burdenRate > 0.15 || cpu > 3000) d = "HOLD";

    setDecision(d);
    setAct("RESULT");
  };

  /** Topbar: "처음" = 무조건 전체 초기화 / "재정수정"도 전체 초기화 후 BALANCE로 */
  const topbar = (
    <div className="flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={goBack}
        disabled={history.length === 0}
        className={[
          "rounded-lg border px-3 py-2 text-sm",
          history.length === 0
            ? "cursor-not-allowed border-zinc-800 text-zinc-500"
            : "border-zinc-700 hover:bg-zinc-800",
        ].join(" ")}
      >
        ← 이전
      </button>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => resetAll("INTRO")}
          className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
        >
          처음
        </button>

        <button
          type="button"
          onClick={() => resetAll("BALANCE")}
          className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
        >
          재정 수정
        </button>
      </div>
    </div>
  );

  /** ===== ACT ===== */

  if (act === "INTRO") {
    return (
      <Page topbar={topbar}>
        <Bubble>{`${USER_TITLE},\n오늘은 어떤 고민으로 이곳까지 오셨습니까?`}</Bubble>

        <Option label="말려주길 바랍니다" onClick={() => pushAndGo("BALANCE")} />

        <Chip>
          <div className="text-zinc-300">안내</div>
          <div className="mt-1 text-sm text-zinc-200">
            본 서비스는 <b>Retry 때만</b> 재정 정보를 유지합니다.
            <br />
            새로고침/재접속/처음 버튼은 모두 초기화됩니다.
          </div>
        </Chip>
      </Page>
    );
  }

  if (act === "BALANCE") {
    const onlyDigits = balanceManualText.replace(/[^0-9]/g, "");
    const parsed = onlyDigits.length > 0 ? Number.parseInt(onlyDigits, 10) : NaN;
    const confirmDisabled = !(Number.isFinite(parsed) && parsed >= 0);

    return (
      <Page topbar={topbar}>
        <Bubble>현재 잔고를 여쭙겠습니다.</Bubble>

        {balance !== null && (
          <Chip>
            <div className="text-zinc-300">현재 선택된 잔고</div>
            <div className="font-semibold">₩{balance.toLocaleString("ko-KR")}</div>
          </Chip>
        )}

        <Option
          label="100만 원 이하"
          selected={balance === 1000000}
          onClick={() => {
            setBalance(1000000);
            setShowBalanceManual(false);
            setBalanceManualText("");
          }}
        />
        <Option
          label="100~300만 원"
          selected={balance === 2000000}
          onClick={() => {
            setBalance(2000000);
            setShowBalanceManual(false);
            setBalanceManualText("");
          }}
        />
        <Option
          label="300~500만 원"
          selected={balance === 4000000}
          onClick={() => {
            setBalance(4000000);
            setShowBalanceManual(false);
            setBalanceManualText("");
          }}
        />
        <Option
          label="500만 원 이상"
          selected={balance === 7000000}
          onClick={() => {
            setBalance(7000000);
            setShowBalanceManual(false);
            setBalanceManualText("");
          }}
        />

        <Option
          label={showBalanceManual ? "직접 입력 (열림)" : "직접 입력"}
          selected={showBalanceManual}
          onClick={() => {
            setShowBalanceManual((v) => !v);
            if (!showBalanceManual && balance !== null && balance >= 0) {
              setBalanceManualText(String(balance));
            }
          }}
        />

        {showBalanceManual && (
          <NumberPanel
            title="잔고를 숫자로 입력해 주세요."
            placeholder="예: 3500000"
            value={balanceManualText}
            onChange={setBalanceManualText}
            onCancel={() => {
              setShowBalanceManual(false);
              setBalanceManualText("");
            }}
            onConfirm={() => {
              const clean = balanceManualText.replace(/[^0-9]/g, "");
              const n = Number.parseInt(clean, 10);
              if (!Number.isFinite(n) || n < 0) return;
              setBalance(n);
              setShowBalanceManual(false);
            }}
            confirmDisabled={confirmDisabled}
          />
        )}

        <Option
          label="다음"
          disabled={balance === null}
          onClick={() => {
            if (balance === null) return;
            pushAndGo("INCOME");
          }}
        />
      </Page>
    );
  }

  if (act === "INCOME") {
    const onlyDigits = incomeManualText.replace(/[^0-9]/g, "");
    const parsed = onlyDigits.length > 0 ? Number.parseInt(onlyDigits, 10) : NaN;
    const confirmDisabled = !(Number.isFinite(parsed) && parsed >= 0);

    return (
      <Page topbar={topbar}>
        <Bubble>월 수입은 어느 정도입니까?</Bubble>

        {income !== null && (
          <Chip>
            <div className="text-zinc-300">현재 선택된 월 수입</div>
            <div className="font-semibold">₩{income.toLocaleString("ko-KR")}</div>
          </Chip>
        )}

        <Option
          label="200만 원 이하"
          selected={income === 2000000}
          onClick={() => {
            setIncome(2000000);
            setShowIncomeManual(false);
            setIncomeManualText("");
          }}
        />
        <Option
          label="200~300만 원"
          selected={income === 2500000}
          onClick={() => {
            setIncome(2500000);
            setShowIncomeManual(false);
            setIncomeManualText("");
          }}
        />
        <Option
          label="300~500만 원"
          selected={income === 4000000}
          onClick={() => {
            setIncome(4000000);
            setShowIncomeManual(false);
            setIncomeManualText("");
          }}
        />
        <Option
          label="500만 원 이상"
          selected={income === 6000000}
          onClick={() => {
            setIncome(6000000);
            setShowIncomeManual(false);
            setIncomeManualText("");
          }}
        />

        <Option
          label={showIncomeManual ? "직접 입력 (열림)" : "직접 입력"}
          selected={showIncomeManual}
          onClick={() => {
            setShowIncomeManual((v) => !v);
            if (!showIncomeManual && income !== null && income >= 0) {
              setIncomeManualText(String(income));
            }
          }}
        />

        {showIncomeManual && (
          <NumberPanel
            title="월 수입을 숫자로 입력해 주세요."
            placeholder="예: 3200000"
            value={incomeManualText}
            onChange={setIncomeManualText}
            onCancel={() => {
              setShowIncomeManual(false);
              setIncomeManualText("");
            }}
            onConfirm={() => {
              const clean = incomeManualText.replace(/[^0-9]/g, "");
              const n = Number.parseInt(clean, 10);
              if (!Number.isFinite(n) || n < 0) return;
              setIncome(n);
              setShowIncomeManual(false);
            }}
            confirmDisabled={confirmDisabled}
          />
        )}

        <Option
          label="다음"
          disabled={income === null}
          onClick={() => {
            if (income === null) return;

            // ✅ 재정 입력이 완료되는 순간에만 ITEM로 이동
            // (첫 진입은 항상 여기까지 거치게 됨)
            pushAndGo("ITEM");

            // ITEM 버튼 활성화 상태 깨끗하게
            setItemDraft(itemText);
          }}
        />
      </Page>
    );
  }

  if (act === "ITEM") {
    const canNext = itemDraft.trim().length > 0 || itemText.trim().length > 0;

    return (
      <Page topbar={topbar}>
        <Bubble>그래서, 오늘 말리길 원하시는 것은 무엇입니까?</Bubble>

        <input
          key={itemKey}
          ref={itemInputRef}
          autoFocus
          name="item"
          className="mb-3 w-full rounded-xl bg-zinc-800 p-3 outline-none"
          placeholder="예: 커피머신, 아이패드"
          defaultValue={itemText}
          onChange={(e) => setItemDraft(e.currentTarget.value)}
        />

        <Option
          label="다음"
          disabled={!canNext}
          onClick={() => {
            const v = (itemInputRef.current?.value ?? "").trim();
            const finalText = v.length > 0 ? v : itemText.trim();
            if (finalText.length === 0) return;

            setItemText(finalText);
            setItemDraft(finalText);
            pushAndGo("PRICE");
          }}
        />
      </Page>
    );
  }

  if (act === "PRICE") {
    const onlyDigits = priceManualText.replace(/[^0-9]/g, "");
    const parsed = onlyDigits.length > 0 ? Number.parseInt(onlyDigits, 10) : NaN;
    const confirmDisabled = !(Number.isFinite(parsed) && parsed > 0);

    return (
      <Page topbar={topbar}>
        <Bubble>가격은요?</Bubble>

        {price !== null && (
          <Chip>
            <div className="text-zinc-300">현재 선택된 가격</div>
            <div className="font-semibold">₩{price.toLocaleString("ko-KR")}</div>
          </Chip>
        )}

        <Option
          label="10만 원 이하"
          selected={price === 100000}
          onClick={() => {
            setPrice(100000);
            setShowPriceManual(false);
            setPriceManualText("");
          }}
        />
        <Option
          label="10~30만 원"
          selected={price === 200000}
          onClick={() => {
            setPrice(200000);
            setShowPriceManual(false);
            setPriceManualText("");
          }}
        />
        <Option
          label="30~70만 원"
          selected={price === 500000}
          onClick={() => {
            setPrice(500000);
            setShowPriceManual(false);
            setPriceManualText("");
          }}
        />
        <Option
          label="70만 원 이상"
          selected={price === 1000000}
          onClick={() => {
            setPrice(1000000);
            setShowPriceManual(false);
            setPriceManualText("");
          }}
        />

        <Option
          label={showPriceManual ? "직접 입력 (열림)" : "직접 입력"}
          selected={showPriceManual}
          onClick={() => {
            setShowPriceManual((v) => !v);
            if (!showPriceManual && price !== null && price > 0) {
              setPriceManualText(String(price));
            }
          }}
        />

        {showPriceManual && (
          <NumberPanel
            title="원하시는 금액을 숫자로 입력해 주세요."
            placeholder="예: 259000"
            value={priceManualText}
            onChange={setPriceManualText}
            onCancel={() => {
              setShowPriceManual(false);
              setPriceManualText("");
            }}
            onConfirm={() => {
              const clean = priceManualText.replace(/[^0-9]/g, "");
              const n = Number.parseInt(clean, 10);
              if (!Number.isFinite(n) || n <= 0) return;
              setPrice(n);
              setShowPriceManual(false);
            }}
            confirmDisabled={confirmDisabled}
          />
        )}

        <Option
          label="다음"
          disabled={price === null}
          onClick={() => {
            if (price === null) return;
            pushAndGo("USAGE");
          }}
        />
      </Page>
    );
  }

  if (act === "USAGE") {
    return (
      <Page topbar={topbar}>
        <Bubble>얼마나 자주 쓰실 계획입니까?</Bubble>

        {usagePerMonth !== null && (
          <Chip>
            <div className="text-zinc-300">현재 선택</div>
            <div className="font-semibold">월 {usagePerMonth}회</div>
          </Chip>
        )}

        <Option
          label="거의 매일"
          selected={usagePerMonth === 25}
          onClick={() => setUsagePerMonth(25)}
        />
        <Option
          label="주 3~4회"
          selected={usagePerMonth === 14}
          onClick={() => setUsagePerMonth(14)}
        />
        <Option
          label="주 1회"
          selected={usagePerMonth === 4}
          onClick={() => setUsagePerMonth(4)}
        />
        <Option
          label="한 달에 몇 번"
          selected={usagePerMonth === 2}
          onClick={() => setUsagePerMonth(2)}
        />

        <Option
          label="집사에게 판단을 맡긴다"
          disabled={!usagePerMonth || !price || !income}
          onClick={() => {
            if (!usagePerMonth || !price || !income) return;
            clearCalcTimer();
            setAct("CALC");
            calcTimerRef.current = setTimeout(() => {
              calcTimerRef.current = null;
              calculate(price, usagePerMonth, income);
            }, 600);
          }}
        />
      </Page>
    );
  }

  if (act === "CALC") {
    return (
      <Page topbar={topbar}>
        <Bubble>잠시만요.\n집사가 계산 중입니다.</Bubble>
      </Page>
    );
  }

  const showAd =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT &&
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULT;

  // RESULT
  return (
    <Page topbar={topbar}>
      <Bubble>
        {decision === "OK"
          ? `${USER_TITLE}, 이번엔 집사도 말릴 명분이 없습니다.`
          : decision === "HOLD"
            ? `${USER_TITLE}, 자주 쓰신다면… 넘어가 드리죠.`
            : `${USER_TITLE}… 이 소비에는 각오가 필요해 보입니다.`}
      </Bubble>

      <Chip>
        <div className="text-zinc-300">요약</div>
        <div className="mt-1 text-sm text-zinc-100">
          <div>물건: {itemText || "—"}</div>
          <div>가격: {price !== null ? `₩${price.toLocaleString("ko-KR")}` : "—"}</div>
          <div>빈도: {usagePerMonth !== null ? `월 ${usagePerMonth}회` : "—"}</div>
        </div>
      </Chip>

      <div className="mb-3 rounded-xl bg-zinc-800 p-3 text-sm">
        <p>1회 사용 비용: ₩{costPerUse?.toFixed(0)}</p>
        <p>월 수입 대비: {(burden! * 100).toFixed(1)}%</p>
      </div>

      {showAd ? (
        <div className="mb-3 rounded-xl border border-zinc-700 bg-zinc-900/60 p-3">
          <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULT!} />
        </div>
      ) : null}

      {/* ✅ Retry = 재정 유지 */}
      <Option
        label="다른 물건으로 다시 물어본다 (재정 유지)"
        onClick={resetTodayOnlyKeepFinance}
      />

      {/* ✅ 그 외 = 전부 초기화 */}
      <Option
        label="처음부터 다시 시작한다 (재정 초기화)"
        onClick={() => resetAll("INTRO")}
      />
    </Page>
  );
}
