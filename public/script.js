import { gameData, updateGameData } from "./gameData.js";
import { handleQuest } from "./commands/quests.js";
import { handleHunting } from "./commands/hunting.js";
import { showCooldowns } from "./commands/cooldowns.js";
import {
  handleShopItems,
  handleSellAll,
  showItemInfo,
} from "./commands/shop.js";
import { startExploration, collectTreasure } from "./commands/explore.js";
import { showHelp } from "./commands/help.js";
import { consumables } from "./data/items/consumable.js";
import {
  equipArmor,
  unequipArmor,
  showEquippedArmor,
} from "./commands/equip.js";
import { showInventory } from "./commands/inventory.js";
import { saveGameData, consoleElement } from "./utilities.js";
import { showStats } from "./commands/stats.js";
import { handleSkillsCommands } from "./commands/skills.js";

document.addEventListener("DOMContentLoaded", function () {

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
    "Welcome back to Texordia. [ Ver 0.1 ]\nUse 'help' to get started\n\n" +
    promptText;
  consoleElement.focus();
  consoleElement.setSelectionRange(
    consoleElement.value.length,
    consoleElement.value.length
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
    const prompt = gameData.currentDirectory
      ? `Texordia\\${gameData.currentDirectory}> `
      : "Texordia> ";

    consoleElement.value += `\n${prompt}`;
    consoleElement.scrollTop = consoleElement.scrollHeight;
    consoleElement.setSelectionRange(
      consoleElement.value.length,
      consoleElement.value.length
    );

    consoleElement.focus();
  }

  function processCommand(input) {
    const [command, ...args] = input.trim().split(/\s+/);
    const initialCommand = args[0] ? `${command} ${args[0]}` : command;
    const argument = args.join(" ");

    console.log(`Command: ${command}, Argument: ${argument}`);

    switch (command) {
      case "sudo":
        if (
          initialCommand === "sudo hunt" &&
          gameData.currentDirectory === "Guild"
        ) {
          gameData.isAsyncCommandRunning = true;
          handleHunting();
        } else if (
          initialCommand === "sudo explore" &&
          gameData.currentDirectory === "Guild"
        ) {
          startExploration();
        } else {
          handleSudoCommands(initialCommand);
        }
        break;
      case "collect":
        if (gameData.currentDirectory === "Guild") {
          collectTreasure();
        } else {
          consoleElement.value +=
            "\nYou need to be in the Guild directory to collect treasures.\n";
        }
        break;
      case "quests":
        handleQuest(argument, input);
        break;
      case "info":
        showItemInfo(argument);
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
      case "help":
        showHelp();
        break;
      case "skills":
        handleSkillsCommands(argument);
        break;
      case "equip":
        equipArmor(argument);
        break;
      case "equipment":
        showEquippedArmor(argument);
        break;
      case "unequip":
        unequipArmor(argument);
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

    if (!gameData.isAsyncCommandRunning) {
      appendPrompt();
    }
  }

  function handleSudoCommands(initialCommand) {
    if (
      initialCommand === "sudo hunt" &&
      gameData.currentDirectory === "Guild"
    ) {
      handleHunting();
    } else {
      consoleElement.value += `\nInvalid command or wrong directory.\n`;
    }
  }

  function handleUseItem(argument) {
    if (typeof argument !== "string") {
      consoleElement.value += "\nInvalid item name.\n";
      return;
    }

    const itemName = argument.toLowerCase();
    const consumableItem = consumables.find(
      (item) => item.name.toLowerCase() === itemName
    );
    const inventoryItem = gameData.userInventory.find(
      (item) => item.item.toLowerCase() === itemName
    );

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
        showCooldowns();
        break;
      case "tree":
        showDirectoryTree();
        break;
      default:
        consoleElement.value += `\n'${command}' is not recognized as an internal or external command.\n`;
        break;
    }
  }

  function usePotion() {
    const potionIndex = gameData.userInventory.findIndex(
      (itemObj) => itemObj.item.toLowerCase() === "potion"
    );

    if (potionIndex !== -1) {
      gameData.userInventory.splice(potionIndex, 1);

      const restoredHP = Math.floor(Math.random() * 6) + 5;

      if (gameData.hp + restoredHP > gameData.maxHp) {
        gameData.hp = gameData.maxHp;
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

  function changeDirectory(argument) {
    let newDirectory = "";

    if (argument !== "~") {
      const availableDirectories = ["Shop", "Guild"];
      const directoryName =
        argument.charAt(0).toUpperCase() + argument.slice(1).toLowerCase();

      if (availableDirectories.includes(directoryName)) {
        newDirectory = directoryName;
      } else {
        consoleElement.value += `\nThe system cannot find the path specified: ${directoryName}\n`;
        return;
      }
    }

    updateGameData({ currentDirectory: newDirectory });

    promptText = `Texordia${newDirectory ? "\\" + newDirectory : ""}> `;
    consoleElement.value += `\nChanged directory to ${
      newDirectory || "root"
    }.\n`;
  }

  function clearScreen() {
    consoleElement.value = "Welcome back to Texordia. [ Ver 0.1 ]\n";
  }

  function showDirectoryTree() {
    const tree = displayDirectoryTree(gameData.currentDirectory);
    consoleElement.value += "\n" + tree;
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
        gameData.currentDirectory.split("\\")
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
