const { google } = require('googleapis');
const User = require('../models/User');
const { encryptToken } = require('../utils/encryption');

// Initialize the Google OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

exports.googleLogin = async (req, res) => {
  try {
    const { code } = req.body; // The code sent from the frontend

    // 1. Exchange the code for tokens (Access Token + Refresh Token)
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // 2. Get User Profile Information using the new tokens
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    
    const { id, email, name, picture } = userInfo.data;

    // 3. Check if user already exists in our DB
    let user = await User.findOne({ googleId: id });

    // 4. Encrypt the Refresh Token (if provided)
    // Note: Google only sends a refresh_token on the FIRST authorization 
    // or if access_type=offline and prompt=consent is used.
    let encryptedRefreshToken = null;
    if (tokens.refresh_token) {
      encryptedRefreshToken = encryptToken(tokens.refresh_token);
    }

    if (user) {
      // Update existing user
      // Only update refresh token if a new one was sent
      if (encryptedRefreshToken) {
        user.refreshToken = encryptedRefreshToken;
      }
      // Update avatar/name in case they changed on Google
      user.avatar = picture;
      user.displayName = name;
      await user.save();
    } else {
      // Create new user
      if (!encryptedRefreshToken) {
        // If it's a new user but Google didn't send a refresh token, 
        // we can't function properly. Frontend must force 'prompt=consent'.
        return res.status(400).json({ message: 'Missing Refresh Token. Please revoke access and try again.' });
      }

      user = await User.create({
        googleId: id,
        email: email,
        displayName: name,
        avatar: picture,
        refreshToken: encryptedRefreshToken,
      });
    }

    // 5. Send User data back to frontend (Exclude sensitive tokens)
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.displayName,
        email: user.email,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ message: 'Google Login Failed', error: error.message });
  }
};
