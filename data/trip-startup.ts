export const TRIP_START = "2026-09-27";
export const TRIP_END = "2026-10-05";

export function selectInitialDayIndex(
  isoDates: string[],
  localDate: string,
) {
  if (!isoDates.length || localDate < TRIP_START) return 0;
  if (localDate > TRIP_END) return isoDates.length - 1;
  const exact = isoDates.indexOf(localDate);
  return exact >= 0 ? exact : 0;
}
