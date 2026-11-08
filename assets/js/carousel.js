import { hexToString, removeColorClasses } from "./colors.js";
import { deleteDeck } from "./api.js";
import { fetchedDecks } from "./decks.js";
import { showError } from "./new-deck-view.js";

const deckList = document.querySelector(".gallery__list");
const deckTemplate = document.querySelector("#deck-template");

/**
 * Formats the carousel title with the current one-based card position.
 * @param {string} deckName The name of the deck being studied.
 * @param {number} cardIndex The zero-based index of the current card.
 * @param {number} totalCards The total number of cards in the deck.
 * @returns {string} The formatted carousel title.
 */
export function getCarouselTitleString(deckName, cardIndex, totalCards) {
  return `${deckName} · ${cardIndex + 1}/${totalCards}`;
}

/**
 * Creates a deck list element and connects its delete and navigation actions.
 * @param {{_id: string, name: string, color: string, cards?: Array<{_id?: string, question: string, answer: string}>}} item The deck to represent.
 * @returns {HTMLElement} The cloned deck element.
 */
export function createDeckEl(item) {
  const deckElement = deckTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const colorName = hexToString(item.color);
  if (colorName) {
    deckElement.classList.add(`card--${colorName}`);
  }

  const deleteButton = deckElement.querySelector(".card__btn_type_delete");
  deleteButton?.addEventListener("click", () => {
    deleteDeck(item._id)
      .then(() => {
        deckElement.remove();
        const index = fetchedDecks.findIndex((d) => d._id === item._id);
        if (index !== -1) {
          fetchedDecks.splice(index, 1);
        }
      })
      .catch(() => {
        showError("Can't delete deck");
      });
  });

  const deckLink = deckElement.querySelector(".card__link");
  if (deckLink) {
    deckLink.href = `#deck/${item._id}`;
  }

  const titleElement = deckElement.querySelector(".card__title");
  const countElement = deckElement.querySelector(".card__count");

  if (titleElement) titleElement.textContent = item.name;
  if (countElement && item.cards) {
    countElement.textContent = `${item.cards.length} cards`;
  }

  return deckElement;
}

/**
 * Creates and prepends a deck element to the deck list when the list exists.
 * @param {{_id: string, name: string, color: string, cards?: Array<{_id?: string, question: string, answer: string}>}} item The deck to render.
 * @returns {void}
 */
export function renderDeckEl(item) {
  const deckElement = createDeckEl(item);
  if (deckList && deckElement) {
    deckList.prepend(deckElement);
  }
}

/**
 * Displays a deck's flashcards in the interactive carousel.
 * @param {{_id: string, name: string, color: string, cards: Array<{_id?: string, question: string, answer: string}>}} deck The deck to study.
 * @returns {void}
 */
export function renderCarouselView(deck) {
  const homeSection = document.querySelector("#home");
  const carouselSection = document.querySelector("#carousel");
  const mainContent = document.querySelector(".page__main-content");
  const notFoundSection = document.querySelector("#not-found");

  if (homeSection) homeSection.style.display = "none";
  if (notFoundSection) notFoundSection.style.display = "none";
  if (carouselSection) {
    carouselSection.style.display = "flex";
  }

  if (mainContent) {
    mainContent.classList.add("page__main-content_location_carousel");
  }

  const carouselTitle = document.querySelector(".carousel__title");
  const cardElement = document.querySelector(".carousel__card");
  const cardText = document.querySelector(".carousel__card-text");
  const leftButton = document.querySelector(".carousel__btn_type_left");
  const rightButton = document.querySelector(".carousel__btn_type_right");
  const flipButton = document.querySelector(".carousel__btn_type_flip");

  let currentCardIndex = 0;
  let showingQuestion = true;

  if (cardElement && deck) {
    removeColorClasses(cardElement);
    const colorName = hexToString(deck.color);
    if (colorName) {
      cardElement.classList.add(`card--${colorName}`);
    }
  }

  /**
   * Updates the visible card, title, and carousel navigation state.
   * @returns {void}
   */
  function updateDisplay() {
    if (!deck || !deck.cards || deck.cards.length === 0) return;

    const currentCard = deck.cards[currentCardIndex];
    if (showingQuestion) {
      cardText.textContent = currentCard.question;
      cardElement?.classList.remove("carousel__card_color_white");
    } else {
      cardText.textContent = currentCard.answer;
      cardElement?.classList.add("carousel__card_color_white");
    }

    if (carouselTitle) {
      carouselTitle.textContent = getCarouselTitleString(
        deck.name,
        currentCardIndex,
        deck.cards.length,
      );
    }

    if (leftButton) {
      leftButton.disabled = currentCardIndex === 0;
      leftButton.classList.toggle(
        "carousel__btn_disabled",
        currentCardIndex === 0,
      );
    }

    if (rightButton) {
      rightButton.disabled = currentCardIndex === deck.cards.length - 1;
      rightButton.classList.toggle(
        "carousel__btn_disabled",
        currentCardIndex === deck.cards.length - 1,
      );
    }
  }

  if (flipButton)
    flipButton.onclick = () => {
      showingQuestion = !showingQuestion;
      updateDisplay();
    };

  if (leftButton)
    leftButton.onclick = () => {
      if (currentCardIndex > 0) {
        currentCardIndex--;
        showingQuestion = true;
        updateDisplay();
      }
    };

  if (rightButton)
    rightButton.onclick = () => {
      if (deck && currentCardIndex < deck.cards.length - 1) {
        currentCardIndex++;
        showingQuestion = true;
        updateDisplay();
      }
    };

  updateDisplay();
}
