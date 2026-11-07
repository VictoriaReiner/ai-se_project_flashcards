import { decks } from "./decks.js";

const errorModal = document.querySelector("#error-modal");
const errorModalMessage = errorModal?.querySelector(".modal__error");
const errorModalCloseBtn = errorModal?.querySelector(".modal__close");

function openModal(modal) {
  modal?.classList.add("modal_visible");
  modal?.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
  modal?.classList.remove("modal_visible");
  modal?.setAttribute("aria-hidden", "true");
}

export function showError(message) {
  if (errorModalMessage) {
    errorModalMessage.textContent = message;
  }
  openModal(errorModal);
}

function validateName(name) {
  if (typeof name !== "string") {
    return null;
  }
  const trimmedName = name.trim();
  if (trimmedName.length < 2 || trimmedName.length > 80) {
    return null;
  }
  return trimmedName;
}

function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return undefined;
  }
}

errorModalCloseBtn?.addEventListener("click", () => {
  closeModal(errorModal);
});

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

/**
 * Converts a string to a URL-safe slug: lowercase with any run of
 * non-alphanumeric characters replaced by a single hyphen, and no leading or
 * trailing hyphens.
 *
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns a consistent lowercase hex color string with a leading "#".
 * Accepts values with or without a leading "#". Returns "#64d583" as a
 * fallback if the value is missing or not a valid 6-digit hex.
 *
 * @param {string|undefined} color
 * @returns {string}
 */
function normalizeColor(color) {
  if (!color) return "#64d583";
  const hex = color.startsWith("#") ? color.slice(1) : color;
  if (!HEX_DIGITS.test(hex)) return "#64d583";
  return "#" + hex.toLowerCase();
}

const form = document.querySelector("#new-deck-form");
const submitBtn = document.querySelector("#new-deck-submit-btn");

export function enableSubmitBtn() {
  if (submitBtn) {
    submitBtn.disabled = false;
  }
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const rawData = Object.fromEntries(new FormData(form));
  const parsedData = parseJSON(rawData["new-deck-data"]);
  if (parsedData === undefined) {
    showError("The submitted text is not valid JSON.");
    return;
  }

  if (
    !parsedData ||
    typeof parsedData !== "object" ||
    Array.isArray(parsedData)
  ) {
    showError(
      'JSON must be an object with a "name" field and a "cards" array.',
    );
    return;
  }

  if (!Object.hasOwn(parsedData, "name")) {
    showError('JSON must include a "name" field.');
    return;
  }

  const name = validateName(parsedData.name);
  if (name === null) {
    showError("Name must be a string between 2 and 80 characters");
    return;
  }

  const cards = parsedData.cards;
  if (!Array.isArray(cards)) {
    showError("Cards must be an array");
    return;
  }

  const validCards =
    cards.length > 0 &&
    cards.every(
      (card) =>
        card &&
        typeof card.question === "string" &&
        card.question.trim() &&
        typeof card.answer === "string" &&
        card.answer.trim(),
    );

  if (!validCards) {
    showError(
      'Use a non-empty array of cards with "question" and "answer" strings.',
    );
    return;
  }

  const color = normalizeColor(rawData["new-deck-color"]);

  if (Object.hasOwn(parsedData, "color")) {
    const jsonColor =
      typeof parsedData.color === "string"
        ? parsedData.color.trim().replace(/^#/, "")
        : "";
    if (
      !HEX_DIGITS.test(jsonColor) ||
      jsonColor.toLowerCase() !== color.slice(1).toLowerCase()
    ) {
      showError(
        "The color specified in the JSON does not match the selected deck color.",
      );
      return;
    }
  }

  const id = `${slugify(name)}-${Date.now()}`;

  const newDeck = {
    id: id,
    color: color,
    name: name,
    cards: cards.map((card, index) => ({
      ...card,
      id: card.id ?? `${id}-${index + 1}`,
    })),
  };

  decks.push(newDeck);

  window.location.hash = `deck/${id}`;
});
