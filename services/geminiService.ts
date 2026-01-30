
import { GoogleGenAI } from "@google/genai";

// استخدام مفتاح فارغ كقيمة افتراضية لتجنب انهيار التطبيق عند التعريف
const getAIInstance = () => {
  const apiKey = (window as any).process?.env?.API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

export const enhanceMessage = async (message: string): Promise<string> => {
  try {
    const ai = getAIInstance();
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
    // العودة للرسالة الأصلية في حال فشل الذكاء الاصطناعي (مثلاً بسبب عدم وجود مفتاح API)
    return message;
  }
};
