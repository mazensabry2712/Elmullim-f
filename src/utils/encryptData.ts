import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_ENCRYPT_SECRET_KEY;

/**
 * Encrypts data using AES encryption algorithm
 * @param {any} data - The data to be encrypted
 * @returns {string} The encrypted string
 * @example
 * const sensitiveData = { id: 123, name: "John" };
 * const encrypted = encryptData(sensitiveData);
 * // Returns: "U2FsdGVkX1..." (encrypted string)
 */
export const encryptData = <T>(data: T): string => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  return encrypted;
};

/**
 * Decrypts previously encrypted data
 * @param {string} encryptedData - The encrypted string to decrypt
 * @returns {any} The decrypted data in its original format
 * @example
 * const encryptedString = "U2FsdGVkX1...";
 * const decrypted = decryptData(encryptedString);
 */
export const decryptData = <T>(encryptedData: string): T => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) as T;
};
