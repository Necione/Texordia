import { gameData } from "../gameData.js";
import { consoleElement, saveGameData } from "../utilities.js";
import { armors } from "../data/items/armor.js";

export function equipArmor(argument) {
  const lowercasedArgument = argument.toLowerCase();

  const armor = gameData.userInventory.find(
    (item) =>
      item.item.toLowerCase() === lowercasedArgument &&
      armors.some((a) => a.name.toLowerCase() === lowercasedArgument)
  );

  if (!armor) {
    consoleElement.value += `\nThis item could not be equipped.\n`;
    return;
  }

  const armorStats = armors.find(
    (a) => a.name.toLowerCase() === lowercasedArgument
  );

  if (!armorStats) {
    consoleElement.value += `\nArmor stats not found for '${argument}'.\n`;
    return;
  }

  if (gameData.equippedArmors.includes(armorStats.name)) {
    consoleElement.value += `\n'${armorStats.name}' is already equipped.\n`;
    return;
  }

  const freeSlotIndex = gameData.equippedArmors.findIndex(
    (slot) => slot === null
  );
  if (freeSlotIndex === -1) {
    consoleElement.value +=
      "\nNo free armor slots available. Please unequip an armor first.\n";
    return;
  }

  gameData.equippedArmors[freeSlotIndex] = armorStats.name;

  // Applying bonuses
  armorStats.bonuses.forEach((bonus) => {
    gameData[bonus.type] += bonus.value;
  });

  consoleElement.value += `\nEquipped '${armorStats.name}'.\n`;

  gameData.userInventory = gameData.userInventory.filter(
    (item) => item.item.toLowerCase() !== lowercasedArgument
  );

  saveGameData();
}

export function unequipArmor(argument) {
  const lowercasedArgument = argument.toLowerCase();

  const equippedIndex = gameData.equippedArmors.findIndex(
    (slot) => slot && slot.toLowerCase() === lowercasedArgument
  );
  if (equippedIndex === -1) {
    consoleElement.value += `\n'${argument}' is not currently equipped.\n`;
    return;
  }

  const armorStats = armors.find(
    (a) => a.name.toLowerCase() === lowercasedArgument
  );

  if (!armorStats) {
    consoleElement.value += `\nArmor stats not found for '${argument}'.\n`;
    return;
  }

  gameData.equippedArmors[equippedIndex] = null;

  // Reverting bonuses
  armorStats.bonuses.forEach((bonus) => {
    gameData[bonus.type] -= bonus.value;
  });

  const inventoryItem = gameData.userInventory.find(
    (item) => item.item.toLowerCase() === lowercasedArgument
  );
  if (inventoryItem) {
    inventoryItem.quantity += 1;
  } else {
    gameData.userInventory.push({ item: armorStats.name, quantity: 1 });
  }

  // Adding confirmation message
  consoleElement.value += `\n'${armorStats.name}' has been unequipped.\n`;

  saveGameData();
}

export function showEquippedArmor() {
  let equippedArmorDisplay = "\n\nCurrently Equipped:\n\n";
  const bonusLabels = {
    maxHp: "Max HP",
    critValue: "Crit Value",
    critChance: "Crit Chance",
    defense: "DEF",
    attack: "ATK"
  };

  gameData.equippedArmors.forEach((armorName, index) => {
    let slotDisplay = `Slot ${index + 1}: `;
    if (armorName) {
      const armorStats = armors.find((a) => a.name === armorName);
      if (armorStats) {
        let bonusesText = armorStats.bonuses.map((bonus) => {
          // Determine how to display the bonus value
          let bonusText;
          if (bonus.type === "critChance" || bonus.type === "critValue") {
            bonusText = `${(bonus.value * 100).toFixed(2)}%`;
          } else {
            // Append + or - sign for non-percentage values
            bonusText = (bonus.value >= 0 ? `+${bonus.value}` : `${bonus.value}`);
          }
          let bonusLabel = bonusLabels[bonus.type] || bonus.type; // Map bonus type to label, or use type as-is
          return `${bonusLabel}: ${bonusText}`;
        }).join(", ");
        slotDisplay += `${armorName} (${bonusesText})`;
      } else {
        slotDisplay += `${armorName} (Stats not found)`;
      }
    } else {
      slotDisplay += "X";
    }
    equippedArmorDisplay += slotDisplay + "\n";
  });

  consoleElement.value += equippedArmorDisplay;
}



