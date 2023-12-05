import { gameData } from './gameData.js';

const encryptionKey = "Wyvern";

export var consoleElement = document.getElementById("console");

export let itemsData = [];

fetch("items.json")
  .then((response) => response.json())
  .then((data) => {
    itemsData = data.items;
  })
  .catch((error) => console.error("Error loading items data:", error));

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