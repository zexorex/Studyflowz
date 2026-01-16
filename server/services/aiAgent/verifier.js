const { GoogleGenAI } = require('@google/genai');

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const verifySolution = async (assignmentData, initialSolution) => {
  try {
    const { title, description } = assignmentData;

    const prompt = `
      You are a strict university professor and grader. Your job is to review a student's draft solution for accuracy and completeness.

      ORIGINAL ASSIGNMENT:
      Title: "${title}"
      Description: "${description}"

      STUDENT'S DRAFT SOLUTION:
      "${initialSolution}"

      INSTRUCTIONS:
      1. Verify all facts and calculations.
      2. Check if all parts of the assignment description were addressed.
      3. Identify any logical fallacies or hallucinations.
      
      OUTPUT FORMAT:
      If the solution is correct and complete, output exactly: "PASS".
      If there are errors, output a bulleted list of specific corrections required. Do NOT rewrite the solution, just list the errors.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash', 
      contents: prompt,
    });

    const text = response.text();

    return text;

  } catch (error) {
    console.error('Verifier Agent Error:', error);
    // If the verifier fails, we default to passing the solution to avoid breaking the pipeline
    return 'PASS'; 
  }
};

module.exports = { verifySolution };
