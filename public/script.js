import { gameData, updateGameData } from "./gameData.js";
import { handleQuest } from "./commands/quests.js";
import { handleAdventure } from "./commands/adventure.js";
import { showCooldowns } from "./commands/cooldowns.js";
import { removeItemFromInventory } from "./commands/rm.js";
import {
  handleShopItems,
  handleSellAll,
  showItemInfo,
} from "./commands/shop.js";
import { startExploration, collectTreasure } from "./commands/explore.js";
import { showHelp } from "./commands/help.js";
import { handleWeaponCommands } from "./commands/weapon.js";
import {
  equipArmor,
  unequipArmor,
  showEquippedArmor,
} from "./commands/equip.js";
import { showInventory } from "./commands/inventory.js";
import { consoleElement, saveGameData } from "./utilities.js";
import { handleUseItem } from "./commands/useitem.js";
import { showStats } from "./commands/stats.js";
import { handleSkillsCommands } from "./commands/skills.js";
import { defaultData } from "./gameData.js";

document.addEventListener("DOMContentLoaded", function () {
  if (
    !gameData.currentVersion ||
    gameData.currentVersion !== defaultData.currentVersion
  ) {
    localStorage.clear();
    location.reload();
    return;
  }
  var promptText = gameData.currentDirectory
    ? `Texordia\\${gameData.currentDirectory}> `
    : "Texordia> ";

  const directoryStructure = {
    Root: {
      Shop: {},
      Blacksmith: {},
      Guild: {},
    },
  };

  if (!gameData.registeredName) {
    // Prompt for name input
    consoleElement.value =
      "Welcome to Texordia, to get started, please enter your name:\n\nTexordia> ";
  } else {
    // Existing welcome message
    consoleElement.value =
      `Welcome back to Texordia, ${gameData.registeredName}\nUse 'help' to view all commands.\n\n` +
      promptText;
  }

  consoleElement.focus();
  consoleElement.setSelectionRange(
    consoleElement.value.length,
    consoleElement.value.length
  );

  consoleElement.addEventListener("keydown", function (e) {
    // Find the position of "Your Response>" in the console text
    const responsePromptPosition =
      consoleElement.value.lastIndexOf("Your Response>");

    // If the prompt is found, add its length to determine the start position for editing
    const editableStartPosition =
      responsePromptPosition !== -1
        ? responsePromptPosition + "Your Response>".length
        : 0;

    var currentLineStart =
      this.value.lastIndexOf(promptText) + promptText.length;

    if (e.ctrlKey && e.key === "a") {
      e.preventDefault();
      this.setSelectionRange(currentLineStart, this.value.length);
      return;
    }

    if (
      (e.key === "Backspace" && this.selectionStart <= currentLineStart) ||
      (e.key === "Delete" && this.selectionStart < currentLineStart)
    ) {
      e.preventDefault();
      return;
    }

    if (this.selectionStart < currentLineStart && !e.ctrlKey) {
      e.preventDefault();
      this.setSelectionRange(currentLineStart, currentLineStart);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      var input = this.value.substring(currentLineStart).trim();

      // Name checking
      if (!gameData.registeredName) {
        if (input.trim().length > 0 && /^[A-Za-z]+$/.test(input.trim())) {
          // Only letters from the alphabet are allowed
          gameData.registeredName = input.trim();
          consoleElement.value +=
            `\n\nWelcome, ${gameData.registeredName}. May you have a safe journey ahead!\nUse 'help' to get started.\n\n` +
            promptText;

          consoleElement.focus();
          consoleElement.setSelectionRange(
            consoleElement.value.length,
            consoleElement.value.length
          );

          saveGameData(); // Save the registered name
        } else {
          consoleElement.value +=
            "\nPlease enter a valid name (letters only).\n\nTexordia> ";
          return;
        }
      } else {
        processCommand(input);
      }

      this.scrollTop = this.scrollHeight;
      this.setSelectionRange(this.value.length, this.value.length);
    } else {
      if (consoleElement.selectionStart < currentLineStart) {
        e.preventDefault();
      }
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
      case "adventure":
      case "adv":
        if (gameData.currentDirectory === "Guild") {
          gameData.isAsyncCommandRunning = true;
          handleAdventure();
        } else {
          consoleElement.value +=
            "\nYou need to be in the Guild directory to go on an adventure.\n";
        }
        break;
      case "exp":
      case "explore":
        if (gameData.currentDirectory === "Guild") {
          startExploration();
        } else {
          consoleElement.value +=
            "\nYou need to be in the Guild directory to go on an adventure.\n";
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
      case "i":
      case "info":
        showItemInfo(argument);
        break;
      case "sellall":
        handleSellAll(argument);
        break;
      case "itemuse":
      case "useitem":
        handleUseItem(argument);
        break;
        case "item":
      case "items":
        handleShopItems(argument, input);
        break;
      case "help":
        showHelp();
        break;
      case "skill":
      case "skills":
        handleSkillsCommands(argument);
        break;
      case "equip":
        equipArmor(argument);
        break;
      case "rm":
        removeItemFromInventory(argument);
        break;
      case "equipment":
        showEquippedArmor(argument);
        break;
      case "weapon":
      case "weapons":
        if (gameData.currentDirectory === "Blacksmith") {
          handleWeaponCommands(argument);
        } else {
          consoleElement.value +=
            "\nYou need to be in the Blacksmith directory to manage weapons.\n";
        }
        break;
      case "unequip":
        unequipArmor(argument);
        break;
      case "cd":
        changeDirectory(argument);
        break;
      case "stats":
      case "things":
      case "inv":
      case "gold":
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

  function handleGeneralCommands(command, argument) {
    switch (command) {
      case "cd":
        changeDirectory(argument);
        break;
      case "stats":
        showStats();
        break;
      case "things":
      case "inv":
      case "gold":
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

  function changeDirectory(argument) {
    let newDirectory = "";

    if (argument !== "~") {
      const availableDirectories = ["Shop", "Guild", "Blacksmith"];
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
