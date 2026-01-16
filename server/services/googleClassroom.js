const { google } = require('googleapis');
const User = require('../models/User');
const { decryptToken } = require('../utils/encryption');

// Helper to initialize the OAuth client with a user's credentials
const getAuthenticatedClient = async (userId) => {
  // 1. Find the user in the database
  const user = await User.findById(userId).select('+refreshToken'); // Explicitly select the hidden field
  
  if (!user || !user.refreshToken) {
    throw new Error('User not found or missing authorization');
  }

  // 2. Decrypt the Refresh Token
  const refreshToken = decryptToken(user.refreshToken);

  // 3. Create OAuth Client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // 4. Set the credentials
  // The client will automatically use this refresh token to generate new access tokens
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return oauth2Client;
};

// Service: Get all active courses for the user
const listCourses = async (userId) => {
  const auth = await getAuthenticatedClient(userId);
  const classroom = google.classroom({ version: 'v1', auth });

  const response = await classroom.courses.list({
    courseStates: ['ACTIVE'], // Only get current classes
    studentId: 'me', // 'me' refers to the authenticated user
  });

  return response.data.courses || [];
};

// Service: Get pending assignments for a specific course
// We filter for 'WORK_NEEDED' to ignore stuff they already finished
const listPendingAssignments = async (userId, courseId) => {
  const auth = await getAuthenticatedClient(userId);
  const classroom = google.classroom({ version: 'v1', auth });

  const response = await classroom.courses.courseWork.list({
    courseId: courseId,
    courseWorkStates: ['PUBLISHED'], // Only published work
    orderBy: 'dueDate asc', // Urgent stuff first
  });

  const allWork = response.data.courseWork || [];

  // Filter logic can be refined here or in the controller.
  // Currently returning all published work. 
  // To strictly check 'pending', we would need to check studentSubmissions,
  // which requires an extra API call per assignment (expensive).
  // For MVP, we return all work and let the frontend filter by date/status.
  
  return allWork;
};

// Service: Get full details of a specific assignment (for the AI)
const getAssignmentDetails = async (userId, courseId, courseWorkId) => {
  const auth = await getAuthenticatedClient(userId);
  const classroom = google.classroom({ version: 'v1', auth });

  // Get the assignment metadata (title, description, links)
  const work = await classroom.courses.courseWork.get({
    courseId,
    id: courseWorkId,
  });

  return work.data;
};

module.exports = {
  listCourses,
  listPendingAssignments,
  getAssignmentDetails
};
