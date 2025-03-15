
// Service to interact with the DeepSeek API
import { toast } from "sonner";

const API_KEY = "sk-64e66a972dc4464b967bab5fa2e4cdff";
const API_URL = "https://api.deepseek.com/v1/chat/completions";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export const generateResponse = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are FinanceGenie, a financial assistant specializing in stock market analysis, investment advice, and financial insights. Provide concise, accurate information about stocks, market trends, and financial concepts. Use data to support your answers when possible."
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("DeepSeek API error:", error);
      throw new Error(error.message || "Failed to get a response");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    toast.error("Failed to get a response from the AI");
    return "I'm sorry, I couldn't process your request at the moment. Please try again later.";
  }
};
