
import React, { useState } from 'react';
import { Settings, Edit3, Heart, ChevronRight, Wallet, Shield, Award, ArrowUpRight, Grid, Image as ImageIcon, X, Smile, Eye, Crown, CheckCircle, UserCheck, Smartphone, Briefcase, Ruler, Dumbbell, GraduationCap, Coins, Gift } from 'lucide-react';
import { User } from '../types';

interface ProfileViewProps {
  user: User & { tags: string[] };
  onEditProfile: () => void;
  onSettings: () => void;
  onMemberPurchase: () => void;
  onUpdateMood: (mood?: { emoji: string; text: string; color: string }) => void;
  onViewVisitors: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onEditProfile, onSettings, onMemberPurchase, onUpdateMood, onViewVisitors }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const detailItems = [
    { icon: <Ruler size={14}/>, label: '身高', value: `${user.height || '--'} cm` },
    { icon: <Dumbbell size={14}/>, label: '体重', value: `${user.weight || '--'} kg` },
    { icon: <Briefcase size={14}/>, label: '职业', value: user.occupation || '自由职业' },
    { icon: <GraduationCap size={14}/>, label: '学历', value: user.education || '不限' },
    { icon: <Coins size={14}/>, label: '年薪', value: user.income || '保密' },
    { icon: <Smile size={14}/>, label: '性别', value: user.gender || '保密' },
  ];

  const myPhotos = [
    'https://picsum.photos/seed/my1/400/400',
    'https://picsum.photos/seed/my2/400/400',
    'https://picsum.photos/seed/my3/400/400',
    'https://picsum.photos/seed/my4/400/400',
    'https://picsum.photos/seed/my5/400/400',
    'https://picsum.photos/seed/my6/400/400',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-5 py-6 border-b border-black flex justify-between items-center bg-white sticky top-0 z-20">
        <h1 className="text-2xl font-black tracking-tighter italic">个人中心.</h1>
        <div className="flex border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <button onClick={onEditProfile} className="w-10 h-10 flex items-center justify-center border-r border-black hover:bg-gray-50 transition-colors">
            <Edit3 size={16} />
          </button>
          <button onClick={onSettings} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </header>

      <section className="border-b border-black bg-gray-50">
        <div className="flex items-stretch">
          <div className="w-32 aspect-square border-r border-black p-3 bg-white relative">
            <div className={`w-full h-full border border-black overflow-hidden bg-black relative group cursor-pointer ${user.isMember ? 'shadow-[4px_4px_0px_0px_rgba(234,179,8,1)]' : ''}`} onClick={onEditProfile}>
              <img src={user.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
            </div>
            {user.mood && (
              <div className={`absolute -top-1 -right-1 ${user.mood.color} text-white text-[8px] font-black p-1 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10 flex items-center gap-1 px-1.5`}>
                {user.mood.emoji} {user.mood.text}
              </div>
            )}
          </div>
          <div className="flex-1 p-5 flex flex-col justify-center bg-white">
            <div className="flex items-center gap-2 mb-1">
               <h2 className={`text-xl font-black tracking-tight uppercase italic ${user.isMember ? 'text-yellow-600' : ''}`}>{user.name}</h2>
               {user.isMember && <Crown size={14} className="text-yellow-500 fill-yellow-500" />}
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1">
               <div className="flex items-center gap-1">
                 <CheckCircle size={10} className={user.authStatus?.isRealPerson ? 'text-green-500' : 'text-gray-200'} />
                 <span className="text-[7px] font-black uppercase tracking-widest text-gray-400">真人</span>
               </div>
               <div className="flex items-center gap-1">
                 <UserCheck size={10} className={user.authStatus?.isRealName ? 'text-green-500' : 'text-gray-200'} />
                 <span className="text-[7px] font-black uppercase tracking-widest text-gray-400">实名</span>
               </div>
               <div className="flex items-center gap-1">
                 <Smartphone size={10} className={user.authStatus?.isPhoneLinked ? 'text-green-500' : 'text-gray-200'} />
                 <span className="text-[7px] font-black uppercase tracking-widest text-gray-400">手机</span>
               </div>
            </div>
            <p className="text-[7px] font-black text-gray-300 tracking-[0.3em] uppercase mt-2">ID: {user.id}</p>
          </div>
        </div>
      </section>

      {/* 详细参数区 */}
      <section className="p-5 border-b border-black">
        <h3 className="text-[8px] font-black text-gray-300 tracking-[0.5em] uppercase mb-4 flex items-center gap-2">
           <Briefcase size={12} /> 社会属性 / SOCIAL ATTRIBUTES
        </h3>
        <div className="grid grid-cols-3 gap-2">
           {detailItems.map((item, idx) => (
             <div key={idx} className="border border-black p-3 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 mb-1 text-gray-400">
                   {item.icon}
                   <span className="text-[7px] font-black uppercase tracking-widest">{item.label}</span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-tight">{item.value}</div>
             </div>
           ))}
        </div>
      </section>

      {/* 礼物墙统计 */}
      <section className="p-5 border-b border-black">
         <h3 className="text-[8px] font-black text-gray-300 tracking-[0.5em] uppercase mb-4 flex items-center gap-2">
           <Gift size={12} /> 贡献荣誉墙 / HONOR WALL
        </h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
           {Object.entries(user.giftStats || {}).map(([name, count], i) => (
             <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 border border-black bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-xl">{name === '即刻咖啡' ? '☕' : name === '灵魂火箭' ? '🚀' : '💎'}</span>
                <span className="text-[9px] font-black uppercase whitespace-nowrap">{name}</span>
                <span className="text-[12px] font-black italic">x{count}</span>
             </div>
           ))}
           {(!user.giftStats || Object.keys(user.giftStats).length === 0) && (
              <div className="w-full py-8 text-center text-[9px] font-black text-gray-300 uppercase tracking-widest">
                暂无礼物记录
              </div>
           )}
        </div>
      </section>

      {/* 会员卡片 */}
      <div className="p-5">
        <div onClick={onMemberPurchase} className={`p-6 border-2 border-black cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${user.isMember ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(234,179,8,1)]' : 'bg-white text-black'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className={`text-lg font-black tracking-tighter italic ${user.isMember ? 'text-yellow-400' : ''}`}>
                {user.isMember ? '黑金会员身份' : '标准用户状态'}
              </h3>
              <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">已解锁全域无限聊天特权</p>
            </div>
            {user.isMember && <Crown size={24} className="text-yellow-400" />}
          </div>
          <div className="h-1 w-full bg-gray-100 mb-4">
             <div className="h-full bg-yellow-400" style={{width: user.isMember ? '100%' : '10%'}}></div>
          </div>
          <p className="text-[7px] font-black uppercase tracking-widest opacity-50">数据采集于本地即时缓存 · 安全加密</p>
        </div>
      </div>

      <div className="px-5 mb-8">
        <h3 className="text-[8px] font-black text-gray-300 tracking-[0.5em] uppercase mb-3 flex items-center gap-2">
          <ImageIcon size={12} /> 我的视觉记录
        </h3>
        <div className="grid grid-cols-3 gap-1">
          {myPhotos.map((photo, i) => (
            <div key={i} className="aspect-square border border-black p-0.5 bg-gray-100 cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
              <img src={photo} className="w-full h-full object-cover grayscale" />
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-32">
        <h3 className="text-[8px] font-black text-gray-300 tracking-[0.5em] uppercase mb-3 ml-1">隐私与资产.</h3>
        <div className="border border-black divide-y divide-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <button onClick={onViewVisitors} className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50">
             <div className="flex items-center gap-4">
               <Eye size={16} />
               <span className="font-black text-[9px] uppercase tracking-widest">谁看过我</span>
             </div>
             <span className="text-[7px] font-black border border-black px-2 py-0.5 uppercase bg-yellow-400">32人访问</span>
          </button>
          <button onClick={onSettings} className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50">
             <div className="flex items-center gap-4">
               <Shield size={16} />
               <span className="font-black text-[9px] uppercase tracking-widest">隐私设置</span>
             </div>
             <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {selectedPhoto && (
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-6" onClick={() => setSelectedPhoto(null)}>
          <div className="border-4 border-white"><img src={selectedPhoto} className="max-w-full max-h-[70vh]" /></div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
