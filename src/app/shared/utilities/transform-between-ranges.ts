export function transformBetweenRanges(
  value: number,
  inputRange: { min: number; max: number },
  outputRange: { min: number; max: number }
) {
  const scale =
    (outputRange.max - outputRange.min) / (inputRange.max - inputRange.min);
  return (value - inputRange.min) * scale + outputRange.min;
}
