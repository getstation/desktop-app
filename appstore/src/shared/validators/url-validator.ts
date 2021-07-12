export function isValidUrl(value: string) {
  try {
    // tslint:disable-next-line:no-unused-expression
    new URL(value);
    return true;
  } catch (_) {
    return false;
  }
}
