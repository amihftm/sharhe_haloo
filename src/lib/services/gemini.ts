// import './setupProxyFetch';

import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure the API key is loaded from environment variables.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set.');
}

// Initialize the main Google AI client.
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Retrieves an instance of the Generative Model.
 * @param modelName The name of the model to use (e.g., 'gemini-1.5-flash').
 * @returns An instance of the generative model.
 */
export const getGenerativeModel = (modelName = 'gemini-2.5-flash', outputType= 'application/json') => {
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: outputType,
    },
  });
};