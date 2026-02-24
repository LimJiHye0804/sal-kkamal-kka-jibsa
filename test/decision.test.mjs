import test from "node:test";
import assert from "node:assert/strict";
import {
  digitsOnly,
  parseAmount,
  evaluatePurchaseDecision,
} from "../src/lib/decision.js";

test("digitsOnly strips non-numeric characters", () => {
  assert.equal(digitsOnly("12a,3원 45"), "12345");
  assert.equal(digitsOnly("abc"), "");
});

test("parseAmount returns null for empty numeric content", () => {
  assert.equal(parseAmount(""), null);
  assert.equal(parseAmount("원만 입력"), null);
});

test("parseAmount parses sanitized integers", () => {
  assert.equal(parseAmount("259,000원"), 259000);
  assert.equal(parseAmount("000120"), 120);
});

test("evaluatePurchaseDecision returns NO for high burden and high cpu", () => {
  const result = evaluatePurchaseDecision(2000000, 2, 4000000);
  assert.equal(result.decision, "NO");
  assert.equal(result.cpu, 1000000);
  assert.equal(result.burdenRate, 0.5);
});

test("evaluatePurchaseDecision returns HOLD when either burden or cpu is high", () => {
  const highBurdenOnly = evaluatePurchaseDecision(800000, 300, 3000000);
  assert.equal(highBurdenOnly.decision, "HOLD");

  const highCpuOnly = evaluatePurchaseDecision(500000, 2, 5000000);
  assert.equal(highCpuOnly.decision, "HOLD");
});

test("evaluatePurchaseDecision returns OK when burden and cpu are both low", () => {
  const result = evaluatePurchaseDecision(50000, 25, 5000000);
  assert.equal(result.decision, "OK");
  assert.equal(result.cpu, 2000);
});
