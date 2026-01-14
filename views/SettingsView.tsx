
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shield, Bell, Moon, Trash2, LogOut, Info, Smartphone, Fingerprint, Lock, ShieldCheck, RefreshCw, X } from 'lucide-react';

interface SettingsViewProps {
  onBack: () => void;
  isMember?: boolean;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onBack, isMember }) => {
  const [cacheSize, setCacheSize] = useState('124.8');
  const [isClearing, setIsClearing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeSubView, setActiveSubView] = useState<'main' | 'notifications' | 'security'>('main');

  // Notification states
  const [notifs, setNotifs] = useState({
    system: true,
    chat: true,
    moment: false
  });

  const handleClearCache = () => {
    setIsClearing(true);
    // Simulate data shredding
    setTimeout(() => {
      setCacheSize('0.00');
      setIsClearing(false);
    }, 1500);
  };

  const renderNotificationSettings = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-300 tracking-[0.4em] uppercase">通知推送协议 / PROTOCOLS</h3>
        <div className="border border-black divide-y divide-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {[
            { key: 'system', label: '系统全域播报', desc: '接收平台重大更新及维护通知' },
            { key: 'chat', label: '私信触感反馈', desc: '接收新消息时触发高频震动' },
            { key: 'moment', label: '动态交互提醒', desc: '当好友评论或点赞您的动态时通知' }
          ].map((item) => (
            <div key={item.key} className="p-6 flex items-center justify-between bg-white">
              <div className="flex-1 pr-4">
                <p className="text-[11px] font-black uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase leading-tight">{item.desc}</p>
              </div>
              <button 
                onClick={() => setNotifs(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifs] }))}
                className={`w-12 h-6 border border-black relative transition-colors duration-300 ${notifs[item.key as keyof typeof notifs] ? 'bg-yellow-400' : 'bg-gray-100'}`}
              >
                <div className={`absolute top-0 bottom-0 w-5 border border-black bg-white transition-all duration-300 ${notifs[item.key as keyof typeof notifs] ? 'left-6' : 'left-0'}`}></div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-black p-6 text-white border border-black shadow-[4px_4px_0px_0px_rgba(34,197,94,1)]">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="text-green-500" size={24} />
          <div>
            <h3 className="text-lg font-black italic tracking-tighter uppercase leading-none">安全等级: 极高</h3>
            <p className="text-[8px] font-bold text-gray-500 tracking-widest uppercase">账户受 256-BIT 加密保护</p>
          </div>
        </div>
        <div className="w-full h-1 bg-white/10 mt-2">
          <div className="w-[95%] h-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-300 tracking-[0.4em] uppercase">验证与授权 / AUTH</h3>
        <div className="border border-black divide-y divide-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {[
            { icon: <Fingerprint size={16}/>, label: '生物识别登录', extra: '已开启' },
            { icon: <Smartphone size={16}/>, label: '登录设备管理', extra: '2台活动设备' },
            { icon: <Lock size={16}/>, label: '修改支付口令', extra: '' }
          ].map((item, i) => (
            <button key={i} className="w-full p-6 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-black">{item.icon}</div>
                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.extra && <span className="text-[8px] font-black text-gray-400 uppercase">{item.extra}</span>}
                <ChevronRight size={14} className="text-gray-200" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-6 py-6 border-b border-black flex items-center justify-between sticky top-0 bg-white z-20">
        <button 
          onClick={activeSubView === 'main' ? onBack : () => setActiveSubView('main')} 
          className="w-10 h-10 border border-black flex items-center justify-center active:scale-95 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter italic">
          {activeSubView === 'main' ? '系统设置.' : activeSubView === 'notifications' ? '通知设置.' : '安全中心.'}
        </h1>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 p-6 space-y-8 pb-32 overflow-y-auto no-scrollbar">
        {activeSubView === 'main' && (
          <>
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-300 tracking-[0.4em] uppercase ml-1">基础配置 / CORE.</h3>
              <div className="border border-black divide-y divide-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <button onClick={() => setActiveSubView('notifications')} className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Bell size={18} className="text-black"/>
                    <span className="text-[11px] font-black uppercase tracking-widest">通知提醒</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase text-gray-400">{notifs.system ? 'ON' : 'OFF'}</span>
                    <ChevronRight size={14} className="text-gray-200" />
                  </div>
                </button>
                <button onClick={() => setActiveSubView('security')} className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Shield size={18} className="text-black"/>
                    <span className="text-[11px] font-black uppercase tracking-widest">账号安全</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase text-green-500">HEALTHY</span>
                    <ChevronRight size={14} className="text-gray-200" />
                  </div>
                </button>
                <button className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Moon size={18} className="text-black"/>
                    <span className="text-[11px] font-black uppercase tracking-widest">深色模式</span>
                  </div>
                  <span className="text-[9px] font-black uppercase text-gray-400">FOLLOW SYSTEM</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-300 tracking-[0.4em] uppercase ml-1">数据存储 / STORAGE.</h3>
              <div className="border border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-widest mb-1">清理应用缓存</h4>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">包含离线语音与缩略图数据</p>
                    </div>
                    <span className="text-lg font-black italic">{cacheSize} MB</span>
                  </div>
                  <button 
                    onClick={handleClearCache}
                    disabled={isClearing || cacheSize === '0.00'}
                    className={`w-full h-12 flex items-center justify-center gap-3 border border-black transition-all ${isClearing ? 'bg-gray-50' : 'bg-white hover:bg-black hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none'}`}
                  >
                    {isClearing ? (
                      <><RefreshCw size={16} className="animate-spin" /> <span className="text-[9px] font-black uppercase tracking-widest">正在粉碎数据...</span></>
                    ) : (
                      <><Trash2 size={16} /> <span className="text-[9px] font-black uppercase tracking-widest">立即释放空间</span></>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-300 tracking-[0.4em] uppercase ml-1">关于 / INFO.</h3>
              <div className="border border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="p-5 flex items-center justify-between border-b border-black">
                   <div className="flex items-center gap-4">
                     <Info size={18} />
                     <span className="text-[11px] font-black uppercase tracking-widest">版本信息</span>
                   </div>
                   <span className="text-[9px] font-black text-gray-400 uppercase">v2.4.0 (Stable)</span>
                </div>
                <div className="p-5 flex items-center justify-between italic">
                   <span className="text-[11px] font-black uppercase tracking-widest">用户协议与隐私条款</span>
                   <ChevronRight size={14} className="text-gray-200" />
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full mt-10 p-5 bg-white text-red-600 flex items-center justify-center gap-3 border border-red-600 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] hover:bg-red-600 hover:text-white transition-all group"
            >
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em]">终断会话 / LOGOUT</span>
            </button>
          </>
        )}

        {activeSubView === 'notifications' && renderNotificationSettings()}
        {activeSubView === 'security' && renderSecuritySettings()}
      </div>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-8 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-xs bg-white border-2 border-red-600 p-8 shadow-[12px_12px_0px_0px_rgba(239,68,68,1)] flex flex-col items-center text-center">
              <div className="w-16 h-16 border-2 border-red-600 flex items-center justify-center text-red-600 mb-6 animate-pulse">
                <LogOut size={32} />
              </div>
              <h2 className="text-xl font-black italic tracking-tighter uppercase mb-2">终断当前连接?</h2>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed mb-8">
                登出将清除本地即时缓存，且在下次登录前无法接收到实时脉动提醒。
              </p>
              <div className="flex flex-col w-full gap-3">
                 <button 
                   onClick={() => {
                     alert('正在注销会话...');
                     window.location.reload();
                   }}
                   className="w-full py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.4em] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                 >
                   确认终断
                 </button>
                 <button 
                   onClick={() => setShowLogoutConfirm(false)}
                   className="w-full py-4 bg-white text-black border border-black text-[10px] font-black uppercase tracking-[0.4em]"
                 >
                   维持现状
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
