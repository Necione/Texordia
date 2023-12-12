import { gameData, updateGameData } from "./gameData.js";
import { handleQuestsCommands } from "./commands/quests.js";
import { handleAdventure } from "./commands/adventure.js";
import { showCooldowns } from "./commands/cooldowns.js";
import { removeItemFromInventory } from "./commands/rm.js";
import {
  handleShopItems,
  sellAllItems,
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
    Root: {},
  };

  consoleElement.value =
    `Welcome back to Texordia\nUse 'help' to view all commands.\n\n` +
    promptText;

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

      processCommand(input);

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
        gameData.isAsyncCommandRunning = true;
        handleAdventure();
        break;
      case "exp":
      case "explore":
        startExploration();
        break;
      case "collect":
        collectTreasure();
        break;
      case "quests":
        handleQuestsCommands(argument, input);
        break;
      case "i":
      case "info":
        showItemInfo(argument);
        break;
      case "sellall":
        sellAllItems(argument);
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
        handleWeaponCommands(argument);
        break;
      case "unequip":
        unequipArmor(argument);
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
      default:
        consoleElement.value += `\n'${command}' is not recognized as an internal or external command.\n`;
        break;
    }
  }

  function clearScreen() {
    consoleElement.value = "I have cleared your screen for you.\n";
  }
});
