import { consoleElement } from "../utilities.js";
import { gameData } from "../gameData.js";

export function showEquippedWeapon() {
    let weaponTable = "\n\nEquipped Weapon:\n";
    weaponTable += "+---------+-----------------+\n";
    weaponTable += "| Part    | Equipped        |\n";
    weaponTable += "+---------+-----------------+\n";
  
    const weaponParts = {
      Blade: gameData.equippedBlade,
      Handle: gameData.equippedHandle,
      Hilt: gameData.equippedHilt,
    };
  
    for (const [part, equipped] of Object.entries(weaponParts)) {
      const equippedDisplay = equipped ? equipped : 'N/A';
      weaponTable += `| ${part.padEnd(7)} | ${equippedDisplay.padEnd(15)} |\n`;
    }
  
    weaponTable += "+---------+-----------------+\n";
    consoleElement.value += weaponTable;
  }
  