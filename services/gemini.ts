
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Reminder } from "../types";

const STATIC_NEWS_FALLBACK = [
  { topic: "MODO OFFLINE", headline: "Bem-vindo ao Sem Neura! Configure sua API_KEY para notícias em tempo real." },
  { topic: "ECONOMIA", headline: "Mercado prevê estabilidade na taxa Selic para o próximo trimestre." },
  { topic: "TECNOLOGIA", headline: "Brasil se torna hub de desenvolvimento para startups de Inteligência Artificial." },
  { topic: "JF", headline: "Juiz de Fora registra crescimento de 15% em novos negócios digitais." },
  { topic: "FINANÇAS", headline: "Uso de apps de gestão cresce 40% entre brasileiros que buscam sair do vermelho." },
  { topic: "GOOGLE", headline: "Google anuncia integração profunda de IA em ferramentas de produtividade." },
  { topic: "MERCADO", headline: "Criptoativos registram alta após novas regulamentações favoráveis." },
  { topic: "BRASIL", headline: "Investimentos em energia limpa batem recorde no primeiro semestre." },
  { topic: "DICA", headline: "Organizar gastos fixos é o primeiro passo para a liberdade financeira." },
  { topic: "IA", headline: "Como pequenos empreendedores estão usando IA para dobrar produtividade." }
];

const getApiKey = () => {
  // Tenta pegar de várias fontes possíveis em ambientes de deploy
  return process.env.API_KEY || (window as any).process?.env?.API_KEY || "";
};

export const getFinancialHealthAnalysis = async (
  transactions: Transaction[],
  reminders: Reminder[],
  isCloudSynced: boolean = false
) => {
  const apiKey = getApiKey();
  if (!apiKey) return "Modo Offline: Configure sua chave Gemini nas configurações para análises inteligentes.";

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Analise os seguintes dados financeiros e lembretes do usuário do app "SEM NEURA":
    Transações: ${JSON.stringify(transactions)}
    Lembretes: ${JSON.stringify(reminders)}
    Status de Backup: ${isCloudSynced ? "CONECTADO AO GOOGLE SHEETS" : "APENAS LOCAL"}
    Forneça um resumo rápido da saúde financeira e uma dica motivacional curta em PT-BR.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.7 }
    });
    return response.text;
  } catch (error) {
    return "Não foi possível analisar seus dados agora. Foque na organização!";
  }
};

export const getDynamicNewsFeed = async () => {
  const apiKey = getApiKey();
  
  // Se não tem chave, nem tenta a API para não travar o carregamento
  if (!apiKey || apiKey === "") {
    return [...STATIC_NEWS_FALLBACK].sort(() => Math.random() - 0.5);
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Gere 8 manchetes curtas e impactantes para um feed de notícias. Tópicos: Juiz de Fora (MG), Economia Brasileira, Avanços de IA, e Tecnologia. Retorne em PT-BR.",
      config: {
        systemInstruction: "Você é um editor de notícias. Retorne as manchetes em um array JSON.",
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
    console.error("Gemini News Error:", error);
    return [...STATIC_NEWS_FALLBACK].sort(() => Math.random() - 0.5);
  }
};

export const processNaturalLanguageReminder = async (input: string) => {
  const apiKey = getApiKey();
  if (!apiKey) return { text: input, priority: "MEDIUM" as const };

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Transforme esta frase em um lembrete estruturado: "${input}"`,
      config: {
        systemInstruction: "Extraia a tarefa e prioridade (HIGH, MEDIUM, LOW).",
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
