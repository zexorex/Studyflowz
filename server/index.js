const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend requests
  credentials: true 
}));
app.use(express.json()); // Parse JSON bodies

// --- DATABASE CONNECTION ---
// We connect directly here to keep it simple and robust
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// --- ROUTES ---
// (These are commented out until we create the route files in the next step!)
// const authRoutes = require('./routes/auth');
// const classroomRoutes = require('./routes/classroom');
// const aiRoutes = require('./routes/ai');

// app.use('/api/auth', authRoutes);
// app.use('/api/classroom', classroomRoutes);
// app.use('/api/ai', aiRoutes);

// Health Check Route
app.get('/', (req, res) => {
  res.send('Studyflowz API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Error Handling Middleware (Optional but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
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
