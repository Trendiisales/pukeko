// genkit-sample.ts
import { TextServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

// Export the function that index.ts is trying to import
export async function summarizeText(text: string): Promise<string> {
  try {
    // Create the client with proper typing
    const client = new TextServiceClient({
      authClient: await new GoogleAuth().getClient() as any,
    });

    // Use the proper interface structure for the client
    const [response] = await client.generateText({
      // Need to use the full model path
      model: "models/text-bison-001",
      // Use the proper parameter structure according to the SDK
      temperature: 0.2,
      maxOutputTokens: 1024,
      prompt: {
        text: `Summarize the following text:\n\n${text}`,
      },
    });

    // Access the results correctly
    return response.candidates?.[0]?.output || "No summary generated";
  } catch (error) {
    console.error("Error summarizing text:", error);
    return "Error generating summary";
  }
}

// If you need to keep the Cloud Functions implementation as well:
/*
import { defineCallable } from '@google-cloud/functions-framework';

// Define your parameter interface
interface SummarizeParams {
  text: string;
}

// Define your result interface
interface SummarizeResult {
  summary: string;
}

// Define your callable function
defineCallable(
  'summarize',
  async (request: { data: SummarizeParams }): Promise<SummarizeResult> => {
    const summary = await summarizeText(request.data.text);
    return { summary };
  }
);
*/
