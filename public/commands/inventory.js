import { gameData } from "../gameData.js";
import { consoleElement } from "../utilities.js";

export function showInventory() {
    let inventoryDisplay = "";
    if (!gameData.userInventory || gameData.userInventory.length === 0) {
      inventoryDisplay = "No items";
    } else {
      inventoryDisplay =
        "\nInventory:\n+---------------+--------+\n| Item          | Amount |\n+---------------+--------+\n";

      gameData.userInventory.forEach((itemObj) => {
        inventoryDisplay += `| ${itemObj.item.padEnd(13)} | ${itemObj.quantity
          .toString()
          .padEnd(6)} |\n`;
      });

      inventoryDisplay += "+---------------+--------+";
    }
    consoleElement.value += `\n${inventoryDisplay}\nGold: ${gameData.goldAmount}\n`;
  }