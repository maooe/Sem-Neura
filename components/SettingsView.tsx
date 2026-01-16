
import React, { useState } from 'react';
import { Settings, Database, Shield, CheckCircle2, Copy, ExternalLink, HelpCircle, Send, AlertCircle, BrainCircuit, ArrowBigDownDash, RefreshCcw, XCircle, LayoutDashboard, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { syncTransactionWithSheets } from '../services/googleSheets.ts';
import { TransactionType } from '../types.ts';

interface SettingsViewProps {
  scriptUrl: string;
  onUrlChange: (url: string) => void;
  onNavigateToDashboard: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ scriptUrl, onUrlChange, onNavigateToDashboard }) => {
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const scriptCode = `function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const json = data.map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h.toLowerCase()] = row[i]);
    return obj;
  });
  return ContentService.createTextOutput(JSON.stringify(json)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const p = JSON.parse(e.postData.contents);
    sheet.appendRow([p.id, p.description, p.amount, p.dueDate, p.status, p.type, p.categoryKind, p.paymentMethod, p.observation]);
    return ContentService.createTextOutput("OK");
  } catch(f) {
    return ContentService.createTextOutput("Erro: " + f);
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestConnection = async () => {
    if (!scriptUrl) return;
    setTesting(true);
    setTestResult(null);
    
    const testData = {
      id: 'test-' + Date.now(),
      description: 'Teste de Conexão - SEM NEURA',
      amount: 0.01,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'PAID' as any,
      type: TransactionType.RECEIVABLE,
      categoryKind: 'VARIABLE' as any,
      paymentMethod: 'PIX' as any,
      observation: 'Se você está vendo isso, a conexão funcionou!'
    };

    const success = await syncTransactionWithSheets(scriptUrl, testData as any);
    setTestResult(success ? 'success' : 'error');
    setTesting(false);
  };

  const handleClear = () => {
    onUrlChange('');
    setTestResult(null);
  };

  // Função para lidar com clique no fundo (fora do conteúdo principal)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onNavigateToDashboard();
    }
  };

  return (
    <div 
      className="min-h-screen pb-32 animate-in fade-in duration-500 cursor-pointer"
      onClick={handleBackdropClick}
    >
      <div className="max-w-5xl mx-auto space-y-10 cursor-default" onClick={e => e.stopPropagation()}>
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 relative">
          <div className="flex items-center gap-6">
            <button 
              onClick={onNavigateToDashboard}
              className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-2xl transition-all shadow-sm group active:scale-95"
              title="Voltar ao Painel"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="p-4 bg-blue-600 text-white rounded-[1.5rem] shadow-xl shadow-blue-100 hidden sm:block">
              <Settings size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Configurações</h2>
              <p className="text-slate-500 font-bold text-sm mt-1">Personalize sua experiência sem neura</p>
            </div>
          </div>

          <button 
            onClick={onNavigateToDashboard}
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100 active:scale-95"
          >
            <X size={18} /> Sair das Configurações
          </button>
        </header>

        {/* PAINEL DE CONEXÃO */}
        <section className="bg-blue-600 rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-blue-200 text-white relative overflow-hidden border-4 border-white">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                <Database size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Conexão Google Sheets</h3>
                <p className="text-blue-100 font-medium">Sincronize seus dados com o Passo 4</p>
              </div>
            </div>

            <div className="space-y-8 bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/20">
              <div className="flex flex-col gap-4">
                 <div className="flex justify-between items-center">
                   <label className="text-xs font-black uppercase tracking-[0.2em] text-blue-200 flex items-center gap-2">
                     <ArrowBigDownDash size={16} /> URL do Script (Passo 4)
                   </label>
                   {scriptUrl && (
                     <button onClick={handleClear} className="text-[10px] font-black uppercase text-blue-200 hover:text-white flex items-center gap-1 transition-colors">
                       <XCircle size={14} /> Limpar URL
                     </button>
                   )}
                 </div>
                 <input 
                   type="text" 
                   value={scriptUrl}
                   onChange={(e) => onUrlChange(e.target.value)}
                   placeholder="Cole aqui o link gerado no Google (Ex: https://script.google.com/...)"
                   className="w-full bg-white text-slate-900 p-6 rounded-2xl text-sm font-bold shadow-inner focus:ring-4 focus:ring-blue-400 outline-none transition-all placeholder:text-slate-300"
                 />
              </div>

              <div className="flex flex-col md:flex-row items-stretch gap-4">
                {scriptUrl ? (
                  <>
                    <div className={`flex-1 flex items-center gap-3 px-6 py-4 rounded-2xl border text-sm font-black italic transition-all ${testResult === 'success' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-100' : 'bg-white/10 border-white/30 text-white'}`}>
                      {testResult === 'success' ? <CheckCircle2 size={20} className="text-emerald-400" /> : <RefreshCcw size={20} className="animate-spin-slow" />}
                      {testResult === 'success' ? 'CONEXÃO ATIVA E FUNCIONANDO!' : 'AGUARDANDO TESTE'}
                    </div>
                    <button 
                      onClick={handleTestConnection}
                      disabled={testing}
                      className={`flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all w-full md:w-auto shadow-2xl active:scale-95
                        ${testResult === 'success' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 
                          testResult === 'error' ? 'bg-rose-500 text-white hover:bg-rose-600' : 
                          'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-white/20'}`}
                    >
                      {testing ? 'TESTANDO...' : (
                        <>
                          {testResult === 'success' ? <CheckCircle2 size={20} /> : <Send size={20} />}
                          TESTAR CONEXÃO
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="w-full p-6 border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center gap-3 text-blue-100 text-sm font-bold italic">
                    <AlertCircle size={20} /> O botão de teste aparecerá assim que você colar a URL.
                  </div>
                )}
              </div>

              {testResult === 'success' && (
                <div className="pt-4 animate-in zoom-in-95 fade-in duration-500">
                  <button 
                    onClick={onNavigateToDashboard}
                    className="w-full bg-slate-900 text-white p-6 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-black transition-all shadow-2xl group"
                  >
                    <LayoutDashboard size={24} className="group-hover:rotate-12 transition-transform" />
                    TUDO PRONTO! IR PARA O DASHBOARD AGORA
                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="absolute -bottom-20 -right-20 opacity-10 pointer-events-none">
            <Database size={400} />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl">
            <h4 className="font-black text-slate-800 uppercase text-sm tracking-[0.2em] mb-8 flex items-center gap-3">
               <HelpCircle size={20} className="text-indigo-500" /> O que fazer agora?
            </h4>
            <div className="space-y-6">
              {[
                { step: "A", text: "Vá para o Dashboard e comece a lançar suas contas." },
                { step: "B", text: "Verifique sua planilha do Google. Uma linha de teste já foi criada!" },
                { step: "C", text: "Use a IA Conselheira no topo do Dashboard para planejar seu mês." },
                { step: "D", text: "Fique sem neura: seus dados estão salvos e seguros na nuvem." }
              ].map(item => (
                <div key={item.step} className="flex gap-5 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-sm text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">{item.step}</div>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed pt-2">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6">Código do Servidor</h4>
              <div className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-inner bg-black/40">
                <div className="absolute top-4 right-4 z-10">
                  <button 
                    onClick={handleCopy}
                    className="p-3 bg-white text-slate-900 rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2 text-xs font-black shadow-lg"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    {copied ? 'COPIADO!' : 'COPIAR CÓDIGO'}
                  </button>
                </div>
                <pre className="p-8 text-[10px] leading-relaxed overflow-x-auto max-h-[300px] custom-scrollbar text-blue-200/70 font-mono">
                  <code>{scriptCode}</code>
                </pre>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
