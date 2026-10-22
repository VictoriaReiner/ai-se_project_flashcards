import { hexToString, removeColorClasses } from "./colors.js";

const deckList = document.querySelector(".gallery__list");
const deckTemplate = document.querySelector("#deck-template");

export function getCarouselTitleString(deckName, cardIndex, totalCards) {
  return `${deckName} · ${cardIndex + 1}/${totalCards}`;
}

export function createDeckEl(item) {
  const deckElement = deckTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const colorName = hexToString(item.color);
  if (colorName) {
    deckElement.classList.add(`card--${colorName}`);
  }

  const deleteButton = deckElement.querySelector(".card__delete-btn");
  deleteButton?.addEventListener("click", () => {
    deckElement.remove();
  });

  const deckLink = deckElement.querySelector(".card__link");
  if (deckLink) {
    deckLink.href = `#carousel/${item.id}`;
  }

  const titleElement = deckElement.querySelector(".card__title");
  const countElement = deckElement.querySelector(".card__count");

  if (titleElement) titleElement.textContent = item.name;
  if (countElement && item.cards) {
    countElement.textContent = `${item.cards.length} cards`;
  }

  return deckElement;
}

export function renderDeckEl(item) {
  const deckElement = createDeckEl(item);
  if (deckList && deckElement) {
    deckList.prepend(deckElement);
  }
}

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

  flipButton?.addEventListener("click", () => {
    showingQuestion = !showingQuestion;
    updateDisplay();
  });

  leftButton?.addEventListener("click", () => {
    if (currentCardIndex > 0) {
      currentCardIndex--;
      showingQuestion = true;
      updateDisplay();
    }
  });

  rightButton?.addEventListener("click", () => {
    if (deck && currentCardIndex < deck.cards.length - 1) {
      currentCardIndex++;
      showingQuestion = true;
      updateDisplay();
    }
  });

  updateDisplay();
}
