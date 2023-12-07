import { consoleElement } from "../utilities.js";

const commands = [
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
    name: "cd (argument)",
    description: "Change into a different directory [~ is go back]",
  },
  {
    name: "sudo (hunt|explore)",
    description: "Go on a hunt or start an exploration",
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
    name: "useitem (argument)",
    description: "Use a consumable",
  },
];

export function showHelp() {
  const longestCommandNameLength = Math.max(
    ...commands.map((cmd) => cmd.name.length),
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