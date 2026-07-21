/**
 * Federal Poverty Level guidelines — update annually each January.
 * Source: https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines
 * Last updated: 2024
 */
export const FPL_YEAR = 2024

// Annual FPL by household size (contiguous US + DC)
export const FPL = {
  1: 15060,
  2: 20440,
  3: 25820,
  4: 31200,
  5: 36580,
  6: 41960,
  7: 47340,
  8: 52720,
}

/**
 * Returns the FPL threshold for a given household size.
 * Household sizes above 8 add $5,380 per additional person.
 */
export function getFPL(householdSize) {
  const size = Math.max(1, parseInt(householdSize) || 1)
  if (size <= 8) return FPL[size]
  return FPL[8] + (size - 8) * 5380
}

/**
 * Returns true if annual income is at or below 100% FPL for the given household size.
 */
export function isEligibleByIncome(annualIncome, householdSize) {
  return annualIncome <= getFPL(householdSize)
}

/**
 * Returns a formatted string showing the FPL limit for display.
 */
export function formatFPL(householdSize) {
  return '$' + getFPL(householdSize).toLocaleString()
}
