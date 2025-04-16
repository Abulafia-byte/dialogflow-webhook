// index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/webhook", async (req, res) => {
  const parameters = req.body;

  const message = parameters.message || "";
  const style = parameters.style || "formal";
  const tone = parameters.tone || "neutral";
  const audience = parameters.audience || "general";
  const purpose = parameters.purpose || "general";
  const constraints = parameters.constraints || "";

  const prompt = `
You are a professional business writing assistant. Rewrite the following user message into a clear, professional message.

Message: "${message}"

Style: ${style}
Tone: ${tone}
Audience: ${audience}
Purpose: ${purpose}
Constraints: ${constraints}

Only return the rewritten message, no explanations.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const aiResponse = completion.choices[0].message.content.trim();

    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ response: "Sorry, I couldn't process your request." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
