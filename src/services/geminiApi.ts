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

    const prompt = `Analyze the GitHub README content below and provide clear and direct answers to the following questions:

      1. Give information about this repo, what is it?
      2. What is this repo used for?
      2. Who can use this repo?
      3. What needs does this repo meet?

      README: ${truncatedText}

      Give your answers in the following format:

      WHAT IS THIS REPO?:[Answer]----

      WHAT IS THIS REPO USED FOR?:[Answer]----

      WHO CAN USE THIS REPO?:[Answer]----

      WHAT NEEDS DOES THIS REPO MEET?:[Answer]
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
