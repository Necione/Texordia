import { consoleElement } from "../utilities.js";

const commands = [
  {
    name: "adventure",
    description: "Go and continue your ongoing adventure",
  },
  {
    name: "explore",
    description: "Check out your surroundings and gather things",
  },
  {
    name: "cd (argument)",
    description: "Change into a different directory [~ is return]",
  },
  {
    name: "info (argument)",
    description: "Displays information about an item",
  },
  {
    name: "equip (argument)",
    description: "Equips an armor item",
  },
  {
    name: "unequip (argument)",
    description: "Unequips an armor item",
  },
  {
    name: "rm (argument)",
    description: "Discard anything in your inventory for 3 Gold",
  },
  {
    name: "times",
    description: "Display all your cooldowns",
  },
  {
    name: "cls",
    description: "Clear the current console",
  },
  {
    name: "collect",
    description: "Collect earnings from a finished exploration",
  },
  {
    name: "weapon -[buy|catalog|add|remove] (argument)",
    description: "Manage and build your current weapon",
  },
  {
    name: "items -[list|buy] (argument)",
    description: "Interact with various shop items",
  },
  {
    name: "quests -[list|refresh|submit] (argument)",
    description: "View and submit your quests",
  },
  {
    name: "inventory",
    description: "Display your current inventory",
  },
  {
    name: "equipment",
    description: "Display your current equipment",
  },
  {
    name: "stats",
    description: "Display your current stats",
  },
  {
    name: "tree",
    description: "View all directories you can go to",
  },
  {
    name: "skills -(buy) (argument)",
    description: "View your current and unlockable skills",
  },
  {
    name: "useitem (argument)",
    description: "Use a consumable",
  },
];

export function showHelp() {
  const longestCommandNameLength = Math.max(
    ...commands.map((cmd) => cmd.name.length)
  );

  let helpMessage = "\n\n";

  commands.forEach((command) => {
    const paddedCommandName = command.name
      .toUpperCase()
      .padEnd(longestCommandNameLength + 2);
    helpMessage += `${paddedCommandName}${command.description}\n`;
  });

  consoleElement.value += helpMessage;
}
