import { consoleElement } from "../utilities.js";
import { gameData } from "../gameData.js";

export function showCooldowns() {
    // Hunting cooldown logic
    var currentTime = new Date().getTime();
    var timePassedSinceLastHunt = Math.floor((currentTime - gameData.lastHuntTime) / 1000);
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
        var timePassedSinceExplorationStart = Math.floor((currentTime - explorationEndTime) / 1000);
        var explorationCooldown = 120;

        if (timePassedSinceExplorationStart < explorationCooldown) {
            var timeLeftForExploration = explorationCooldown - timePassedSinceExplorationStart;
            consoleElement.value += `Time remaining until exploration can be collected: ${timeLeftForExploration} seconds\n`;
        } else {
            consoleElement.value += `\nExploration complete! You can collect your treasure now.\n`;
        }
    }
}
