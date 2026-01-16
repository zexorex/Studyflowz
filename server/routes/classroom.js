const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');

// Route: GET /api/classroom/courses
// Description: Get all active courses for the logged-in user
router.get('/courses', classroomController.getCourses);

// Route: GET /api/classroom/courses/:courseId/work
// Description: Get pending assignments for a specific course
router.get('/courses/:courseId/work', classroomController.getAssignments);

// Route: GET /api/classroom/courses/:courseId/work/:id
// Description: Get specific assignment details (Title, Description, Links)
router.get('/courses/:courseId/work/:id', classroomController.getAssignmentDetails);

module.exports = router;
