
import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types';

// Use named parameter and direct process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialInsights = async (transactions: Transaction[]) => {
  const prompt = `
    As an expert financial advisor, analyze the following recent transactions and provide 3 concise, actionable insights for the user's financial health.
    Format the response as 3 short bullet points.
    
    Transactions: ${JSON.stringify(transactions.slice(0, 10))}
    
    Guidelines:
    1. Look for patterns in spending.
    2. Suggest potential savings.
    3. Be encouraging but direct.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    // Use .text property to extract output string as per guidelines
    return response.text || "No insights available at this moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate insights right now.";
  }
};
