const OpenAI = require('openai');
const openai = new OpenAI(process.env.OPENAI_API_KEY);

const generateContent = async (abstract) => {

    console.log("Generating content...");

    const prompt = await openai.chat.completions.create({ 
        model: "gpt-4-0125-preview", 
        messages: [{ 
        "role": "system", 
        "content": ` 
        System Role: Detailed Prompt Generator for Image Creation 

        Objective: Generate highly detailed prompts for image generation that include comprehensive descriptions of the scene, characters, background, and context inspired from this research abstract. 

        Instructions: 
        The style of the image should be comic-style. 

        Scene Description: 
        Specify the type of scene (e.g., "VR-computer science lab"). 
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

    const summaryContent = ` 
        Abstract: 
        ${abstract} 
        Image Scenario: 
        ${generatedPrompt} 
    `; 

    const summary = await openai.chat.completions.create({ 
        model: "gpt-4-0125-preview", 
        messages: [ 
            {"role": "system", "content": `Create a text summary of the research abstract 
                input in the form of a dialogue script between the characters in the given 
                image scenario .`}, 

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

module.exports = {
  generateContent
};