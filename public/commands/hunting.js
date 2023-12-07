import { gameData, updateGameData } from "../gameData.js";
import { saveGameData, consoleElement } from "../utilities.js";
import { monsters } from "../data/monsters.js";

function generateHealthBar(currentHP, maxHP) {
    currentHP = Math.min(currentHP, maxHP);
    const hpBarLength = 20;

    if (currentHP <= 0) {
        return "[DEAD".padEnd(hpBarLength + 1) + `] ${currentHP}/${maxHP}`;
    }

    const filledLength = Math.round((currentHP / maxHP) * hpBarLength);
    const emptyLength = hpBarLength - filledLength;

    return "[" + "█".repeat(filledLength) + " ".repeat(emptyLength) + `] ${currentHP}/${maxHP}`;
}

export async function handleHunting(finishHuntCallback) {

  var currentTime = new Date().getTime();
  if (currentTime - gameData.lastHuntTime < 30000) {
      var timeLeft = Math.ceil((30000 - (currentTime - gameData.lastHuntTime)) / 1000);
      consoleElement.value += `\nYou need to rest. Try hunting again in ${timeLeft} seconds.\n`;
      if (typeof finishHuntCallback === "function") {
          finishHuntCallback();
      }
      return;
  }

  let spinner = ["-", "/", "|", "\\"];
  let spinnerIndex = 0;

  const spinnerInterval = setInterval(() => {
      consoleElement.value = consoleElement.value.replace(/[-/|\\]$/, "") + spinner[spinnerIndex];
      spinnerIndex = (spinnerIndex + 1) % spinner.length;
  }, 250);

  consoleElement.value += "\nSearching for monsters... ";
  consoleElement.disabled = true;

  setTimeout(() => {
      clearInterval(spinnerInterval);

        // Filter monsters based on the player's level and their encounter range
        const levelAppropriateMonsters = monsters.filter(monster =>
          gameData.level >= monster.encounterRange[0] && gameData.level <= monster.encounterRange[1]
      );

      // Select a random monster from the filtered list
      const monster = levelAppropriateMonsters[Math.floor(Math.random() * levelAppropriateMonsters.length)];
      monster.hp = Math.floor(Math.random() * (monster.hpRange[1] - monster.hpRange[0] + 1)) + monster.hpRange[0];
      const monsterMaxHP = monster.hp;

      let combatLog = "";
      let isFirstAttack = true;

      const combatStartIndex = consoleElement.value.length;

      const updateCombatDisplay = () => {
        const playerName = "Your HP";
        const monsterName = monster.name + " HP";

        // Determine the maximum name length for alignment
        const maxNameLength = Math.max(playerName.length, monsterName.length);

        // Pad the names to the maximum length
        const paddedPlayerName = playerName.padEnd(maxNameLength);
        const paddedMonsterName = monsterName.padEnd(maxNameLength);

        const playerHealthBar = generateHealthBar(gameData.hp, gameData.maxHp);
        const monsterHealthBar = generateHealthBar(monster.hp, monsterMaxHP);
        
        const combatDisplay = `\n\n${paddedPlayerName} ${playerHealthBar}\n${paddedMonsterName} ${monsterHealthBar}\n\n[ Combat Log ]\n${combatLog}`;
        consoleElement.value = consoleElement.value.substring(0, combatStartIndex) + combatDisplay;
        adjustConsoleScroll();
    };

      const adjustConsoleScroll = () => {
          consoleElement.scrollTop = consoleElement.scrollHeight;
      };

      updateCombatDisplay();

      const combatInterval = setInterval(() => {
          if (monster.hp > 0) {
              const attackResult = playerAttack(isFirstAttack, monster, gameData);
              combatLog += attackResult.combatLog;
              isFirstAttack = attackResult.isFirstAttack;

              if (monster.hp <= 0) {
                  clearInterval(combatInterval);
                  combatLog += `You defeated the ${monster.name}!\n`;
                  updateCombatDisplay();
                  handleCombatVictory(monster, finishHuntCallback);
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

      gameData.lastHuntTime = new Date().getTime();
  }, 5000);
}

function playerAttack(isFirstAttack, monster, gameData) {
  let playerDamage = gameData.attack;

  if (isFirstAttack && gameData.skills.includes("Vigilance")) {
      playerDamage *= 2; // Double damage for the first attack
  }

  monster.hp -= playerDamage;

    // Check for Leech skill
    if (gameData.skills.includes("Leech")) {
      gameData.leechCounter++;
      if (gameData.leechCounter >= 2) {
          gameData.hp = Math.min(gameData.hp + 0.5, gameData.maxHp); // Heal 1 HP, but do not exceed max HP
          gameData.leechCounter = 0; // Reset counter after healing
      }      
  }

  return { combatLog: `+ You dealt ${playerDamage} Damage to the ${monster.name}!\n`, isFirstAttack: false };
}

function monsterAttack(monster, gameData) {
  const monsterAttack = Math.floor(Math.random() * (monster.damage[1] - monster.damage[0] + 1)) + monster.damage[0];
  gameData.hp -= monsterAttack;

  return `- The ${monster.name} dealt ${monsterAttack} Damage to you\n`;
}

function handleCombatVictory(monster, finishHuntCallback) {
  // Handle player victory and display loot
  consoleElement.value += `\n[ Combat Results ]\n`;
  let lootDropped = false;
  let lootTable =
    "\nLoot Gained:\n+---------------+--------+\n| Name          | Amount |\n+---------------+--------+\n";

  if (Array.isArray(monster.drops)) {
    monster.drops.forEach((drop) => {
      if (Math.random() * 100 < drop.dropChance) {
        lootDropped = true;
        const quantity =
          Math.floor(
            Math.random() * (drop.quantityRange[1] - drop.quantityRange[0] + 1),
          ) + drop.quantityRange[0];

        const existingItemIndex = gameData.userInventory.findIndex(
          (item) => item.item === drop.item,
        );
        if (existingItemIndex !== -1) {
          gameData.userInventory[existingItemIndex].quantity += quantity;
        } else {
          gameData.userInventory.push({
            item: drop.item,
            quantity: quantity,
          });
        }

        lootTable += `| ${drop.item.padEnd(13)} | ${quantity
          .toString()
          .padEnd(6)} |\n`;
      }
    });
  }

  if (lootDropped) {
    lootTable += "+---------------+--------+\n";
    consoleElement.value += lootTable;
  } else {
    consoleElement.value += "\nNo loot gained this time.\n";
  }

  gameData.lastHuntTime = new Date().getTime();

  // Calculate and award EXP
  const xpAwarded =
    Math.floor(Math.random() * (monster.expRange[1] - monster.expRange[0] + 1)) +
    monster.expRange[0];
  gameData.exp += xpAwarded;
  consoleElement.value += `\nYou gained ${xpAwarded} EXP.\n`;

  updateGameData(gameData);
  saveGameData();

  if (typeof finishHuntCallback === "function") {
    finishHuntCallback();
  }

  consoleElement.value += `\nTexordia\\${gameData.currentDirectory}> `;
  consoleElement.disabled = false;
  consoleElement.focus();
  consoleElement.setSelectionRange(
    consoleElement.value.length,
    consoleElement.value.length,
  );
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
