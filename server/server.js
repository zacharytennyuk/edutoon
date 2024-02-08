require('dotenv').config();
const openai = new OpenAI.Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const { OpenAIApi } = require("openai");

const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use the environment port or 3000

app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => {
  res.send('Server is running.');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.post('/generate-text', async (req, res) => {
  const openai = new OpenAIApi(new OpenAI.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }));
  
  try {
    const response = await openai.createCompletion("gpt-4-0125-preview", {
      prompt: req.body.prompt,
      temperature: 0.7,
      max_tokens: 256,
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error calling the OpenAI API");
  }
});