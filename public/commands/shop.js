import {
  saveGameData,
  consoleElement,
} from "../utilities.js";
import { gameData } from "../gameData.js";
import { drops } from "../data/items/drops.js";
import { armors } from "../data/items/armor.js";
import { consumables } from "../data/items/consumable.js";

function extractItemNameFromInput(input) {
  var match = input.match(/-buy\s+(.+)/);
  return match ? match[1] : null;
}

function attemptToPurchaseItem(itemName, gameData, consoleElement) {
  const allItems = [...drops, ...consumables, ...armors];

  // Find the item data
  const item = allItems.find(
    (i) => i.name.toLowerCase() === itemName.toLowerCase(),
  );

  // Check if item is purchasable and available
  if (!item || !item.purchasable) {
    consoleElement.value += `\nItem '${itemName}' is not available for purchase.\n`;
    return;
  }

  // Check if the player has enough gold
  if (gameData.goldAmount < item.buyPrice) {
    consoleElement.value += `\nNot enough Gold to purchase '${itemName}'.\n`;
    return;
  }

  // Deduct the gold and add the item to inventory with its original case
  gameData.goldAmount -= item.buyPrice;
  const inventoryItem = gameData.userInventory.find(
    (i) => i.item === item.name,
  );
  if (inventoryItem) {
    inventoryItem.quantity += 1;
  } else {
    gameData.userInventory.push({ item: item.name, quantity: 1 });
  }

  // Save game data and update the console
  saveGameData();
  consoleElement.value += `\nPurchased '${item.name}' for ${item.buyPrice} Gold.\n`;
}

function createTable(data, title) {
  let maxLength = 0;
  data.forEach((item) => {
    if (item.name.length > maxLength) {
      maxLength = item.name.length;
    }
  });

  const minNameWidth = 10;
  const nameWidth = Math.max(maxLength, minNameWidth);
  let table = `\n\n${title}\n`;
  table += `+${"-".repeat(nameWidth + 2)}+${"-".repeat(14)}+${"-".repeat(
    15,
  )}+\n`;
  table += `| ${"Item Name".padEnd(
    nameWidth,
  )} | Buy Price    | Sell Price    |\n`;
  table += `+${"-".repeat(nameWidth + 2)}+${"-".repeat(14)}+${"-".repeat(
    15,
  )}+\n`;

  data.forEach((item) => {
    const buyPriceDisplay = item.purchasable ? item.buyPrice.toString() : "X";
    const sellPriceDisplay = item.sellPrice.toString();
    table += `| ${item.name.padEnd(nameWidth)} | ${buyPriceDisplay.padEnd(
      12,
    )} | ${sellPriceDisplay.padEnd(13)} |\n`;
  });

  table += `+${"-".repeat(nameWidth + 2)}+${"-".repeat(14)}+${"-".repeat(
    15,
  )}+\n`;
  return table;
}

function listShopItems(consoleElement, category) {
  let output = "";

  if (category === "drops" && drops && drops.length > 0) {
    output += createTable(drops, "Drops");
  } else if (category === "consumables" && consumables && consumables.length > 0) {
    output += createTable(consumables, "Consumables");
  } else if (category === "armors" && armors && armors.length > 0) {
    output += createTable(armors, "Armor");
  } else {
    output += `\nNo ${category} available.\n`;
  }

  consoleElement.value += output;
}


export function sellAllItems(specificItem) {
  let totalSellPrice = 0;
  specificItem = specificItem ? specificItem.toLowerCase() : null;

  gameData.userInventory = gameData.userInventory.filter((itemObj) => {
    if (!specificItem || itemObj.item.toLowerCase() === specificItem) {
      const itemData = [...drops, ...consumables, ...armors].find(
        (item) => item.name.toLowerCase() === itemObj.item.toLowerCase(),
      );
      if (itemData) {
        totalSellPrice += itemData.sellPrice * itemObj.quantity;
        return false;
      }
    }
    return true;
  });

  gameData.goldAmount += totalSellPrice;
  consoleElement.value += `\nSold ${
    specificItem ? specificItem : "all items"
  } for ${totalSellPrice} gold.\n`;
  saveGameData();
}

export function handleSellAll(argument) {
  if (gameData.currentDirectory !== "Shop") {
    consoleElement.value +=
      "\nYou must be in the Shop directory to sell items.\n";
    return;
  }
  sellAllItems(argument);
}

export function handleShopItems(argument, input) {
  if (gameData.currentDirectory !== "Shop") {
    consoleElement.value += "\nYou must be in the Shop directory to interact with items.\n";
    return;
  }

  const args = input.split(/\s+/); // Split the input by spaces

  if (args[0] === "items" && args[1] === "-list") {
    const category = args[2] || "all";
    if (["drops", "armors", "consumables", "all"].includes(category)) {
      if (category === "all") {
        listShopItems(consoleElement, "drops");
        listShopItems(consoleElement, "consumables");
        listShopItems(consoleElement, "armors");
      } else {
        listShopItems(consoleElement, category);
      }
    } else {
      consoleElement.value += `\nInvalid category. Use: 'items -list [drops|armors|consumables|all]'\n`;
    }
  } else if (args[0] === "items" && args[1] === "-buy") {
    const itemName = extractItemNameFromInput(input);
    if (itemName) {
      attemptToPurchaseItem(itemName, gameData, consoleElement);
    } else {
      consoleElement.value += '\nInvalid format. Use: items -buy "Item Name"\n';
    }
  } else {
    consoleElement.value += `\nInvalid command structure. Use: 'items -[list|buy] (argument)'\n`;
  }
}
