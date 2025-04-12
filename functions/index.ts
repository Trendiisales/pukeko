import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { generateText, summarizeText } from "./genkit-sample";
import express from "express";
import cors from "cors";

// Initialize Firebase
admin.initializeApp();

// Create Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.status(200).send({ message: "Hello from Firebase Functions!" });
});

app.get("/api/data", (req, res) => {
  // Your data handling logic
  const data = {
    items: [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
      { id: 3, name: "Item 3" },
    ],
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(data);
});

// AI text generation endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const generatedText = await generateText(prompt);
    return res.status(200).json({ result: generatedText });
  } catch (error) {
    console.error("Error in text generation:", error);
    return res.status(500).json({ error: "Failed to generate text" });
  }
});

// Text summarization endpoint
app.post("/api/summarize", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const summary = await summarizeText(text);
    return res.status(200).json({ summary });
  } catch (error) {
    console.error("Error in text summarization:", error);
    return res.status(500).json({ error: "Failed to summarize text" });
  }
});

// Export the API as a Firebase Function
export const api = functions.https.onRequest(app);
