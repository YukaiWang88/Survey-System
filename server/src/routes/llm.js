const express = require('express');
const router = express.Router();
const axios = require('axios');


const API_URL = "https://api2.road2all.com/v1/chat/completions";
// const API_KEY = process.env.OPENAI_API_KEY;
const API_KEY = "sk-AihzBQwE4KRU6Ye84d70A10896C7458d949b4592A66030Bb"; // 使用您实际的 API 密钥

router.post("/extract", async (req, res) => {
  try {
    const description = req.body.description;
    if (!description) {
      console.error("Description is missing");
      return res.status(400).json({ error: "Description is required." });
    }


    const maxAdjectives = description.split(' ').length > 50 ? 3 : Math.min(3, description.split(' ').length);

    const prompt = ` 
    Please extract the ${maxAdjectives} most important adjectives that describe the characteristics of the following course. Only return an array of adjectives:
    "${description}"
    `;

    console.log("Sending prompt to OpenAI:", prompt);

    const response = await axios.post(
      API_URL,
      {
        model: "gpt-4o", // 使用正确的模型
        messages: [{ role: "user", content: prompt }],
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("OpenAI response:", response.data);

    const reply = response.data.choices[0].message.content;

    let adjectives;
    try {
      adjectives = JSON.parse(reply);
    } catch {
      adjectives = reply
        .replace(/[\[\]\"“”]/g, "")
        .split(/[,\n]/)
        .map((w) => w.trim())
        .filter(Boolean);
    }

    res.json({ adjectives });
  } catch (error) {
    console.error("API call failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to extract adjectives via GPT-4o." });
  }
});


module.exports = router;