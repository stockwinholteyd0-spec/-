
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Zap, Shield, Sparkles, CheckCircle2, Crown, Eye, MessageSquare, RefreshCw, Check } from 'lucide-react';

interface MemberPurchaseViewProps {
  onBack: () => void;
  isCurrentlyMember?: boolean;
  onActivate: () => void;
}

const MemberPurchaseView: React.FC<MemberPurchaseViewProps> = ({ onBack, isCurrentlyMember, onActivate }) => {
  const [selectedTier, setSelectedTier] = useState<string>('annual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const benefits = [
    { icon: <MessageSquare size={24}/>, label: '无限全域聊天' },
    { icon: <Eye size={24}/>, label: '查看访客记录' },
    { icon: <Sparkles size={24}/>, label: '专属黑金标识' },
    { icon: <Shield size={24}/>, label: '高级隐私模式' }
  ];

  const tiers = [
    { id: 'monthly', name: '月度会员', price: '28', period: '/ 月', desc: '短期体验即时社交魅力' },
    { id: 'annual', name: '年度黄金', price: '198', period: '/ 年', desc: '最受欢迎的城市探索方案', popular: true },
  ];

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      triggerSuccess();
    }, 2000);
  };

  const handleRestore = () => {
    setIsRestoring(true);
    setTimeout(() => {
      setIsRestoring(false);
      // Simulate checking server for existing sub
      const hasPrevious = Math.random() > 0.5;
      if (hasPrevious) {
        triggerSuccess();
      } else {
        alert('未发现有效的历史订阅记录。');
      }
    }, 1500);
  };

  const triggerSuccess = () => {
    onActivate();
    setShowSuccessOverlay(true);
    setTimeout(() => {
      setShowSuccessOverlay(false);
      onBack();
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white relative">
      <header className="px-6 py-8 flex items-center justify-between sticky top-0 bg-[#0A0A0A] z-20 border-b border-white/5">
        <button onClick={onBack} className="w-10 h-10 border border-white/20 flex items-center justify-center active:scale-95 transition-transform bg-white/5">
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <Crown size={20} className="text-yellow-400 mb-1" />
          <h1 className="text-[10px] font-black uppercase tracking-[0.5em] italic">BlackGold Member</h1>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar pb-40">
        <div className="border border-yellow-400/30 p-6 bg-gradient-to-br from-yellow-400/10 to-transparent relative overflow-hidden shadow-[0_0_20px_rgba(234,179,8,0.1)]">
           <div className="relative z-10 flex justify-between items-center">
              <div>
                <p className="text-[8px] font-black text-yellow-400 uppercase tracking-widest mb-1">当前身份状态 / IDENTITY</p>
                <h2 className="text-2xl font-black italic tracking-tight">{isCurrentlyMember ? '黑金贵宾' : '尚未激活'}</h2>
              </div>
              <div className="w-12 h-12 rounded-full border border-yellow-400 p-0.5 overflow-hidden shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                 <img src="https://picsum.photos/seed/user-me/100" className="w-full h-full object-cover grayscale" />
              </div>
           </div>
        </div>

        <section className="space-y-4">
          <h3 className="text-[8px] font-black text-gray-500 tracking-[0.4em] uppercase">会员特权矩阵 / BENEFITS</h3>
          <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 overflow-hidden">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-[#0A0A0A] p-8 flex flex-col items-start gap-4 hover:bg-white/5 transition-colors group">
                <div className="text-yellow-400 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <span className="text-[11px] font-black tracking-widest uppercase leading-tight">
                  {benefit.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[8px] font-black text-gray-500 tracking-[0.4em] uppercase text-center mb-6">选择适合您的席位 / PRICING</h3>
          <div className="grid grid-cols-1 gap-4">
            {tiers.map(tier => (
              <div 
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`relative border p-6 cursor-pointer transition-all duration-300 ${
                  selectedTier === tier.id 
                  ? 'border-yellow-400 bg-yellow-400 text-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]' 
                  : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
              >
                {tier.popular && (
                  <div className={`absolute -top-3 right-4 px-2 py-0.5 text-[7px] font-black uppercase tracking-widest border ${selectedTier === tier.id ? 'bg-black text-white border-black' : 'bg-white text-black border-white'}`}>
                    Hot Choice
                  </div>
                )}
                <div className="flex justify-between items-end mb-1">
                  <h4 className="font-black text-sm uppercase tracking-widest">{tier.name}</h4>
                  <div className="flex items-baseline">
                    <span className="text-[10px] font-black mr-1 uppercase">¥</span>
                    <span className="text-3xl font-black italic tracking-tighter leading-none">{tier.price}</span>
                    <span className="text-[8px] font-black opacity-50 ml-1 uppercase">{tier.period}</span>
                  </div>
                </div>
                <p className={`text-[8px] font-bold uppercase tracking-[0.2em] ${selectedTier === tier.id ? 'text-black/60' : 'text-gray-500'}`}>
                  {tier.desc}
                </p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center pt-4">
            <button 
              onClick={handleRestore}
              disabled={isRestoring || isCurrentlyMember}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors disabled:opacity-30"
            >
              <RefreshCw size={12} className={isRestoring ? 'animate-spin' : ''} />
              恢复已购项目 / RESTORE
            </button>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#0A0A0A]/80 backdrop-blur-xl border-t border-white/5">
        <button 
          onClick={handlePay}
          disabled={isProcessing || isCurrentlyMember}
          className={`w-full h-16 flex items-center justify-center gap-3 transition-all duration-300 font-black text-xs uppercase tracking-[0.5em] shadow-[4px_4px_0px_0px_rgba(234,179,8,1)] active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50 ${isCurrentlyMember ? 'bg-green-500 text-white shadow-none' : 'bg-white text-black hover:bg-yellow-400'}`}
        >
          {isCurrentlyMember ? (
            <><CheckCircle2 size={18}/> 已成功激活身份</>
          ) : isProcessing ? (
            <><div className="w-5 h-5 border-2 border-black border-t-transparent animate-spin"></div> 正在授权...</>
          ) : (
            <><Zap size={18} fill="currentColor"/> 立即永久刻印身份</>
          )}
        </button>
      </div>

      {/* Success Animation Overlay */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-500">
           <div className="relative">
              <div className="w-32 h-32 border-4 border-yellow-400 flex items-center justify-center animate-in zoom-in-50 duration-500">
                 <Check size={64} className="text-yellow-400" strokeWidth={4} />
              </div>
              {/* Decorative corner accents */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-yellow-400"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-yellow-400"></div>
           </div>
           
           <div className="mt-12 text-center space-y-2">
              <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white animate-in slide-in-from-bottom-4 duration-700">身份已刻印.</h2>
              <p className="text-[10px] font-black text-yellow-400 tracking-[0.6em] uppercase animate-in slide-in-from-bottom-6 duration-700 delay-100">IDENTITY SEALED SUCCESSFULLY</p>
           </div>
           
           <div className="mt-16 w-48 h-1 bg-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-yellow-400 animate-progress"></div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        .animate-progress {
          animation: progress 2.5s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default MemberPurchaseView;
