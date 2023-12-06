import { gameData, updateGameData } from "../gameData.js";
import { saveGameData, consoleElement } from "../utilities.js";

let monsters = [];

fetch("data/monsters.json")
  .then((response) => response.json())
  .then((data) => {
    monsters = data.monsters;
  })
  .catch((error) => console.error("Error loading monster data:", error));

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

export async function handleHunting(finishHuntCallback) {
  var currentTime = new Date().getTime();
  if (currentTime - gameData.lastHuntTime < 60000) {
    var timeLeft = Math.ceil(
      (60000 - (currentTime - gameData.lastHuntTime)) / 1000,
    );
    consoleElement.value += `\nYou need to rest. Try hunting again in ${timeLeft} seconds.\n`;

    if (typeof finishHuntCallback === "function") {
      finishHuntCallback();
    }
  } else {
    let spinner = ["-", "/", "|", "\\"];
    let spinnerIndex = 0;

    // Start the spinner
    const spinnerInterval = setInterval(() => {
      consoleElement.value =
        consoleElement.value.replace(/[-/|\\]$/, "") + spinner[spinnerIndex];
      spinnerIndex = (spinnerIndex + 1) % spinner.length;
    }, 250); // Change spinner every 250 milliseconds

    consoleElement.value += "\nSearching for monsters... ";
    consoleElement.disabled = true;

    setTimeout(() => {
      clearInterval(spinnerInterval); // Clear the spinner

      const monster = monsters[Math.floor(Math.random() * monsters.length)];
      const monsterHPRange = monster.hpRange; // Fetching hpRange from the monster data
      let monsterHP =
        Math.floor(
          Math.random() * (monsterHPRange[1] - monsterHPRange[0] + 1),
        ) + monsterHPRange[0];
      const monsterMaxHP = monsterHP;

      let combatLog = "";

      const updateCombatDisplay = () => {
        const updatedDisplay =
          `Your HP: ${generateHealthBar(gameData.hp, gameData.maxHp)}\n` +
          `${monster.name} HP: ${generateHealthBar(
            monsterHP,
            monsterMaxHP,
          )}\n\n` +
          `[ Combat Log ]\n` +
          combatLog;
        consoleElement.value =
          consoleElement.value.substring(
            0,
            consoleElement.value.indexOf("Searching for monsters...") +
              "Searching for monsters...".length,
          ) +
          "\n\n" +
          updatedDisplay;

        adjustConsoleScroll();
      };

      function adjustConsoleScroll() {
        consoleElement.scrollTop = consoleElement.scrollHeight;
      }

      updateCombatDisplay(); // Initial display update

      const combatInterval = setInterval(() => {
        // Player's turn
        const playerDamage = gameData.attack; // Assuming gameData.attack is defined
        monsterHP -= playerDamage;
        combatLog += `+ You dealt ${playerDamage} Damage to the ${monster.name}!\n`;

        if (monsterHP <= 0) {
          clearInterval(combatInterval);
          combatLog += `You defeated the ${monster.name}!\n`;
          updateCombatDisplay();
          handleCombatVictory(monster, finishHuntCallback);
          return;
        }

        // Monster's turn
        const monsterAttackRange = monster.damage;
        const monsterAttack =
          Math.floor(
            Math.random() * (monsterAttackRange[1] - monsterAttackRange[0] + 1),
          ) + monsterAttackRange[0];
        const playerDefense = gameData.defense;

        // Calculate damage using the provided formula
        let monsterDamage = Math.round(
          (monsterAttack * monsterAttack) / (monsterAttack + playerDefense),
        );

        // Ensure damage is at least 1
        monsterDamage = Math.max(1, monsterDamage);

        gameData.hp -= monsterDamage;
        combatLog += `- The ${monster.name} dealt ${monsterDamage} Damage to you\n`;

        if (gameData.hp <= 0) {
          clearInterval(combatInterval);
          combatLog += `You have been defeated by the ${monster.name}!\n`;
          updateCombatDisplay();
          handleCombatDefeat();
          return;
        }

        updateCombatDisplay();
      }, 1000); // 1 second interval between turns
    }, 5000); // 5 seconds for initial spinner
  }
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

export function showHuntCooldown() {
  var currentTime = new Date().getTime();
  var timePassed = Math.floor((currentTime - gameData.lastHuntTime) / 1000);
  var cooldown = 60;

  if (timePassed < cooldown) {
    var timeLeft = cooldown - timePassed;
    consoleElement.value += `\nTime remaining until next hunt: ${timeLeft} seconds\n`;
  } else {
    consoleElement.value += `\nReady for hunting!\n`;
  }
}