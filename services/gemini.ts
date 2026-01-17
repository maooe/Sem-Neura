
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Reminder } from "../types";

export const STATIC_NEWS_FALLBACK = [
  { topic: "MODO OFFLINE", headline: "Bem-vindo ao Sem Neura! Configure sua API_KEY para notícias em tempo real." },
  { topic: "DICA", headline: "Organizar gastos fixos é o primeiro passo para a liberdade financeira." },
  { topic: "ECONOMIA", headline: "Mercado prevê estabilidade na taxa Selic para o próximo trimestre." },
  { topic: "JF", headline: "Juiz de Fora registra crescimento de 15% em novos negócios digitais." },
  { topic: "TECNOLOGIA", headline: "Brasil se torna hub de desenvolvimento para startups de Inteligência Artificial." },
  { topic: "FINANÇAS", headline: "Uso de apps de gestão cresce 40% entre brasileiros que buscam sair do vermelho." },
  { topic: "IA", headline: "Como pequenos empreendedores estão usando IA para dobrar produtividade." }
];

const getApiKey = (): string => {
  try {
    // Tenta pegar do ambiente injetado (Vercel/Cloud)
    if (typeof process !== 'undefined' && process?.env?.API_KEY) {
      return process.env.API_KEY;
    }
    // Tenta pegar do window
    if ((window as any).process?.env?.API_KEY) {
      return (window as any).process.env.API_KEY;
    }
    if ((window as any).API_KEY) {
      return (window as any).API_KEY;
    }
  } catch (e) {
    console.warn("Erro ao acessar API_KEY:", e);
  }
  return "";
};

export const getFinancialHealthAnalysis = async (
  transactions: Transaction[],
  reminders: Reminder[],
  isCloudSynced: boolean = false
): Promise<string> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey || apiKey.length < 10) return "Modo Offline: Configure sua chave Gemini no painel do Vercel para análises inteligentes.";

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      Analise os seguintes dados financeiros e lembretes do usuário do app "SEM NEURA":
      Transações: ${JSON.stringify(transactions)}
      Lembretes: ${JSON.stringify(reminders)}
      Status de Backup: ${isCloudSynced ? "CONECTADO" : "LOCAL"}
      Forneça um resumo rápido e uma dica curta em PT-BR.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.7 }
    });
    return response.text || "Análise concluída com sucesso.";
  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    return "Foque na organização! Seus dados estão salvos localmente.";
  }
};

export const getDynamicNewsFeed = async () => {
  try {
    const apiKey = getApiKey();
    if (!apiKey || apiKey.length < 10) return [...STATIC_NEWS_FALLBACK];

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Gere 8 manchetes curtas sobre Juiz de Fora, Economia e IA. Retorne em JSON.",
      config: {
        systemInstruction: "Retorne apenas o array JSON de objetos {topic, headline}.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              headline: { type: Type.STRING }
            },
            required: ["topic", "headline"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.warn("Usando fallback de notícias devido a erro na API.");
    return [...STATIC_NEWS_FALLBACK].sort(() => Math.random() - 0.5);
  }
};

export const processNaturalLanguageReminder = async (input: string) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey || apiKey.length < 10) return { text: input, priority: "MEDIUM" as const };

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Transforme em lembrete: "${input}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] }
          },
          required: ["text", "priority"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return { text: input, priority: "MEDIUM" as const };
  }
};
