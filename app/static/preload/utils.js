/**
 * Helper to fill an input in a page that makes sure it is correctly
 * updated, even when the website uses React (a simple input.value = x doesn't work)
 * @param {Object} input the input field as a DOM element
 * @param {string} value the value to assign to the field
 */
export const fillInput = (input, value) => {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  nativeInputValueSetter.call(input, value);

  ['input', 'change'].forEach(eventName => {
    const event = new Event(eventName, { bubbles: true, composed: true });
    event.simulated = true;
    input.dispatchEvent(event);
  });
};
