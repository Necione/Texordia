import { consoleElement } from "../utilities.js";
import { gameData } from "../gameData.js";

export function showCooldowns() {
  var currentTime = new Date().getTime();
  var hasCooldowns = false;

  // Exploration cooldown logic
  if (gameData.ongoingExploration) {
    var explorationEndTime = new Date(gameData.explorationEndTime).getTime();
    var timeLeftForExploration = Math.ceil(
      (explorationEndTime - currentTime) / 1000
    );

    if (timeLeftForExploration > 0) {
      consoleElement.value += `\nExploration: ${timeLeftForExploration} seconds\n`;
      hasCooldowns = true;
    } else {
      consoleElement.value += `\nExploration complete! You can collect your treasure now.\n`;
      hasCooldowns = true;
    }
  }

  if (!hasCooldowns) {
    consoleElement.value += `\nYou have no active cooldowns.\n`;
  }
}
