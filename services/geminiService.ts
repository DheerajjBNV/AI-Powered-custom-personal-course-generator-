
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { CoursePlan, UserProfile, ChatMessage } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const courseSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A catchy and descriptive title for the course.' },
        description: { type: Type.STRING, description: 'A brief, one-paragraph overview of the course.' },
        duration: { type: Type.STRING, description: 'Estimated total duration, e.g., "4 Weeks".' },
        modules: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    week: { type: Type.INTEGER, description: 'The week number for this module.' },
                    title: { type: Type.STRING, description: 'The title of the module for this week.' },
                    summary: { type: Type.STRING, description: 'A short summary of what will be learned in this module.' },
                    topics: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING, description: 'The specific topic title.' },
                                description: { type: Type.STRING, description: 'A one-sentence description of the topic.' },
                                resources: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            type: { type: Type.STRING, description: 'Type of resource: "video", "article", "project", or "book".' },
                                            title: { type: Type.STRING, description: 'The title of the resource.' },
                                            description: { type: Type.STRING, description: 'A brief description of what the resource covers.' }
                                        },
                                        required: ['type', 'title', 'description']
                                    }
                                }
                            },
                            required: ['title', 'description', 'resources']
                        }
                    }
                },
                required: ['week', 'title', 'summary', 'topics']
            }
        }
    },
    required: ['title', 'description', 'duration', 'modules']
};

export const generateCoursePlan = async (profile: UserProfile): Promise<CoursePlan> => {
    const prompt = `
    Based on the following user profile, generate a personalized learning course plan.
    
    Interests: ${profile.interests}
    Learning Pace: ${profile.pace}
    Goals: ${profile.goals}

    Please create a structured, week-by-week course plan that is practical and engaging. The plan should be broken down into weekly modules, with each module containing several key topics. For each topic, suggest a few learning resources like articles, videos, or small projects. Ensure the course title is motivating and relevant.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: courseSchema,
        },
    });
    
    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse course plan JSON:", e);
        throw new Error("The AI returned an invalid course structure. Please try again.");
    }
};

let chat: Chat | null = null;

export const startChat = () => {
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are a helpful and encouraging learning assistant. Keep your answers concise and focused on the user's learning journey.",
        },
    });
};

export const getChatbotResponseStream = async (message: string) => {
    if (!chat) {
        startChat();
    }
    if (chat) {
        return chat.sendMessageStream({ message });
    }
    throw new Error("Chat not initialized");
};

export const getAIAdvice = async (topic: string, course: string): Promise<string> => {
    const prompt = `I'm currently studying the topic "${topic}" as part of my course on "${course}". Can you give me a simple, actionable piece of advice or a key insight to help me understand it better? Keep it to 2-3 sentences.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text;
};
