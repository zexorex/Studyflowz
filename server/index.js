const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true // Important for maintaining sessions/cookies if needed
}));
app.use(express.json()); // Allows parsing of JSON bodies

// Basic Health Check Route
app.get('/', (req, res) => {
  res.send('Studyflowz API is running...');
});

// Import Routes (We will create these files later)
// const authRoutes = require('./routes/auth');
// const classroomRoutes = require('./routes/classroom');
// const aiRoutes = require('./routes/ai');

// Use Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/classroom', classroomRoutes);
// app.use('/api/ai', aiRoutes);

// Database Connection & Server Start
// We will import the DB connection here in the next step
const startServer = async () => {
  try {
    // await connectDB(); // Placeholder for DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
