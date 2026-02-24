import { ensurePost, getModelOrFail } from "./_shared.js";

export default async function handler(req, res) {
  if (!ensurePost(req, res)) return;

  const { question, correctAnswer, userAnswer } = req.body || {};
  if (!question || !correctAnswer) {
    return res.status(400).json({ error: "Missing question or correctAnswer." });
  }

  const model = getModelOrFail(res);
  if (!model) return;

  const prompt = `
Explain why "${correctAnswer}" is the correct answer to: "${question}".
${userAnswer && userAnswer !== correctAnswer ? `Also explain briefly why "${userAnswer}" is incorrect.` : ""}
Keep it concise (under 100 words).
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return res.status(200).json({ explanation: response.text().trim() });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: message || "Failed to generate explanation." });
  }
}
