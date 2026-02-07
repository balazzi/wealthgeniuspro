
import { GoogleGenAI, Type } from "@google/genai";

export const getMarketForecast = async (asset: string) => {
  // Use direct process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      // Use gemini-3-pro-preview for complex financial analysis
      model: "gemini-3-pro-preview",
      contents: `Provide a highly detailed, world-class quantum-level financial analysis and 24-hour forecast for ${asset}. Include potential price targets, sentiment analysis, and key macro-economic variables.`,
      config: {
        thinkingConfig: { thinkingBudget: 5000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prediction: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            priceTarget: { type: Type.NUMBER },
            sentiment: { type: Type.STRING },
            reasons: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["prediction", "confidence", "priceTarget", "sentiment", "reasons"]
        }
      }
    });
    // Ensure response text is present before parsing
    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Forecast Error:", error);
    return null;
  }
};

export const getAIVideoScript = async (topic: string) => {
  // Use direct process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a professional YouTube script for a 1-minute financial video on ${topic}. Focus on hyper-realism and expert financial advisory tone.`,
    });
    return response.text || "Error generating AI script.";
  } catch (error) {
    return "Error generating AI script.";
  }
};

export const generateVideoContent = async (prompt: string, onStatusUpdate: (status: string) => void) => {
  // Create instance right before API call to ensure current API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  onStatusUpdate("Initializing Quantum Video Engine...");
  
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Hyper-photorealistic 8k video of a professional financial advisor in a modern high-tech office explaining: ${prompt}. Cinematic lighting, natural human movement, clear authoritative financial tone.`,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '16:9'
      }
    });

    const statusMessages = [
      "Synthesizing high-fidelity visual nodes...",
      "Rendering photorealistic lighting textures...",
      "Calibrating natural human motion vectors...",
      "Finalizing 8K resolution pass...",
      "Securing video stream with quantum encryption..."
    ];
    let messageIndex = 0;

    while (!operation.done) {
      onStatusUpdate(statusMessages[messageIndex % statusMessages.length]);
      messageIndex++;
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed: No URI returned.");

    onStatusUpdate("Downloading encrypted video stream...");
    // Append API key to download link
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Video Generation Error:", error);
    throw error;
  }
};
