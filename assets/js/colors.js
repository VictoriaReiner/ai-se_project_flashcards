export const colorMap = {
  green: "#64d583",
  blue: "#91a8f9",
  orange: "#ee955e",
  pink: "#ee92d7",
  purple: "#aa8ef0",
  yellow: "#f5d770",
  default: "#64d583",
};

export function stringToHex(colorName) {
  return colorMap[colorName] || colorMap.default;
}

export function hexToString(hex) {
  return (
    Object.keys(colorMap).find((key) => colorMap[key] === hex) || "default"
  );
}

export function removeColorClasses(element) {
  if (!element) return;
  const classes = Array.from(element.classList);
  classes.forEach((className) => {
    if (className.includes("color_") || className.includes("card--")) {
      element.classList.remove(className);
    }
  });
}
