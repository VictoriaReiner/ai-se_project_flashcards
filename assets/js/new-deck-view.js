import { addDeck } from "./api.js";
import { fetchedDecks } from "./decks.js";
import { renderDeckEl } from "./carousel.js";

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

  addDeck({
    name: name,
    cards: cards,
    color: color,
  })
    .then((newDeck) => {
      fetchedDecks.push(newDeck);
      renderDeckEl(newDeck);
      window.location.hash = `deck/${newDeck._id}`;
    })
    .catch(() => {
      showError("Can't create deck");
    });
});