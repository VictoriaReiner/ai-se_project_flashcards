import { getDeckByID, fetchedDecks } from "./decks.js";
import { renderDeckEl, renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";
import { enableSubmitBtn, showError } from "./new-deck-view.js";
import { getDecks } from "./api.js";

let currentDeck = null;

getDecks()
  .then((decks) => {
    fetchedDecks.push(...decks);
    decks.forEach(renderDeckEl);
  })
  .catch(() => {
    showError("Can't fetch decks");
  })
  .finally(() => {
    router();
  });

const homeSection = document.querySelector("#home");
const deckSection = document.querySelector("#deck-view");
const notFoundSection = document.querySelector("#not-found");
const carouselSection = document.querySelector("#carousel");
const newDeckSection = document.querySelector("#new-deck-view");
const aboutSection = document.querySelector("#about");
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
    location.hash = `#carousel/${currentDeck._id}`;
  }
});

const newDeckButton = document.querySelector("#home .gallery__new-deck-btn");
newDeckButton?.addEventListener("click", () => {
  location.hash = "#new-deck";
});

/**
 * Shows the view selected by the current location hash.
 * @returns {void}
 */
function router() {
  const hash = location.hash || "#home";
  const mainContent = document.querySelector(".page__main-content");
  const pageElement = document.querySelector(".page");

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
  if (newDeckSection) {
    newDeckSection.style.display = "none";
  }
  if (aboutSection) {
    aboutSection.style.display = "none";
  }
  if (mainContent) {
    mainContent.classList.remove("page__main-content_location_carousel");
  }

  if (pageElement) {
    pageElement.classList.remove("page_no-mobile-bar");
  }

  if (hash === "#new-deck" || hash === "#new-deck-view") {
    if (newDeckSection) {
      newDeckSection.style.display = "block";
    }
    enableSubmitBtn();
  } else if (hash === "#about") {
    if (aboutSection) {
      aboutSection.style.display = "block";
    }
  } else if (hash === "#home" || hash === "") {
    if (homeSection) homeSection.style.display = "";
  } else if (hash.startsWith("#deck/")) {
    const deckId = hash.split("/")[1];
    const deck = getDeckByID(deckId);

    if (deck) {
      currentDeck = deck;
      renderDeckView(deck);
    } else if (notFoundSection) {
      notFoundSection.style.display = "";
      pageElement?.classList.add("page_no-mobile-bar");
    }
  } else if (hash.startsWith("#carousel/")) {
    const deckId = hash.split("/")[1];
    const deck = getDeckByID(deckId);

    if (deck) {
      currentDeck = deck;
      renderCarouselView(deck);
      pageElement?.classList.add("page_no-mobile-bar");
    } else {
      if (notFoundSection) notFoundSection.style.display = "";
    }
  } else {
    if (notFoundSection) notFoundSection.style.display = "";
    pageElement?.classList.add("page_no-mobile-bar");
  }
}

window.addEventListener("hashchange", router);

router();
