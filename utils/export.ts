
import { Transaction, TransactionType, ExtendedStatus, CategoryKind, PaymentMethod } from '../types';

export const exportTransactionsToCSV = (transactions: Transaction[]) => {
  if (transactions.length === 0) {
    alert("Nenhum dado para exportar!");
    return;
  }

  // Incluímos o ID no início para permitir restauração precisa
  const headers = [
    'ID',
    'Descrição/Cliente', 
    'Valor', 
    'Vencimento', 
    'Tipo (Fluxo)', 
    'Categoria', 
    'Status', 
    'Meio de Pagamento', 
    'Observação'
  ];
  
  const rows = transactions.map(t => [
    t.id,
    `"${t.description.replace(/"/g, '""')}"`,
    t.amount.toString(),
    t.dueDate,
    t.type,
    t.categoryKind,
    t.status,
    t.paymentMethod,
    `"${(t.observation || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `sem_neura_backup_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importTransactionsFromCSV = (file: File): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/);
        if (lines.length < 2) throw new Error("Arquivo vazio ou inválido.");

        const headers = lines[0].split(',');
        const transactions: Transaction[] = [];

        // Regex para lidar com campos entre aspas que contém vírgulas
        const csvRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(csvRegex).map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'));
          
          // Mapeamento baseado nos headers definidos no export
          const trans: Transaction = {
            id: values[0] || Math.random().toString(36).substr(2, 9),
            description: values[1],
            amount: parseFloat(values[2]),
            dueDate: values[3],
            type: values[4] as TransactionType,
            categoryKind: values[5] as CategoryKind,
            status: values[6] as ExtendedStatus,
            paymentMethod: values[7] as PaymentMethod,
            observation: values[8] || ''
          };

          if (trans.description && !isNaN(trans.amount)) {
            transactions.push(trans);
          }
        }
        resolve(transactions);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Erro ao ler o arquivo."));
    reader.readAsText(file);
  });
};
