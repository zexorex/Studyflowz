const router = require('express').Router();
const { google } = require('googleapis');
const User = require('../models/User'); // We need to create this model too

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  // NOTE: This must match Google Console EXACTLY.
  // Using Backend port 5000 for the callback
  'http://localhost:5000/api/auth/google/callback' 
);

// 1. Redirect to Google
router.get('/google', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/classroom.courses.readonly',
    'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
    'profile', 'email'
  ];
  const url = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes, prompt: 'consent' });
  res.redirect(url);
});

// 2. Google Callback
router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    // Save User to DB
    let user = await User.findOneAndUpdate(
      { googleId: userInfo.data.id },
      { 
        name: userInfo.data.name,
        email: userInfo.data.email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token 
      },
      { upsert: true, new: true }
    );

    // Redirect to Frontend with User ID
    res.redirect(`http://localhost:5173?userId=${user._id}`);
  } catch (error) {
    console.error(error);
    res.redirect('http://localhost:5173?error=auth_failed');
  }
});

module.exports = router;
