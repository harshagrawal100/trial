
import { GoogleGenAI, Chat, Type } from "@google/genai";
import type { BotResponse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const botResponseSchema = {
  type: Type.OBJECT,
  properties: {
    reply: {
      type: Type.STRING,
      description: "A witty, conversational, Gen-Z style reply to the user. Use emojis! 😉",
    },
    books: {
      type: Type.ARRAY,
      description: "A list of books found that match the user's request. Can be an empty list.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          author: { type: Type.STRING },
          summary: { 
            type: Type.STRING,
            description: "A short, engaging summary of the book."
          },
          coverImageUrl: {
            type: Type.STRING,
            description: "A URL to a placeholder cover image, e.g., from picsum.photos."
          },
          pdfLinks: {
            type: Type.ARRAY,
            description: "A list of potential PDF sources. Can be an empty list.",
            items: {
              type: Type.OBJECT,
              properties: {
                source: { type: Type.STRING, description: "The name of the website or source." },
                url: { type: Type.STRING, description: "The direct URL to the PDF." },
              },
              required: ["source", "url"],
            },
          },
        },
        required: ["title", "author", "summary", "coverImageUrl", "pdfLinks"],
      },
    },
  },
  required: ["reply", "books"],
};

const chat: Chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: `You are BookBot, a super-smart and fun AI assistant with a Gen Z personality. Your mission is to help users find PDF versions of books.
- Your tone should be casual, friendly, and witty. Use emojis where it feels natural 😉.
- If a user asks for a book, search for it. If you can't find it, be encouraging and suggest trying another title or author.
- For cover images, generate a placeholder URL from https://picsum.photos/400/600.
- IMPORTANT: You MUST ALWAYS return your response in the structured JSON format defined by the provided schema. Do not output anything other than the JSON object.`,
    responseMimeType: "application/json",
    responseSchema: botResponseSchema,
  },
});

export const sendMessageToBot = async (message: string): Promise<BotResponse> => {
  try {
    const result = await chat.sendMessage({ message });
    const jsonString = result.text.trim();
    // Sometimes the response might be wrapped in markdown
    const cleanedJsonString = jsonString.replace(/^```json\s*|```$/g, '');
    const parsedResponse = JSON.parse(cleanedJsonString) as BotResponse;
    return parsedResponse;
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    return {
      reply: "Oops, my circuits are a bit fried right now 😵‍💫. Maybe try again in a sec?",
      books: [],
    };
  }
};
