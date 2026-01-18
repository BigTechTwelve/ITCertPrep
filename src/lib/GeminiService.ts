import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface GeneratedQuestion {
    question: string;
    options: string[];
    correctAnswer: number; // Index 0-3
    explanation: string;
}

export class GeminiService {
    private static genAI = new GoogleGenerativeAI(API_KEY || "");
    private static model = GeminiService.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    static async generateQuestions(topic: string, difficulty: string, count: number): Promise<GeneratedQuestion[]> {
        if (!API_KEY) {
            throw new Error("Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env file.");
        }

        const prompt = `
            Generate ${count} multiple-choice questions about "${topic}" at a "${difficulty}" difficulty level.
            
            Return the response ONLY as a valid JSON array of objects. Do not wrap in markdown code blocks.
            Each object must strictly follow this structure:
            {
                "question": "The question text",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": 0, (index of the correct option, 0-3)
                "explanation": "Brief explanation of why the answer is correct"
            }
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean up if the model wraps in markdown
            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

            const questions = JSON.parse(cleanedText) as GeneratedQuestion[];
            return questions;
        } catch (error: any) {
            console.error("Gemini Generation Error:", error);

            // Handle specific API errors
            const errorMessage = error.toString();
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
        if (!API_KEY) {
            throw new Error("Missing Gemini API Key.");
        }

        const prompt = `
            Explain why "${correctAnswer}" is the correct answer to the question: "${question}".
            ${userAnswer !== correctAnswer ? `Also briefly explain why "${userAnswer}" is incorrect.` : ''}
            Keep the explanation concise (under 100 words), educational, and encouraging.
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error("Gemini Explanation Error:", error);

            const errorMessage = error.toString();
            if (errorMessage.includes('429') || errorMessage.includes('Quota exceeded')) {
                return "I'm currently resting (Quota Exceeded). Please try asking for an explanation again later.";
            }

            return "I couldn't generate an explanation at this moment. Please try again later.";
        }
    }
}
