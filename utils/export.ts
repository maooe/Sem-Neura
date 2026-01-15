
import { Transaction } from '../types';

export const exportTransactionsToCSV = (transactions: Transaction[]) => {
  if (transactions.length === 0) {
    alert("Nenhum dado para exportar!");
    return;
  }

  const headers = [
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
