const axios = require('axios');

const generateContent = async (abstract) => {
    try {
        console.log("Generating content...");

        const prompt = `Generate an image based on a scenario inspired by this abstract: ${abstract}`;
        const apiKey = process.env.MY_MIDJOURNEY_API_KEY;

        if (!apiKey) {
            throw new Error("API key is not defined");
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
        const maxAttempts = 10;
        const delay = 5000; // 5 seconds

        while (attempts < maxAttempts) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, delay));

            imageResponse = await axios.get(
                `https://api.mymidjourney.ai/api/v1/midjourney/imagine/status/${messageId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                    }
                }
            );

            console.log(`Status Check ${attempts}:`, imageResponse.data);

            if (imageResponse.data.status === 'completed' && imageResponse.data.images && imageResponse.data.images.length > 0) {
                break;
            } else if (imageResponse.data.status === 'queued') {
                console.log('Image generation is still queued. Waiting...');
            } else if (imageResponse.data.status === 'failed') {
                throw new Error('Image generation failed');
            }
        }

        if (!imageResponse.data.images || imageResponse.data.images.length === 0) {
            throw new Error("No images found in the response");
        }

        const generatedImage = imageResponse.data.images[0];  

        console.log("Generated prompt:", prompt);
        console.log("Generated image:", generatedImage);

        return { generatedPrompt: prompt, generatedImage };
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
