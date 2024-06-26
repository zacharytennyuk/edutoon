require('dotenv').config();
const express = require('express');
const cors = require('cors');
const openaiRoutes = require('./routes/openaiRoutes.js');
const app = express();
const port = 5200;

const { exec } = require('child_process');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const Origins = ['https://edutoon-xkx7.onrender.com', 'http://localhost:3000', 'http://127.0.0.1:3000'];

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

const upload = multer({ dest: 'uploads/' });
app.get('/test-extract', (req, res) => {
  const pdfPath = path.join(__dirname, '..', 'client/public', 'McAmisSecurity23.pdf');
  
  exec(`python python/extract.py "${pdfPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error}`);
      console.error(`stderr: ${stderr}`);
      return res.status(500).send(`Error processing PDF: ${stderr}`);
    }
    console.log(`Extracted text: ${stdout}`);
    res.send({ extractedText: stdout });
  });
});

app.listen(port, () => console.log('Server started on port', port));