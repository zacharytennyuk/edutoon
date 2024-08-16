const axios = require('axios');

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

        // console.log("Request Data:", requestData);  // Log the request data

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

        // console.log("API Response:", response.data);

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

            // console.log(`Status Check ${attempts}:`, imageResponse.data);

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

        // console.log("Generated prompt:", prompt);
        // console.log("Generated image:", characterImage);

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

const generateBackgrounds = async (script, summary, backgrounds) => {
    try {
        console.log("Generating background images...");

        const panels = [];

        for (let i = 0; i < backgrounds.length; i++) {
            const background = backgrounds[i];
            console.log("Panel ", i, " ", background);
            let prompt = `${background} 
            Use a comic art style`;

            if (prompt.length > 2048) {
                prompt = prompt.substring(0, 2048);
            }

            const apiKey = process.env.MY_MIDJOURNEY_API_KEY;
            if (!apiKey) {
                throw new Error('API key is missing');
            }

            const requestData = { prompt };

            // console.log("Request Data:", requestData);

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
    generateCharacters,
    generateBackgrounds,
};
