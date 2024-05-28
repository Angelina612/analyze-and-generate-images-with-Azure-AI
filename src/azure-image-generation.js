const key = process.env.REACT_APP_OPENAI_KEY;
const url = "https://api.openai.com/v1/images/generations";

function isConfigured() {
    return key !== undefined;
}

async function generateImage(prompt) {
    if (!key) {
        console.error('API key is missing. Please check your .env file.');
        return;
    }

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`,
        },
        body: JSON.stringify({
        prompt: prompt,
        model: "dall-e-2",
        n: 1,
        size: "1024x1024"
        }),
    });
    
    console.log(key);
    return await res.json();
    // return key;
}

export { generateImage, isConfigured };

