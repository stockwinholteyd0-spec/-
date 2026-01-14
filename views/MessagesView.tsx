
import React from 'react';
import { UserPlus, Search, Bell, Heart, Plus, Sparkles } from 'lucide-react';

interface MessagesViewProps {
  onChatClick: (userId: string) => void;
  onAvatarClick: (userId: string) => void;
  onAddFriendsClick: () => void;
  onSearchClick: () => void;
  onSystemMessagesClick: () => void;
  onMutualFollowsClick: () => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({ 
  onChatClick, 
  onAvatarClick, 
  onAddFriendsClick, 
  onSearchClick,
  onSystemMessagesClick,
  onMutualFollowsClick
}) => {
  const chatList = [
    { 
      id: 'gemini',
      name: 'Gemini AI Assistant', 
      avatar: 'https://www.gstatic.com/lamda/images/favicon_v2_16x16.png',
      message: '随时为您效劳。我是您的AI智能助手。', 
      time: '在线', 
      isAI: true,
      unread: 1
    },
    { 
      id: 'u1',
      name: '切尔西 · L', 
      avatar: 'https://picsum.photos/seed/lily/200', 
      message: '我们待会儿还在那家咖啡店见吗？', 
      time: '2分钟前', 
      unread: 2, 
    },
    { 
      id: 'u2',
      name: '张伟', 
      avatar: 'https://picsum.photos/seed/wei/200', 
      message: '听起来没问题。', 
      time: '上午 10:42', 
    },
    { 
      id: 'u3',
      name: '艾玛 · S', 
      avatar: 'https://picsum.photos/seed/emma/200', 
      message: '[发送了一张图片]', 
      time: '昨天', 
    },
  ];

  const onlineUsers = [
    { id: 'u1', avatar: 'https://picsum.photos/seed/online1/200' },
    { id: 'u2', avatar: 'https://picsum.photos/seed/online2/200' },
    { id: 'u3', avatar: 'https://picsum.photos/seed/online3/200' },
    { id: 'u4', avatar: 'https://picsum.photos/seed/online4/200' },
    { id: 'u5', avatar: 'https://picsum.photos/seed/online5/200' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-6 pt-12 pb-8 border-b border-black">
        <div className="flex items-end justify-between mb-8">
          <h1 className="text-5xl font-black tracking-tighter italic">聊天.</h1>
          <div className="flex border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <button onClick={onAddFriendsClick} className="w-12 h-12 flex items-center justify-center border-r border-black hover:bg-gray-50 transition-colors"><UserPlus size={20}/></button>
            <button onClick={onSearchClick} className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"><Search size={20}/></button>
          </div>
        </div>

        <div className="grid grid-cols-2 border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div 
            onClick={onSystemMessagesClick}
            className="p-6 border-r border-black flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="relative mb-3">
              <Bell className="text-black" size={24} />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500"></div>
            </div>
            <span className="font-black text-[10px] tracking-widest uppercase">系统消息</span>
          </div>
          <div 
            onClick={onMutualFollowsClick}
            className="p-6 flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="relative mb-3">
              <Heart className="text-black" size={24} />
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5">3</div>
            </div>
            <span className="font-black text-[10px] tracking-widest uppercase">互相关注</span>
          </div>
        </div>
      </header>

      <div className="px-6 py-6 border-b border-black bg-gray-50">
        <h3 className="text-[10px] font-black text-gray-400 tracking-[0.4em] uppercase mb-4">在线用户</h3>
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          <div onClick={onAddFriendsClick} className="w-14 h-14 border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0 cursor-pointer bg-white hover:border-black transition-colors">
            <Plus size={20} className="text-gray-300" />
          </div>
          {onlineUsers.map(user => (
            <div 
              key={user.id} 
              onClick={() => onAvatarClick(user.id)}
              className="w-14 h-14 border border-black p-1 flex-shrink-0 cursor-pointer grayscale hover:grayscale-0 transition-all bg-white relative group"
            >
              <img src={user.avatar} className="w-full h-full object-cover" alt="online user" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="divide-y divide-black">
        {chatList.map((chat) => (
          <div 
            key={chat.id} 
            className={`flex items-center gap-5 p-6 hover:bg-gray-50 transition-colors cursor-pointer group ${chat.isAI ? 'bg-yellow-50/30 border-l-4 border-l-yellow-400' : ''}`}
            onClick={() => onChatClick(chat.id)}
          >
            <div className={`w-16 h-16 border border-black p-1 grayscale group-hover:grayscale-0 transition-all bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative`}>
              {chat.isAI ? <Sparkles size={32} className="text-yellow-500" /> : <img src={chat.avatar} className="w-full h-full object-cover" alt={chat.name} />}
              {chat.unread && !chat.isAI && (
                <div className="absolute -top-2 -right-2 bg-red-500 w-4 h-4 border border-black"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h4 className={`font-black text-sm uppercase tracking-tight flex items-center gap-2 ${chat.unread ? 'text-black' : 'text-gray-600'}`}>
                  {chat.name}
                  {chat.isAI && <span className="bg-black text-yellow-400 text-[8px] px-1 py-0.5">AI</span>}
                </h4>
                <span className="text-[9px] font-black text-gray-400 tracking-widest">{chat.time}</span>
              </div>
              <p className={`text-xs truncate tracking-tight uppercase ${chat.unread ? 'font-black text-black' : 'font-bold text-gray-400'}`}>
                {chat.message}
              </p>
            </div>
            {chat.unread && (
              <div className="bg-black text-white text-[10px] font-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(234,179,8,1)]">
                {chat.unread}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesView;
