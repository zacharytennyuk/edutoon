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
          content: `Summarize the key research takeaways including:
      (1) the paper's area of study
      (2) the fundamental problem within the area that the research is addressing
      (3) the paper's solution to the problem
      (4) what the implications/impact of the solution is on the state of the art`,
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