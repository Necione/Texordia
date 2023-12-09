import { consoleElement } from "../utilities.js";
import { gameData } from "../gameData.js";
import { skillData, unlockSkill } from "../data/skills.js";
import { saveGameData } from "../utilities.js";

export function handleSkillsCommands(argument) {
  const args = argument.split(" ");
  const command = args[0];
  const skillName = args[1];

  switch (command) {
    case "-buy":
      if (skillName) {
        unlockSkill(skillName.toLowerCase());
      }
      break;
    case "-upgrade":
      if (skillName) {
        upgradeSkill(skillName.toLowerCase());
      }
      break;
    default:
      showSkills();
  }
}

export function upgradeSkill(skillName) {
  const formattedSkillName = Object.keys(skillData).find(
    (key) => key.toLowerCase() === skillName
  );

  if (!formattedSkillName) {
    consoleElement.value += `\nError: Skill '${skillName}' not found.\n`;
    return false;
  }

  const skill = gameData.skills[formattedSkillName];
  const skillDetails = skillData[formattedSkillName];

  if (!skill || !skill.unlocked) {
    consoleElement.value += `\nError: Skill '${formattedSkillName}' is not unlocked.\n`;
    return false;
  }

  if (skill.level >= skillDetails.maxLevel) {
    consoleElement.value += `\nError: Skill '${formattedSkillName}' is already at max level.\n`;
    return false;
  }

  const growthRate = 1.9;
  const upgradeCost = Math.round(
    skillDetails.upgradeCost * Math.pow(growthRate, skill.level - 1)
  );

  if (gameData.goldAmount >= upgradeCost) {
    gameData.goldAmount -= upgradeCost;
    const oldLevel = skill.level;
    skill.level += 1;

    saveGameData();
    consoleElement.value += `\nSkill '${formattedSkillName}' upgraded from Level ${oldLevel} to Level ${skill.level}.\n`;
    return true;
  } else {
    consoleElement.value += `\nError: Not enough Gold to upgrade '${formattedSkillName}'. Required: ${upgradeCost}, Available: ${gameData.goldAmount}\n`;
    return false;
  }
}

function showSkills() {
  let unlockedSkillsDisplay = "\n\nUnlocked Skills:\n";
  let lockedSkillsDisplay = "\nLocked Skills:\n";

  Object.entries(skillData).forEach(([skillName, skillDetails]) => {
    const isUnlocked = gameData.skills[skillName] && gameData.skills[skillName].unlocked;
    const skillLevel = isUnlocked ? gameData.skills[skillName].level : 1;
    let skillDescription;

    if (skillName === "Leech") {
      skillDescription = `Heals ${skillDetails.bonuses[skillLevel - 1]} HP every 2 attacks.`;
    } else if (skillName === "Vigilance") {
      skillDescription = `Deal ${skillDetails.bonuses[skillLevel - 1]} more damage on your first attack.`;
    }

    let skillCostInfo = "";
    if (isUnlocked) {
      if (skillLevel < skillDetails.maxLevel) {
        const growthRate = 1.9;
        const nextLevelCost = Math.round(skillDetails.upgradeCost * Math.pow(growthRate, skillLevel - 1));
        skillCostInfo = ` (Next Level: ${nextLevelCost} Gold)`;
      } else {
        skillCostInfo = " (MAX)";
      }
    } else {
      skillCostInfo = ` (${skillDetails.cost} Gold)`;
    }

    const skillLevelInfo = isUnlocked ? `Lv${skillLevel}` : "";

    if (isUnlocked) {
      unlockedSkillsDisplay += `> ${skillName} [${skillLevelInfo}] - ${skillDescription}${skillCostInfo}\n`;
    } else {
      lockedSkillsDisplay += `> ${skillName}${skillCostInfo} - ${skillDescription}\n`;
    }
  });

  consoleElement.value += unlockedSkillsDisplay + lockedSkillsDisplay;
}
