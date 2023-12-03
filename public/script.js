document.addEventListener("DOMContentLoaded", function () {
  const encryptionKey = "Wyvern";

  // Function to encrypt data
  function encryptData(data) {
    return CryptoJS.AES.encrypt(data, encryptionKey).toString();
  }

  // Function to decrypt data
  function decryptData(encryptedData) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  function loadFromLocalStorage(key, defaultValue) {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      const decryptedValue = decryptData(storedValue);
      return key === "userInventory" || key === "gameData"
        ? JSON.parse(decryptedValue)
        : decryptedValue;
    }
    return defaultValue;
  }

  function saveToLocalStorage(key, value) {
    let valueToStore;
    if (key === "userInventory" || key === "gameData") {
      valueToStore = JSON.stringify(value);
    } else {
      valueToStore = value.toString();
    }
    localStorage.setItem(key, encryptData(valueToStore));
  }

  var savedData = loadFromLocalStorage("gameData", {
    goldAmount: 100,
    lastHuntTime: 0,
    hp: 20,
  });
  var goldAmount = savedData.goldAmount;
  var lastHuntTime = savedData.lastHuntTime;
  var hp = savedData.hp;
  var currentDirectory = loadFromLocalStorage("currentDirectory", "");
  var userInventory = loadFromLocalStorage("userInventory", []);

  var consoleElement = document.getElementById("console");
  var promptText = currentDirectory
    ? `Texordia\\${currentDirectory}> `
    : "Texordia> ";

  function saveGameData() {
    const gameData = {
      goldAmount: goldAmount,
      lastHuntTime: lastHuntTime,
      hp: hp,
    };
    saveToLocalStorage("gameData", gameData);
  }

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

  // Set focus back to the console whenever it loses focus
  document.addEventListener("click", function () {
    consoleElement.focus();
  });

  function processCommand(input) {
    var commandParts = input.split(/\s+/);
    var fullCommand = commandParts.slice(0, 2).join(" ").toLowerCase(); // For handling two-word commands
    var command = commandParts[0].toLowerCase(); // For handling single-word commands
    var argument = commandParts.slice(1).join(" ").toLowerCase(); // Arguments of the command

    if (fullCommand === "sudo hunt") {
      if (currentDirectory === "Guild") {
        handleHunting();
      } else {
        consoleElement.value +=
          "\nYou must be in the Guild directory to hunt.\n";
      }
      return;
    } else if (fullCommand === "sudo explore") {
      handleExploration();
      return;
    }

    // Handling commands within specific directories
    if (currentDirectory === "Shop" && command === "items") {
      if (argument.startsWith("-buy")) {
        var itemName = extractItemNameFromInput(input);
        if (itemName) {
          attemptToPurchaseItem(itemName);
        } else {
          consoleElement.value +=
            '\nInvalid format. Use: items -buy "Item Name"';
        }
      } else if (argument === "-list") {
        listShopItems();
      }
      return;
    }

    if (command === "useitem") {
      if (argument.toLowerCase() === "potion") {
        usePotion();
      } else {
        consoleElement.value += "\nYou don't have that item in your inventory.\n";
      }
      return;
    }

    // Handling general commands
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
        consoleElement.value += `\n'${input}' is not recognized as an internal or external command.\n`;
        break;
    }
  }

  function showHuntCooldown() {
    var currentTime = new Date().getTime();
    var timePassed = Math.floor((currentTime - lastHuntTime) / 1000); // Time passed in seconds
    var cooldown = 60; // Cooldown duration in seconds

    if (timePassed < cooldown) {
      var timeLeft = cooldown - timePassed;
      consoleElement.value += `\nTime remaining until next hunt: ${timeLeft} seconds\n`;
    } else {
      consoleElement.value += `\nReady for hunting!\n`;
    }
  }

  function extractItemNameFromInput(input) {
    var match = input.match(/-buy\s+(.+)/);
    return match ? match[1] : null;
  }  

  function usePotion() {
    const potionIndex = userInventory.findIndex((item) => item.toLowerCase() === "potion");
  
    if (potionIndex !== -1) {
      // Remove the used Potion from the inventory
      userInventory.splice(potionIndex, 1);
  
      // Calculate the amount of HP to restore (between 5 and 10)
      const restoredHP = Math.floor(Math.random() * 6) + 5;
  
      // Check if restoring HP would exceed the maximum limit
      if (hp + restoredHP > 20) {
        hp = 20; // Set HP to the maximum limit
      } else {
        hp += restoredHP; // Restore HP
      }
  
      consoleElement.value += `\nYou used a Potion and restored ${restoredHP} HP. Current HP: ${hp}.\n`;
  
      // Save the updated inventory and HP to local storage
      saveToLocalStorage("userInventory", userInventory);
      saveGameData();
    } else {
      consoleElement.value += "\nYou don't have any Potions in your inventory.\n";
    }
  }  

  async function handleHunting() {
    var currentTime = new Date().getTime();
    if (currentTime - lastHuntTime < 60000) {
      var timeLeft = Math.ceil((60000 - (currentTime - lastHuntTime)) / 1000); // Calculate time left in seconds
      consoleElement.value +=
        `\nYou need to rest. Try hunting again in ${timeLeft} seconds.\n`;
    } else {
      var goldEarned = Math.floor(Math.random() * 11) + 5; // Random gold between 5 and 15
      var hpLoss = Math.floor(Math.random() * 6) + 2; // Random HP loss between 2 and 7
      goldAmount += goldEarned;
      hp -= hpLoss; // Deduct HP loss from the current HP
      lastHuntTime = currentTime;
      consoleElement.value += `\nYou went hunting and earned ${goldEarned} gold! Lost ${hpLoss} HP.\n  Total gold: ${goldAmount}.\n  Current HP: ${hp}.\n`;
  
      // Save the game data to local storage
      checkForDeath();
      saveGameData();
    }
  }  

  function attemptToPurchaseItem(itemName) {
    const item = shopItems.items.find(
      (item) => item.name.toLowerCase() === itemName.toLowerCase(),
    );

    if (item) {
      if (goldAmount >= item.price) {
        goldAmount -= item.price; // Deduct the item price from the gold
        userInventory.push(item.name); // Add the item to the inventory
        consoleElement.value += `\nPurchased ${item.name} for ${item.price} coins. Remaining gold: ${goldAmount}.\n`;

        // Save the updated gold amount and inventory to local storage
        saveGameData();
        saveToLocalStorage("userInventory", userInventory);
      } else {
        consoleElement.value += "\nNot enough gold to purchase this item.\n";
      }
    } else {
      consoleElement.value += "\nItem not found in the shop.\n";
    }
  }

  function showStats() {
    const maxHP = 20;
    const hpBarLength = 20; // Total length of the HP bar
    const filledLength = Math.round((hp / maxHP) * hpBarLength); // Calculate the filled portion
    const emptyLength = hpBarLength - filledLength; // Calculate the empty portion

    // Create the HP bar string
    const hpBar =
      "[" +
      "█".repeat(filledLength) +
      " ".repeat(emptyLength) +
      `] ${hp}/${maxHP}`;

    // Display HP bar and other stats
    consoleElement.value += `\n\nHP: ${hpBar}\nGold: ${goldAmount}\n`;
  }

  function changeDirectory(argument) {
    // Allow navigation to Shop and Guild directories only
    if (
      (argument === "shop" || argument === "guild") &&
      currentDirectory === ""
    ) {
      currentDirectory = argument.charAt(0).toUpperCase() + argument.slice(1); // Capitalize first letter
      promptText = `Texordia\\${currentDirectory}> `;
      consoleElement.value += `\nChanged directory to ${currentDirectory}.\n`;
    } else if (argument === "~") {
      currentDirectory = "";
      promptText = "Texordia> ";
      consoleElement.value += "\nChanged directory to root.\n";
    } else {
      consoleElement.value += `\nThe system cannot find the path specified.\n`;
      return;
    }

    // Save the current directory to local storage
    saveToLocalStorage("currentDirectory", currentDirectory);
  }

  function listShopItems() {
    consoleElement.value += "\nItems available in the Shop:\n";
    
    // Table header
    consoleElement.value += "+----------------+-------+\n";
    consoleElement.value += "| Item           | Price |\n";
    consoleElement.value += "+----------------+-------+\n";
  
    // List each item
    shopItems.items.forEach((item) => {
      let itemString = `| ${item.name}`;
      // Padding for item name to align columns
      itemString += ' '.repeat(15 - item.name.length);
      itemString += `| ${item.price}`;
      // Padding for price to align columns
      itemString += ' '.repeat(6 - item.price.toString().length);
      itemString += '|\n';
  
      consoleElement.value += itemString;
    });
  
    // Table footer
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
    let inventoryDisplay =
      userInventory.length > 0 ? userInventory.join(", ") : "No items";
    consoleElement.value += `\nInventory: ${inventoryDisplay}\nGold: ${goldAmount}\n`;
  }

  function handleExploration() {
    var itemsToFind = ["Rock", "Iron Ore"];
    var foundItem = itemsToFind[Math.floor(Math.random() * itemsToFind.length)];
    userInventory.push(foundItem);
    consoleElement.value += `\nYou explored and found ${foundItem}!\n`;

    // Save the updated inventory to local storage
    localStorage.setItem("userInventory", JSON.stringify(userInventory));
  }

  function displayDirectoryTree(currentDirectory) {
    // This function should be adapted to fit the structure of your directory system
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
    if (hp <= 0) {
      consoleElement.value +=
        "\nYou have died. All progress has been reset.\n";
      localStorage.clear(); // Clears all local storage data
      // Reset game variables to initial state
      goldAmount = 100;
      lastHuntTime = 0;
      hp = 20;
      currentDirectory = "";
      userInventory = [];
      saveGameData(); // Save initial state to local storage (optional)
  
      // Reload the page
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Reload the page after a delay (2 seconds in this example)
    }
  }
  
  function getSubdirectory(directoryStructure, path) {
    let current = directoryStructure;
    for (const dir of path) {
      if (current[dir]) {
        current = current[dir];
      } else {
        return null; // Subdirectory does not exist
      }
    }
    return current;
  }
});