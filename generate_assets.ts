import { GoogleGenAI } from "@google/genai";

async function generateAssets() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY or API_KEY not found in environment.");
    return;
  }
  const ai = new GoogleGenAI({ apiKey });

  console.log("Generating Logo...");
  try {
    const logoResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A professional industrial gear logo, high-tech, gold and black color scheme, sleek and modern, symmetrical, isolated on a clean white background, 3D rendered style with metallic finish. The gear should look like a precision tool part.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    let logoUrl = "";
    for (const part of logoResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        logoUrl = `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    console.log("Generating Consultant Avatar...");
    const consultantResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A professional 3D industrial consultant avatar, male, wearing a yellow hard hat and a professional grey work shirt with a small gear logo on the pocket, friendly and expert expression, high quality 3D render, isolated on a clean background.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    let consultantUrl = "";
    for (const part of consultantResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        consultantUrl = `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    console.log("LOGO_URL_START");
    console.log(logoUrl);
    console.log("LOGO_URL_END");
    console.log("CONSULTANT_URL_START");
    console.log(consultantUrl);
    console.log("CONSULTANT_URL_END");
  } catch (error) {
    console.error("Error generating assets:", error);
  }
}

generateAssets();
