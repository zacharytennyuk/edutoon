const express = require('express');
const router = express.Router();
// const multer = require('multer');
// const path = require('path');
const { processPaperToComic } = require('../controllers/comicController');
// const fs = require('fs');

// // Set up multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Set the directory to save the uploaded files
//   },
//   filename: (req, file, cb) => {
//     const extension = path.extname(file.originalname).toLowerCase();
//     if (extension !== '.pdf') {
//       // If the uploaded file is not a PDF, save it with a .pdf extension
//       cb(null, `${file.fieldname}-${Date.now()}.pdf`);
//     } else {
//       cb(null, file.originalname); // Save with the original name if it's already a PDF
//     }
//   }
// });

// // Filter to ensure the file is a PDF
// const fileFilter = (req, file, cb) => {
//   const allowedMimeTypes = ['application/pdf'];
//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only PDFs are allowed.'));
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter
// });

// Route to process text input
router.post('/process-paper', async (req, res) => {
  try {
    const { abstract } = req.body; // Get the abstract text from the request body

    if (!abstract) {
      return res.status(400).send("No text provided.");
    }

    const comic = await processPaperToComic(abstract);

    res.send({ comic });
  } catch (error) {
    console.error("Error processing paper:", error);
    res.status(500).send({ error: "Error processing paper", details: error.message });
  }
});

// Route to process PDF input
// router.post('/process-paper', upload.single('pdf'), async (req, res) => {
//   let pdfPath = req.file.path;
  
//   try {
//     // Additional check to ensure file extension is .pdf
//     if (path.extname(pdfPath).toLowerCase() !== '.pdf') {
//       const newPdfPath = `${pdfPath}.pdf`;
//       fs.renameSync(pdfPath, newPdfPath);
//       pdfPath = newPdfPath;
//     }

//     const comic = await processPaperToComic(pdfPath);

//     // Delete the uploaded PDF after processing
//     fs.unlink(pdfPath, (err) => {
//       if (err) console.error(`Error deleting file: ${err}`);
//     });

//     res.send({ comic });
//   } catch (error) {
//     console.error("Error processing paper:", error);
//     res.status(500).send({ error: "Error processing paper", details: error.message });
    
//     // Clean up the file in case of an error
//     if (fs.existsSync(pdfPath)) {
//       fs.unlink(pdfPath, (err) => {
//         if (err) console.error(`Error deleting file after error: ${err}`);
//       });
//     }
//   }
// });

module.exports = router;
