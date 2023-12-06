import {
  loadFromLocalStorage,
  saveToLocalStorage,
  consoleElement,
  saveGameData,
  dropsData,
} from "../utilities.js";
import { gameData } from "../gameData.js";

export function getAllDropItems(dropsData) {
  const itemNames = new Set();
  dropsData.forEach((item) => itemNames.add(item.name));
  return Array.from(itemNames);
}

export function generateRandomQuests(dropsData) {
  const itemNames = getAllDropItems(dropsData);
  const quests = [];
  for (let i = 1; i <= 3; i++) {
    const item = itemNames[Math.floor(Math.random() * itemNames.length)];
    const quantity = Math.floor(Math.random() * 10) + 1;
    const reward = Math.floor(Math.random() * 21) + 10;
    quests.push({
      id: i,
      itemRequirement: `${quantity}x ${item}`,
      reward: `${reward} Gold`,
    });
  }
  return quests;
}

export function generateAndSaveQuests(dropsData) {
  const quests = generateRandomQuests(dropsData);
  saveToLocalStorage("quests", quests);
  return quests;
}

export function submitQuest(questId) {
  // Load the quests and find the one with the matching ID
  let quests = loadFromLocalStorage("quests", []);
  const quest = quests.find((q) => q.id === parseInt(questId));

  if (!quest) {
    consoleElement.value += `\nNo quest found with ID ${questId}.\n`;
    return;
  }

  // Parse the item requirement to get the name and quantity
  const [quantityRequired, itemName] = quest.itemRequirement
    .split("x ")
    .map((el) => el.trim());
  const inventoryItem = gameData.userInventory.find(
    (item) => item.item === itemName,
  );

  if (!inventoryItem || inventoryItem.quantity < parseInt(quantityRequired)) {
    consoleElement.value += `\nYou do not have enough of the required item to complete this quest.\n`;
    return;
  }

  // Remove the required items from the player's inventory
  inventoryItem.quantity -= parseInt(quantityRequired);

  // If the quantity of the item reaches 0, remove the item from the inventory
  if (inventoryItem.quantity <= 0) {
    gameData.userInventory = gameData.userInventory.filter(
      (item) => item.quantity > 0,
    );
  }

  // Parse the reward to add the gold to the player's total
  const rewardAmount = parseInt(quest.reward.split(" ")[0]);
  gameData.goldAmount += rewardAmount;

  // Remove the quest from the list of available quests
  quests = quests.filter((q) => q.id !== parseInt(questId));
  saveToLocalStorage("quests", quests);

  // Save the game data
  saveGameData();

  consoleElement.value += `\nQuest ${questId} completed! You earned ${rewardAmount} Gold.\n`;
}

export function handleQuestsCommands(argument, input) {
  if (argument.startsWith("-submit")) {
    const questId = input.split(" ")[2];
    submitQuest(questId);
  } else if (argument === "-refresh") {
    refreshQuests(dropsData);
  } else if (argument === "-list") {
    showQuests();
  } else {
    consoleElement.value += `\nInvalid command structure. Use: 'quests -[list|refresh|submit] (argument)'\n`;
  }
}

export function refreshQuests(callback) {
  // Check if dropsData is loaded
  if (dropsData.length > 0) {
    const quests = generateAndSaveQuests(dropsData);
    showQuests();
    consoleElement.value += "\nQuests have been refreshed.\n";
  } else {
    // If dropsData is not loaded, set up a callback to call refreshQuests later
    callback();
  }
}

export function showQuests() {
  let quests = loadFromLocalStorage("quests", null);
  if (!quests || !Array.isArray(quests)) {
    consoleElement.value +=
      "\nNo quests available. Use 'quests -refresh' to generate new quests.\n";
    return;
  }

  let questTable =
    "\n\nAvailable Quests:\n+---------+---------------------+---------+\n| QuestID | Item Requirement    | Rewards |\n+---------+---------------------+---------+\n";

  quests.forEach((quest) => {
    let questId = quest.id.toString().padEnd(7);
    let itemRequirement = quest.itemRequirement.padEnd(19);
    let reward = quest.reward.padEnd(6);

    questTable += `| ${questId} | ${itemRequirement} | ${reward} |\n`;
  });

  questTable += "+---------+---------------------+---------+\n";
  consoleElement.value += questTable;
}
