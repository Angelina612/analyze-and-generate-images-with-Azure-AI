import React, { useState } from 'react';
import { analyzeImage, isConfigured as analyze_configured} from './azure-image-analysis';
import { generateImage, isConfigured as generate_configured } from './azure-image-generation';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [functionType, setFunctionType] = useState('');

  const handleInputChange = (event) => {
    setFunctionType('');
    setInputValue(event.target.value);
    setResult(null);
  };

  const handleAnalyzeClick = async () => {
    // Add your analyze logic here
    setFunctionType('analyze');
    setLoading(true);
    const response = await analyzeImage(inputValue);
    setResult(response.body);
    setLoading(false);
    console.log(response);
  };

  const handleGenerateClick = async () => {
    // Add your generate logic here
    setFunctionType('generate');
    setLoading(true);
    const response = await generateImage(inputValue);
    // const response = {
    //     "created": 1589478378,
    //     "data": [
    //       {
    //         "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL5PMmapngRdbxX-oxEiQkiv087tjyX41l7TahbaCiPFXQcax1_UzpVlZ0iMiDPDGMuqI&usqp=CAU"
    //       },
    //       {
    //         "url": "https://example.com/image2"
    //       }
    //     ]
    //   };

    setResult(response);
    setLoading(false);
  };

  const DisplayResults = () => {
    if (!analyze_configured() || !generate_configured()) {
      return <p>Key and/or endpoint not configured for conginitive services</p>;
    }

    if (loading) {
      return <p>Loading...</p>;
    }

    if (result === null) {
      return null;
    }

    if (result.error) {
      return <p>Error: {result.error.message}</p>;
    }

    if (functionType === 'analyze') {
      return (
        <div>
          <h2>Computer Vision Analysis</h2>
          <img src={inputValue} width="500"/>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      );
    }

    else if (functionType === 'generate') {      
      const url = result.data.map((item) => item.url)[0];
      const data = {
        "prompt": inputValue,
        "URL": url
      };

      return (
        <div>
          <h2>Image Generation</h2>
          <img src={url} width="500"/>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      );
    }
    
  };

  return (
    <div>
      <h1>Computer Vision</h1>
      <label htmlFor="url">Insert URL or type prompt:<br/></label>
      <input
        type="text"
        id="url"
        placeholder="Enter URL to analyze or textual prompt to generate an image"
        value={inputValue}
        onChange={handleInputChange}
      />
      <br/>
      <button onClick={handleAnalyzeClick} >Analyze</button>
      <button onClick={handleGenerateClick}>Generate</button>

      <DisplayResults/>
    </div>
  );
}

export default App;