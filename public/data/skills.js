import { gameData } from "../gameData.js";
import { saveGameData, consoleElement } from "../utilities.js";

export const skillData = {
  Vigilance: {
    name: "Vigilance",
    cost: 50,
    unlocked: false,
    level: 0,
    maxLevel: 5,
    bonuses: [1.5, 1.75, 2, 2.5, 3],
    upgradeCost: 40,
  },
  Leech: {
    name: "Leech",
    cost: 30,
    unlocked: false,
    level: 0,
    maxLevel: 5,
    bonuses: [1, 2, 3, 4, 5],
    upgradeCost: 40,
  },
};

export function unlockSkill(skillName) {
  // Convert skillName to the correct case as defined in skillData
  const formattedSkillName = Object.keys(skillData).find(
    (key) => key.toLowerCase() === skillName.toLowerCase()
  );

  // Check if the formatted skill name exists
  if (!formattedSkillName) {
    consoleElement.value += `\nSkill '${skillName}' not found.\n`;
    return false;
  }

  const skillDetails = skillData[formattedSkillName];

  // Check if the skill is already unlocked
  if (skillDetails.unlocked) {
    consoleElement.value += `\nSkill '${formattedSkillName}' is already unlocked.\n`;
    return false;
  }

  // Check if the player has enough gold to unlock the skill
  if (gameData.goldAmount >= skillDetails.cost) {
    gameData.goldAmount -= skillDetails.cost;
    skillDetails.unlocked = true;
    gameData.skills[formattedSkillName] = { unlocked: true, level: 1 };

    saveGameData();
    consoleElement.value += `\nSkill '${formattedSkillName}' unlocked successfully.\n`;
    return true;
  } else {
    consoleElement.value += `\nNot enough Gold to unlock '${formattedSkillName}'. Required: ${skillDetails.cost}, Available: ${gameData.goldAmount}\n`;
    return false;
  }
}
