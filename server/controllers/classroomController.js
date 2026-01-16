const googleService = require('../services/googleClassroom');

// @desc    Get list of active courses
// @route   GET /api/classroom/courses
exports.getCourses = async (req, res) => {
  try {
    // We expect the frontend to send the User's DB ID in the header 'user-id'
    const userId = req.headers['user-id'];

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID required' });
    }

    const courses = await googleService.listCourses(userId);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
};

// @desc    Get assignments for a specific course
// @route   GET /api/classroom/courses/:courseId/work
exports.getAssignments = async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const { courseId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID required' });
    }

    const assignments = await googleService.listPendingAssignments(userId, courseId);
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Failed to fetch assignments', error: error.message });
  }
};

// @desc    Get details for a single assignment (Useful for AI loading)
// @route   GET /api/classroom/courses/:courseId/work/:id
exports.getAssignmentDetails = async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const { courseId, id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID required' });
    }

    const work = await googleService.getAssignmentDetails(userId, courseId, id);
    res.json(work);
  } catch (error) {
    console.error('Error fetching assignment details:', error);
    res.status(500).json({ message: 'Failed to fetch assignment details', error: error.message });
  }
};
