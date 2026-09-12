const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Formats a plain "YYYY-MM-DD" calendar date (no time-of-day, no timezone)
 * as "Month D, YYYY" — parsed from the string components directly rather
 * than through `new Date(iso)`, which would interpret it as UTC midnight
 * and can shift a day off once reformatted for a Pacific-time audience.
 */
export function formatFriendlyDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export function formatDateRange(checkInIso: string, checkOutIso: string): string {
  return `${formatFriendlyDate(checkInIso)} – ${formatFriendlyDate(checkOutIso)}`;
}
