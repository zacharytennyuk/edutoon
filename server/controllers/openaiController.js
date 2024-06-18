const OpenAI = require('openai');
const openai = new OpenAI(process.env.OPENAI_API_KEY);

const generateContent = async (abstract) => {

    console.log("Generating content...");

    const summary = await openai.chat.completions.create({
        model: "gpt-4-0125-preview",
        messages: [
        {"role": "system", "content": "You create text summaries of research abstract inputs."},
        {"role": "user", "content": abstract}
        ],
    });

    const generatedSummary = summary.choices[0].message.content;
    console.log("Generated summary:", generatedSummary);

    const prompt = await openai.chat.completions.create({
        model: "gpt-4-0125-preview",
        messages: [
        {
            "role": "system",
            "content": `
            The system will take user input (a research abstract or excerpt) and output a prompt for DALL-E to create an image
            that serves as a visual guide to the research.
            1. The image should be a coherent scenario that helps a viewer understand the research.
            2. The image should clearly convey the main idea of the research for an audience who may not be familiar with the topic.
            3. Avoid including text and abstract imagery/symbols/representations in the prompt. Focus on a real scenario.
            4. The prompt should instruct 'Avoid including text or abstract imagery/symbols/representations. The image should be realistic in content.'
            `
        },
        {"role": "user", "content": abstract}
        ],
    });

    const generatedPrompt = prompt.choices[0].message.content;
    console.log("Generated prompt:", generatedPrompt);

    const panel = await openai.images.generate({model: "dall-e-3", prompt: generatedPrompt});
    const generatedImage = panel.data[0].url;

    const testImage = 'https://cdn.pixabay.com/photo/2017/01/30/10/59/animal-2020580_1280.jpg';

    return { generatedSummary, generatedPrompt, generatedImage };
};

module.exports = {
  generateContent
};