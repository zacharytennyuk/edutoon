require('dotenv').config();

const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const openai = new OpenAI(process.env.OPENAI_API_KEY);
const multer = require('multer');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();
const port = 5200;




const Origins = ['https://edutoon-xkx7.onrender.com', 'http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || Origins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('CORS error!'))
    }
  }
}));

app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// const placeholderDuck = 'https://cdn.pixabay.com/photo/2017/01/30/10/59/animal-2020580_1280.jpg';

app.post("/create-panel", upload.single('pdf'), async (req, res) => {
  try {
    let { abstract } = req.body;
    let extractedText = abstract;

    if (req.file) {
      const pdfPath = req.file.path;
      exec(`python extract.py "${pdfPath}"`, async (error, stdout, stderr) => {
        if (error) {
          console.error(`Execution error: ${error}`);
          return res.status(500).send('Error processing PDF');
        }
        extractedText = stdout;
        await generate(extractedText, res);
        fs.unlink(pdfPath, (err) => {
          if (err) console.error(`Error deleting file: ${err}`);
        });
      });
    } else {
      await generateContent(extractedText, res);
    }
  } catch (error) {
    console.error("Error from OpenAI:", error);
    res.status(500).send("Could not create panel.");
  }
});

const generateContent = async (text, res) => {
  try{

    // console.log("Generating panel.");

    
    // const {abstract} = req.body;
    // console.log("Abstract extracted: ", {abstract});

    // summary generation
    const summary = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        {"role": "system", "content": "You create a text summaries of research inputs."},
        {"role": "user", "content": abstract}],
    });
    console.log("Generated summary: ", summary.choices[0].message.content);
    console.log("-----");
    const generatedSummary = summary.choices[0].message.content;

    // prompt generation
    const prompt = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        {"role": "system", "content":
        `The system will take user input (a research paper or abstract) and output
        a prompt for dalle-3 to create an image in a two-dimensional style
        that visually summarizes the research with realistic scenario that
        will aid the viewer in understanding of the research while avoiding
        complex, abstract imagery. This prompt will avoid mentioning any
        text to include in the image. The prompt should instruct "Avoid
        adding text to the image."`},
        {"role": "user", "content": abstract}],
    });

    console.log("Generated prompt: ", prompt.choices[0].message.content);
    console.log("-----");
    const generatedPrompt = prompt.choices[0].message.content;

    // image generation
    const panel = await openai.images.generate({model: "dall-e-3", prompt: generatedPrompt});
    const generatedImage = panel.data[0].url;

    console.log("server log ---");
    
    // const panelURL = placeholderDuck;
    console.log("Generated image URL: ", generatedImage);
    console.log("-----");
    res.json({ generatedSummary, generatedPrompt, generatedImage });

  } catch (error) {

    console.error("Error from OpenAI:", error);
    res.status(500).send("Could not create panel.");

  }
};

app.listen(port, () => console.log('Server started on port', port))