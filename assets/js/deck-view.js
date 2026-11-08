import { hexToString, removeColorClasses } from "./colors.js";

const deckSection = document.querySelector("#deck-view");
const deckTitle = deckSection?.querySelector(".gallery__title");
const cardList = deckSection?.querySelector(".gallery__list");
const cardTemplate = document.querySelector("#flashcard-template");

/**
 * Displays a deck's flashcards as a list with flip and delete controls.
 * @param {{_id: string, name: string, color: string, cards: Array<{_id?: string, question: string, answer: string}>}} deck The deck to display.
 * @returns {void}
 */
export function renderDeckView(deck) {
  if (!deckSection || !cardList || !cardTemplate) return;

  deckSection.style.display = "block";
  deckTitle.textContent = deck.name;
  cardList.replaceChildren();

  const colorName = hexToString(deck.color);

  deck.cards.forEach((card) => {
    const cardElement = cardTemplate.content
      .querySelector(".card")
      .cloneNode(true);
    const titleElement = cardElement.querySelector(".card__title");
    const flipButton = cardElement.querySelector(".card__btn_type_flip");
    const deleteButton = cardElement.querySelector(".card__btn_type_delete");
    let showingQuestion = true;

    removeColorClasses(cardElement);
    if (colorName) cardElement.classList.add(`card--${colorName}`);
    titleElement.textContent = card.question;

    flipButton.addEventListener("click", () => {
      showingQuestion = !showingQuestion;
      titleElement.textContent = showingQuestion ? card.question : card.answer;
      cardElement.classList.toggle("card_color_white", !showingQuestion);
    });

    deleteButton.addEventListener("click", () => {
      const cardIndex = deck.cards.findIndex((item) => item._id === card._id);
      if (cardIndex !== -1) deck.cards.splice(cardIndex, 1);
      const deckLink = Array.from(
        document.querySelectorAll("#home .card__link"),
      ).find((link) => link.getAttribute("href") === `#deck/${deck._id}`);
      const countElement =
        deckLink?.parentElement.querySelector(".card__count");
      if (countElement) countElement.textContent = `${deck.cards.length} cards`;
      renderDeckView(deck);
    });

    cardList.append(cardElement);
  });
}
