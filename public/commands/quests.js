import {
  loadFromLocalStorage,
  saveToLocalStorage,
  consoleElement,
  saveGameData,
} from "../utilities.js";
import { gameData } from "../gameData.js";
import { drops } from "../data/items/drops.js";

export function handleQuest(argument, input) {
  if (gameData.currentDirectory !== "Guild") {
    consoleElement.value +=
      "\nYou must be in the Guild directory for quests.\n";
    return;
  }
  handleQuestsCommands(argument, input);
}

export function generateRandomQuests() {
  const itemNames = drops.map((drop) => drop.name);
  const quests = [];
  for (let i = 1; i <= 5; i++) {
    const item = itemNames[Math.floor(Math.random() * itemNames.length)];
    const quantity = Math.floor(Math.random() * 10) + 1;
    const reward = Math.floor(Math.random() * 26) + 15;
    quests.push({
      id: i,
      itemRequirement: `${quantity}x ${item}`,
      reward: `${reward} Gold`,
    });
  }
  return quests;
}

export function generateAndSaveQuests() {
  const quests = generateRandomQuests();
  saveToLocalStorage("quests", quests);
  return quests;
}

export function submitQuest(questId) {
  let quests = loadFromLocalStorage("quests", []);
  const quest = quests.find((q) => q.id === parseInt(questId));

  if (!quest) {
    consoleElement.value += `\nNo quest found with ID ${questId}.\n`;
    return;
  }

  const [quantityRequired, itemName] = quest.itemRequirement
    .split("x ")
    .map((el) => el.trim());
  const inventoryItem = gameData.userInventory.find(
    (item) => item.item === itemName
  );

  if (!inventoryItem || inventoryItem.quantity < parseInt(quantityRequired)) {
    consoleElement.value += `\nYou do not have enough of the required item to complete this quest.\n`;
    return;
  }

  inventoryItem.quantity -= parseInt(quantityRequired);

  if (inventoryItem.quantity <= 0) {
    gameData.userInventory = gameData.userInventory.filter(
      (item) => item.quantity > 0
    );
  }

  const rewardAmount = parseInt(quest.reward.split(" ")[0]);
  gameData.goldAmount += rewardAmount;

  quests = quests.filter((q) => q.id !== parseInt(questId));
  saveToLocalStorage("quests", quests);

  saveGameData();

  consoleElement.value += `\nQuest ${questId} completed! You earned ${rewardAmount} Gold.\n`;
}

export function handleQuestsCommands(argument, input) {
  if (argument.startsWith("-submit")) {
    const questId = input.split(" ")[2];
    submitQuest(questId);
  } else if (argument === "-refresh") {
    refreshQuests();
  } else if (argument === "-list") {
    showQuests();
  } else {
    consoleElement.value += `\nInvalid command structure. Use: 'quests -[list|refresh|submit] (argument)'\n`;
  }
}

export function refreshQuests() {
  if (gameData.goldAmount >= 5) {
    gameData.goldAmount -= 5;
    const quests = generateAndSaveQuests();
    showQuests();
    consoleElement.value += "\nQuests have been refreshed. 5 Gold deducted.\n";
    saveGameData();
  } else {
    consoleElement.value +=
      "\nNot enough Gold to refresh quests. Need 5 Gold.\n";
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
