export function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch (_) {
    return false;
  }
}
