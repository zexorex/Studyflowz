const googleService = require('../services/googleClassroom');
const { runAssignmentPipeline } = require('../services/aiAgent/pipeline');

// @desc    Generate a solution for a specific assignment
// @route   POST /api/ai/solve
exports.generateSolution = async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const { courseId, assignmentId, studyMode } = req.body;

    // 1. Validation
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID required' });
    }
    if (!courseId || !assignmentId) {
      return res.status(400).json({ message: 'Missing courseId or assignmentId' });
    }

    // 2. Fetch the actual assignment data from Google
    // We do this server-side so the Frontend doesn't have to pass massive text blobs
    console.log(`[AI Controller] Fetching assignment details for ${assignmentId}...`);
    const assignment = await googleService.getAssignmentDetails(userId, courseId, assignmentId);

    // 3. Prepare data for the AI Agent
    const assignmentData = {
      title: assignment.title,
      description: assignment.description || "No description provided.",
      // In a future version, you could parse assignment.materials here (e.g., PDF links)
    };

    // 4. Trigger the AI Pipeline
    // This might take 10-20 seconds, so the frontend needs a loading state
    const result = await runAssignmentPipeline(assignmentData, studyMode);

    // 5. Send back the final formatted text
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate solution', error: error.message });
  }
};
