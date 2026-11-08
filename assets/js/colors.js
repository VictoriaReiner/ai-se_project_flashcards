export const colorMap = {
  green: "#64d583",
  blue: "#91a8f9",
  orange: "#ee955e",
  pink: "#ee92d7",
  purple: "#aa8ef0",
  yellow: "#f5d770",
  default: "#64d583",
};

/**
 * Returns the hex value for a named color, or the default color if unknown.
 * @param {string} colorName The color name to look up.
 * @returns {string} The corresponding hex color.
 */
export function stringToHex(colorName) {
  return colorMap[colorName] || colorMap.default;
}

/**
 * Returns the color name matching a hex value, or "default" if none matches.
 * @param {string} hex The hex color value to look up.
 * @returns {string} The matching color name or "default".
 */
export function hexToString(hex) {
  return (
    Object.keys(colorMap).find((key) => colorMap[key] === hex) || "default"
  );
}

/**
 * Removes color-related classes from an element when one is provided.
 * @param {Element|null|undefined} element The element to update.
 * @returns {void}
 */
export function removeColorClasses(element) {
  if (!element) return;
  const classes = Array.from(element.classList);
  classes.forEach((className) => {
    if (className.includes("color_") || className.includes("card--")) {
      element.classList.remove(className);
    }
  });
}
