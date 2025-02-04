import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_TOKEN;
const genAI = new GoogleGenerativeAI(API_KEY);

export const summarizeReadme = async (text: string): Promise<string> => {
  try {
    const cleanText = text.replace(/[\r\n\t]+/g, " ").trim();
    const MAX_LENGTH = 1000;
    const truncatedText =
      cleanText.length > MAX_LENGTH
        ? cleanText.substring(0, MAX_LENGTH)
        : cleanText;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
    Analyze the following GitHub README content and answer the questions below in a clear and structured manner.  
    Ensure that each answer is clear, descriptive,detailed and provides meaningful context.  
    Do not merge multiple questions into one answer.  
    Avoid extremely short responses—expand where necessary.  
  
  1. What is this repository? and What is the purpose of this repository? 
  2. Who can use this repository?  
  3. What problems does this repository solve?  
  4. What technologies does it use?  
  5. How can it be installed and used?  
  6. Is this repository actively maintained?  
  7. Is any license information mentioned? If so, provide information about this license type.
  8. Does this README contain any warning signs (e.g., "Experimental", "Deprecated", "Not maintained")? If so, list them.

  README: ${truncatedText}

  Format your response as follows:

  Question  
  Response  

  Question  
  Response 
`;


    const result = await model.generateContent(prompt);

    const responseText = result.response.text();
    if (!responseText) throw new Error("Invalid API response");

    return responseText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while generating the summary.";
  }
};
