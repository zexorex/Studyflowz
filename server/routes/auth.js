const express = require('express');
const router = express.Router();
const { googleLogin } = require('../controllers/authController');

// Route: POST /api/auth/google
// Description: Handle Google OAuth code exchange
// Access: Public
router.post('/google', googleLogin);

module.exports = router;
