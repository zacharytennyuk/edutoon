const fs = require('fs');
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const uploadPDF = async (req, res) => {
  const pdfPath = req.file.path;
  // const pdfPath = './server/controllers/McAmisSecurity23.pdf';
  console.log('Current working directory:', process.cwd());
  // Check if the file exists
  if (!fs.existsSync(pdfPath)) {
    console.error('PDF file not found:', pdfPath);
    res.status(404).send('PDF file not found');
    return;
  }
  try {
    // Step 1: Create the assistant
    const assistant = await openai.beta.assistants.create({
      name: "Research Paper Assistant",
      instructions: `Search this research paper pdf and summarize the key takeaways listed here:
      (1) the paper's area of study
      (2) the fundamental problem within the area that the research is addressing
      (3) the paper's solution to the problem
      (4) what the implications/impact of the solution is on the state of the art`,
      model: "gpt-4-turbo",
      tools: [{ type: "file_search" }],
    }, {
      headers: {
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    console.log("Assistant created");

    console.log("OpenAI vectorStores methods:", openai.beta.vectorStore);

    // Step 2: Create a vector store and upload the file
    const fileStreams = [fs.createReadStream(pdfPath)];

    console.log("Filestream created");


    let vectorStore = await openai.beta.vectorStores.create({
      name: "Research Paper Vector Store",
    });

    console.log("Vector store created");

    await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, fileStreams)

    console.log("File uploaded to vector store");

    // Step 3: Update the assistant to use the vector store
    await openai.beta.assistants.update(assistant.id, {
      tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
    });

    console.log("Assistant updated with vector store");

    // Step 4: Create a thread with the file attached
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: "Summarize the key takeaways from this research paper.",
          attachments: [{ file_id: vectorStore.id, tools: [{ type: "file_search" }] }],
        },
      ],
    });

    console.log("Thread created");

    // Step 5: Create a run and get the output
    const stream = openai.beta.threads.runs.stream(thread.id, {
      assistant_id: assistant.id,
    });

    let summary = "";
    stream.on("textCreated", (event) => {
      summary += event.content[0].text.value;
    });

    stream.on("end", () => {
      res.send({ summary });
    });

    stream.on("error", (error) => {
      console.error("Error processing PDF:", error);
      res.status(500).send(`Error processing PDF: ${error.message}`);
    });
  } catch (error) {
    console.error("Error processing PDF:", error.response ? error.response.data : error.message);
    res.status(500).send({
      error: 'Error processing PDF',
      details: error.response ? error.response.data : error.message
    });
  } finally {
    // fs.unlink(pdfPath, (err) => {
    //   if (err) console.error(`Error deleting file: ${err}`);
    // });
  }
};
  
const generateContent = async (abstract) => {

    console.log("Generating content...");

    const prompt = await openai.chat.completions.create({ 
        model: "gpt-4o", 
        max_tokens: 500,
        messages: [{ 
        "role": "system",
        "content": ` 
        System Role: Detailed Prompt Generator for Image Creation 

        Objective: Generate highly detailed prompts for image generation that include comprehensive descriptions of the scene, characters, 
        background, and context inspired from this research abstract. 

        Instructions: 
    
        Scene Description: 
        Specify the type of scene (e.g., "VR-computer science lab"). 
        Specify the style of the image should be comic-style. 
        Describe the setting in detail, including any notable features, equipment, and atmosphere. 
        Mention the overall mood or theme of the scene. 
        
        Character Descriptions: 
        Provide detailed descriptions of each character, including name, physical appearance, clothing, and accessories. 
        Describe the characters' expressions, body language, and interactions. 
        Include any specific attributes or distinguishing features (e.g., "blue-haired scientist wearing a trench coat"). 

        Background and Elements: 
        Describe the background in detail, including any significant elements or props. 
        Ensure the background is relevant to the scene and complements the characters. 
        Mention any specific lighting or visual effects (e.g., "holographic displays, digital interfaces"). 

        Context and Action: 
        Explain the context of the scene and what is happening (e.g., "characters having an engaging conversation about virtual privacy"). 
        Include any actions or activities the characters are involved in. 
        Describe any relevant objects or tools the characters are using. 
        ` 
        }, 
        {"role": "user", "content": abstract} 
        ], 
    }); 

    const generatedPrompt = prompt.choices[0].message.content;
    console.log("Generated prompt:", generatedPrompt);
    console.log("");

    const summaryContent = ` 
        Abstract: 
        ${abstract} 
        Image Scenario: 
        ${generatedPrompt} 
    `; 

    const summary = await openai.chat.completions.create({ 
        model: "gpt-4o",
        messages: [ 
            {"role": "system", "content": `Create a text summary of the research abstract 
                input in the form of a dialogue script between the characters in the given 
                image scenario. Only include lines of dialogue from the characters.
                
                Example Format:
                Character A: ...
                Character B: ...
                `}, 
            {"role": "user", "content": summaryContent} 
        ], 
    }); 
    
    const generatedSummary = summary.choices[0].message.content;
    console.log("Generated summary:", generatedSummary);

    const panel = await openai.images.generate({model: "dall-e-3", prompt: generatedPrompt});
    const generatedImage = panel.data[0].url;

    const testImage = 'https://cdn.pixabay.com/photo/2017/01/30/10/59/animal-2020580_1280.jpg';

    return { generatedSummary, generatedPrompt, generatedImage };
};

const splitScriptIntoPairs = (script) => {
  const lines = script.split('\n').filter(line => line.trim() !== '');
  const pairs = [];
  
  for (let i = 0; i < lines.length; i += 2) {
      if (i + 1 < lines.length) {
          pairs.push(`${lines[i]}\n${lines[i + 1]}`);
      } else {
          pairs.push(`${lines[i]}`);
      }
  }
  
  return pairs;
};

const charactersAndScript = async (summary) => {

  console.log("Generating character description...");

  const characterPrompt = await openai.chat.completions.create({ 
      model: "gpt-4o", 
      max_tokens: 500,
      messages: [{ 
      "role": "system",
      "content": ` 
      Objective: Without using words that an AI would interpret as inappropriate, generate a short (under 1900 characters) description for 2 characters who know about the following research summary.
      Provide VERY BRIEF descriptions of each character, including name and appearance.
      ` 
      }, 
      {"role": "user", "content": summary} 
      ], 
  }); 

  const characters = characterPrompt.choices[0].message.content;
  console.log("Generated characters:", characters);

  const scriptContent = ` 
        Research Summary: 
        ${summary} 
        Character Description: 
        ${characters} 
  `; 

    const generatedScript = await openai.chat.completions.create({ 
        model: "gpt-4o",
        messages: [ 
            {"role": "system", "content": `Without using words that an AI would interpret as inappropriate, create a dialogue script that communicates the key takeaways of this research summary as spoken by these characters. Only include lines of dialogue from the characters.
                Format:
                Character A Name: [dialogue]
                Character B Name: [dialogue]
                `},
            {"role": "user", "content": scriptContent} 
        ], 
    }); 
    
    const script = splitScriptIntoPairs(generatedScript.choices[0].message.content);
    console.log("Generated script:", script);

  return { characters, script };

};



module.exports = {
  uploadPDF,
  generateContent,
  charactersAndScript,
};