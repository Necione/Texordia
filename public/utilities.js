const encryptionKey = "Wyvern";

export function loadFromLocalStorage(key, defaultValue) {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
        const decryptedValue = decryptData(storedValue);
        try {
            return JSON.parse(decryptedValue);
        } catch(e) {
            console.error("Error parsing data from localStorage:", e);
            return defaultValue;
        }
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