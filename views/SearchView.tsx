
import React, { useState } from 'react';
import { ChevronLeft, Search, X, Clock, Sparkles } from 'lucide-react';

interface SearchViewProps {
  onBack: () => void;
  onUserClick: (id: string) => void;
}

const SearchView: React.FC<SearchViewProps> = ({ onBack, onUserClick }) => {
  const [query, setQuery] = useState('');
  const history = ['极简主义', '上海咖啡店', '胶片摄影', 'Gemini'];
  const trending = ['#北京大雪', '#AI艺术', '#秒回新版本', '#我的视觉记录'];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-6 py-6 border-b border-black flex items-center gap-4 sticky top-0 bg-white z-20">
        <button onClick={onBack} className="p-2 -ml-2"><ChevronLeft size={24} /></button>
        <div className="flex-1 relative border-2 border-black p-1 bg-white">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={16} />
          <input 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索全域内容"
            className="w-full bg-transparent py-2.5 pl-9 pr-8 text-xs font-black outline-none uppercase"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} />
            </button>
          )}
        </div>
      </header>

      <div className="p-6 space-y-10">
        {!query ? (
          <>
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-gray-300 tracking-[0.4em] uppercase">最近搜索.</h3>
                <button className="text-[8px] font-black uppercase text-gray-300">清除历史</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => setQuery(item)}
                    className="flex items-center gap-2 border border-black px-3 py-2 text-[9px] font-black uppercase hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <Clock size={12} className="text-gray-300" />
                    {item}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-300 tracking-[0.4em] uppercase">当下趋势.</h3>
              <div className="border border-black divide-y divide-black shadow-[4px_4px_0px_0px_rgba(234,179,8,1)]">
                {trending.map((tag, i) => (
                  <button 
                    key={i}
                    onClick={() => setQuery(tag.replace('#', ''))}
                    className="w-full p-5 flex items-center justify-between hover:bg-gray-50 group transition-colors"
                  >
                    <span className="text-[11px] font-black uppercase tracking-widest">{tag}</span>
                    <Sparkles size={14} className="text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="py-20 text-center">
            <div className="w-16 h-16 border-2 border-black border-t-transparent animate-spin mx-auto mb-6"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">正在检索全网脉动...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;
