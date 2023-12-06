import { gameData } from './gameData.js';

const encryptionKey = "Wyvern";

export var consoleElement = document.getElementById("console");

export let dropsData = [];

fetch("data/items/drops.json") // Updated path
  .then((response) => response.json())
  .then((data) => {
    dropsData = data.drops; // Assuming the JSON structure remains the same
  })
  .catch((error) => console.error("Error loading drops data:", error));

  export let armorData = [];

  fetch("data/items/armor.json") // Updated path
    .then((response) => response.json())
    .then((data) => {
      armorData = data.armor; // Assuming the JSON structure remains the same
    })
    .catch((error) => console.error("Error loading drops data:", error));

export let consumableData = [];

fetch("data/items/consumable.json")
  .then(response => response.json())
  .then(data => {
    consumableData = data.consumables;
  })
  .catch(error => console.error("Error loading consumable data:", error));

export let armorsData = [];

export async function loadArmorsData() {
  try {
      const response = await fetch("data/armor.json");
      const data = await response.json();
      armorsData = data.armors;
  } catch (error) {
      console.error("Error loading armor data:", error);
  }
}

export function loadFromLocalStorage(key, defaultValue) {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
        const decryptedValue = decryptData(storedValue);
        const parsedValue = JSON.parse(decryptedValue);
        console.log("Loaded data for key", key, ":", parsedValue); // Debug
        return parsedValue;
    }
    return defaultValue;
}

  export function encryptData(data) {
    return CryptoJS.AES.encrypt(data, encryptionKey).toString();
  }

  export function decryptData(encryptedData) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

export function saveToLocalStorage(key, value) {
  let valueToStore = JSON.stringify(value);
  localStorage.setItem(key, encryptData(valueToStore));
}

export function saveGameData() {
  saveToLocalStorage("gameData", gameData);
}