const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  // We store the Refresh Token encrypted.
  // Access tokens are short-lived and can be regenerated using this.
  refreshToken: {
    type: String, 
    required: true, 
    select: false // Security: Don't return this field by default in queries
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
