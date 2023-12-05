import { gameData, updateGameData } from "../gameData.js";
import { consoleElement, armorsData} from "../utilities.js";

export function equipArmor(argument) {
    argument = argument.toLowerCase();
    const armor = armorsData.find(a => a.name.toLowerCase() === argument);
    if (!armor) {
      consoleElement.value += `\nItem is not an armor or does not exist.\n`;
      return;
    }

        // Check if the player has the armor in their inventory
        const inventoryIndex = gameData.userInventory.findIndex(item => item.item.toLowerCase() === argument);
        if (inventoryIndex === -1) {
            consoleElement.value += `\nYou do not have ${armor.name} in your inventory.\n`;
            return;
        }
  
    // Check if the armor is already equipped
    if (gameData.equippedArmors.includes(armor)) {
      consoleElement.value += `\nYou have already equipped ${armor.name}.\n`;
      return;
    }
  
    // Find a free slot to equip the armor
    const freeSlotIndex = gameData.equippedArmors.indexOf(null);
    if (freeSlotIndex === -1) {
      consoleElement.value += "\nNo free slots available to equip armor.\n";
      return;
    }
  
    gameData.equippedArmors[freeSlotIndex] = armor;
    consoleElement.value += `\nEquipped ${armor.name}. Defense increased by ${armor.defense}.\n`;
    gameData.defense += armor.defense;
    updateGameData(gameData);
  }
  
  export function unequipArmor(argument) {
    argument = argument.toLowerCase();
    const armorIndex = gameData.equippedArmors.findIndex(a => a && a.name.toLowerCase() === argument);
    if (armorIndex === -1) {
      consoleElement.value += `\nItem is not equipped.\n`;
      return;
    }
  
    const armor = gameData.equippedArmors[armorIndex];
    gameData.equippedArmors[armorIndex] = null;
    consoleElement.value += `\nUnequipped ${armor.name}. Defense decreased by ${armor.defense}.\n`;
    gameData.defense -= armor.defense;
    updateGameData(gameData);
  }