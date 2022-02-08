export function getInRange(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

export function normalizeSlideIndex(index, slidesCount) {
  if (index < 0) {
    return (index + slidesCount) % slidesCount;
  }
  if (index > slidesCount) {
    return 0;
  }
  return index % slidesCount;
}
