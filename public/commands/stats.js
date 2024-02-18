import { gameData } from "../gameData.js";
import { consoleElement } from "../utilities.js";

export function showStats() {
  // HP Bar
  const hpBarLength = 20;
  const hpPercentage = (gameData.hp / gameData.maxHp) * 100;

  // Ensure hpPercentage is between 0 and 100
  const clampedHpPercentage = Math.max(0, Math.min(hpPercentage, 100));
  const filledHpLength = Math.round((clampedHpPercentage / 100) * hpBarLength);
  const emptyHpLength = hpBarLength - filledHpLength;

  const hpBar =
    "[" +
    "█".repeat(filledHpLength) +
    " ".repeat(emptyHpLength) +
    `] ${clampedHpPercentage.toFixed(2)}% (${gameData.hp}/${gameData.maxHp})`;

  // Display stats
  consoleElement.value += `\n\nHP: ${hpBar}\n\n`;
  consoleElement.value += `Attack: ${gameData.attack}\n`;
  consoleElement.value += `Defense: ${gameData.defense}\n`;
  consoleElement.value += `Crit Chance: ${(gameData.critChance * 100).toFixed(
    2
  )}%\n`;
  consoleElement.value += `Crit Value: ${(gameData.critValue * 100).toFixed(
    2
  )}%\n\n`;
  consoleElement.value += `Level: ${gameData.level} (${gameData.exp}/${gameData.nextLevelExp} EXP)\n`;
}
