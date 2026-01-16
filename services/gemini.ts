
import { GoogleGenAI } from "@google/genai";
import { Transaction, Reminder } from "../types";

export const getFinancialHealthAnalysis = async (
  transactions: Transaction[],
  reminders: Reminder[],
  isCloudSynced: boolean = false
) => {
  // Fix: Always initialize GoogleGenAI with the current API key from process.env.API_KEY before use
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
    // Fix: Access .text as a property, not a method, as per SDK documentation.
    return response.text;
  } catch (error) {
    console.error("Erro ao consultar Gemini:", error);
    return "Não foi possível analisar seus dados agora, mas mantenha a calma!";
  }
};
