import { gameData } from "../gameData.js";
import { saveGameData } from "../utilities.js";

export const skillData = {
  Vigilance: {
    name: "Vigilance",
    description: "Deals 2x damage for the first attack in a hunt",
    cost: 50,
    unlocked: false,
  },
  Leech: {
    name: "Leech",
    description: "Heals 1 HP every 2 attacks",
    cost: 30,
    unlocked: false,
  },
};

export function unlockSkill(skillName) {
  // Find the skill with the matching lowercase name
  const skill = Object.entries(skillData).find(
    ([name, data]) => name.toLowerCase() === skillName
  );

  if (!skill) {
    console.error(`Skill '${skillName}' not found.`);
    return false;
  }

  const [skillKey, skillDetails] = skill;

  // Check if the skill is already unlocked or added to gameData.skills
  if (skillDetails.unlocked || gameData.skills.includes(skillKey)) {
    console.error(`Skill '${skillKey}' is already unlocked.`);
    return false;
  }

  if (gameData.goldAmount >= skillDetails.cost) {
    gameData.goldAmount -= skillDetails.cost;
    skillDetails.unlocked = true;
    gameData.skills.push(skillKey); // Store the original skill name

    saveGameData();

    return true;
  } else {
    console.error(
      `Not enough gold to unlock '${skillKey}'. Required: ${skillDetails.cost}, Available: ${gameData.goldAmount}`
    );
    return false;
  }
}