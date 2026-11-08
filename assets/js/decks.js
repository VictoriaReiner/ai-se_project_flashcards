export const fetchedDecks = [];

export function getDeckByID(id) {
  return fetchedDecks.find((deck) => deck._id === id);
}
