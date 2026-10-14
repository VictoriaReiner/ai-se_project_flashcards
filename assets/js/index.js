import { decks, getDeckByID } from "./decks.js";
import { renderDeckEl, renderCarouselView } from "./carousel.js";

decks.forEach(renderDeckEl);

const homeSection = document.querySelector("#home");
const notFoundSection = document.querySelector("#not-found");
const carouselSection = document.querySelector("#carousel");

function handleRoute() {
  const hash = location.hash || "#home";
  const mainContent = document.querySelector(".page__main-content");

  if (homeSection) {
    homeSection.style.display = "none";
  }
  if (notFoundSection) {
    notFoundSection.style.display = "none";
  }
  if (carouselSection) {
    carouselSection.style.display = "none";
  }
  if (mainContent) {
    mainContent.classList.remove("page__main-content--carousel");
  }

  if (hash === "#home" || hash === "") {
    if (homeSection) homeSection.style.display = "";
  } else if (hash.startsWith("#carousel/")) {
    const deckId = hash.split("/")[1];
    const deck = getDeckByID(deckId);

    if (deck) {
      renderCarouselView(deck);
    } else {
      if (notFoundSection) notFoundSection.style.display = "";
    }
  } else {
    if (notFoundSection) notFoundSection.style.display = "";
  }
}

window.addEventListener("hashchange", handleRoute);

handleRoute();
