/**
 * Blog utility functions
 */

/**
 * Parse date string to Date object
 * Adds timezone to avoid Invalid Date errors
 */
export function parseDate(dateString: string): Date {
  // If date is already in ISO format with time, use as is
  if (dateString.includes('T')) {
    return new Date(dateString)
  }

  // Add midday time to avoid timezone issues
  return new Date(dateString + 'T12:00:00')
}
