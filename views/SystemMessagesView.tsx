
import React from 'react';
import { ChevronLeft, Bell, Shield, Zap, Info, ArrowRight } from 'lucide-react';

interface SystemMessagesViewProps {
  onBack: () => void;
}

const SystemMessagesView: React.FC<SystemMessagesViewProps> = ({ onBack }) => {
  const notifications = [
    {
      id: '1',
      title: '欢迎来到 秒回.',
      content: '您的账户已成功建立。开始探索城市的每个脉动，寻找那些真正懂你的人。',
      time: '2025-05-10 10:00',
      type: 'welcome',
      icon: <Zap size={18} className="text-yellow-500" />
    },
    {
      id: '2',
      title: '账户安全提醒',
      content: '我们检测到您的账户在一个新的终端设备（iPhone 15 Pro）上成功登录。如果非本人操作，请立即重置密码。',
      time: '1小时前',
      type: 'security',
      icon: <Shield size={18} className="text-red-500" />
    },
    {
      id: '3',
      title: '社区准则更新 v2.4',
      content: '为了维护更纯粹的社交环境，我们更新了动态发布的相关规则，请务必查看。',
      time: '昨天',
      type: 'update',
      icon: <Info size={18} className="text-blue-500" />
    },
    {
      id: '4',
      title: '身份已刻印成功',
      content: '恭喜！您已成功激活黑金会员。全域无限私信、访客追踪等高级权限已同步下发。',
      time: '2天前',
      type: 'membership',
      icon: <Zap size={18} className="text-yellow-500" />
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-6 py-6 border-b border-black flex items-center justify-between sticky top-0 bg-white z-20">
        <button onClick={onBack} className="w-10 h-10 border border-black flex items-center justify-center active:scale-95 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
           <Bell size={18} />
           <h1 className="text-xl font-black uppercase tracking-tighter italic">系统消息.</h1>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar pb-20">
        {notifications.map((notif) => (
          <div key={notif.id} className="border border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
             <div className="p-5 border-b border-black bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   {notif.icon}
                   <h3 className="font-black text-xs uppercase tracking-tight">{notif.title}</h3>
                </div>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{notif.time}</span>
             </div>
             <div className="p-5">
                <p className="text-[11px] font-bold text-black uppercase leading-relaxed mb-4">
                   {notif.content}
                </p>
                <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-black transition-colors">
                   查看详情 / DETAILS <ArrowRight size={12} />
                </button>
             </div>
          </div>
        ))}
        
        <div className="py-10 text-center">
           <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">没有更多历史通知了</p>
        </div>
      </div>
    </div>
  );
};

export default SystemMessagesView;
