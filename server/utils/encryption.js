const CryptoJS = require('crypto-js');

const encryptToken = (token) => {
  if (!token) return null;
  // Encrypts the token using the secret key from your .env file
  return CryptoJS.AES.encrypt(token, process.env.ENCRYPTION_KEY).toString();
};

const decryptToken = (encryptedToken) => {
  if (!encryptedToken) return null;
  // Decrypts the token back to the original string
  const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encryptToken, decryptToken };
