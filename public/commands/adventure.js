import { gameData, updateGameData, updateLevel } from "../gameData.js";
import { saveGameData, consoleElement } from "../utilities.js";
import { monsters } from "../data/monsters.js";
import { monsterGroups } from "../data/groupMonster.js";
import { skillData } from "../data/skills.js";
import { triggerRandomEvent } from "./randomEvent.js";

gameData.accumulatedRewards = {
  loot: [],
  exp: 0,
};

function spawnSpecificMonster(monsterName) {
  const specificMonster = monsters.find(
    (monster) => monster.name === monsterName
  );

  if (!specificMonster) {
    throw new Error("Monster not found: " + monsterName);
  }

  const monsterHP =
    Math.floor(
      Math.random() *
        (specificMonster.hpRange[1] - specificMonster.hpRange[0] + 1)
    ) + specificMonster.hpRange[0];

  return {
    ...specificMonster,
    currentHP: monsterHP,
    maxHP: monsterHP,
  };
}

function spawnMonster(playerLevel) {
  const levelAppropriateMonsters = monsters.filter(
    (monster) =>
      playerLevel >= monster.encounterRange[0] &&
      playerLevel <= monster.encounterRange[1] &&
      monster.naturalEncounter
  );

  if (levelAppropriateMonsters.length === 0) {
    throw new Error("No appropriate monsters found for this level.");
  }

  const selectedMonster =
    levelAppropriateMonsters[
      Math.floor(Math.random() * levelAppropriateMonsters.length)
    ];
  const monsterHP =
    Math.floor(
      Math.random() *
        (selectedMonster.hpRange[1] - selectedMonster.hpRange[0] + 1)
    ) + selectedMonster.hpRange[0];

  return {
    ...selectedMonster,
    currentHP: monsterHP,
    maxHP: monsterHP,
  };
}

function generateHealthBar(currentHP, maxHP) {
  // Fallback for undefined or NaN values
  currentHP = currentHP ?? 0;
  maxHP = maxHP ?? 1;

  currentHP = Math.max(0, Math.min(currentHP, maxHP));
  const hpBarLength = 20;
  const filledLength = Math.round((currentHP / maxHP) * hpBarLength);
  const emptyLength = hpBarLength - filledLength;

  return (
    "[" +
    "█".repeat(filledLength) +
    " ".repeat(emptyLength) +
    `] ${currentHP}/${maxHP}`
  );
}

function startCombat(monster, remainingMonsters, onAllCombatsComplete) {
  let combatLog = "";
  let isFirstAttack = true;
  const combatStartIndex = consoleElement.value.length;

  const updateCombatDisplay = () => {
    const playerName = "Your HP";
    const monsterName = monster.name + " HP";
    const maxNameLength = Math.max(playerName.length, monsterName.length);

    const paddedPlayerName = playerName.padEnd(maxNameLength);
    const paddedMonsterName = monsterName.padEnd(maxNameLength);

    const playerHealthBar = generateHealthBar(gameData.hp, gameData.maxHp);
    const monsterHealthBar = generateHealthBar(
      monster.currentHP,
      monster.maxHP
    );

    const combatDisplay = `\n\n${paddedPlayerName} ${playerHealthBar}\n${paddedMonsterName} ${monsterHealthBar}\n\n[ Combat Log ]\n${combatLog}`;
    consoleElement.value =
      consoleElement.value.substring(0, combatStartIndex) + combatDisplay;
    adjustConsoleScroll();
  };

  const adjustConsoleScroll = () => {
    consoleElement.scrollTop = consoleElement.scrollHeight;
  };

  updateCombatDisplay();

  const combatInterval = setInterval(() => {
    if (monster.currentHP > 0) {
      const attackResult = playerAttack(isFirstAttack, monster, gameData);
      combatLog += attackResult.combatLog;
      isFirstAttack = attackResult.isFirstAttack;

      if (monster.currentHP <= 0) {
        clearInterval(combatInterval);
        combatLog += `You defeated the ${monster.name}!\n`;
        updateCombatDisplay();

        handleCombatVictory(monster, remainingMonsters, onAllCombatsComplete);

        return;
      }

      combatLog += monsterAttack(monster, gameData);

      if (gameData.hp <= 0) {
        clearInterval(combatInterval);
        combatLog += `You have been defeated by the ${monster.name}!\n`;
        updateCombatDisplay();
        handleCombatDefeat();
        return;
      }
    }

    updateCombatDisplay();
  }, 1000);
}

export async function handleAdventure() {
  let spinner = ["-", "/", "|", "\\"];
  let spinnerIndex = 0;

  const spinnerInterval = setInterval(() => {
    consoleElement.value =
      consoleElement.value.replace(/[-/|\\]$/, "") + spinner[spinnerIndex];
    spinnerIndex = (spinnerIndex + 1) % spinner.length;
  }, 250);

  consoleElement.value += "\nGoing on an adventure... ";
  consoleElement.disabled = true;

  setTimeout(() => {
    clearInterval(spinnerInterval);

    const randomChoice = Math.random() < 0.1; // 10% chance

    if (randomChoice) {
      triggerRandomEvent();
    } else {
      let monstersToEncounter = [];

      // 25% chance to encounter a group of monsters
      if (Math.random() < 0.25) {
        const groupToEncounter = monsterGroups.find(
          (group) =>
            gameData.level >= group.levelRange[0] &&
            gameData.level <= group.levelRange[1]
        );

        if (groupToEncounter) {
          // Spawn monsters based on the group configuration
          groupToEncounter.monsters.forEach((groupMonster) => {
            for (let i = 0; i < groupMonster.number; i++) {
              monstersToEncounter.push(spawnSpecificMonster(groupMonster.name));
            }
          });
        }
      }

      // If no group was chosen or random chance failed, spawn a single random monster
      if (monstersToEncounter.length === 0) {
        monstersToEncounter.push(spawnMonster(gameData.level));
      }

      const onAllCombatsComplete = () => {
        applyAccumulatedRewards();
        updateGameData();
        saveGameData();

        gameData.isAsyncCommandRunning = false;

        // Append the next command prompt
        if (gameData.currentDirectory === "") {
          consoleElement.value += `\nTexordia> `;
        } else {
          consoleElement.value += `\nTexordia\\${gameData.currentDirectory}> `;
        }
        consoleElement.disabled = false;
        consoleElement.focus();
        consoleElement.setSelectionRange(
          consoleElement.value.length,
          consoleElement.value.length,
          (consoleElement.scrollTop = consoleElement.scrollHeight)
        );

        saveGameData();
      };

      startCombat(
        monstersToEncounter.shift(),
        monstersToEncounter,
        onAllCombatsComplete
      );
    }
  }, 4000);
}

function playerAttack(isFirstAttack, monster, gameData) {
  let playerDamage = gameData.attack;
  let combatLog = "";

  // Check for critical hit
  if (Math.random() < gameData.critChance) {
    playerDamage *= gameData.critValue; // Apply critical damage multiplier
    combatLog += "(CRIT) ";
  }

  // Apply Vigilance skill bonus
  if (
    isFirstAttack &&
    gameData.skills["Vigilance"] &&
    gameData.skills["Vigilance"].unlocked
  ) {
    const vigilanceLevel = gameData.skills["Vigilance"].level - 1;
    const vigilanceBonus = skillData.Vigilance.bonuses[vigilanceLevel];
    playerDamage *= vigilanceBonus; // Apply Vigilance bonus
  }

  // Round the player damage to the nearest hundredth
  playerDamage = parseFloat(playerDamage.toFixed(2));

  monster.currentHP -= playerDamage;
  if (monster.currentHP < 0) monster.currentHP = 0;

  combatLog += `You dealt ${playerDamage} damage to the ${monster.name}.\n`;

  // Apply Leech skill bonus and log the healing
  if (
    gameData.skills["Leech"] &&
    gameData.skills["Leech"].unlocked &&
    gameData.leechCounter % 2 === 0
  ) {
    const leechLevel = gameData.skills["Leech"].level - 1;
    const leechBonus = skillData.Leech.bonuses[leechLevel];
    gameData.hp = Math.min(gameData.hp + leechBonus, gameData.maxHp);

    // Adding Leech skill healing to the combat log
    combatLog += `Leech skill healed you for ${leechBonus} HP.\n`;
  }
  gameData.leechCounter++;

  return {
    combatLog: combatLog,
    isFirstAttack: false,
  };
}

function monsterAttack(monster, gameData) {
  const monsterAttack =
    Math.floor(Math.random() * (monster.damage[1] - monster.damage[0] + 1)) +
    monster.damage[0];
  gameData.hp -= monsterAttack;

  return `The ${monster.name} dealt ${monsterAttack} Damage to you.\n`;
}

function handleCombatVictory(monster, remainingMonsters, onAllCombatsComplete) {
  accumulateLootAndExp(monster);

  if (remainingMonsters.length > 0) {
    const nextMonster = remainingMonsters.shift();
    startCombat(nextMonster, remainingMonsters, onAllCombatsComplete);
  } else {
    applyAccumulatedRewards();

    gameData.isAsyncCommandRunning = false;

    if (gameData.currentDirectory === "") {
      consoleElement.value += `\nTexordia> `;
    } else {
      consoleElement.value += `\nTexordia\\${gameData.currentDirectory}> `;
    }
    consoleElement.disabled = false;
    consoleElement.focus();
    consoleElement.setSelectionRange(
      consoleElement.value.length,
      consoleElement.value.length,
      (consoleElement.scrollTop = consoleElement.scrollHeight)
    );

    updateLevel();
    saveGameData();
  }
}

function accumulateLootAndExp(monster) {
  // Iterate over the monster's drops to determine what loot is awarded
  if (Array.isArray(monster.drops)) {
    monster.drops.forEach((drop) => {
      if (Math.random() * 100 < drop.dropChance) {
        const quantity =
          Math.floor(
            Math.random() * (drop.quantityRange[1] - drop.quantityRange[0] + 1)
          ) + drop.quantityRange[0];

        // Check if the item already exists in the accumulated loot
        const existingItem = gameData.accumulatedRewards.loot.find(
          (item) => item.item === drop.item
        );
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          gameData.accumulatedRewards.loot.push({ item: drop.item, quantity });
        }
      }
    });
  }

  // Calculate and accumulate EXP
  const xpAwarded =
    Math.floor(
      Math.random() * (monster.expRange[1] - monster.expRange[0] + 1)
    ) + monster.expRange[0];
  gameData.accumulatedRewards.exp += xpAwarded;
}

function applyAccumulatedRewards() {
  // Apply the accumulated loot
  gameData.accumulatedRewards.loot.forEach((accumulatedItem) => {
    const existingItemIndex = gameData.userInventory.findIndex(
      (item) => item.item === accumulatedItem.item
    );
    if (existingItemIndex !== -1) {
      gameData.userInventory[existingItemIndex].quantity +=
        accumulatedItem.quantity;
    } else {
      gameData.userInventory.push({ ...accumulatedItem });
    }
  });

  // Apply the accumulated experience points
  gameData.exp += gameData.accumulatedRewards.exp;

  updateLevel();

  // Display the results
  displayAccumulatedRewardsResults();
  resetAccumulatedRewards();
}

function displayAccumulatedRewardsResults() {
  let rewardsSummary = "\nHunting Rewards:\n";

  // Displaying the accumulated loot in table format
  if (gameData.accumulatedRewards.loot.length > 0) {
    rewardsSummary += "+---------------+--------+\n";
    rewardsSummary += "| Loot          | Amount |\n";
    rewardsSummary += "+---------------+--------+\n";
    gameData.accumulatedRewards.loot.forEach((item) => {
      let paddedItemName = item.item.padEnd(13, " "); // Adjust the padding as needed
      let paddedQuantity = item.quantity.toString().padEnd(6, " ");
      rewardsSummary += `| ${paddedItemName} | ${paddedQuantity} |\n`;
    });
    rewardsSummary += "+---------------+--------+\n";
  } else {
    rewardsSummary += "No loot gained this time.\n\n";
  }

  // Displaying the accumulated experience
  rewardsSummary += `Total EXP Gained: ${gameData.accumulatedRewards.exp}\n`;

  consoleElement.value += rewardsSummary;
}

function resetAccumulatedRewards() {
  gameData.accumulatedRewards = { loot: [], exp: 0 };
}

function handleCombatDefeat() {
  consoleElement.value += "\nYou have died. All progress has been reset.\n";
  localStorage.clear();

  consoleElement.scrollTop = consoleElement.scrollHeight;

  setTimeout(() => {
    window.location.reload();
  }, 2000);
}
