
import { Transaction } from '../types';

export const syncTransactionWithSheets = async (url: string, transaction: Transaction) => {
  if (!url) return false;

  try {
    // Para Google Apps Script, usamos 'no-cors' para evitar problemas de preflight, 
    // mas isso não permite ler a resposta. O try/catch pegará erros de rede.
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });
    console.log('Dados enviados para sincronização via fetch (no-cors)');
    return true;
  } catch (error) {
    console.error('Erro na sincronização:', error);
    return false;
  }
};
