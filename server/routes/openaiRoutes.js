const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporarily store the uploaded files
const { uploadPDF } = require('../controllers/openaiController');

router.post('/upload-pdf', upload.single('pdf'), uploadPDF);

router.post('/create-panel', async (req, res) => {
  try {
    const { abstract } = req.body;
    const result = await generateContent(abstract);
    res.json(result);
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).send("Could not generate content.");
  }
});

module.exports = router;
