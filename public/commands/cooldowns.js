import { consoleElement } from "../utilities.js";
import { gameData } from "../gameData.js";

export function showCooldowns() {
  var currentTime = new Date().getTime();

  // Hunting cooldown logic
  var timePassedSinceLastHunt = Math.floor(
    (currentTime - gameData.lastHuntTime) / 1000
  );
  var huntCooldown = 30;

  if (timePassedSinceLastHunt < huntCooldown) {
    var timeLeftForHunt = huntCooldown - timePassedSinceLastHunt;
    consoleElement.value += `\nTime remaining until next hunt: ${timeLeftForHunt} seconds\n`;
  } else {
    consoleElement.value += `\nReady for hunting!\n`;
  }

  // Exploration cooldown logic
  if (gameData.ongoingExploration) {
    var explorationEndTime = new Date(gameData.explorationEndTime).getTime();
    var timeLeftForExploration = Math.floor(
      (explorationEndTime - currentTime) / 1000
    );

    if (timeLeftForExploration > 0) {
      consoleElement.value += `Time remaining until exploration can be collected: ${timeLeftForExploration} seconds\n`;
    } else {
      consoleElement.value += `\nExploration complete! You can collect your treasure now.\n`;
    }
  }
}
