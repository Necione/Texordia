import { gameData } from "../gameData.js";
import { saveGameData } from "../utilities.js";

export const events = [
  {
    dialogue: "You encountered a wounded man in the woods, looking for help...",
    triggerRequirements: {
      minLevel: 1,
      minGold: 5,
    },
    choices: [
      {
        description: "Give the man 5 Gold",
        action: () => {
          if (gameData.goldAmount >= 5) {
            gameData.goldAmount -= 5; // Deduct 5 gold
            const fleshItem = { item: "Flesh", quantity: 1 };

            // Add 2 Flesh to inventory
            const existingItemIndex = gameData.userInventory.findIndex(
              (item) => item.item === fleshItem.item
            );
            if (existingItemIndex !== -1) {
              gameData.userInventory[existingItemIndex].quantity +=
                fleshItem.quantity;
            } else {
              gameData.userInventory.push(fleshItem);
            }

            saveGameData(); // Save the changes
            return "You give the man some gold. He thanks you and hands you some flesh.";
          } else {
            return "You don't have enough gold to help the man.";
          }
        },
        outcome: "The man thanks you and quickly disappears into the forest.",
      },
      {
        description: "Ignore the man and walk away",
        action: () => {
          // No change to gameData in this case
          return "You decide to ignore the man and continue on your journey.";
        },
        outcome: "The man watches you leave with a look of disappointment.",
      },
    ],
  },
  {
    dialogue:
      "A wandering trader approaches you, offering a mysterious ring for 20 Gold...",
    triggerRequirements: {
      minLevel: 1,
      minGold: 20,
    },
    choices: [
      {
        description: "Buy the mysterious ring for 20 Gold",
        action: () => {
          if (gameData.goldAmount >= 20) {
            gameData.goldAmount -= 20; // Deduct 20 gold
            const ringItem = { item: "Evil Ring", quantity: 1 };

            const existingItemIndex = gameData.userInventory.findIndex(
              (item) => item.item === ringItem.item
            );
            if (existingItemIndex !== -1) {
              gameData.userInventory[existingItemIndex].quantity +=
                ringItem.quantity;
            } else {
              gameData.userInventory.push(ringItem);
            }

            saveGameData(); // Save the changes
            return "You purchase the mysterious ring. It feels oddly cold to the touch.";
          } else {
            return "You don't have enough gold to buy the ring.";
          }
        },
        outcome: "The trader hands you the ring and disappears into the crowd.",
      },
      {
        description: "Decline the offer and walk away",
        action: () => {
          // No change to gameData in this case
          return "You decide not to purchase the ring and continue on your way.";
        },
        outcome:
          "The trader shrugs and moves on to the next potential customer.",
      },
    ],
  },
  {
    dialogue:
      "A wandering trader approaches you, offering a mysterious ring for 20 Gold...",
    triggerRequirements: {
      minLevel: 1,
      minGold: 20,
    },
    choices: [
      {
        description: "Buy the mysterious ring for 20 Gold",
        action: () => {
          if (gameData.goldAmount >= 20) {
            gameData.goldAmount -= 20; // Deduct 20 gold
            const ringItem = { item: "Ring of Hope", quantity: 1 };

            const existingItemIndex = gameData.userInventory.findIndex(
              (item) => item.item === ringItem.item
            );
            if (existingItemIndex !== -1) {
              gameData.userInventory[existingItemIndex].quantity +=
                ringItem.quantity;
            } else {
              gameData.userInventory.push(ringItem);
            }

            saveGameData(); // Save the changes
            return "You purchase the mysterious ring. It feels oddly warm to the touch.";
          } else {
            return "You don't have enough gold to buy the ring.";
          }
        },
        outcome: "The trader hands you the ring and disappears into the crowd.",
      },
      {
        description: "Decline the offer and walk away",
        action: () => {
          // No change to gameData in this case
          return "You decide not to purchase the ring and continue on your way.";
        },
        outcome:
          "The trader shrugs and moves on to the next potential customer.",
      },
    ],
  },
];
