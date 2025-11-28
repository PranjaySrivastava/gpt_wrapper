// server.js  (CommonJS version)

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config(); // loads OPENAI_API_KEY from .env

const app = express();
app.use(cors());
app.use(express.json());

// Check that API key exists
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing. Set it in .env");
  process.exit(1);
}

// Create OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/chat -> called by your frontend
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message || "";

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",  // or "gpt-4o-mini"
      messages: [
        { role: "system", content: "You are a helpful AI tutor." },
        { role: "user", content: userMessage },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a reply.";

    res.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "Server error talking to OpenAI" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("✅ Backend running at http://localhost:3000");
});
