// const { createAssistant, uploadFileToVectorStore, updateAssistantWithVectorStore, createThread, runAssistant } = require('../services/comicServices');
const { uploadPDF, generatePrompts } = require('../controllers/openaiController');
const { generateCharacters, generateBackgrounds } = require('../controllers/midjourneyController');
const { removeBackground } = require('../utils/removeBackground');
const fs = require('fs');

const processPaperToComic = async (paper) => {
  try {

    // Summarize PDF here:
    // const { summary } = await uploadPDF(paper);

    const summary = `
    Area of Study:
        The paper looks at the privacy and safety problems with 3D online house tours used in real estate listings, especially focusing on the personal information that might be shared by mistake through these virtual tours.

    Fundamental Problem:
        The main problem is that personal information can be leaked through 3D virtual home tours on real estate websites like Zillow, and bad people can use this information.

    Solution:
        The research examines 44 3D home tours to find out what kinds of personal information are shown and gives advice and tech solutions to reduce privacy risks.

    Implications/Impact:
        The study shows the need for better privacy protections and tech solutions to stop personal information from being shared by mistake. This is very important for keeping people safe and private in the digital real estate market. This could lead to changes in how the industry works to better protect privacy.
    `;
    // Generate characters and script
    const { characters, script, backgrounds } = await generatePrompts(summary);

    console.log("Character Description: ", characters);
    console.log("Script: ", script);
    console.log("Backgrounds: ", backgrounds);

    // Generate character image
    // const {characterImage} = await generateCharacters(characters);
    // console.log("Character Image: ", characterImage);
    
    // Remove background from character images using rembg
    // const charactersNoBackground = await removeBackground(characterImage);

    const test = "https://cdn.imaginepro.ai/storage/v1/object/public/cdn/e1a3b3c1-cb4b-4535-bff7-9dbcfede4ba6.png";
    const characterImagePath = await removeBackground(test);
    console.log("Clipped Character Image: ", characterImagePath);
    
    // Generate backgrounds
    // const backgroundImages = await generateBackgrounds(script, summary, backgrounds);

    const backgroundImages = [
      'https://cdn.imaginepro.ai/storage/v1/object/public/cdn/b4e4c76c-df36-4456-b800-fbd402660dc1.png',
      'https://cdn.imaginepro.ai/storage/v1/object/public/cdn/b54563ef-dbdd-4a46-8d7f-8771507ca4ed.png',
      'https://cdn.imaginepro.ai/storage/v1/object/public/cdn/4b9e8756-4445-4824-bab4-d3dfe8e66dc4.png',
      'https://cdn.imaginepro.ai/storage/v1/object/public/cdn/1a4ebf8e-1736-4100-8f32-1c7484bc7f86.png',
      'https://cdn.imaginepro.ai/storage/v1/object/public/cdn/234e4fb4-a505-404b-aa68-159be8b08fff.png',
      'https://cdn.imaginepro.ai/storage/v1/object/public/cdn/3a991da4-9396-4e69-a528-c76bf3157e4d.png'
    ]

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






// const characterImage = "https://cdn.imaginepro.ai/storage/v1/object/public/cdn/509a2f96-947c-4c4f-9ff0-ff030728bcf5.png";

// const characters = `
    // ### Character 1: Dr. Vanessa Sterling
    // **Name:** Dr. Vanessa Sterling
    // **Physical Appearance:** Dr. Vanessa Sterling is in her mid-40s with a poised and professional demeanor. She has short, graphite-grey hair styled in a sleek bob that complements her sharp, analytical eyes. Her skin is a medium tan, and she often wears minimal, but elegant, makeup to highlight her refined features.
    // **Clothing:** Vanessa typically wears well-tailored, charcoal grey suit sets paired with crisp, white blouses. Her style is both practical and authoritative, reflecting her position in academia and her expertise in digital privacy. 
    // **Accessories:** She carries a slim, black leather briefcase containing her research materials and a high-tech tablet with a stylus for electronic note-taking. Vanessa also sports a pair of delicate, silver-rimmed glasses that give her a scholarly appearance. A smartwatch on her wrist keeps her punctual and connected.
    // ### Character 2: Noah Turner
    // **Name:** Noah Turner
    // **Physical Appearance:** Noah Turner is a tech-savvy millennial in his late 20s with an athletic build. He has curly, chestnut-brown hair that casually falls into his expressive, hazel eyes, and his complexion is light olive. A perpetual hint of stubble gives him a slightly rugged yet approachable look.
    // **Clothing:** Noah favors a relaxed, yet modern style. He is often seen in jeans and graphic t-shirts of his favorite tech companies or comic book characters, topped with a casual blazer. During colder months, he adds a hoodie into the mix.
    // **Accessories:** He never parts with his augmented reality glasses that allow him to analyze and interact with 3D digital spaces effortlessly. Additionally, Noah always has a multi-functional backpack equipped with multiple gadgets, ranging from a compact drone to a mini-laptop. A couple of stylish bracelets adorn his wrist, one of which is a smart gadget that tracks environmental data and integrates with his other tech gear.
    // ### Interaction:
    // In this comic, Dr. Vanessa Sterling acts as the knowledgeable guide on the implications of privacy and security concerns, while Noah Turner provides the tech expertise to translate complex technological solutions into practical applications. Together, they embark on a journey to educate real estate professionals and the public about the critical need for privacy in 3D virtual home tours, exploring real-world scenarios and deploying innovative solutions to safeguard personal information.`;
    
//     const script = `Dr. Vanessa Sterling: Noah, have you noticed the rising use of 3D digital twins in online real estate listings?

// Noah Turner: Absolutely, Vanessa. They offer a high level of detail, making virtual tours almost as informative as physical visits. But you’re concerned about privacy, right?

// Dr. Vanessa Sterling: Exactly. Our research shows that these virtual tours can inadvertently expose sensitive personal information. 

// Noah Turner: That sounds serious. So, what kind of personal information are we talking about?

// Dr. Vanessa Sterling: Items like family photos, mail with personal addresses, even medication bottles that indicate medical conditions. All these can be visible in 3D home tours.

// Noah Turner: Wow, I hadn’t thought about it from that angle. Potential adversaries could exploit this data.

// Dr. Vanessa Sterling: Precisely. That’s our fundamental problem—these tours inadvertently leaking sensitive information.

// Noah Turner: So, what’s the solution, Vanessa? How do we protect privacy without losing the benefits of these virtual tours?

// Dr. Vanessa Sterling: We conducted a qualitative analysis of 44 3D home tours to identify the types of personal information at risk. From there, we developed guidelines and technological solutions to mitigate these risks.

// Noah Turner: Guidelines? Like what, advising homeowners to declutter before a virtual tour?

// Dr. Vanessa Sterling: Yes, precisely. But also technological solutions such as automated detection and blurring of sensitive information within the 3D models.

// Noah Turner: That’s really innovative. So, what's the bigger picture here—how will this impact the industry?

// Dr. Vanessa Sterling: The findings highlight the urgent need for stricter privacy protections and effective technological solutions. This could transform industry practices, leading to enhanced privacy regulations and protocols in the digital real estate market.

// Noah Turner: It’s fascinating to see how even advanced tech needs to be carefully balanced with privacy concerns. This will definitely change how we create and present 3D digital twins in real estate.

// Dr. Vanessa Sterling: Indeed. The goal is to harness the benefits of these technologies while ensuring that personal privacy is not compromised.

// Noah Turner: Thanks, Vanessa. I’ll definitely be looking at 3D tours with a more critical eye from now on. We’ve got to stay one step ahead to protect user privacy.

// Dr. Vanessa Sterling: It’s our responsibility as both technologists and educators, Noah. Let’s work together to spread this awareness and implement safer practices.`;
    

    // // Step 1: Create assistant and vector store, upload file
    // const assistant = await createAssistant();
    // console.log("Assistant created");

    // const vectorStore = await uploadFileToVectorStore(paper);
    // console.log("File uploaded to vector store");

    // await updateAssistantWithVectorStore(assistant.id, vectorStore.id);
    // console.log("Assistant updated with vector store");

    // // Step 2: Create thread and run assistant to get summary
    // const thread = await createThread(vectorStore.id);
    // console.log("Thread created");

    // const summary = await runAssistant(thread.id, assistant.id);
    // console.log("Summary created:", summary);