const express = require("express");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = 8000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Upload PDF
app.post("/upload", async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) return res.status(400).json({ error: "No file uploaded" });
    const data = await pdfParse(req.files.pdf.data);
    res.json({ text: data.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PDF parsing failed" });
  }
});

// AI Highlight
app.post("/ai-highlight", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    // Updated prompt to explicitly request up to 20 sentences
    const prompt = `
      From the following text, select the 20 most important sentences 
      (or as many as possible if the text is shorter). 
      Return each sentence exactly as it appears in the text, one per line.
      Do not paraphrase, summarize, or add words. 
      Only copy full sentences from the text. 

      Text: """${text}"""
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2, // ✅ Lower temperature for more consistent results
    });

    let highlights = completion.choices[0].message.content;

    // Split the highlights by newlines, trim whitespace, and remove any empty lines.
    highlights = highlights
      .split("\n")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Send the array of highlights back to the frontend.
    res.json({ highlights });
  } catch (err) {
    console.error("❌ AI error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "AI highlighting failed" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));