const axios = require('axios');

const generateContent = async (input) => {
    try {
        console.log("Generating content...");

        // const prompt = `Generate a fun, engaging, wacky comic depicting two characters 
        // discussing the findings of this research with a setting also 
        // inspired by the research: ${input}`;

        // Explicitly state: "The characters should be created in a comic art style. The characters should be generated on a blank white background." 

        // Initial image
        const prompt = `${input}`;

        // Panels
        // const prompt = `https://cdn.imaginepro.ai/storage/v1/object/public/image/temp52162%2F1721604080936Test4FullBaseImage.png
        // CREATE ANOTHER IMAGE IN THIS SAME STYLE WITH THE SAME CHARACTERS AND NO OTHERS.
        // THE SCENE SHOULD INCORPORATE ASPECTS OF THE CHARACTERS' CONVERSATION. DO NOT 
        // GENERATE SPEECH BUBBLES, I WILL DO IT MYSELF: ${input}`;
        const apiKey = process.env.MY_MIDJOURNEY_API_KEY;

        if (!apiKey) {
        }

        const requestData = {
            prompt: prompt,
        };

        console.log("Request Data:", requestData);  // Log the request data

        const response = await axios.post(
            'https://api.mymidjourney.ai/api/v1/midjourney/imagine',
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                }
            }
        );

        console.log("API Response:", response.data);

        if (!response.data.success) {
            throw new Error("Image generation request failed");
        }

        const messageId = response.data.messageId;

        // Poll for the status of the image generation
        let imageResponse;
        let attempts = 0;
        const maxAttempts = 20;
        const delay = 10000; // 10 seconds

        while (attempts < maxAttempts) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, delay));

            imageResponse = await axios.get(
                `https://api.mymidjourney.ai/api/v1/midjourney/message/${messageId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                    }
                }
            );

            console.log(`Status Check ${attempts}:`, imageResponse.data);

            if (imageResponse.data.status === 'DONE' && imageResponse.data.uri) {
                break;
            } else if (imageResponse.data.status === 'QUEUED' || imageResponse.data.status === 'PROCESSING') {
                console.log('Image generation is still in progress. Waiting...');
            } else if (imageResponse.data.status === 'FAIL') {
                throw new Error('Image generation failed');
            }
        }

        if (!imageResponse.data.uri) {
            throw new Error("No image found in the response");
        }

        const generatedImage = imageResponse.data.uri;  

        console.log("Generated prompt:", prompt);
        console.log("Generated image:", generatedImage);

        const generatedSummary = "This is a test summary.";
        return { generatedPrompt: prompt, generatedImage, generatedSummary };
    } catch (error) {
        // Log the full error response for debugging
        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);
        } else {
            console.error("Error message:", error.message);
        }

        // Handle specific rate limit error
        if (error.response && error.response.status === 403 && error.response.data.error === 'Forbidden') {
            throw new Error('You have already queued the maximum number of jobs. Please wait for them to complete or upgrade your subscription.');
        }

        throw new Error("Failed to generate content");
    }
};

const generateCharacters = async (input) => {
    try {
        console.log("Generating character image...");
       
        let prompt = `Two comic-style characters in conversation on a blank white background. ${input}
        `;
        
        if (prompt.length > 2048) {
            prompt = prompt.substring(0, 2048);
        }        

        const apiKey = process.env.MY_MIDJOURNEY_API_KEY;

        if (!apiKey) {
        }

        const requestData = {
            prompt: prompt,
        };

        console.log("Request Data:", requestData);  // Log the request data

        const response = await axios.post(
            'https://api.mymidjourney.ai/api/v1/midjourney/imagine',
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                }
            }
        );

        console.log("API Response:", response.data);

        if (!response.data.success) {
            throw new Error("Image generation request failed");
        }

        const messageId = response.data.messageId;

        // Poll for the status of the image generation
        let imageResponse;
        let attempts = 0;
        const maxAttempts = 20;
        const delay = 10000; // 10 seconds

        while (attempts < maxAttempts) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, delay));

            imageResponse = await axios.get(
                `https://api.mymidjourney.ai/api/v1/midjourney/message/${messageId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                    }
                }
            );

            console.log(`Status Check ${attempts}:`, imageResponse.data);

            if (imageResponse.data.status === 'DONE' && imageResponse.data.uri) {
                break;
            } else if (imageResponse.data.status === 'QUEUED' || imageResponse.data.status === 'PROCESSING') {
                console.log('Image generation is still in progress. Waiting...');
            } else if (imageResponse.data.status === 'FAIL') {
                throw new Error('Image generation failed');
            }
        }

        if (!imageResponse.data.uri) {
            throw new Error("No image found in the response");
        }

        const characterImage = imageResponse.data.uri;  

        console.log("Generated prompt:", prompt);
        console.log("Generated image:", characterImage);

        return { characterImage };

    } catch (error) {
        // Log the full error response for debugging
        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);
        } else {
            console.error("Error message:", error.message);
        }

        // Handle specific rate limit error
        if (error.response && error.response.status === 403 && error.response.data.error === 'Forbidden') {
            throw new Error('You have already queued the maximum number of jobs. Please wait for them to complete or upgrade your subscription.');
        }

        throw new Error("Failed to generate content");
    }
};

const generateBackgrounds = async (script, summary) => {
    try {
        console.log("Generating background images...");

        const panels = [];

        for (let i = 0; i < 2; i++) {
            const dialogue = script[i];
            console.log("Panel ", i, " ", dialogue);
            let prompt = `${summary} 
            Identify the topic of focus. Create a comic-style setting related to this topic.`;

            if (prompt.length > 2048) {
                prompt = prompt.substring(0, 2048);
            }

            const apiKey = process.env.MY_MIDJOURNEY_API_KEY;
            if (!apiKey) {
                throw new Error('API key is missing');
            }

            const requestData = { prompt };

            console.log("Request Data:", requestData);

            const response = await axios.post(
                'https://api.mymidjourney.ai/api/v1/midjourney/imagine',
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    }
                }
            );

            if (!response.data.success) {
                throw new Error("Image generation request failed");
            }

            const messageId = response.data.messageId;

            // Poll for the status of the image generation
            let imageResponse;
            let attempts = 0;
            const maxAttempts = 20;
            const delay = 10000; // 10 seconds

            while (attempts < maxAttempts) {
                attempts++;
                await new Promise(resolve => setTimeout(resolve, delay));

                imageResponse = await axios.get(
                    `https://api.mymidjourney.ai/api/v1/midjourney/message/${messageId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                        }
                    }
                );

                if (imageResponse.data.status === 'DONE' && imageResponse.data.uri) {
                    break;
                } else if (imageResponse.data.status === 'QUEUED' || imageResponse.data.status === 'PROCESSING') {
                    console.log('Image generation is still in progress. Waiting...');
                } else if (imageResponse.data.status === 'FAIL') {
                    throw new Error('Image generation failed');
                }
            }

            if (!imageResponse.data.uri) {
                throw new Error("No image found in the response");
            }

            const imageUrl = imageResponse.data.uri;
            panels.push(imageUrl);
            console.log(`Generated panel URL: ${imageUrl}`);
        }

        return panels;

    } catch (error) {
        // Log the full error response for debugging
        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);
        } else {
            console.error("Error message:", error.message);
        }

        // Handle specific rate limit error
        if (error.response && error.response.status === 403 && error.response.data.error === 'Forbidden') {
            throw new Error('You have already queued the maximum number of jobs. Please wait for them to complete or upgrade your subscription.');
        }

        throw new Error("Failed to generate content");
    }
};

module.exports = {
    generateContent,
    generateCharacters,
    generateBackgrounds,
};
