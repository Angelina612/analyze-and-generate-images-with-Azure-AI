const endpoint = process.env.REACT_APP_VISION_ENDPOINT;
const key = process.env.REACT_APP_VISION_KEY;

function isConfigured() {
    return endpoint !== undefined && key !== undefined;
}

const { AzureKeyCredential } = require("@azure/core-auth");
const createClient = require('@azure-rest/ai-vision-image-analysis').default;

const credential = new AzureKeyCredential(key);
const client = createClient(endpoint, credential);

const features = [
    'Caption',
    'DenseCaptions',
    'Objects',
    'People',
    'Read',
    'SmartCrops',
    'Tags'
];

// const imageUrl = 'https://aka.ms/azsdk/image-analysis/sample.jpg';

async function analyzeImage(imageUrl) {
  if (!key) {
      console.error('API key is missing. Please check your .env file.');
      return;
  }
  
  const res = client.path('/imageanalysis:analyze').post({
    body: {
        url: imageUrl
    },
    queryParameters: {
        features: features,
        'language': 'en',
        'gender-neutral-captions': 'true',
        'smartCrops-aspect-ratios': [0.9, 1.33]
    },
    contentType: 'application/json'
  });

    return res;
}

export { analyzeImage, isConfigured };