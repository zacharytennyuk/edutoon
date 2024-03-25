require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const openai = new OpenAI(process.env.OPENAI_API_KEY);
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

const placeholderDuck = 'https://cdn.pixabay.com/photo/2017/01/30/10/59/animal-2020580_1280.jpg';

app.post("/create-panel", async (req, res) => {
  try{

    console.log("Generating panel.");

    // working URL generation
    const {abstract} = req.body;
    console.log("Abstract extracted: ", {abstract});
    const summary = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": "You create text summaries of research abstract inputs. Take user input (a research abstract) and output a prompt for dalle-3 to create a single comic panel that visually summarizes the abstract."},
        {"role": "user", "content": abstract}],
    });
    console.log("Generated prompt: ", summary.choices[0].message.content);
    console.log("-----");
    const generatedPrompt = summary.choices[0].message.content;

    // image generation
    const panel = await openai.images.generate({model: "dall-e-3", prompt: generatedPrompt});
    const panelURL = panel.data[0].url;
    console.log("server log ---");
    
    // const panelURL = placeholderDuck;
    console.log("Generated image: ", panelURL);
    console.log("-----");
    res.json({ generatedPrompt, panelURL });

  } catch (error) {

    console.error("Error from OpenAI:", error);
    res.status(500).send("Could not create panel.");

  }
})

app.listen(port, () => console.log('Server started on port', port))