require('dotenv').config();
const express = require('express');
const cors = require('cors');

const openaiRoutes = require('./routes/openaiRoutes.js');
const midjourneyRoutes = require('./routes/midjourneyRoutes.js');
const comicRoutes = require('./routes/comicRoutes.js');

const app = express();
const port = 5200;
const Origins = ['https://edutoon-xkx7.onrender.com', 'http://localhost:3000', 'http://127.0.0.1:3000'];

const { exec } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || Origins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS error!'));
    }
  }
}));

app.use(express.json());
app.use('/api', openaiRoutes);
app.use('/api', midjourneyRoutes);
app.use('/api', comicRoutes);

const tempDir = path.join(os.tmpdir(), 'edutoon');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

app.get('/image/:filename', (req, res) => {
  const filePath = path.join(tempDir, req.params.filename);
  res.sendFile(filePath, err => {
    if (err) {
      console.error("Error retrieving the image:", err);
      res.status(500).send("Error retrieving the image.");
    }
  });
});

// vestigial PDF processing

// const upload = multer({ dest: 'uploads/' });
// app.get('/test-extract', (req, res) => {
//   const pdfPath = path.join(__dirname, '..', 'client/public', 'McAmisSecurity23.pdf');
  
//   exec(`python python/extract.py "${pdfPath}"`, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Execution error: ${error}`);
//       console.error(`stderr: ${stderr}`);
//       return res.status(500).send(`Error processing PDF: ${stderr}`);
//     }
//     console.log(`Extracted text: ${stdout}`);
//     res.send({ extractedText: stdout });
//   });
// });

app.listen(port, () => console.log('Server started on port', port));