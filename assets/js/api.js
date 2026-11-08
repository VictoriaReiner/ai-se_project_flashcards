const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";

const headers = {
  "Content-Type": "application/json",
  Authorization: "01a1b6c9-1e35-7309-8d5a-920269c5ba7a",
};

/**
 * Parses a successful API response as JSON or rejects with its HTTP status.
 * @param {Response} res The response returned by fetch.
 * @returns {Promise<unknown>} The parsed response body.
 */
function processResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

/**
 * Fetches all decks from the API.
 * @returns {Promise<Array<{_id: string, name: string, color: string, cards: Array<{_id?: string, question: string, answer: string}>}>>} The fetched decks.
 */
export function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

/**
 * Deletes a deck from the API.
 * @param {string} id The ID of the deck to delete.
 * @returns {Promise<unknown>} The parsed API response body.
 */
export function deleteDeck(id) {
  return fetch(`${baseUrl}/decks/${id}`, {
    method: "DELETE",
    headers,
  }).then(processResponse);
}

/**
 * Creates a deck through the API.
 * @param {{name: string, color: string, cards: Array<{question: string, answer: string}>}} deckData The deck data to submit.
 * @returns {Promise<{_id: string, name: string, color: string, cards: Array<{_id?: string, question: string, answer: string}>}>} The created deck returned by the API.
 */
export function addDeck(deckData) {
  return fetch(`${baseUrl}/decks`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(deckData),
  }).then(processResponse);
}
