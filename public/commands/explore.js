import { gameData } from "../gameData.js";
import { treasures } from "../data/treasure.js";
import { saveGameData, consoleElement } from "../utilities.js";

export function startExploration() {
  if (gameData.ongoingExploration) {
    consoleElement.value += "\nAn exploration is already ongoing.\n";

    return;
  }

  gameData.ongoingExploration = true;
  gameData.explorationEndTime = new Date().getTime() + 120000;
  consoleElement.value +=
    "\nExploration started! You can collect the treasure in 2 minutes with 'collect'\n";

  saveGameData();
}

export function collectTreasure() {
  if (!gameData.ongoingExploration) {
    consoleElement.value += "\nNo ongoing exploration to collect from.\n";
    return;
  }

  const currentTime = new Date().getTime();
  if (currentTime < gameData.explorationEndTime) {
    consoleElement.value +=
      "\nThe exploration is not yet complete. Please wait.\n";
    return;
  }

  const treasure = treasures[Math.floor(Math.random() * treasures.length)];
  const amount =
    Math.floor(Math.random() * (treasure.maxAmount - treasure.minAmount + 1)) +
    treasure.minAmount;
  const coins =
    Math.floor(Math.random() * (treasure.maxCoins - treasure.minCoins + 1)) +
    treasure.minCoins;
  const exp =
    Math.floor(Math.random() * (treasure.maxExp - treasure.minExp + 1)) +
    treasure.minExp;

  gameData.ongoingExploration = false;

  // Add treasure to inventory
  const itemIndex = gameData.userInventory.findIndex(
    (i) => i.item === treasure.item
  );
  if (itemIndex >= 0) {
    gameData.userInventory[itemIndex].quantity += amount;
  } else {
    gameData.userInventory.push({ item: treasure.item, quantity: amount });
  }

  // Update coins and experience
  gameData.goldAmount += coins;
  gameData.exp += exp;

  consoleElement.value += `\nTreasure Collected! You found ${amount} ${treasure.item}(s), ${coins} coins, and ${exp} experience points.\n`;

  saveGameData();
}
