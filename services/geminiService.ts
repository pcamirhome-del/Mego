
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const enhanceMessage = async (message: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `قم بتحسين واحترافية رسالة التسويق التالية عبر واتساب لتكون أكثر جاذبية ووضوحاً باللغة العربية. حافظ على نبرة ودودة ولكن احترافية. الرسالة: "${message}"`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || message;
  } catch (error) {
    console.error("Gemini Error:", error);
    return message;
  }
};
