import { loadFromLocalStorage } from "./utilities.js";

function getAllDropItems() {
  const dropItems = new Set();
  monsters.forEach((monster) => {
    if (Array.isArray(monster.drops)) {
      monster.drops.forEach((drop) => dropItems.add(drop.item));
    }
  });
  return Array.from(dropItems);
}

function generateRandomQuests() {
  const dropItems = getAllDropItems();
  const quests = [];
  for (let i = 1; i <= 3; i++) {
    const item = dropItems[Math.floor(Math.random() * dropItems.length)];
    const quantity = Math.floor(Math.random() * 10) + 1;
    const reward = Math.floor(Math.random() * 16) + 5;
    quests.push({
      id: i,
      itemRequirement: `${quantity}x ${item}`,
      reward: `${reward} Gold`,
    });
  }
  return quests;
}

function generateAndSaveQuests() {
  const quests = generateRandomQuests();
  saveToLocalStorage("quests", quests);
  return quests;
}

function refreshQuests(consoleElement) {
  if (goldAmount >= 20) {
    goldAmount -= 20;
    generateAndSaveQuests();
    showQuests(consoleElement);
    consoleElement.value += "\nQuests refreshed. 20 gold deducted.\n";
    saveGameData();
  } else {
    consoleElement.value += "\nNot enough gold to refresh quests.\n";
  }
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

  questTable += "+---------+---------------------+---------+";
  consoleElement.value += questTable;
}

export {
  getAllDropItems,
  generateRandomQuests,
  generateAndSaveQuests,
  refreshQuests,
  showQuests,
};
