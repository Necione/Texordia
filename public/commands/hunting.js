import { gameData, updateGameData } from "../gameData.js";
import { saveGameData, consoleElement } from "../utilities.js";
import { monsters } from "../data/monsters.js";

// Add this in your gameData structure
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

  return {
    ...specificMonster,
    currentHP:
      Math.floor(
        Math.random() *
          (specificMonster.hpRange[1] - specificMonster.hpRange[0] + 1)
      ) + specificMonster.hpRange[0],
  };
}

function spawnMonster(playerLevel) {
  const levelAppropriateMonsters = monsters.filter(
    (monster) =>
      playerLevel >= monster.encounterRange[0] &&
      playerLevel <= monster.encounterRange[1]
  );

  const selectedMonster =
    levelAppropriateMonsters[
      Math.floor(Math.random() * levelAppropriateMonsters.length)
    ];

  return {
    ...selectedMonster,
    currentHP:
      Math.floor(
        Math.random() *
          (selectedMonster.hpRange[1] - selectedMonster.hpRange[0] + 1)
      ) + selectedMonster.hpRange[0],
  };
}

function generateHealthBar(currentHP, maxHP) {
  currentHP = Math.min(currentHP, maxHP);
  const hpBarLength = 20;

  if (currentHP <= 0) {
    return "[DEAD".padEnd(hpBarLength + 1) + `] ${currentHP}/${maxHP}`;
  }

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
      monster.hpRange[1]
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

        // Call handleCombatVictory here
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

export async function handleHunting() {
  var currentTime = new Date().getTime();
  if (currentTime - gameData.lastHuntTime < 30000) {
    var timeLeft = Math.ceil(
      (30000 - (currentTime - gameData.lastHuntTime)) / 1000
    );
    consoleElement.value += `\nYou need to rest. Try hunting again in ${timeLeft} seconds.\n`;
    gameData.isAsyncCommandRunning = false;

    saveGameData();
    return;
  }

  let spinner = ["-", "/", "|", "\\"];
  let spinnerIndex = 0;

  const spinnerInterval = setInterval(() => {
    consoleElement.value =
      consoleElement.value.replace(/[-/|\\]$/, "") + spinner[spinnerIndex];
    spinnerIndex = (spinnerIndex + 1) % spinner.length;
  }, 250);

  consoleElement.value += "\nSearching for monsters... ";
  consoleElement.disabled = true;

  setTimeout(() => {
    clearInterval(spinnerInterval);

    const monstersToEncounter = [spawnMonster(gameData.level)];
    if (monstersToEncounter[0].name === "Jellyfish") {
      // Add two Lesser Jellyfish to the encounter list
      monstersToEncounter.push(spawnSpecificMonster("Lesser Jellyfish"));
      monstersToEncounter.push(spawnSpecificMonster("Lesser Jellyfish"));
    } else if (Math.random() < 0.5) {
      // Add a second random monster if the first isn't a Jellyfish
      monstersToEncounter.push(spawnMonster(gameData.level));
    }

    const onAllCombatsComplete = () => {
      applyAccumulatedRewards();

      // Update game data and save it
      gameData.lastHuntTime = new Date().getTime();
      updateGameData(gameData);
      saveGameData();

      gameData.isAsyncCommandRunning = false;

      // Append the next command prompt
      consoleElement.value += `\nTexordia\\${gameData.currentDirectory}> `;
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
  }, 5000);

  gameData.lastHuntTime = new Date().getTime();
}

function playerAttack(isFirstAttack, monster, gameData) {
  let playerDamage = gameData.attack;

  if (isFirstAttack && gameData.skills.includes("Vigilance")) {
    playerDamage *= 2;
  }

  monster.currentHP -= playerDamage;

  if (gameData.skills.includes("Leech") && gameData.leechCounter % 2 === 0) {
    gameData.hp = Math.min(gameData.hp + 1, gameData.maxHp);
  }
  gameData.leechCounter++;

  return {
    combatLog: `+ You dealt ${playerDamage} Damage to the ${monster.name}!\n`,
    isFirstAttack: false,
  };
}

function monsterAttack(monster, gameData) {
  const monsterAttack =
    Math.floor(Math.random() * (monster.damage[1] - monster.damage[0] + 1)) +
    monster.damage[0];
  gameData.hp -= monsterAttack;

  return `- The ${monster.name} dealt ${monsterAttack} Damage to you\n`;
}

function handleCombatVictory(monster, remainingMonsters, onAllCombatsComplete) {
  accumulateLootAndExp(monster);

  if (remainingMonsters.length > 0) {
    const nextMonster = remainingMonsters.shift();
    startCombat(nextMonster, remainingMonsters, onAllCombatsComplete);
  } else {
    gameData.lastHuntTime = new Date().getTime();
    updateGameData(gameData);

    applyAccumulatedRewards();

    gameData.isAsyncCommandRunning = false;

    consoleElement.value += `\nTexordia\\${gameData.currentDirectory}> `;
    consoleElement.disabled = false;
    consoleElement.focus();
    consoleElement.setSelectionRange(
      consoleElement.value.length,
      consoleElement.value.length,
      (consoleElement.scrollTop = consoleElement.scrollHeight)
    );

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
    rewardsSummary += "No loot gained this time.\n";
  }

  // Displaying the accumulated experience
  rewardsSummary += `Total EXP Gained: ${gameData.accumulatedRewards.exp}\n`;

  consoleElement.value += rewardsSummary;
}

function resetAccumulatedRewards() {
  gameData.accumulatedRewards = { loot: [], exp: 0 };
}

function handleCombatDefeat() {
  consoleElement.value += `\n[ Combat Results ]\nYou have been defeated!\n`;
  handleDeath();
}

function handleDeath() {
  consoleElement.value += "\nYou have died. All progress has been reset.\n";
  localStorage.clear();

  setTimeout(() => {
    window.location.reload();
  }, 2000);
}
