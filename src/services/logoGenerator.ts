import { GoogleGenAI } from "@google/genai";

async function generateLogo() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: 'A high-quality, professional metallic logo for an industrial engineering app. The logo features a symmetrical gear-like or mechanical symbol with a brushed steel or titanium texture. It has a 3D effect with subtle shadows and highlights, set against a dark, textured slate or concrete background. The style is clean, modern, and technical, conveying precision and strength. The symbol is centered and takes up most of the frame.',
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}

export { generateLogo };
