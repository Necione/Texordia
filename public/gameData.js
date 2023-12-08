import { loadFromLocalStorage, saveToLocalStorage } from "./utilities.js";

const defaultData = {
  isAsyncCommandRunning: false,
  goldAmount: 0,
  ongoingExploration: false,
  explorationEndTime: "",
  attack: 2,
  hp: 20,
  maxHp: 20,
  defense: 0,
  userInventory: [],
  currentDirectory: "",
  equippedArmors: [null, null, null, null],
  level: 1,
  exp: 0,
  nextLevelExp: 35, // EXP required for level 2
  equippedBlade: null,
  equippedHandle: null,
  equippedHilt: null,
  skills: {
    Vigilance: {
      unlocked: false,
      level: 0,
    },
    Leech: {
      unlocked: false,
      level: 0,
    },
  },
  leechCounter: 0,
  isFirstAttack: true,
};

function updateLevel() {
  const expForNextLevel = [35, 55, 115, 215, 355, 535, 755, 1015, 1315, 1655];

  while (
    gameData.exp >= gameData.nextLevelExp &&
    gameData.level - 1 < expForNextLevel.length
  ) {
    gameData.level++;
    gameData.attack += 1;
    gameData.nextLevelExp = expForNextLevel[gameData.level - 1];
  }
}

let gameData = loadFromLocalStorage("gameData", defaultData);

function updateGameData(newData) {
  gameData = { ...gameData, ...newData };
  updateLevel();
  saveToLocalStorage("gameData", gameData);
}

export { gameData, updateGameData, updateLevel };
