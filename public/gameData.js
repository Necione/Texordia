import { loadFromLocalStorage, saveToLocalStorage } from "./utilities.js";

const defaultData = {
  goldAmount: 0,
  lastHuntTime: 0,
  attack: 2,
  hp: 20,
  maxHp: 20,
  defense: 0,
  userInventory: [],
  currentDirectory: "",
  equippedArmors: [null, null, null, null],
};

let gameData = loadFromLocalStorage("gameData", defaultData);

function updateGameData(newData) {
  gameData = { ...gameData, ...newData };
  saveToLocalStorage("gameData", gameData);
}

export { gameData, updateGameData };