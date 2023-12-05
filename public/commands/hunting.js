import { gameData, updateGameData } from "../gameData.js";
import {
  saveToLocalStorage,
  saveGameData,
  consoleElement,
} from "../utilities.js";

let monsters = [];

fetch("monsters.json")
  .then((response) => response.json())
  .then((data) => {
    monsters = data.monsters;
  })
  .catch((error) => console.error("Error loading monster data:", error));

export async function handleHunting() {
  var currentTime = new Date().getTime();
  if (currentTime - gameData.lastHuntTime < 60000) {
    var timeLeft = Math.ceil(
      (60000 - (currentTime - gameData.lastHuntTime)) / 1000,
    );
    consoleElement.value += `\nYou need to rest. Try hunting again in ${timeLeft} seconds.\n`;
  } else {
    const monster = monsters[Math.floor(Math.random() * monsters.length)];
    const goldEarned =
      Math.floor(
        Math.random() * (monster.coinDrop[1] - monster.coinDrop[0] + 1),
      ) + monster.coinDrop[0];
    const hpLoss =
      Math.floor(Math.random() * (monster.damage[1] - monster.damage[0] + 1)) +
      monster.damage[0];

    gameData.goldAmount += goldEarned;
    gameData.hp -= hpLoss;
    gameData.lastHuntTime = currentTime;

    let lootDropped = false;
    let lootTable =
      "\nLoot Gained:\n+---------------+--------+\n| Name          | Amount |\n+---------------+--------+\n";

    if (Array.isArray(monster.drops)) {
      monster.drops.forEach((drop) => {
        if (Math.random() * 100 < drop.dropChance) {
          lootDropped = true;
          const quantity =
            Math.floor(
              Math.random() *
                (drop.quantityRange[1] - drop.quantityRange[0] + 1),
            ) + drop.quantityRange[0];

          const existingItemIndex = gameData.userInventory.findIndex(
            (item) => item.item === drop.item,
          );
          if (existingItemIndex !== -1) {
            gameData.userInventory[existingItemIndex].quantity += quantity;
          } else {
            gameData.userInventory.push({
              item: drop.item,
              quantity: quantity,
            });
          }

          lootTable += `| ${drop.item.padEnd(13)} | ${quantity
            .toString()
            .padEnd(6)} |\n`;
        }
      });
    }

    if (lootDropped) {
      lootTable += "+---------------+--------+";
      consoleElement.value += lootTable;
    } else {
      consoleElement.value += "\nNo loot gained this time.\n";
    }

    consoleElement.value += `\nYou encountered a ${monster.name}! After a fierce battle, you earned ${goldEarned} gold and lost ${hpLoss} HP.\n  Total gold: ${gameData.goldAmount}.\n  Current HP: ${gameData.hp}.\n`;

    checkForDeath();
    updateGameData(gameData);
    saveToLocalStorage("userInventory", gameData.userInventory);
  }
}

export function checkForDeath() {
  if (gameData.hp <= 0) {
    consoleElement.value += "\nYou have died. All progress has been reset.\n";
    localStorage.clear();

    // Reset gameData values
    updateGameData({ goldAmount: 100, lastHuntTime: 0, hp: 20, defense: 10 });
    currentDirectory = "";
    userInventory = [];
    saveGameData();

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
}
