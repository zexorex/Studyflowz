const { GoogleGenAI } = require('@google/genai');

// Initialize the new Gemini Client
// It automatically looks for GOOGLE_API_KEY or GEMINI_API_KEY in process.env
// But we can pass it explicitly to be safe.
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const solveAssignment = async (assignmentData) => {
  try {
    const { title, description, materials } = assignmentData;

    // Construct the prompt
    const prompt = `
      You are an expert academic tutor. Your task is to solve the following assignment.
      
      ROLE:
      - Focus purely on factual accuracy, mathematical correctness, and completeness.
      - Ignore tone; be direct and technical.
      - If the assignment asks for an essay, provide a comprehensive outline and key arguments.
      - If it is a math/science problem, show step-by-step work.

      ASSIGNMENT DETAILS:
      Title: "${title}"
      Description: "${description}"
      
      INSTRUCTIONS:
      Provide the solution in a structured format. 
      Focus on getting the right answer.
    `;

    // The new SDK syntax is slightly different:
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash', // The new fast/cheap standard (or 'gemini-1.5-flash')
      contents: prompt,
    });

    // Extract text from the new response structure
    const text = response.text();

    return text;

  } catch (error) {
    console.error('Solver Agent Error:', error);
    throw new Error('Failed to generate initial solution.');
  }
};

module.exports = { solveAssignment };
