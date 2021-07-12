export function isValidColor(color: string) {
  const element = document.createElement('div');
  element.style.color = color;
  const value = element.style.color.split(/\s+/).join('').toLowerCase(); // empty string if color is invalid
  return !!(value);
}
