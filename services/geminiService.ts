import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCongratulationMessage = async (
  userName: string,
  prizeName: string,
  storeName: string
): Promise<string> => {
  const client = getClient();
  if (!client) {
    return `Chúc mừng ${userName} từ cửa hàng ${storeName}! Bạn đã trúng ${prizeName}.`;
  }

  try {
    const prompt = `
      Hãy viết một lời chúc mừng ngắn gọn, vui vẻ, hài hước và nhiệt huyết (dưới 30 từ) bằng tiếng Việt.
      Người nhận: ${userName} (Chủ cửa hàng: ${storeName}).
      Giải thưởng vừa trúng: "${prizeName}".
      Tông giọng: Marketing, sôi động, khích lệ.
      Không dùng hashtag.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || `Chúc mừng bạn đã trúng ${prizeName}!`;
  } catch (error) {
    console.error("Error generating message:", error);
    return `Chúc mừng ${userName}! Bạn thật may mắn khi trúng ${prizeName}.`;
  }
};
