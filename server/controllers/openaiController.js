const fs = require('fs');
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const summarizeChunk = async (text) => {
  try {
    console.log("Summarizing chunk of length:", text.length);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a highly skilled academic assistant. Using simple vocabulary, please summarize the following text in a concise manner."
        },
        { role: "user", content: text }
      ]
    });

    const summary = response.choices[0]?.message?.content;
    if (!summary) {
      throw new Error("Failed to generate summary. The API returned null or undefined.");
    }

    console.log("Generated summary of length:", summary.length);
    return summary;
  } catch (error) {
    console.error("Error in summarizeChunk:", error.message);
    throw error;
  }
};

const summarizePDF = async (paper) => {
  try {
    console.log("Starting summarization...");

    const maxLength = 10000;
    let paperChunks = [];

    for (let i = 0; i < paper.length; i += maxLength) {
      const chunk = paper.substring(i, i + maxLength);
      paperChunks.push(chunk);
    }

    let summaries = [];

    // Summarize each chunk
    for (const chunk of paperChunks) {
      const summary = await summarizeChunk(chunk);
      summaries.push(summary);
    }

    // Combine all summaries into one
    let combinedSummary = summaries.join(' ');

    console.log("Combined summary length:", combinedSummary.length);

    // If the combined summary is still too long, summarize it further
    while (combinedSummary.length > maxLength) {
      console.log("Combined summary too long! Snipping...");
      combinedSummary = await summarizeChunk(combinedSummary);
    }

    console.log("Final summarized length:", combinedSummary.length);
    console.log(combinedSummary);
    return combinedSummary;
  } catch (error) {
    console.error("Error in summarizePDF:", error.message);
    throw error;
  }
};

// const summarizePDF = async (pdfPath) => {
//   try {

//     console.log("PDF PATH:", pdfPath);

//     console.log("Creating vector store...");

//     // Step 1: Create the vector store
//     const vectorStore = await openai.beta.vectorStores.create({
//       name: `Research-Paper-Vector-Store${new Date().toISOString()}`,
//     });

//     console.log("Creating file stream...");

//     // Step 2: Upload the PDF file to the vector store
//     const fileStreams = [fs.createReadStream(pdfPath)];
//     await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, fileStreams);

//     console.log("Creating assistant...");

//     // Step 3: Create the assistant with file search capability
//     const assistant = await openai.beta.assistants.create({
//       name: "Research Paper Assistant",
//       instructions: "Search the research paper for title, authors, and a summary of key takeaways.",
//       model: "gpt-4-turbo",
//       tools: [{ type: "file_search" }],
//       tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
//     });

//     // Step 4: Create a thread with search prompts to extract title, authors, and summary
//     const thread = await openai.beta.threads.create({
//       messages: [
//         {
//           role: "user",
//           content: "Extract the title of the research paper.",
//           attachments: [{ file_id: vectorStore.id, tools: [{ type: "file_search" }] }],
//         },
//       ],
//     });

//     // Function to run the assistant and extract content
//     const runAssistant = async (content) => {
//       const runStream = openai.beta.threads.runs.stream(thread.id, {
//         assistant_id: assistant.id,
//       });

//       let result = "";
//       return new Promise((resolve, reject) => {
//         runStream.on("textCreated", (event) => {
//           if (event.content && event.content[0] && event.content[0].text) {
//             result += event.content[0].text.value;
//           }
//         });

//         runStream.on("end", () => {
//           resolve(result.trim());
//         });

//         runStream.on("error", (error) => {
//           reject(`Error processing PDF: ${error.message}`);
//         });
//       });
//     };

//     // Extract Title
//     const title = await runAssistant("Extract the title of the research paper.");

//     // Extract Authors
//     await openai.beta.threads.messages.create(thread.id, {
//       role: "user",
//       content: "Extract the authors of the research paper.",
//       attachments: [{ file_id: vectorStore.id, tools: [{ type: "file_search" }] }],
//     });
//     const authors = await runAssistant("Extract the authors of the research paper.");

//     // Extract Summary
//     await openai.beta.threads.messages.create(thread.id, {
//       role: "user",
//       content: "Provide a summary of the key takeaways from the research paper.",
//       attachments: [{ file_id: vectorStore.id, tools: [{ type: "file_search" }] }],
//     });
//     const summary = await runAssistant("Provide a summary of the key takeaways from the research paper.");

//     // Return the extracted information
//     return { title, authors, summary };

//   } catch (error) {
//     console.error("Error processing PDF:", error.message);
//     throw new Error(`Error summarizing PDF: ${error.message}`);
//   }
// };

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

const generatePrompts = async (summary) => {

  console.log("Generating character description...");

  const characterPrompt = await openai.chat.completions.create({ 
      model: "gpt-4o", 
      max_tokens: 500,
      messages: [{ 
      "role": "system",
      "content": ` 
      Objective: Using simple vocabulary, generate a short (under 1900 characters) name and physical appearance for 2 characters who know about the following research summary.
      ` 
      }, 
      {"role": "user", "content": summary} 
      ], 
  }); 

  const characters = characterPrompt.choices[0].message.content;

  console.log("Generated characters:", characters);

  console.log("Generating script...", characters);

  const scriptContent = ` 
        Research Summary: 
        ${summary} 
        Character Description: 
        ${characters} 
  `; 

    const generatedScript = await openai.chat.completions.create({ 
        model: "gpt-4o",
        messages: [ 
            {"role": "system", "content": `Using simple vocabulary, create a dialogue script that communicates the key takeaways of this research summary as spoken by these characters. Only include lines of dialogue from the characters.
                Format:
                Character A Name: [dialogue]
                Character B Name: [dialogue]
                `},
            {"role": "user", "content": scriptContent} 
        ], 
    }); 
    
    const script = splitScriptIntoPairs(generatedScript.choices[0].message.content);

    console.log("Generated script:", script);

    console.log("Generating background prompts...");

    const backgrounds = [];

    for (let i = 0; i < script.length; i++) {

        const dialogue = script[i];

        console.log("Generating background", i);
        
        if (dialogue.length > 2048) {
          dialogue = dialogue.substring(0, 2048);
        }

        const backgroundPrompt = await openai.chat.completions.create({ 
          model: "gpt-4o", 
          max_tokens: 500,
          messages: [{ 
          "role": "system",
          "content": ` 
          Objective: In the given dialogue, there are main nouns of interest. Using simple vocabulary, briefly describe a setting that focuses on the main nouns of interest. DO NOT INCLUDE CHARACTERS OR DIALOGUE.
          ` 
          }, 
          {"role": "user", "content": dialogue} 
          ], 
        }); 
    
        const background = backgroundPrompt.choices[0].message.content;

        backgrounds.push(background);
        console.log(`Generated background prompt: ${background}`);

    }

  return { characters, script, backgrounds };

};

module.exports = {
  summarizePDF,
  generatePrompts,
};