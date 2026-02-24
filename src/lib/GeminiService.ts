const AI_PROXY_URL = import.meta.env.VITE_AI_PROXY_URL;

export interface GeneratedQuestion {
    question: string;
    options: string[];
    correctAnswer: number; // Index 0-3
    explanation: string;
}

export class GeminiService {
    static async generateQuestions(topic: string, difficulty: string, count: number): Promise<GeneratedQuestion[]> {
        if (!AI_PROXY_URL) {
            throw new Error("Missing VITE_AI_PROXY_URL. Configure a server endpoint for AI generation.");
        }

        try {
            const response = await fetch(`${AI_PROXY_URL}/generate-questions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, difficulty, count }),
            });
            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "AI generation request failed.");
            }
            const questions = (await response.json()) as GeneratedQuestion[];
            return questions;
        } catch (error: unknown) {
            console.error("Gemini Generation Error:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            if (errorMessage.includes('429') || errorMessage.includes('Quota exceeded')) {
                throw new Error("AI Quota Exceeded. The free tier limit has been reached. Please try again later.");
            }
            if (errorMessage.includes('503')) {
                throw new Error("AI Service Unavailable. Google's servers are busy. Please try again in a moment.");
            }
            throw new Error("Failed to generate questions. Please try again.");
        }
    }

    static async explainAnswer(question: string, correctAnswer: string, userAnswer: string): Promise<string> {
        if (!AI_PROXY_URL) {
            throw new Error("Missing VITE_AI_PROXY_URL. Configure a server endpoint for AI explanation.");
        }

        try {
            const response = await fetch(`${AI_PROXY_URL}/explain-answer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question, correctAnswer, userAnswer }),
            });
            if (!response.ok) {
                return "I couldn't generate an explanation at this moment. Please try again later.";
            }
            const data = (await response.json()) as { explanation?: string };
            return data.explanation || "I couldn't generate an explanation at this moment. Please try again later.";
        } catch (error: unknown) {
            console.error("Gemini Explanation Error:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            if (errorMessage.includes('429') || errorMessage.includes('Quota exceeded')) {
                return "I'm currently resting (Quota Exceeded). Please try asking for an explanation again later.";
            }
            return "I couldn't generate an explanation at this moment. Please try again later.";
        }
    }
}
