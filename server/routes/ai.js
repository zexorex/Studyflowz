const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Route: POST /api/ai/solve
// Description: Trigger the AI pipeline for a specific assignment
// Body required: { courseId, assignmentId, studyMode }
router.post('/solve', aiController.generateSolution);

module.exports = router;
