import { gameData } from "../gameData.js";
import { consoleElement, saveGameData } from "../utilities.js";
import { consumables } from "../data/items/consumable.js";

function usePotion(potionName) {
  const lowercasedPotionName = potionName.toLowerCase();
  const potionData = consumables.find(
    (item) =>
      item.name.toLowerCase() === lowercasedPotionName &&
      item.itemType === "potion"
  );

  if (!potionData) {
    consoleElement.value += `\nPotion data not found for ${potionName}.\n`;
    return;
  }

  const potionIndex = gameData.userInventory.findIndex(
    (itemObj) => itemObj.item.toLowerCase() === lowercasedPotionName
  );

  if (potionIndex === -1) {
    consoleElement.value += `\nYou don't have any ${potionName} in your inventory.\n`;
    return;
  }

  const restoredHP =
    Math.floor(
      Math.random() * (potionData.healRange[1] - potionData.healRange[0] + 1)
    ) + potionData.healRange[0];
  gameData.userInventory.splice(potionIndex, 1);
  gameData.hp = Math.min(gameData.hp + restoredHP, gameData.maxHp);

  consoleElement.value += `\nYou used a ${potionData.name} and restored ${restoredHP} HP. Current HP: ${gameData.hp}.\n`;

  saveGameData();
}

export function handleUseItem(argument) {
  if (typeof argument !== "string") {
    consoleElement.value += "\nInvalid item name.\n";
    return;
  }

  const itemName = argument.toLowerCase();
  const consumableItem = consumables.find(
    (item) => item.name.toLowerCase() === itemName
  );

  if (
    consumableItem &&
    consumableItem.itemType === "potion" &&
    gameData.userInventory.some((item) => item.item.toLowerCase() === itemName)
  ) {
    usePotion(itemName);
  } else {
    consoleElement.value +=
      "\nYou don't have that item in your inventory, or it's not a potion.\n";
  }
}