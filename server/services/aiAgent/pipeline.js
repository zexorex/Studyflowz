const { solveAssignment } = require('./solver');
const { verifySolution } = require('./verifier');
const { humanizeSolution } = require('./humanizer');

// Safety Limit: Prevent infinite loops if the AI gets stuck
const MAX_RETRIES = 2;

const runAssignmentPipeline = async (assignmentData, studyMode = false) => {
  console.log(`[AI Pipeline] Starting for: "${assignmentData.title}"`);

  // Step 1: Initial Solve
  console.log('[AI Pipeline] Step 1: Solving...');
  let currentSolution = await solveAssignment(assignmentData);
  let attempts = 0;
  let verified = false;

  // Step 2: Verification Loop
  while (!verified && attempts < MAX_RETRIES) {
    console.log(`[AI Pipeline] Step 2: Verifying (Attempt ${attempts + 1})...`);
    const critique = await verifySolution(assignmentData, currentSolution);

    if (critique.trim() === 'PASS') {
      verified = true;
      console.log('[AI Pipeline] Verification Passed.');
    } else {
      console.log('[AI Pipeline] Verification Failed. Logic errors found.');
      attempts++;
      
      // Self-Correction: Ask the Solver to fix the errors
      // We modify the assignment description temporarily to include the critique
      const correctionContext = {
        ...assignmentData,
        description: `
          PREVIOUS ATTEMPT:
          ${currentSolution}

          CRITIQUE (FIX THESE ERRORS):
          ${critique}

          ORIGINAL INSTRUCTIONS:
          ${assignmentData.description}
        `
      };

      console.log('[AI Pipeline] Re-solving with corrections...');
      currentSolution = await solveAssignment(correctionContext);
    }
  }

  if (!verified) {
    console.warn('[AI Pipeline] Warning: Max retries reached. Proceeding with best available solution.');
  }

  // Step 3: Humanize
  console.log('[AI Pipeline] Step 3: Humanizing (Study Mode: ' + studyMode + ')...');
  const finalOutput = await humanizeSolution(currentSolution, studyMode);

  return finalOutput;
};

module.exports = { runAssignmentPipeline };
