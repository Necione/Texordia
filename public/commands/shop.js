import { saveGameData, consoleElement } from "../utilities.js";
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
    (i) => i.name.toLowerCase() === itemName.toLowerCase()
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
    (i) => i.item === item.name
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
    if (item.purchasable && item.name.length > maxLength) {
      maxLength = item.name.length;
    }
  });

  const minNameWidth = 10;
  const nameWidth = Math.max(maxLength, minNameWidth);
  let table = `\n\n${title}\n`;
  table += `+${"-".repeat(nameWidth + 2)}+${"-".repeat(14)}+${"-".repeat(
    15
  )}+\n`;
  table += `| ${"Item Name".padEnd(
    nameWidth
  )} | Buy Price    | Sell Price    |\n`;
  table += `+${"-".repeat(nameWidth + 2)}+${"-".repeat(14)}+${"-".repeat(
    15
  )}+\n`;

  data
    .filter((item) => item.purchasable)
    .forEach((item) => {
      const buyPriceDisplay = item.buyPrice.toString();
      const sellPriceDisplay = item.sellPrice.toString();
      table += `| ${item.name.padEnd(nameWidth)} | ${buyPriceDisplay.padEnd(
        12
      )} | ${sellPriceDisplay.padEnd(13)} |\n`;
    });

  table += `+${"-".repeat(nameWidth + 2)}+${"-".repeat(14)}+${"-".repeat(
    15
  )}+\n`;
  return table;
}

function listShopItems(consoleElement, category) {
  let output = "";

  if (category === "drops" && drops && drops.length > 0) {
    output += createTable(drops, "Drops");
  } else if (
    category === "consumable" &&
    consumables &&
    consumables.length > 0
  ) {
    output += createTable(consumables, "Consumable");
  } else if (category === "equipment" && armors && armors.length > 0) {
    output += createTable(armors, "Equipment");
  } else {
    output += `\nNo ${category} available.\n`;
  }

  consoleElement.value += output;
}

export function sellAllItems(argument) {
  let totalSellPrice = 0;
  argument = argument ? argument.toLowerCase() : null;

  // Check if there are items to sell
  const itemsToSell = gameData.userInventory.filter((itemObj) => {
    if (!argument || itemObj.item.toLowerCase() === argument) {
      return [...drops, ...consumables, ...armors].some(
        (item) => item.name.toLowerCase() === itemObj.item.toLowerCase()
      );
    }
    return false;
  });

  // If no items to sell, display a message and exit the function
  if (itemsToSell.length === 0) {
    consoleElement.value += "\nYou don't have anything to sell.\n";
    return;
  }

  // Proceed with selling items
  gameData.userInventory = gameData.userInventory.filter((itemObj) => {
    if (!argument || itemObj.item.toLowerCase() === argument) {
      const itemData = [...drops, ...consumables, ...armors].find(
        (item) => item.name.toLowerCase() === itemObj.item.toLowerCase()
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
    argument ? argument : "all items"
  } for ${totalSellPrice} Gold.\n`;
  saveGameData();
}

export function handleShopItems(argument, input) {
  const args = input.split(/\s+/); // Split the input by spaces

  // Check for both 'item' and 'items' commands
  if (args[0].startsWith("item") && args[1] === "-list") {
    let category = args[2];

    // Map shorthand to full category name
    const categoryMap = {
      e: "equipment",
      d: "drops",
      c: "consumable",
    };

    // Replace shorthand with full category name if applicable
    category = categoryMap[category] || category;

    if (["drops", "equipment", "consumable"].includes(category)) {
      listShopItems(consoleElement, category);
    } else {
      consoleElement.value += `\nInvalid category. Use: 'item -list [drops|equipment|consumable]'\n`;
    }
  } else if (args[0].startsWith("item") && args[1] === "-buy") {
    const itemName = extractItemNameFromInput(input);
    if (itemName) {
      attemptToPurchaseItem(itemName, gameData, consoleElement);
    } else {
      consoleElement.value += '\nInvalid format. Use: item -buy "Item Name"\n';
    }
  } else {
    consoleElement.value += `\nInvalid command structure. Use: 'item -[list|buy] (argument)'\n`;
  }
}

export function showItemInfo(itemName) {
  const lowercasedItemName = itemName.toLowerCase();
  const item =
    armors.find((item) => item.name.toLowerCase() === lowercasedItemName) ||
    consumables.find(
      (item) => item.name.toLowerCase() === lowercasedItemName
    ) ||
    drops.find((item) => item.name.toLowerCase() === lowercasedItemName);

  if (!item) {
    consoleElement.value += `\nItem not found, are you sure it's spelt correctly?\n`;
    return;
  }

  let infoDisplay = `\n\nInfo for '${item.name}':\n`;
  if (item.defenseIncrease)
    infoDisplay += `- Defense Increase: ${item.defenseIncrease}\n`;
  if (item.hpIncrease) infoDisplay += `- HP Increase: ${item.hpIncrease}\n`;
  if (item.attackIncrease)
    infoDisplay += `- Attack Increase: ${item.attackIncrease}\n`;
  if (item.buyPrice) infoDisplay += `- Buy Price: ${item.buyPrice}\n`;
  if (item.sellPrice) infoDisplay += `- Sell Price: ${item.sellPrice}\n`;

  // Check if the item is a potion and display its healing range
  if (item.itemType === "potion" && item.healRange) {
    infoDisplay += `- Heals: ${item.healRange[0]} to ${item.healRange[1]} HP\n`;
  }

  consoleElement.value += infoDisplay;
}
