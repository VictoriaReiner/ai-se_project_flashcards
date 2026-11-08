export const fetchedDecks = [];

/**
 * Finds a fetched deck by its server-assigned ID.
 * @param {string} id The deck ID to find.
 * @returns {{_id: string, name: string, color: string, cards: Array<{_id?: string, question: string, answer: string}>}|undefined} The matching deck, if present.
 */
export function getDeckByID(id) {
  return fetchedDecks.find((deck) => deck._id === id);
}
