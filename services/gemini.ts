
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Reminder } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialHealthAnalysis = async (
  transactions: Transaction[],
  reminders: Reminder[]
) => {
  const prompt = `
    Analise os seguintes dados financeiros e lembretes do usuário do app "SEM NEURA":
    
    Transações: ${JSON.stringify(transactions)}
    Lembretes: ${JSON.stringify(reminders)}
    
    Por favor, forneça um resumo rápido da saúde financeira (saldo projetado), destaque urgências e dê uma dica motivacional curta para uma vida "Sem Neura". Responda em Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao consultar Gemini:", error);
    return "Não foi possível analisar seus dados agora, mas mantenha a calma!";
  }
};
