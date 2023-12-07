import { consoleElement } from "../utilities.js";
import { gameData } from "../gameData.js";
import { skillData, unlockSkill } from "../data/skills.js";

export function handleSkillsCommands(argument) {
  if (argument.startsWith("-buy")) {
    // Convert the skill name to lowercase for case-insensitive comparison
    const skillName = argument.split(" ")[1].toLowerCase();
    if (skillName && unlockSkill(skillName)) {
      consoleElement.value += `\nSkill '${skillName}' unlocked!\n`;
    } else {
      consoleElement.value += `\nUnable to unlock skill '${skillName}'. Check if you have enough gold and if the skill is not already unlocked.\n`;
    }
  } else {
    showSkills();
  }
}

function showSkills() {
  let message = "\nUnlocked Skills:\n";

  gameData.skills.forEach((skillName) => {
    if (skillData[skillName] && skillData[skillName].unlocked) {
      message += `${skillName}: ${skillData[skillName].description}\n`;
    }
  });

  message += "\nAvailable Skills to Unlock:\n";
  Object.keys(skillData).forEach((skillName) => {
    const skill = skillData[skillName];
    if (!skill.unlocked) {
      message += `${skillName} (Cost: ${skill.cost} Gold): ${skill.description}\n`;
    }
  });

  consoleElement.value += message;
}
