
import React, { useState } from 'react';
import { ChevronLeft, Palette, Eye, EyeOff, LayoutGrid } from 'lucide-react';

interface CardSettingsViewProps {
  onBack: () => void;
}

const CardSettingsView: React.FC<CardSettingsViewProps> = ({ onBack }) => {
  const [auraColor, setAuraColor] = useState('yellow');
  const [showLocation, setShowLocation] = useState(true);
  const [showAge, setShowAge] = useState(true);
  const [borderWidth, setBorderWidth] = useState('thick');

  const auraColors = [
    { id: 'yellow', hex: '#EAB308', name: '极客黄' },
    { id: 'red', hex: '#EF4444', name: '热血红' },
    { id: 'blue', hex: '#3B82F6', name: '深空蓝' },
    { id: 'black', hex: '#000000', name: '极简黑' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-6 py-6 border-b border-black flex items-center justify-between sticky top-0 bg-white z-10">
        <button onClick={onBack} className="w-10 h-10 border border-black flex items-center justify-center active:scale-95 transition-transform">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter italic">开卡设置.</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-8 space-y-10 pb-32">
        {/* Preview Card */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">视觉预览.</h3>
          <div className="p-8 border border-black bg-gray-50 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
             <div 
               className={`w-full max-w-[200px] aspect-[3/4] border-black p-4 bg-white flex flex-col justify-between transition-all duration-500`}
               style={{ 
                 borderWidth: borderWidth === 'thick' ? '3px' : '1px',
                 boxShadow: `8px 8px 0px 0px ${auraColors.find(c => c.id === auraColor)?.hex}` 
               }}
             >
                <div className="w-12 h-12 border-2 border-black bg-black grayscale"></div>
                <div>
                   <h4 className="font-black text-xs uppercase mb-1">亚历克斯</h4>
                   <div className="flex flex-wrap gap-1">
                      {showAge && <span className="text-[7px] font-black border border-black px-1">23</span>}
                      {showLocation && <span className="text-[7px] font-black border border-black px-1">上海</span>}
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Aura Selection */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Palette size={16}/>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">身份光晕 / AURA</h3>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {auraColors.map(color => (
              <button 
                key={color.id}
                onClick={() => setAuraColor(color.id)}
                className={`aspect-square border-2 flex items-center justify-center transition-all ${auraColor === color.id ? 'border-black' : 'border-transparent'}`}
              >
                <div 
                  className="w-full h-full shadow-inner" 
                  style={{ backgroundColor: color.hex }}
                ></div>
              </button>
            ))}
          </div>
        </section>

        {/* Visibility Toggles */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Eye size={16}/>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">隐私显示 / VISIBILITY</h3>
          </div>
          <div className="border border-black divide-y divide-black">
            <button 
              onClick={() => setShowLocation(!showLocation)}
              className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">显示距离与位置</span>
              {showLocation ? <Eye size={16} className="text-green-500" /> : <EyeOff size={16} className="text-gray-300" />}
            </button>
            <button 
              onClick={() => setShowAge(!showAge)}
              className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">显示年龄信息</span>
              {showAge ? <Eye size={16} className="text-green-500" /> : <EyeOff size={16} className="text-gray-300" />}
            </button>
          </div>
        </section>

        {/* Border Style */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <LayoutGrid size={16}/>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">边框张力 / TENSION</h3>
          </div>
          <div className="flex border border-black h-12 overflow-hidden">
             <button 
               onClick={() => setBorderWidth('thin')}
               className={`flex-1 font-black text-[9px] uppercase tracking-widest transition-all ${borderWidth === 'thin' ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
             >
               轻盈
             </button>
             <button 
               onClick={() => setBorderWidth('thick')}
               className={`flex-1 font-black text-[9px] uppercase tracking-widest border-l border-black transition-all ${borderWidth === 'thick' ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
             >
               厚重
             </button>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 border-t border-black bg-white">
        <button 
          onClick={onBack}
          className="w-full bg-black text-white py-4 font-black text-[10px] uppercase tracking-[0.5em] shadow-[4px_4px_0px_0px_rgba(234,179,8,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
        >
          保存设置
        </button>
      </div>
    </div>
  );
};

export default CardSettingsView;
