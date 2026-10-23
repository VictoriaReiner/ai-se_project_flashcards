import { decks, getDeckByID } from "./decks.js";
import { renderDeckEl, renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";

let currentDeck = null;

decks.forEach(renderDeckEl);

const homeSection = document.querySelector("#home");
const deckSection = document.querySelector("#deck-view");
const notFoundSection = document.querySelector("#not-found");
const carouselSection = document.querySelector("#carousel");
const deckList = document.querySelector("#home .gallery__list");
const practiceButton = document.querySelector(
  "#deck-view .gallery__practice-btn",
);

deckList?.addEventListener("click", (event) => {
  const deckLink = event.target.closest(".card__link");
  if (!deckLink) return;

  currentDeck = getDeckByID(deckLink.hash.split("/")[1]);
});

practiceButton?.addEventListener("click", (event) => {
  event.preventDefault();
  if (currentDeck) {
    location.hash = `#carousel/${currentDeck.id}`;
  }
});

function router() {
  const hash = location.hash || "#home";
  const mainContent = document.querySelector(".page__main-content");

  if (homeSection) {
    homeSection.style.display = "none";
  }
  if (deckSection) {
    deckSection.style.display = "none";
  }
  if (notFoundSection) {
    notFoundSection.style.display = "none";
  }
  if (carouselSection) {
    carouselSection.style.display = "none";
  }
  if (mainContent) {
    mainContent.classList.remove("page__main-content_location_carousel");
  }

  if (hash === "#home" || hash === "") {
    if (homeSection) homeSection.style.display = "";
  } else if (hash.startsWith("#deck/")) {
    const deckId = hash.split("/")[1];
    const deck = getDeckByID(deckId);

    if (deck) {
      currentDeck = deck;
      renderDeckView(deck);
    } else if (notFoundSection) {
      notFoundSection.style.display = "";
    }
  } else if (hash.startsWith("#carousel/")) {
    const deckId = hash.split("/")[1];
    const deck = getDeckByID(deckId);

    if (deck) {
      currentDeck = deck;
      renderCarouselView(deck);
    } else {
      if (notFoundSection) notFoundSection.style.display = "";
    }
  } else {
    if (notFoundSection) notFoundSection.style.display = "";
  }
}

window.addEventListener("hashchange", router);

router();
