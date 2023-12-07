import { gameData } from "../gameData.js";
import { consoleElement, saveGameData } from "../utilities.js";
import { armors } from "../data/items/armor.js";

export function equipArmor(argument) {
  // Load armor data if not already loaded
  if (armors.length === 0) {
    console.error("Armor data is not loaded.");
    return;
  }

  const lowercasedArgument = argument.toLowerCase();

  // Find the armor in the user's inventory
  const armor = gameData.userInventory.find(
    (item) =>
      item.item.toLowerCase() === lowercasedArgument &&
      armors.some((a) => a.name.toLowerCase() === lowercasedArgument)
  );

  if (!armor) {
    consoleElement.value += `\nItem '${argument}' was not found, are you sure this is typed correctly?\n`;
    return;
  }

  // Find the armor stats from the armor data
  const armorStats = armors.find(
    (a) => a.name.toLowerCase() === lowercasedArgument
  );

  if (!armorStats) {
    consoleElement.value += `\nArmor stats not found for '${argument}'.\n`;
    return;
  }

  // Check if the armor is already equipped
  if (gameData.equippedArmors.includes(armorStats.name)) {
    consoleElement.value += `\n'${armorStats.name}' is already equipped.\n`;
    return;
  }

  // Find a free armor slot
  const freeSlotIndex = gameData.equippedArmors.findIndex(
    (slot) => slot === null
  );
  if (freeSlotIndex === -1) {
    consoleElement.value +=
      "\nNo free armor slots available. Please unequip an armor first.\n";
    return;
  }

  // Equip the armor
  gameData.equippedArmors[freeSlotIndex] = armorStats.name;

  // Add stats from the armor
  gameData.defense += armorStats.defenseIncrease || 0; // Add defense if it exists, otherwise add 0
  gameData.maxHp += armorStats.hpIncrease || 0; // Add HP if it exists, otherwise add 0
  gameData.attack += armorStats.attackIncrease || 0; // Add attack if it exists, otherwise add 0

  consoleElement.value += `\nEquipped '${armorStats.name}'.\n`;

  // Remove armor from inventory
  gameData.userInventory = gameData.userInventory.filter(
    (item) => item.item.toLowerCase() !== lowercasedArgument
  );

  // Save game data
  saveGameData();
  console.log(gameData.maxHp);
}

export function unequipArmor(argument) {
  // Load armor data if not already loaded
  if (armors.length === 0) {
    console.error("Armor data is not loaded.");
    return;
  }

  const lowercasedArgument = argument.toLowerCase();

  // Find if the armor is equipped
  const equippedIndex = gameData.equippedArmors.findIndex(
    (slot) => slot && slot.toLowerCase() === lowercasedArgument
  );
  if (equippedIndex === -1) {
    consoleElement.value += `\n'${argument}' is not currently equipped.\n`;
    return;
  }

  // Get the armor stats from the armor data
  const armorStats = armors.find(
    (a) => a.name.toLowerCase() === lowercasedArgument
  );

  if (!armorStats) {
    consoleElement.value += `\nArmor stats not found for '${argument}'.\n`;
    return;
  }

  // Unequip the armor
  gameData.equippedArmors[equippedIndex] = null;

  // Adjust gameData values based on armor stats
  if (armorStats.defenseIncrease) {
    gameData.defense -= armorStats.defenseIncrease;
  }

  if (armorStats.hpIncrease) {
    gameData.maxHp -= armorStats.hpIncrease;
  }

  if (armorStats.attackIncrease) {
    gameData.attack -= armorStats.attackIncrease;
  }

  // Add the armor back to inventory
  const inventoryItem = gameData.userInventory.find(
    (item) => item.item.toLowerCase() === lowercasedArgument
  );
  if (inventoryItem) {
    inventoryItem.quantity += 1;
  } else {
    gameData.userInventory.push({ item: armorStats.name, quantity: 1 });
  }

  // Save game data
  saveGameData();
}

export function showEquippedArmor() {
  // Load armor data if not already loaded
  if (armors.length === 0) {
    console.error("Armor data is not loaded.");
    return;
  }

  let equippedArmorDisplay = "\n\nCurrently Equipped:\n\n";
  let totalDefenseIncrease = 0;
  let totalHpIncrease = 0;
  let totalAttackIncrease = 0;

  gameData.equippedArmors.forEach((argument, index) => {
    if (argument) {
      const armorStats = armors.find((a) => a.name === argument);
      if (armorStats) {
        // Default to 0 if undefined
        let defenseIncrease = armorStats.defenseIncrease || 0;
        let hpIncrease = armorStats.hpIncrease || 0;
        let attackIncrease = armorStats.attackIncrease || 0;

        equippedArmorDisplay += `Slot ${
          index + 1
        }: ${argument} (Defense +${defenseIncrease}, HP +${hpIncrease}, Attack +${attackIncrease})\n`;
        totalDefenseIncrease += defenseIncrease;
        totalHpIncrease += hpIncrease;
        totalAttackIncrease += attackIncrease;
      } else {
        equippedArmorDisplay += `Slot ${
          index + 1
        }: ${argument} (Stats not found)\n`;
      }
    } else {
      equippedArmorDisplay += `Slot ${index + 1}: X\n`;
    }
  });

  equippedArmorDisplay += `\nTotal Defense Increase: ${totalDefenseIncrease}\n`;
  equippedArmorDisplay += `Total HP Increase: ${totalHpIncrease}\n`;
  equippedArmorDisplay += `Total Attack Increase: ${totalAttackIncrease}\n`;

  consoleElement.value += equippedArmorDisplay;

  saveGameData();
}