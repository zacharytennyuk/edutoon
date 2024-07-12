const axios = require('axios');

const generateContent = async (abstract) => {
    try {
        console.log("Generating content...");

        // const prompt = `Generate a fun, engaging, wacky comic depicting two characters 
        // discussing the findings of this research with a setting also 
        // inspired by the research: ${abstract}`;
        // const prompt = `${abstract}`;
        const prompt = `https://image.mymidjourney.ai/storage/v1/object/public/image/temp52162%2F1720758267616FullBaseImage.png Match this image style. The view should be from a different angle. The scene should incorporate aspects of the characters' conversation. ${abstract}`;
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

module.exports = {
    generateContent
};
