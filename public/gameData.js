import { loadFromLocalStorage, saveToLocalStorage } from "./utilities.js";

const defaultData = {
  goldAmount: 100,
  lastHuntTime: 0,
  hp: 20,
  defense: 10,
  userInventory: []  // Initialize userInventory as an empty array
};

let gameData = loadFromLocalStorage("gameData", defaultData);

function updateGameData(newData) {
  gameData = { ...gameData, ...newData };
  saveToLocalStorage("gameData", gameData);  // Correctly pass key and value to saveToLocalStorage
}

export { gameData, updateGameData };