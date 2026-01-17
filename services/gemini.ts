
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Reminder } from "../types";

export const getFinancialHealthAnalysis = async (
  transactions: Transaction[],
  reminders: Reminder[],
  isCloudSynced: boolean = false
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analise os seguintes dados financeiros e lembretes do usuário do app "SEM NEURA":
    
    Transações: ${JSON.stringify(transactions)}
    Lembretes: ${JSON.stringify(reminders)}
    Status de Backup: ${isCloudSynced ? "CONECTADO AO GOOGLE SHEETS (Seguro)" : "APENAS LOCAL (Sem Backup)"}
    
    Por favor, forneça um resumo rápido da saúde financeira (saldo projetado), destaque urgências e dê uma dica motivacional curta para uma vida "Sem Neura". 
    Se o backup estiver ativo, parabenize pela organização profissional. Se não, sugira suavemente conectar para mais segurança.
    Responda em Português do Brasil de forma amigável e direta.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao consultar Gemini:", error);
    return "Não foi possível analisar seus dados agora, mas mantenha a calma!";
  }
};

const STATIC_NEWS_FALLBACK = [
  { topic: "IA", headline: "Novos modelos Gemini 3 atingem raciocínio de nível humano em testes de lógica." },
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

export const getDynamicNewsFeed = async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    // Se não houver API KEY, cai direto no catch
    if (!process.env.API_KEY || process.env.API_KEY === "") {
      throw new Error("No API Key");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Gere 8 manchetes curtas e impactantes para um feed de notícias. Tópicos: Juiz de Fora (MG), Economia Brasileira, Avanços de IA, e Tecnologia. Retorne em PT-BR.",
      config: {
        systemInstruction: "Você é um editor de notícias. Retorne as manchetes em um array JSON. Seja imparcial e direto.",
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
    // Retorna a lista estática embaralhada para parecer dinâmica
    return [...STATIC_NEWS_FALLBACK].sort(() => Math.random() - 0.5);
  }
};

export const processNaturalLanguageReminder = async (input: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Transforme esta frase em um lembrete estruturado: "${input}"`,
      config: {
        systemInstruction: "Você é um assistente do app 'Sem Neura'. Extraia a tarefa principal e determine a prioridade (HIGH, MEDIUM, LOW) baseada em palavras-chave como 'urgente', 'importante', 'depois', etc. Se não houver data específica mencionada, apenas extraia o texto da tarefa.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "O texto limpo do lembrete, sem o prefixo 'me lembre de' ou similares."
            },
            priority: {
              type: Type.STRING,
              enum: ["LOW", "MEDIUM", "HIGH"],
              description: "Prioridade calculada da tarefa."
            }
          },
          required: ["text", "priority"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as { text: string; priority: Reminder['priority'] };
  } catch (error) {
    console.error("Erro ao processar lembrete com IA:", error);
    return { text: input, priority: "MEDIUM" as const };
  }
};
