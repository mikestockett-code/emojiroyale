export const CHALK_COLORS = ['#ff6eb4', '#ffe066', '#7fff7f', '#ff9f43', '#c77dff', '#7fffff', '#ff85a1', '#a8ff78'];

export function chalkColor(index: number): string {
  return CHALK_COLORS[index % CHALK_COLORS.length];
}

export function chalkTextStyle(index: number, fontSize: number, shadowRadius = 6) {
  const c = chalkColor(index);
  return {
    color: c,
    fontWeight: '900' as const,
    fontSize,
    textShadowColor: c,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: shadowRadius,
  };
}
