export function isEmptyObj(obj: {}): boolean {
  if (!obj) return false;
  if (typeof obj !== 'object') return false
  return !Object.keys(obj).length
}