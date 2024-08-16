const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { summarizePDF } = require('../controllers/openaiController');

router.post('/summarize-pdf', upload.single('pdf'), summarizePDF);

// Route for creating content based on an abstract
// router.post('/create-panel', async (req, res) => {
//   try {
//     const { abstract } = req.body;

//     if (!abstract) {
//       return res.status(400).send("No abstract provided.");
//     }

//     const result = await generateContent(abstract);
//     res.json(result);
//   } catch (error) {
//     console.error("Error generating content:", error);
//     res.status(500).send("Could not generate content.");
//   }
// });

module.exports = router;
