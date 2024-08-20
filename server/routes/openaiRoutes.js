const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { summarizePDF } = require('../controllers/openaiController');

router.post('/summarize-pdf', upload.single('pdf'), summarizePDF);

module.exports = router;
