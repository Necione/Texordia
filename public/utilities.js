const encryptionKey = "Wyvern";

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

export function saveGameData(gameData) {
  console.log("Saving game data:", gameData); // Debug
  saveToLocalStorage("gameData", gameData);
}