import { gameData, updateGameData } from "./gameData.js";
import { refreshQuests, showQuests } from "./commands/quests.js";
import { handleHunting } from "./commands/hunting.js";
import { handleShopItems, handleSellAll } from "./commands/shop.js";
import {
  saveGameData,
  consoleElement,
  dropsData,
  consumableData,
  loadArmorsData,
} from "./utilities.js";

document.addEventListener("DOMContentLoaded", function () {

  let isAsyncCommandRunning = false;

  var promptText = gameData.currentDirectory
    ? `Texordia\\${gameData.currentDirectory}> `
    : "Texordia> ";

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
  
      this.scrollTop = this.scrollHeight;
      this.setSelectionRange(this.value.length, this.value.length);
    }
  });

  document.addEventListener("click", function () {
    consoleElement.focus();
  });

  function appendPrompt() {
    const prompt = gameData.currentDirectory ? `Texordia\\${gameData.currentDirectory}> ` : "Texordia> ";

    consoleElement.value += `\n${prompt}`;
    consoleElement.scrollTop = consoleElement.scrollHeight;
    consoleElement.setSelectionRange(consoleElement.value.length, consoleElement.value.length);

    consoleElement.focus();
  }

  function finishHunt() {
    isAsyncCommandRunning = false;
  }

  function processCommand(input) {
    const [command, ...args] = input.trim().split(/\s+/);
    const initialCommand = args[0] ? `${command} ${args[0]}` : command;
    const argument = args.join(" ");

    console.log(`Command: ${command}, Argument: ${argument}`);

    switch (command) {
      case "armor":
        loadArmorsData().then(() => {
        if (argument.startsWith("-equip")) {
          const itemName = argument.substring(7).trim();
          equipArmor(itemName);
        } else if (argument.startsWith("-unequip")) {
          const itemName = argument.substring(9).trim();
          unequipArmor(itemName);
        } else {
          consoleElement.value += `\nInvalid command structure. Ise: 'armor -[equip|unequip] [argument]'\n`;
        }
      })
        break;
      case "sudo":
        if (initialCommand === "sudo hunt" && gameData.currentDirectory === "Guild") {
            isAsyncCommandRunning = true;
            handleHunting(finishHunt); 
          } else {
            handleSudoCommands(initialCommand);
        }
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

    if (!isAsyncCommandRunning) {
        appendPrompt();
    }
}

  function handleSudoCommands(initialCommand) {
    if (initialCommand === "sudo hunt" && gameData.currentDirectory === "Guild") {
      handleHunting();
    } else {
      consoleElement.value += `\nInvalid command or wrong directory.\n`;
    }
  }

  function handleQuestsCommands(argument) {
    if (gameData.currentDirectory !== "Guild") {
      consoleElement.value +=
        "\nYou must be in the Guild directory for quests.\n";
      return;
    }
    argument === "-refresh"
      ? refreshQuests(consoleElement, dropsData)
      : showQuests(consoleElement);
  }

  function handleUseItem(argument) {
    if (typeof argument !== "string") {
      consoleElement.value += "\nInvalid item name.\n";
      return;
    }
  
    const itemName = argument.toLowerCase();
    const consumableItem = consumableData.find(item => item.name.toLowerCase() === itemName);
    const inventoryItem = gameData.userInventory.find(item => item.item.toLowerCase() === itemName);
  
    if (consumableItem && inventoryItem) {
      if (itemName === "potion") {
        usePotion();
      }
    } else {
      consoleElement.value += "\nYou don't have that item in your inventory.\n";
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

  function usePotion() {
    const potionIndex = gameData.userInventory.findIndex(
      (itemObj) => itemObj.item.toLowerCase() === "potion",
    );

    if (potionIndex !== -1) {
      gameData.userInventory.splice(potionIndex, 1);

      const restoredHP = Math.floor(Math.random() * 6) + 5;

      if (gameData.hp + restoredHP > 20) {
        gameData.hp = 20;
      } else {
        gameData.hp += restoredHP;
      }

      consoleElement.value += `\nYou used a Potion and restored ${restoredHP} HP. Current HP: ${gameData.hp}.\n`;

      saveGameData();
    } else {
      consoleElement.value +=
        "\nYou don't have any Potions in your inventory.\n";
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

    consoleElement.value += `\n\nHP: ${hpBar}\nDefense: ${gameData.defense}\n`;
  }

  function changeDirectory(argument) {
    let newDirectory = "";
  
    if (argument !== "~") {
      const availableDirectories = ["Shop", "Guild"];
      const directoryName = argument.charAt(0).toUpperCase() + argument.slice(1).toLowerCase();
  
      if (availableDirectories.includes(directoryName)) {
        newDirectory = directoryName;
      } else {
        consoleElement.value += `\nThe system cannot find the path specified: ${directoryName}\n`;
        return;
      }
    }
  
    updateGameData({ currentDirectory: newDirectory });
  
    promptText = `Texordia${newDirectory ? '\\' + newDirectory : ''}> `;
    consoleElement.value += `\nChanged directory to ${newDirectory || 'root'}.\n`;
  }
  
  function clearScreen() {
    consoleElement.value =
    "Welcome back to Texordia. [ Ver 0.1 ]\n";
  }

  function showDirectoryTree() {
    const tree = displayDirectoryTree(gameData.currentDirectory);
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
        inventoryDisplay += `| ${itemObj.item.padEnd(13)} | ${itemObj.quantity
          .toString()
          .padEnd(6)} |\n`;
      });

      inventoryDisplay += "+---------------+--------+";
    }
    consoleElement.value += `\n${inventoryDisplay}\nGold: ${gameData.goldAmount}\n`;
  }

  function displayDirectoryTree() {
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

    if (gameData.currentDirectory === "") {
      return buildTree(directoryStructure.Root);
    } else {
      const subdirectory = getSubdirectory(
        directoryStructure,
        gameData.currentDirectory.split("\\"),
      );
      if (subdirectory) {
        return buildTree(subdirectory, "  ");
      } else {
        return `No subdirectories were found.\n`;
      }
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
