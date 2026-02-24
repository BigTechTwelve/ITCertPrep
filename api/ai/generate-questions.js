import { ensurePost, getModelOrFail, safeJsonArray } from "./_shared.js";

export default async function handler(req, res) {
  if (!ensurePost(req, res)) return;

  const { topic, difficulty, count } = req.body || {};
  if (!topic || !difficulty || !count) {
    return res.status(400).json({ error: "Missing topic, difficulty, or count." });
  }

  const model = getModelOrFail(res);
  if (!model) return;

  const prompt = `
Generate ${count} multiple-choice questions about "${topic}" at a "${difficulty}" difficulty level.

Return ONLY valid JSON array (no markdown) of:
{
  "question": "Question text",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": "Why this is correct"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questions = safeJsonArray(response.text());
    return res.status(200).json(questions);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: message || "Failed to generate questions." });
  }
}
