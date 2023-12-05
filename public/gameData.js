import { loadFromLocalStorage, saveToLocalStorage } from "./utilities.js";

const defaultData = {
  goldAmount: 100,
  lastHuntTime: 0,
  attack: 2,
  hp: 20,
  defense: 10,
  userInventory: [],
  currentDirectory: ""
};

let gameData = loadFromLocalStorage("gameData", defaultData);

function updateGameData(newData) {
  gameData = { ...gameData, ...newData };
  saveToLocalStorage("gameData", gameData);
}

export { gameData, updateGameData };