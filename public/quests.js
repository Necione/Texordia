import { loadFromLocalStorage, saveToLocalStorage } from "./utilities.js";

function getAllDropItems(itemsData) {
  const itemNames = new Set();
  itemsData.forEach((item) => itemNames.add(item.name));
  return Array.from(itemNames);
}

function generateRandomQuests(itemsData) {
  const itemNames = getAllDropItems(itemsData);
  const quests = [];
  for (let i = 1; i <= 3; i++) {
    const item = itemNames[Math.floor(Math.random() * itemNames.length)];
    const quantity = Math.floor(Math.random() * 10) + 1;
    const reward = Math.floor(Math.random() * 16) + 10;
    quests.push({
      id: i,
      itemRequirement: `${quantity}x ${item}`,
      reward: `${reward} Gold`,
    });
  }
  return quests;
}

function generateAndSaveQuests(itemsData) {
  const quests = generateRandomQuests(itemsData);
  saveToLocalStorage("quests", quests);
  return quests;
}

function refreshQuests(consoleElement, itemsData) {
  const quests = generateAndSaveQuests(itemsData);
  showQuests(consoleElement, quests);
  consoleElement.value += "\nQuests have been refreshed.\n";
}

function showQuests(consoleElement) {
  let quests = loadFromLocalStorage("quests", null);
  if (!quests || !Array.isArray(quests)) {
    consoleElement.value +=
      "\nNo quests available. Use 'quests -refresh' to generate new quests.\n";
    return;
  }

  let questTable =
    "\nAvailable Quests:\n+---------+---------------------+---------+\n| QuestID | Item Requirement    | Rewards |\n+---------+---------------------+---------+\n";

  quests.forEach((quest) => {
    let questId = quest.id.toString().padEnd(7);
    let itemRequirement = quest.itemRequirement.padEnd(19);
    let reward = quest.reward.padEnd(6);

    questTable += `| ${questId} | ${itemRequirement} | ${reward} |\n`;
  });

  questTable += "+---------+---------------------+---------+\n";
  consoleElement.value += questTable;
}

export {
  getAllDropItems,
  generateRandomQuests,
  generateAndSaveQuests,
  refreshQuests,
  showQuests,
};
