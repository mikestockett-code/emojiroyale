export const CHALK_COLORS = ['#ff6eb4', '#ffe066', '#7fff7f', '#ff9f43', '#c77dff', '#7fffff', '#ff85a1', '#a8ff78'];

export function chalkColor(index: number): string {
  return CHALK_COLORS[index % CHALK_COLORS.length];
}
