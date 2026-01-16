const { GoogleGenAI } = require('@google/genai');

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const humanizeSolution = async (solutionText, studyMode = false) => {
  try {
    let prompt;

    if (studyMode) {
      // MODE A: Study Helper (The "Tutor" Persona)
      prompt = `
        You are a supportive academic tutor.
        The student has an assignment solution below, but they have requested "Study Mode".
        
        DO NOT give the direct solution.
        Instead, rewrite the content into a guide.
        1. Explain the underlying concepts clearly.
        2. Provide similar example problems if applicable.
        3. Give hints or "leading questions" that help the student arrive at the answer themselves.
        4. Use a helpful, encouraging tone.

        Raw Solution Context:
        "${solutionText}"
      `;
    } else {
      // MODE B: Final Polish (The "Student" Persona)
      prompt = `
        You are a student rewriting a draft assignment.
        Your goal is to make the text sound natural, clear, and academic, but not robotic.

        INSTRUCTIONS:
        1. Remove robotic transitions like "In conclusion," "Furthermore," or "It is important to note."
        2. Use varied sentence structures.
        3. Ensure the formatting is clean Markdown (use headers, bolding for key terms).
        4. Keep the factual content exactly as provided in the source text, just change the style.

        Source Text:
        "${solutionText}"
      `;
    }

    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash', 
      contents: prompt,
    });

    return response.text();

  } catch (error) {
    console.error('Humanizer Agent Error:', error);
    // Fallback: If AI fails, return the raw verified text so the user gets *something*
    return solutionText;
  }
};

module.exports = { humanizeSolution };
