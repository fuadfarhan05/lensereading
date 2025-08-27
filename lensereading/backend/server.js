const express = require("express");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = 8000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.post("/upload", async (req, res) => {
  if (!req.files || !req.files.pdf) return res.status(400).json({ error: "No file uploaded" });

  try {
    const data = await pdfParse(req.files.pdf);
    res.json({ text: data.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to parse PDF" });
  }
});

app.post("/ai-highlight", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    // Updated prompt to explicitly request up to 20 sentences
    const prompt = `
      From the following text, select the 10 most important sentences 
      (or as many as possible if the text is shorter). 
      Return each sentence exactly as it appears in the text, one per line.
      Do not paraphrase, summarize, or add words. 
      Only copy full sentences from the text. 

      Text: """${text}"""
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2, 
    });

    let highlights = completion.choices[0].message.content;

    highlights = highlights
      .split("\n")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    res.json({ highlights });
  } catch (err) {
    console.error("❌ AI error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "AI highlighting failed" });
  }
});

// ---------------- Translate ----------------
app.post("/translate", async (req, res) => {
  const { text, targetLang } = req.body;
  if (!text || !targetLang) return res.status(400).json({ error: "Missing text or target language" });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are a helpful translator for a platform called Lense. Translate everything into ${targetLang}.` },
        { role: "user", content: text }
      ]
    });

    const translation = response.choices[0].message.content;
    res.json({ translation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Translation failed" });
  }
});

// ---------------- Lookup ----------------
app.post("/lookup", async (req, res) => {
  const { word } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a dictionary assistant. Provide concise definitions." },
        { role: "user", content: `Define the word: ${word}` },
      ],
    });

    const definition = completion.choices[0].message.content;
    res.json({ definition });
  } catch (err) {
    console.error(err);
    res.status(500).json({ definition: "Error fetching definition." });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
