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
    Analyze the following GitHub README content and answer the questions below in a clear and structured manner and if there isn't answer on readme you can interpret.  
    Ensure that each answer is clear, descriptive,detailed and provides meaningful context.  
    Do not merge multiple questions into one answer.  
    Avoid extremely short responses—expand where necessary.  
    DO NOT use any Markdown formatting or special characters like asterisks (*) in your response.
   DO NOT use sentences like "The README itself doesn't explicitly", "The README provides no explicit"
    When information is not available, simply state what IS available rather than what is NOT available.
    Be direct and assertive in your responses without hedging or using phrases like "based on the excerpt" or "it's not possible to determine".
    Show question, everytime
      
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


export const summarizeCommitDate = async (text:string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({model:"gemini-2.0-flash-exp"});
    const prompt = `
    Analyze these commit times and provide a brief summary about when the team is most active.
    Focus on their primary working hours and whether they are morning, afternoon, evening, or night workers.
    When mentioning time ranges, provide broader periods (like "early morning", "late afternoon", "mid-night") rather than specific hours.

    TEXT: ${text}

    Provide a two-sentence summary like this:
    "The team is most active during the late afternoon hours. 
    They appear to be primarily afternoon workers, with their peak activity typically in the late afternoon to early evening UTC."

    Keep it simple but informative. Avoid specific hour ranges, instead use general time periods.
  `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    if (!responseText) throw new Error("Invalid API response");
    return responseText;

  }
  catch(error){
    console.error("Gemini API Error:",error);
    return "There is error :("
  }
}
