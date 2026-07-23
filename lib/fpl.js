/**
 * Federal Poverty Level guidelines — update annually each January.
 * Source: https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines
 * Last updated: January 2026 (effective Jan 13, 2026)
 *
 * Fair Fares eligibility: household income at or below 200% of FPL
 * (expanded from 150% in the June 2026 NYC budget agreement).
 * Source: https://www.nyc.gov/site/fairfares/index.page
 */
export const FPL_YEAR = 2026

// Fair Fares income limit as a multiple of FPL (200%)
export const FF_MULTIPLIER = 2.0

// Annual FPL by household size (contiguous US + DC), 2026
export const FPL = {
  1: 15960,
  2: 21648,
  3: 27324,
  4: 33000,
  5: 38676,
  6: 44352,
  7: 50028,
  8: 55704,
}

// Per-additional-person amount above 8, 2026
const EXTRA_PERSON = 5676

/**
 * Returns the 100% FPL amount for a given household size.
 */
export function getFPL(householdSize) {
  const size = Math.max(1, parseInt(householdSize) || 1)
  if (size <= 8) return FPL[size]
  return FPL[8] + (size - 8) * EXTRA_PERSON
}

/**
 * Returns the Fair Fares income limit (200% of FPL) for a household size.
 */
export function getFairFaresLimit(householdSize) {
  return Math.round(getFPL(householdSize) * FF_MULTIPLIER)
}

/**
 * Returns true if annual income is at or below the Fair Fares limit (200% FPL).
 */
export function isEligibleByIncome(annualIncome, householdSize) {
  return annualIncome <= getFairFaresLimit(householdSize)
}

/**
 * Formatted Fair Fares limit for display.
 */
export function formatFFLimit(householdSize) {
  return '$' + getFairFaresLimit(householdSize).toLocaleString()
}

/**
 * Formatted 100% FPL for display.
 */
export function formatFPL(householdSize) {
  return '$' + getFPL(householdSize).toLocaleString()
}
