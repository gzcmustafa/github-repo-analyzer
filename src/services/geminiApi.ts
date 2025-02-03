import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEMINI_TOKEN;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateText?key=${API_KEY}`;

export const summarizeReadme = async (text: string): Promise<string> => {
    try {
        const response = await axios.post(GEMINI_API_URL, {
            prompt: { 
              text: `Analyze and summarize the github README content below:
                - What is this repo, what does it do, what is its purpose?
                - What is it used for?, Who can use it?
                - What are its important features?
                 
                README:\n\n${text}`
              }
        });

        return response.data.candidates[0].output.text || "No summary ";
    } catch(error: any) { // add any type
        console.error("API error:", error);
        return "Failed to generate summary. Please try again later.";
    }
};