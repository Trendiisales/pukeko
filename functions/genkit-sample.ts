import { GenerativeServiceClient } from "@google-ai/generativelanguage";

// Example implementation (based on typical usage)
const MODEL_NAME = "models/gemini-pro";
const API_KEY = process.env.GENAI_API_KEY || "your-api-key";

// Using apiKey directly instead of authClient to avoid type conflicts
const client = new GenerativeServiceClient({
  apiKey: API_KEY,
});

export async function generateText(prompt: string): Promise<string> {
  try {
    const result = await client.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // Safe access with optional chaining and nullish coalescing
    const responseText = result[0]?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return responseText;
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
}

// Adding the missing summarizeText function that's imported in index.ts
export async function summarizeText(text: string): Promise<string> {
  try {
    const prompt = `Please summarize the following text:\n\n${text}`;
    return await generateText(prompt);
  } catch (error) {
    console.error("Error summarizing text:", error);
    throw error;
  }
}
