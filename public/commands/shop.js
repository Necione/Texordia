import {
    saveGameData,
    consoleElement,
    itemsData,
    armorsData,
  } from "../utilities.js";
  import { gameData } from "../gameData.js";
  
  export const shopItems = {
    items: [
      { name: "Potion", price: 50 },
      { name: "Shield", price: 50 },
    ],
  };
  
  function extractItemNameFromInput(input) {
    var match = input.match(/-buy\s+(.+)/);
    return match ? match[1] : null;
  }
  
  export function listShopItems(consoleElement) {
    const allItems = [...shopItems.items, ...(armorsData || [])];

    // Find the maximum length of item names
    const maxItemNameLength = allItems.reduce((maxLength, item) => Math.max(maxLength, item.name.length), 0);

    // Header of the table
    consoleElement.value += "\nItems available in the Shop:\n";
    consoleElement.value += `+${"-".repeat(maxItemNameLength + 2)}+-------+\n`;
    consoleElement.value += `| ${"Item".padEnd(maxItemNameLength)} | Price |\n`;
    consoleElement.value += `+${"-".repeat(maxItemNameLength + 2)}+-------+\n`;

    // List all items
    allItems.forEach((item) => {
        let itemString = `| ${item.name.padEnd(maxItemNameLength)} | ${item.price}`;
        itemString += " ".repeat(6 - item.price.toString().length);
        itemString += "|\n";
        consoleElement.value += itemString;
    });

    // Footer of the table
    consoleElement.value += `+${"-".repeat(maxItemNameLength + 2)}+-------+\n`;
}
  
  export function attemptToPurchaseItem(itemName, gameData, consoleElement, armorsData) {
    let item = shopItems.items.find(
      (item) => item.name.toLowerCase() === itemName.toLowerCase(),
    );

    // If not found in regular items, search in armors
    if (!item && armorsData) {
        item = armorsData.find(
          (armor) => armor.name.toLowerCase() === itemName.toLowerCase(),
        );
    }

    if (item) {
        if (gameData.goldAmount >= item.price) {
            gameData.goldAmount -= item.price;

            const existingItemIndex = gameData.userInventory.findIndex(
              (invItem) => invItem.item === item.name,
            );
            if (existingItemIndex !== -1) {
                gameData.userInventory[existingItemIndex].quantity += 1;
            } else {
                gameData.userInventory.push({ item: item.name, quantity: 1 });
            }

            consoleElement.value += `\nPurchased ${item.name} for ${item.price} coins. Remaining gold: ${gameData.goldAmount}.\n`;

            saveGameData();
        } else {
            consoleElement.value += "\nNot enough gold to purchase this item.\n";
        }
    } else {
        consoleElement.value += "\nItem not found in the shop.\n";
    }
}

  
  export function sellAllItems(specificItem, gameData, itemsData, consoleElement) {
    let totalSellPrice = 0;
    specificItem = specificItem ? specificItem.toLowerCase() : null;

    gameData.userInventory = gameData.userInventory.filter((itemObj) => {
      if (!specificItem || itemObj.item.toLowerCase() === specificItem) {
        const itemData = itemsData.find(
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
    sellAllItems(argument, gameData, itemsData, consoleElement);
}
  
  export function handleShopItems(argument, input) {
    if (gameData.currentDirectory !== "Shop") {
      consoleElement.value +=
        "\nYou must be in the Shop directory to interact with items.\n";
      return;
    }
    if (argument.startsWith("-buy")) {
      const itemName = extractItemNameFromInput(input);
      if (itemName) {
        attemptToPurchaseItem(itemName, gameData, consoleElement, armorsData);
      } else {
        consoleElement.value += '\nInvalid format. Use: items -buy "Item Name"\n';
      }
    } else if (argument === "-list") {
      listShopItems(consoleElement);
    } else {
      consoleElement.value += `\nInvalid command structure. Ise: 'items -[list|buy] (argument)'\n`;
    }
  }
  