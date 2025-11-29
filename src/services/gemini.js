import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeOutfit = async (file) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const imageParts = await fileToGenerativePart(file);

    const prompt = `
    You are a professional Fashion AI Stylist. 
      Your goal is to suggest IMPROVEMENTS and SHOPPING IDEAS.

      ═══════════════════════════════════════════════════════════════════════════════
      ⚙️ STEP 1: DETECTION
      - Detect Gender, Occasion, and Current Outfit.
      - If NO clothing/person detected → Reply ONLY: "❌ No clothing item detected."

      ═══════════════════════════════════════════════════════════════════════════════
      ⚙️ STEP 2: ANALYSIS OUTPUT (Strict Format)
      
      💫 **Quick Review**
      <One-line smart summary with emojis>

      👗 **Outfit Details**
      • **Upper:** <Description>
      • **Lower:** <Description>
      • **Shoes:** <Description>

      ✅ **What Looks Good**
      • <Point 1>
      • <Point 2>

      🚀 **Style Upgrades (What to Buy)**
      (Suggest 3 DIFFERENT categories. Do NOT repeat shoes twice.)
      • <Item 1 - e.g. Footwear>
      • <Item 2 - e.g. Accessory like Watch/Glasses/Jewelry>
      • <Item 3 - e.g. Layering like Jacket/Blazer OR Bag/Hat>

      📸 **Insta Caption**
      <Short influencer-style caption>

      🏷️ **Hashtags**
      #FashionAI #OOTD #StyleGuide

      ═══════════════════════════════════════════════════════════════════════════════
      ⚠️ CRITICAL SHOPPING GENERATOR
      ═══════════════════════════════════════════════════════════════════════════════
      At the very bottom, generate the "SEARCH:" line.
      
      RULES:
      1. Use keywords from the "Style Upgrades" section.
      2. Ensure keywords are DIFFERENT (e.g. 1 Shoe, 1 Watch, 1 Jacket).
      3. MUST include Gender (e.g. "Men's Leather Watch").
      
      Format:
      SEARCH: [Gender]'s [Upgrade Item 1], [Gender]'s [Upgrade Item 2], [Gender]'s [Upgrade Item 3]   

═══════════════════════════════════════════════════════════════════════════════
`;
    const result = await model.generateContent([prompt, imageParts]);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Error details:", error);
    return `Error: ${error.message}`;
  }
};

async function fileToGenerativePart(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(",")[1];
      resolve({
        inlineData: { data: base64Data, mimeType: file.type },
      });
    };
    reader.readAsDataURL(file);
  });
}
