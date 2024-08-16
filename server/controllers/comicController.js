const { summarizePDF, generatePrompts } = require('../controllers/openaiController');
const { generateCharacters, generateBackgrounds } = require('../controllers/midjourneyController');
const { removeBackground } = require('../utils/removeBackground');
const fs = require('fs');

const processPaperToComic = async (paper) => {
  try {
    if (!paper || typeof paper !== 'string') {
      throw new Error('Invalid input: expected a non-empty string.');
    }

    console.log('Received paper for processing:', paper);

    // Summarize research input
    const summary = await summarizePDF(paper);
    console.log('Summary:', summary);

    // Generate characters and script
    const { characters, script, backgrounds } = await generatePrompts(summary);
    console.log("Character Description: ", characters);
    console.log("Script: ", script);
    console.log("Backgrounds: ", backgrounds);

    // Generate character image
    const {characterImage} = await generateCharacters(characters);
    console.log("Character Image: ", characterImage);
    
    // Remove background from character images using rembg
    const characterImagePath = await removeBackground(characterImage);
    console.log("Clipped Character Image: ", characterImagePath);
    
    // Generate backgrounds
    const backgroundImages = await generateBackgrounds(script, summary, backgrounds);
    console.log("Background Images:", backgroundImages);
    
    // Compile final comic and send to client
    const comic = {
      script,
      characterImagePath,
      backgroundImages,
    };

    return comic;

  } catch (error) {
    console.error("Error processing paper:", error.response ? error.response.data : error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

module.exports = {
  processPaperToComic
};