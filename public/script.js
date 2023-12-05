import { gameData, updateGameData } from './gameData.js';
import { refreshQuests, showQuests } from "./quests.js";
import { loadFromLocalStorage, saveToLocalStorage, saveGameData } from "./utilities.js";

document.addEventListener("DOMContentLoaded", function () {

  var savedData = loadFromLocalStorage("gameData", {
    goldAmount: 100,
    lastHuntTime: 0,
    hp: 20,
    defense: 10,
  });

  var currentDirectory = loadFromLocalStorage("currentDirectory", "");
  var userInventory = loadFromLocalStorage("userInventory", []);

  let monsters = [];

  fetch("monsters.json")
    .then((response) => response.json())
    .then((data) => {
      monsters = data.monsters;
    })
    .catch((error) => console.error("Error loading monster data:", error));

  let itemsData = [];

  fetch("items.json")
    .then((response) => response.json())
    .then((data) => {
      itemsData = data.items;
    })
    .catch((error) => console.error("Error loading items data:", error));

  var consoleElement = document.getElementById("console");
  var promptText = currentDirectory
    ? `Texordia\\${currentDirectory}> `
    : "Texordia> ";

  const shopItems = {
    items: [
      { name: "Sword", price: 100 },
      { name: "Shield", price: 150 },
      { name: "Potion", price: 50 },
    ],
  };

  const directoryStructure = {
    Root: {
      Shop: {},
      Guild: {},
    },
  };

  consoleElement.value =
    "Welcome back to Texordia. [ Ver 0.1 ]\n\n" + promptText;
  consoleElement.focus();
  consoleElement.setSelectionRange(
    consoleElement.value.length,
    consoleElement.value.length,
  );

  consoleElement.addEventListener("keydown", function (event) {
    var currentLineStart =
      this.value.lastIndexOf(promptText) + promptText.length;

    if (event.ctrlKey && event.key === "a") {
      event.preventDefault();
      this.setSelectionRange(currentLineStart, this.value.length);
      return;
    }

    if (
      (event.key === "Backspace" && this.selectionStart <= currentLineStart) ||
      (event.key === "Delete" && this.selectionStart < currentLineStart)
    ) {
      event.preventDefault();
      return;
    }

    if (this.selectionStart < currentLineStart && !event.ctrlKey) {
      event.preventDefault();
      this.setSelectionRange(currentLineStart, currentLineStart);
    }

    if (event.key === "Enter") {
      event.preventDefault();
      var input = this.value.substring(currentLineStart).trim();

      processCommand(input);

      if (input.toLowerCase() !== "cls") {
        this.value += "\n" + promptText;
      }

      this.scrollTop = this.scrollHeight;
      this.setSelectionRange(this.value.length, this.value.length);
    }
  });

  document.addEventListener("click", function () {
    consoleElement.focus();
  });

  function processCommand(input) {
    const [command, ...args] = input.trim().split(/\s+/);
    const initialCommand = args[0] ? `${command} ${args[0]}` : command;
    const argument = args.join(" ");

    console.log(`Command: ${command}, Argument: ${argument}`);

    switch (command) {
      case "sudo":
        handleSudoCommands(initialCommand);
        break;
      case "quests":
        handleQuestsCommands(argument);
        break;
      case "sellall":
        handleSellAll(argument);
        break;
      case "useitem":
        handleUseItem(argument);
        break;
      case "items":
        handleShopItems(argument, input);
        break;
      case "cd":
        changeDirectory(argument);
        break;
      case "stats":
      case "inventory":
      case "cls":
      case "times":
      case "tree":
        handleGeneralCommands(command, argument);
        break;
      default:
        consoleElement.value += `\n'${input}' is not recognized as an internal or external command.\n`;
        break;
    }
  }

  function handleSudoCommands(initialCommand) {
    if (initialCommand === "sudo hunt" && currentDirectory === "Guild") {
      handleHunting();
    } else {
      consoleElement.value += `\nInvalid command or wrong directory.\n`;
    }
  }

  function handleQuestsCommands(argument) {
    if (currentDirectory !== "Guild") {
      consoleElement.value +=
        "\nYou must be in the Guild directory for quests.\n";
      return;
    }
    argument === "-refresh"
      ? refreshQuests(consoleElement, itemsData, hp)
      : showQuests(consoleElement);
  }

  function handleSellAll(argument) {
    if (currentDirectory !== "Shop") {
      consoleElement.value +=
        "\nYou must be in the Shop directory to sell items.\n";
      return;
    }
    sellAllItems(argument);
  }

  function handleUseItem(argument) {
    if (argument.toLowerCase() === "potion") {
      usePotion();
    } else {
      consoleElement.value += "\nYou don't have that item in your inventory.\n";
    }
  }

  function handleShopItems(argument, input) {
    if (currentDirectory !== "Shop") {
      consoleElement.value +=
        "\nYou must be in the Shop directory to interact with items.\n";
      return;
    }
    if (argument.startsWith("-buy")) {
      const itemName = extractItemNameFromInput(input);
      itemName
        ? attemptToPurchaseItem(itemName)
        : (consoleElement.value +=
            '\nInvalid format. Use: items -buy "Item Name"');
    } else if (argument === "-list") {
      listShopItems();
    }
  }

  function handleGeneralCommands(command, argument) {
    switch (command) {
      case "cd":
        changeDirectory(argument);
        break;
      case "stats":
        showStats();
        break;
      case "inventory":
        showInventory();
        break;
      case "cls":
        clearScreen();
        break;
      case "times":
        showHuntCooldown();
        break;
      case "tree":
        showDirectoryTree();
        break;
      default:
        consoleElement.value += `\n'${command}' is not recognized as an internal or external command.\n`;
        break;
    }
  }

  function showHuntCooldown() {
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

  function sellAllItems(specificItem = null) {
    let totalSellPrice = 0;
    specificItem = specificItem ? specificItem.toLowerCase() : null;

    userInventory = userInventory.filter((itemObj) => {
      if (!specificItem || itemObj.item.toLowerCase() === specificItem) {
        const itemData = itemsData.find(
          (item) => item.name.toLowerCase() === itemObj.item.toLowerCase(),
        );
        if (itemData) {
          totalSellPrice += itemData.sellPrice * itemObj.quantity;
          return false;
        }
      }
      return true;
    });

    goldAmount += totalSellPrice;
    consoleElement.value += `\nSold ${
      specificItem ? specificItem : "all items"
    } for ${totalSellPrice} gold.\n`;
    saveToLocalStorage("userInventory", userInventory);
    saveGameData();
  }

  function extractItemNameFromInput(input) {
    var match = input.match(/-buy\s+(.+)/);
    return match ? match[1] : null;
  }

  function usePotion() {
    const potionIndex = userInventory.findIndex(
      (item) => item.toLowerCase() === "potion",
    );

    if (potionIndex !== -1) {
      userInventory.splice(potionIndex, 1);

      const restoredHP = Math.floor(Math.random() * 6) + 5;

      if (hp + restoredHP > 20) {
        hp = 20;
      } else {
        hp += restoredHP;
      }

      consoleElement.value += `\nYou used a Potion and restored ${restoredHP} HP. Current HP: ${hp}.\n`;

      saveToLocalStorage("userInventory", userInventory);
      saveGameData();
    } else {
      consoleElement.value +=
        "\nYou don't have any Potions in your inventory.\n";
    }
  }

  async function handleHunting() {
    var currentTime = new Date().getTime();
    if (currentTime - gameData.lastHuntTime < 60000) {
      var timeLeft = Math.ceil((60000 - (currentTime - gameData.lastHuntTime)) / 1000);
      consoleElement.value += `\nYou need to rest. Try hunting again in ${timeLeft} seconds.\n`;
    } else {
      const monster = monsters[Math.floor(Math.random() * monsters.length)];
      const goldEarned =
        Math.floor(
          Math.random() * (monster.coinDrop[1] - monster.coinDrop[0] + 1),
        ) + monster.coinDrop[0];
      const hpLoss =
        Math.floor(
          Math.random() * (monster.damage[1] - monster.damage[0] + 1),
        ) + monster.damage[0];
  
      gameData.goldAmount += goldEarned;
      gameData.hp -= hpLoss;
      gameData.lastHuntTime = currentTime;
  
      let lootDropped = false;
      let lootTable =
        "\nLoot Gained:\n+---------------+--------+\n| Name          | Amount |\n+---------------+--------+\n";
  
      if (Array.isArray(monster.drops)) {
        monster.drops.forEach((drop) => {
          if (Math.random() * 100 < drop.dropChance) {
            lootDropped = true;
            const quantity =
              Math.floor(
                Math.random() *
                  (drop.quantityRange[1] - drop.quantityRange[0] + 1),
              ) + drop.quantityRange[0];
  
            const existingItemIndex = gameData.userInventory.findIndex(
              (item) => item.item === drop.item,
            );
            if (existingItemIndex !== -1) {
              gameData.userInventory[existingItemIndex].quantity += quantity;
            } else {
              gameData.userInventory.push({ item: drop.item, quantity: quantity });
            }
  
            lootTable += `| ${drop.item.padEnd(13)} | ${quantity
              .toString()
              .padEnd(6)} |\n`;
          }
        });
      }
  
      if (lootDropped) {
        lootTable += "+---------------+--------+";
        consoleElement.value += lootTable;
      } else {
        consoleElement.value += "\nNo loot gained this time.\n";
      }
  
      consoleElement.value += `\nYou encountered a ${monster.name}! After a fierce battle, you earned ${goldEarned} gold and lost ${hpLoss} HP.\n  Total gold: ${gameData.goldAmount}.\n  Current HP: ${gameData.hp}.\n`;
  
      checkForDeath();
      updateGameData(gameData);
      saveToLocalStorage("userInventory", gameData.userInventory);
    }
  }

  function attemptToPurchaseItem(itemName) {
    const item = shopItems.items.find(
      (item) => item.name.toLowerCase() === itemName.toLowerCase(),
    );

    if (item) {
      if (gameData.goldAmount >= item.price) {
        gameData.goldAmount -= item.price;

        const existingItemIndex = gameData.userInventory.findIndex(
          (invItem) => invItem.item === item.name,
        );
        if (existingItemIndex !== -1) {
          gameData.userInventory[existingItemIndex].quantity += 1;
        } else {
          gameData.userInventory.push({ item: item.name, quantity: 1 });
        }

        consoleElement.value += `\nPurchased ${item.name} for ${item.price} coins. Remaining gold: ${gameData.goldAmount}.\n`;

        saveGameData();
        saveToLocalStorage("userInventory", gameData.userInventory);
      } else {
        consoleElement.value += "\nNot enough gold to purchase this item.\n";
      }
    } else {
      consoleElement.value += "\nItem not found in the shop.\n";
    }
  }

  function showStats() {
    const maxHP = 20;
    const hpBarLength = 20;
    const filledLength = Math.round((gameData.hp / maxHP) * hpBarLength);
    const emptyLength = hpBarLength - filledLength;

    const hpBar =
      "[" +
      "█".repeat(filledLength) +
      " ".repeat(emptyLength) +
      `] ${gameData.hp}/${maxHP}`;

    consoleElement.value += `\n\nHP: ${hpBar}\nGold: ${gameData.goldAmount}\nDefense: ${gameData.defense}\n`;
  }

  function changeDirectory(argument) {
    if (argument === "~") {
      currentDirectory = "";
      promptText = "Texordia> ";
      consoleElement.value += "\nChanged directory to root.\n";
    } else {
      const availableDirectories = ["Shop", "Guild"];
      const directoryName =
        argument.charAt(0).toUpperCase() + argument.slice(1).toLowerCase();

      if (availableDirectories.includes(directoryName)) {
        currentDirectory = directoryName;
        promptText = `Texordia\\${currentDirectory}> `;
        consoleElement.value += `\nChanged directory to ${currentDirectory}.\n`;
      } else {
        consoleElement.value += `\nThe system cannot find the path specified: ${directoryName}\n`;
      }
    }

    saveToLocalStorage("currentDirectory", currentDirectory);
  }

  function listShopItems() {
    consoleElement.value += "\nItems available in the Shop:\n";

    consoleElement.value += "+----------------+-------+\n";
    consoleElement.value += "| Item           | Price |\n";
    consoleElement.value += "+----------------+-------+\n";

    shopItems.items.forEach((item) => {
      let itemString = `| ${item.name}`;

      itemString += " ".repeat(15 - item.name.length);
      itemString += `| ${item.price}`;

      itemString += " ".repeat(6 - item.price.toString().length);
      itemString += "|\n";

      consoleElement.value += itemString;
    });

    consoleElement.value += "+----------------+-------+\n";
  }

  function clearScreen() {
    consoleElement.value = promptText;
  }

  function showDirectoryTree() {
    const tree = displayDirectoryTree(currentDirectory);
    consoleElement.value += "\n" + tree;
  }

  function showInventory() {
    let inventoryDisplay = "";
      if (!gameData.userInventory || gameData.userInventory.length === 0) {
      inventoryDisplay = "No items";
    } else {
      inventoryDisplay =
        "\nInventory:\n+---------------+--------+\n| Item          | Amount |\n+---------------+--------+\n";
  
      gameData.userInventory.forEach((itemObj) => {
        inventoryDisplay += `| ${itemObj.item.padEnd(13)} | ${itemObj.quantity.toString().padEnd(6)} |\n`;
      });
  
      inventoryDisplay += "+---------------+--------+";
    }
    consoleElement.value += `\n${inventoryDisplay}\nGold: ${gameData.goldAmount}\n`;
  }  

  function displayDirectoryTree(currentDirectory) {
    function buildTree(directory, prefix = "") {
      let tree = "";
      for (const key in directory) {
        tree += `${prefix}- ${key}\n`;
        if (typeof directory[key] === "object") {
          tree += buildTree(directory[key], prefix + "  ");
        }
      }
      return tree;
    }

    if (currentDirectory === "") {
      return buildTree(directoryStructure.Root);
    } else {
      const subdirectory = getSubdirectory(
        directoryStructure,
        currentDirectory.split("\\"),
      );
      if (subdirectory) {
        return buildTree(subdirectory, "  ");
      } else {
        return `No subdirectories were found.\n`;
      }
    }
  }

  function checkForDeath() {
    if (gameData.hp <= 0) { // Use gameData.hp
      consoleElement.value += "\nYou have died. All progress has been reset.\n";
      localStorage.clear();

      // Reset gameData values
      updateGameData({ goldAmount: 100, lastHuntTime: 0, hp: 20, defense: 10 });
      currentDirectory = "";
      userInventory = [];
      saveGameData();

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }

  function getSubdirectory(directoryStructure, path) {
    let current = directoryStructure;
    for (const dir of path) {
      if (current[dir]) {
        current = current[dir];
      } else {
        return null;
      }
    }
    return current;
  }
});