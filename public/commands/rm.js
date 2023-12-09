import { saveGameData, consoleElement } from "../utilities.js";
import { gameData } from "../gameData.js";

export function removeItemFromInventory(argument) {
    // Convert item name to lowercase for case-insensitive comparison
    const formattedItemName = argument.toLowerCase();

    // Find the item in the user's inventory
    const itemIndex = gameData.userInventory.findIndex(
        (item) => item.item.toLowerCase() === formattedItemName
    );

    if (itemIndex === -1) {
        consoleElement.value += `\nItem '${argument}' not found in your inventory.\n`;
        return;
    }

    // Check if the player has enough gold
    const removalCost = 3;
    if (gameData.goldAmount < removalCost) {
        consoleElement.value += `\nNot enough Gold to remove '${argument}'. Need ${removalCost} Gold.\n`;
        return;
    }

    // Remove the item and deduct the gold
    gameData.userInventory.splice(itemIndex, 1);
    gameData.goldAmount -= removalCost;

    consoleElement.value += `\nRemoved '${argument}' from your inventory for ${removalCost} Gold.\n`;

    saveGameData();
}
