
export const exportFullBackupJSON = () => {
  const backupData: Record<string, string | null> = {};
  
  // Captura todas as chaves do localStorage relacionadas ao app
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('sn_')) {
      backupData[key] = localStorage.getItem(key);
    }
  }

  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `sem_neura_FULL_BACKUP_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importFullBackupJSON = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (typeof data !== 'object') throw new Error('Formato inválido');
        
        // Validação básica: deve ter chaves começando com sn_
        const keys = Object.keys(data);
        if (keys.length === 0 || !keys.some(k => k.startsWith('sn_'))) {
          throw new Error('Arquivo não contém dados do Sem Neura');
        }

        // Limpa dados atuais e insere os novos
        // Nota: O ideal é filtrar chaves sn_ apenas para não apagar outras coisas do domínio
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('sn_')) {
            localStorage.removeItem(key);
          }
        }

        Object.entries(data).forEach(([key, value]) => {
          if (value) localStorage.setItem(key, value as string);
        });

        resolve(true);
      } catch (err) {
        console.error('Erro na restauração:', err);
        resolve(false);
      }
    };
    reader.readAsText(file);
  });
};
