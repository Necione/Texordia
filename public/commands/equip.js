import { gameData } from "../gameData.js";
import { consoleElement, armorData, saveGameData } from "../utilities.js";

export function equipArmor(argument) {
    // Load armor data if not already loaded
    if (armorData.length === 0) {
        console.error("Armor data is not loaded.");
        return;
    }

    const lowercasedArgument = argument.toLowerCase();

    // Find the armor in the user's inventory
    const armor = gameData.userInventory.find(item => item.item.toLowerCase() === lowercasedArgument && armorData.some(a => a.name.toLowerCase() === lowercasedArgument));

    if (!armor) {
        consoleElement.value += `\nItem '${argument}' was not found, are you sure this is typed correctly?\n`;
        return;
    }

    // Get the armor stats from the armor data
    const armorStats = armorData.find(a => a.name.toLowerCase() === lowercasedArgument);

    if (!armorStats) {
        consoleElement.value += `\nArmor stats not found for '${argument}'.\n`;
        return;
    }

    // Find a free armor slot
    const freeSlotIndex = gameData.equippedArmors.findIndex(slot => slot === null);
    if (freeSlotIndex === -1) {
        consoleElement.value += "\nNo free armor slots available. Please unequip an armor first.\n";
        return;
    }

    gameData.equippedArmors[freeSlotIndex] = armorStats.name;
    gameData.defense += armorStats.defenseIncrease;
  
    if (armorStats.hpIncrease) {
      gameData.maxHp += armorStats.hpIncrease;
    }

    consoleElement.value += `\nEquipped '${armorStats.name}'.\n`;

    // Remove armor from inventory
    gameData.userInventory = gameData.userInventory.filter(item => item.item.toLowerCase() !== lowercasedArgument);

    // Save game data
    saveGameData();
    console.log(gameData.maxHp)
}

export function unequipArmor(argument) {
    // Load armor data if not already loaded
    if (armorData.length === 0) {
        console.error("Armor data is not loaded.");
        return;
    }

    const lowercasedArgument = argument.toLowerCase();

    // Find if the armor is equipped
    const equippedIndex = gameData.equippedArmors.findIndex(slot => slot && slot.toLowerCase() === lowercasedArgument);
    if (equippedIndex === -1) {
        consoleElement.value += `\n'${argument}' is not currently equipped.\n`;
        return;
    }

    // Get the armor stats from the armor data
    const armorStats = armorData.find(a => a.name.toLowerCase() === lowercasedArgument);

    if (!armorStats) {
        consoleElement.value += `\nArmor stats not found for '${argument}'.\n`;
        return;
    }

    // Unequip the armor
    gameData.equippedArmors[equippedIndex] = null;
    gameData.defense -= armorStats.defenseIncrease;
  
    if (armorStats.hpIncrease) {
        gameData.maxHp -= armorStats.hpIncrease;
    }

    // Add the armor back to inventory
    const inventoryItem = gameData.userInventory.find(item => item.item.toLowerCase() === lowercasedArgument);
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
    if (armorData.length === 0) {
        console.error("Armor data is not loaded.");
        return;
    }

    let equippedArmorDisplay = "\n\nEquipped Armor:\n\n";
    let totalDefenseIncrease = 0;

    gameData.equippedArmors.forEach((argument, index) => {
        if (argument) {
            const armorStats = armorData.find(a => a.name === argument);
            if (armorStats) {
                equippedArmorDisplay += `Slot ${index + 1}: ${argument} (Defense +${armorStats.defenseIncrease})\n`;
                totalDefenseIncrease += armorStats.defenseIncrease;
            } else {
                equippedArmorDisplay += `Slot ${index + 1}: ${argument} (Stats not found)\n`;
            }
        } else {
            equippedArmorDisplay += `Slot ${index + 1}: X\n`;
        }
    });

    equippedArmorDisplay += `\nTotal Defense Increase: ${totalDefenseIncrease}\n`;

    consoleElement.value += equippedArmorDisplay;

    // Save game data
    saveGameData();
}