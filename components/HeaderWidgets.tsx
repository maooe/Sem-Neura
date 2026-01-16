
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Newspaper, Zap, ExternalLink } from 'lucide-react';
import { getDynamicNewsFeed } from '../services/gemini';

export const HeaderWidgets: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState<string>('Buscando local...');
  const [news, setNews] = useState<{topic: string, headline: string}[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          // Em um app real, faríamos reverse geocoding aqui
          setLocation('Juiz de Fora, MG');
        } catch (e) { setLocation('Localização Ativa'); }
      }, () => setLocation('Localização Manual'));
    }

    // News
    const fetchNews = async () => {
      const data = await getDynamicNewsFeed();
      setNews(data);
    };
    fetchNews();

    return () => clearInterval(timer);
  }, []);

  const handleNewsClick = (headline: string) => {
    const query = encodeURIComponent(headline);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  return (
    <div className="w-full bg-white border-b border-slate-100 px-6 py-3 flex flex-col md:flex-row items-center gap-4 lg:gap-8 overflow-hidden sticky top-0 z-[40] backdrop-blur-md bg-white/80">
      
      {/* Clock & Date */}
      <div className="flex items-center gap-4 bg-slate-100/50 px-4 py-2 rounded-2xl border border-slate-200/50">
        <div className="flex flex-col items-end border-r border-slate-200 pr-4">
          <span className="text-lg font-black text-slate-900 leading-none">
            {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-[10px] font-black text-brand-600 uppercase tracking-tighter">
            {time.toLocaleTimeString('pt-BR', { second: '2-digit' })}s
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {time.toLocaleDateString('pt-BR', { weekday: 'short' })}
          </span>
          <span className="text-xs font-bold text-slate-800">
            {time.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </span>
        </div>
      </div>

      {/* Location */}
      <div className="hidden lg:flex items-center gap-2 text-slate-500">
        <MapPin size={16} className="text-rose-500" />
        <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">{location}</span>
      </div>

      {/* News Ticker */}
      <div className="flex-1 w-full bg-slate-900 text-white rounded-2xl p-2.5 flex items-center gap-4 overflow-hidden shadow-lg shadow-slate-200">
        <div className="flex-shrink-0 bg-brand-600 px-3 py-1 rounded-lg flex items-center gap-2">
          <Newspaper size={14} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">News</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex gap-12 animate-marquee whitespace-nowrap items-center">
            {news.map((item, i) => (
              <div 
                key={i} 
                onClick={() => handleNewsClick(item.headline)}
                className="flex items-center gap-3 cursor-pointer group/news transition-all hover:scale-105"
              >
                <span className="text-[10px] font-black text-brand-400 bg-brand-400/10 px-2 py-0.5 rounded uppercase tracking-widest group-hover/news:bg-brand-400 group-hover/news:text-slate-900 transition-colors">{item.topic}</span>
                <span className="text-xs font-bold text-slate-200 group-hover/news:text-white underline-offset-4 group-hover/news:underline decoration-brand-500">{item.headline}</span>
                <ExternalLink size={10} className="text-slate-500 group-hover/news:text-brand-500" />
                <Zap size={10} className="text-amber-500" />
              </div>
            ))}
            {/* Duplicate for infinite effect */}
            {news.map((item, i) => (
              <div 
                key={`dup-${i}`} 
                onClick={() => handleNewsClick(item.headline)}
                className="flex items-center gap-3 cursor-pointer group/news transition-all hover:scale-105"
              >
                <span className="text-[10px] font-black text-brand-400 bg-brand-400/10 px-2 py-0.5 rounded uppercase tracking-widest group-hover/news:bg-brand-400 group-hover/news:text-slate-900 transition-colors">{item.topic}</span>
                <span className="text-xs font-bold text-slate-200 group-hover/news:text-white underline-offset-4 group-hover/news:underline decoration-brand-500">{item.headline}</span>
                <ExternalLink size={10} className="text-slate-500 group-hover/news:text-brand-500" />
                <Zap size={10} className="text-amber-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          /* Velocidade aumentada: de 40s para 20s */
          animation: marquee 20s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
