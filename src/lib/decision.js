/**
 * @typedef {"OK" | "HOLD" | "NO"} Decision
 */

/**
 * Keep only digits from user input.
 * @param {string} text
 * @returns {string}
 */
export function digitsOnly(text) {
  return text.replace(/[^0-9]/g, "");
}

/**
 * Parse number input with digit sanitization.
 * @param {string} text
 * @returns {number | null}
 */
export function parseAmount(text) {
  const clean = digitsOnly(text);
  if (clean.length === 0) return null;
  const parsed = Number.parseInt(clean, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * @param {number} price
 * @param {number} usagePerMonth
 * @param {number} income
 * @returns {{cpu: number, burdenRate: number, decision: Decision}}
 */
export function evaluatePurchaseDecision(price, usagePerMonth, income) {
  const cpu = price / usagePerMonth;
  const burdenRate = price / income;

  /** @type {Decision} */
  let decision = "OK";
  if (burdenRate > 0.3 && cpu > 3000) decision = "NO";
  else if (burdenRate > 0.15 || cpu > 3000) decision = "HOLD";

  return { cpu, burdenRate, decision };
}
