import { gameData } from "../gameData.js";
import { consoleElement, saveGameData } from "../utilities.js";
import { blades, hilts, handles } from "../data/items/parts.js";

export function showEquippedWeapon() {
  let weaponTable = "\n\nEquipped Weapon:\n";
  weaponTable += "+---------+-----------------+----------------------+\n";
  weaponTable += "| Part    | Equipped        | Bonuses              |\n";
  weaponTable += "+---------+-----------------+----------------------+\n";

  const weaponParts = {
    Blade: gameData.equippedBlade,
    Handle: gameData.equippedHandle,
    Hilt: gameData.equippedHilt,
  };

  let totalBonuses = { ATK: 0, DEF: 0 }; // Initialize total bonuses

  for (const [part, equipped] of Object.entries(weaponParts)) {
    let partBonuses = "";
    const equippedDisplay = equipped ? equipped : "N/A";

    // Retrieve and format bonuses for each part
    const partData = getPartData(part, equipped);
    if (partData && partData.bonuses) {
      if (partData.bonuses.attackIncrease) {
        partBonuses += `ATK: +${partData.bonuses.attackIncrease} `;
        totalBonuses.ATK += partData.bonuses.attackIncrease; // Add to total bonuses
      }
      if (partData.bonuses.defenseIncrease) {
        partBonuses += `DEF: +${partData.bonuses.defenseIncrease}`;
        totalBonuses.DEF += partData.bonuses.defenseIncrease; // Add to total bonuses
      }
    }

    weaponTable += `| ${part.padEnd(7)} | ${equippedDisplay.padEnd(
      15
    )} | ${partBonuses.padEnd(20)} |\n`;
  }

  weaponTable += "+---------+-----------------+----------------------+\n";
  weaponTable += `Total Bonuses: ATK: +${totalBonuses.ATK}, DEF: +${totalBonuses.DEF}\n`;

  consoleElement.value += weaponTable;
}

// Helper function to get part data
function getPartData(partType, partName) {
  const partsArray =
    partType === "Blade" ? blades : partType === "Handle" ? handles : hilts;
  return partsArray.find((p) => p.name === partName);
}

function addWeaponPart(itemName) {
  const formattedItemName = itemName.toLowerCase();

  // Find the item in the user's inventory, ignoring case
  const itemIndex = gameData.userInventory.findIndex(
    (item) => item.item.toLowerCase() === formattedItemName
  );

  if (itemIndex === -1) {
    consoleElement.value += `\nYou do not have '${itemName}' in your inventory.\n`;
    return;
  }

  // Determine the type of weapon part (Blade, Handle, or Hilt)
  let partType = null;
  let partData = null;
  if (blades.some((blade) => blade.name.toLowerCase() === formattedItemName)) {
    partType = "Blade";
    partData = blades.find(
      (blade) => blade.name.toLowerCase() === formattedItemName
    );
  } else if (
    handles.some((handle) => handle.name.toLowerCase() === formattedItemName)
  ) {
    partType = "Handle";
    partData = handles.find(
      (handle) => handle.name.toLowerCase() === formattedItemName
    );
  } else if (
    hilts.some((hilt) => hilt.name.toLowerCase() === formattedItemName)
  ) {
    partType = "Hilt";
    partData = hilts.find(
      (hilt) => hilt.name.toLowerCase() === formattedItemName
    );
  }

  if (partType === null) {
    consoleElement.value += `\n'${itemName}' is not a valid weapon part.\n`;
    return;
  }

  // Equip the part and apply its bonuses
  applyWeaponPart(partType, partData);

  // Remove the part from inventory
  gameData.userInventory.splice(itemIndex, 1);

  consoleElement.value += `\nEquipped '${itemName}' as your weapon's ${partType}.\n`;

  saveGameData(); // Save changes to game data
}

// Helper function to apply a weapon part
function applyWeaponPart(partType, partData) {
  if (partType === "Blade") {
    gameData.equippedBlade = partData.name;
  } else if (partType === "Handle") {
    gameData.equippedHandle = partData.name;
  } else if (partType === "Hilt") {
    gameData.equippedHilt = partData.name;
  }

  // Apply bonuses
  if (partData.bonuses) {
    if (partData.bonuses.attackIncrease) {
      gameData.attack += partData.bonuses.attackIncrease;
    }
    if (partData.bonuses.defenseIncrease) {
      gameData.defense += partData.bonuses.defenseIncrease;
    }
  }

  saveGameData(); // Save changes to game data
}

function showWeaponCatalog() {
  let catalogTable = "\n\nWeapon Parts Catalog:\n";
  catalogTable += "+------------+--------+-----------------------+\n";
  catalogTable += "| Part       | Cost   | Bonuses               |\n";
  catalogTable += "+------------+--------+-----------------------+\n";

  const displayBonus = (part) => {
    let bonuses = [];
    if (part.bonuses.attackIncrease)
      bonuses.push(`ATK: +${part.bonuses.attackIncrease}`);
    if (part.bonuses.defenseIncrease)
      bonuses.push(`DEF: +${part.bonuses.defenseIncrease}`);
    return bonuses.join(", ");
  };

  const allParts = [...blades, ...hilts, ...handles];
  allParts.forEach((part) => {
    const bonusText = displayBonus(part);
    catalogTable += `| ${part.name.padEnd(10)} | ${part.cost
      .toString()
      .padEnd(6)} | ${bonusText.padEnd(21)} |\n`;
  });

  catalogTable += "+------------+--------+-----------------------+\n";
  consoleElement.value += catalogTable;
}

export function handleWeaponCommands(argument) {
  const args = argument.split(" ");
  const command = args[0].toLowerCase();
  const partType = args.slice(1).join(" ").toLowerCase();

  switch (command) {
    case "-add":
      addWeaponPart(partType);
      break;
    case "-buy":
      buyWeaponPart(partType);
      break;
    case "-catalog":
      showWeaponCatalog();
      break;
    case "-remove":
      removeWeaponPart(partType);
      break;
    default:
      showEquippedWeapon();
  }
}

function removeWeaponPart(partType) {
  let partData;
  if (partType === "blade" && gameData.equippedBlade) {
    partData = blades.find((blade) => blade.name === gameData.equippedBlade);
    gameData.equippedBlade = null;
  } else if (partType === "handle" && gameData.equippedHandle) {
    partData = handles.find(
      (handle) => handle.name === gameData.equippedHandle
    );
    gameData.equippedHandle = null;
  } else if (partType === "hilt" && gameData.equippedHilt) {
    partData = hilts.find((hilt) => hilt.name === gameData.equippedHilt);
    gameData.equippedHilt = null;
  } else {
    consoleElement.value += `\nNothing is equipped in that part.\n`;
    return;
  }

  // Revert bonuses
  if (partData && partData.bonuses) {
    if (partData.bonuses.attackIncrease) {
      gameData.attack -= partData.bonuses.attackIncrease;
    }
    if (partData.bonuses.defenseIncrease) {
      gameData.defense -= partData.bonuses.defenseIncrease;
    }
  }

  // Add the part back to inventory
  const inventoryItem = gameData.userInventory.find(
    (item) => item.item === partData.name
  );
  if (inventoryItem) {
    inventoryItem.quantity += 1;
  } else {
    gameData.userInventory.push({ item: partData.name, quantity: 1 });
  }

  consoleElement.value += `\nRemoved '${partData.name}' from your weapon's ${partType}.\n`;

  saveGameData(); // Save changes to game data
}

function buyWeaponPart(itemName) {
  const allParts = [...blades, ...hilts, ...handles];
  const part = allParts.find((part) => part.name.toLowerCase() === itemName);

  if (!part) {
    consoleElement.value += `\n'${itemName}' is not a valid weapon part.\n`;
    return;
  }

  // Check if the player has enough gold
  if (gameData.goldAmount < part.cost) {
    consoleElement.value += `\nNot enough Gold to purchase '${part.name}'.\n`;
    return;
  }

  // Deduct gold and add part to inventory
  gameData.goldAmount -= part.cost;
  gameData.userInventory.push({ item: part.name, quantity: 1 });

  consoleElement.value += `\nPurchased '${part.name}' for ${part.cost} Gold.\n`;

  saveGameData();
}
