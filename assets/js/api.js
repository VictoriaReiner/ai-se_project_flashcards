const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";

const headers = {
  "Content-Type": "application/json",
  Authorization: "01a1b6c9-1e35-7309-8d5a-920269c5ba7a",
};

function processResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

export function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

export function deleteDeck(id) {
  return fetch(`${baseUrl}/decks/${id}`, {
    method: "DELETE",
    headers,
  }).then(processResponse);
}

export function addDeck(deckData) {
  return fetch(`${baseUrl}/decks`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(deckData),
  }).then(processResponse);
}
