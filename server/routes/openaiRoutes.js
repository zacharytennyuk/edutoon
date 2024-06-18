const express = require('express');
const router = express.Router();
const { generateContent } = require('../controllers/openaiController');

router.post('/create-panel', async (req, res) => {
  try {
    const { abstract } = req.body;
    const result = await generateContent(abstract);
    res.json(result);
  } catch (error) {
    console.error("Error from OpenAI:", error);
    res.status(500).send("Could not create panel.");
  }
});

module.exports = router;
