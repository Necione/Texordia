import { gameData } from "../gameData.js";
import { consoleElement } from "../utilities.js";

export function showStats() {
  // HP Bar
  const hpBarLength = 20;
  const filledHpLength = Math.round(
    (gameData.hp / gameData.maxHp) * hpBarLength
  );
  const emptyHpLength = hpBarLength - filledHpLength;
  const hpPercentage = Math.floor((gameData.hp / gameData.maxHp) * 100);
  const hpBar =
    "[" +
    "█".repeat(filledHpLength) +
    " ".repeat(emptyHpLength) +
    `] ${hpPercentage}% (${gameData.hp}/${gameData.maxHp})`;

  // Display stats
  consoleElement.value += `\n\nHP: ${hpBar}\nAttack: ${gameData.attack}\nDefense: ${gameData.defense}\n`;
  consoleElement.value += `\nLevel: ${gameData.level} (${gameData.exp}/${gameData.nextLevelExp} EXP)\n`;
}
