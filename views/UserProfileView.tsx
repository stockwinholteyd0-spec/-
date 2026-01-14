
import React, { useState } from 'react';
import { ChevronLeft, MessageCircle, Heart, MapPin, Share2, MoreHorizontal, Zap, X, Sparkles, Crown, CheckCircle, UserCheck, Smartphone, Ruler, Dumbbell, Briefcase, GraduationCap, Coins } from 'lucide-react';

interface UserProfileViewProps {
  userId: string | null;
  onBack: () => void;
  onMessage: () => void;
  onZap: () => void;
  isMember?: boolean;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ userId, onBack, onMessage, onZap, isMember }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isFollowed, setIsFollowed] = useState(false);

  // Mock data for other users, including the new fields
  const user = {
    name: userId === 'u1' ? '切尔西 · L' : '莉莉 · 陈',
    age: 23,
    gender: '女',
    isVip: true,
    bio: '极简主义者 / 摄影师 / 旅行家。在城市的每一个网格中发现被忽略的美。',
    distance: '1.2公里',
    location: '上海',
    height: 168,
    weight: 48,
    occupation: '时尚摄影师',
    education: '艺术硕士',
    income: '30w - 50w',
    tags: ['艺术家', '猫奴', '数码爱好者', '黑胶收藏'],
    authStatus: { isRealPerson: true, isRealName: true, isPhoneLinked: true },
    photos: [
      'https://picsum.photos/seed/user1/800/1000',
      'https://picsum.photos/seed/user2/800/1000',
      'https://picsum.photos/seed/user3/800/1000',
    ]
  };

  const detailItems = [
    { icon: <Ruler size={14}/>, label: '身高', value: `${user.height} cm` },
    { icon: <Dumbbell size={14}/>, label: '体重', value: `${user.weight} kg` },
    { icon: <Briefcase size={14}/>, label: '职业', value: user.occupation },
    { icon: <GraduationCap size={14}/>, label: '学历', value: user.education },
    { icon: <Coins size={14}/>, label: '年薪', value: user.income },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      <div className="relative aspect-[4/3] border-b border-black overflow-hidden">
        <img src={user.photos[0]} className="w-full h-full object-cover grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
        
        <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center">
          <button onClick={onBack} className="w-10 h-10 bg-white border border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <ChevronLeft size={20} />
          </button>
          <div className="flex border border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <button className="w-10 h-10 border-r border-black hover:bg-gray-50"><Share2 size={16} /></button>
            <button className="w-10 h-10 hover:bg-gray-50"><MoreHorizontal size={16} /></button>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-xl font-black tracking-tighter uppercase italic">{user.name}</h1>
            {user.isVip && <Crown size={14} className="text-yellow-400 fill-yellow-400" />}
            <span className="text-xs font-bold border border-white/40 px-1">{user.age}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-[7px] font-black tracking-widest uppercase border border-white/20 px-1.5 py-0.5">
              <MapPin size={7} fill="currentColor" /> {user.distance}
            </div>
            <div className="flex items-center gap-1.5 text-[7px] font-black tracking-widest uppercase border border-white/20 px-1.5 py-0.5">
              <CheckCircle size={7} className="text-green-500" fill="currentColor" /> 真人认证
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 pb-40">
        <section className="mb-8">
           <h3 className="text-[7px] font-black text-gray-300 tracking-[0.4em] uppercase mb-4">社会档案 / DOSSIER.</h3>
           <div className="grid grid-cols-2 gap-3">
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

        <section className="mb-6">
          <h3 className="text-[7px] font-black text-gray-300 tracking-[0.4em] uppercase mb-2">个人简介 / BIO.</h3>
          <p className="text-sm font-bold leading-tight tracking-tight text-black italic">"{user.bio}"</p>
        </section>

        <section className="mb-6">
          <h3 className="text-[7px] font-black text-gray-300 tracking-[0.4em] uppercase mb-2">身份标签 / TAGS.</h3>
          <div className="flex flex-wrap gap-1.5">
            {user.tags.map((tag, i) => (
              <span key={i} className="border border-black px-2.5 py-1 text-[7px] font-black uppercase tracking-widest">#{tag}</span>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-[7px] font-black text-gray-300 tracking-[0.4em] uppercase mb-3">视觉影像 / GALLERY.</h3>
          <div className="grid grid-cols-2 gap-2">
            {user.photos.map((photo, i) => (
              <div key={i} className="border border-black p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" onClick={() => setSelectedPhoto(photo)}>
                <img src={photo} className="w-full h-28 object-cover grayscale hover:grayscale-0 transition-all" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 flex gap-1.5 bg-white/80 backdrop-blur-sm border-t border-black">
        <button onClick={() => setIsFollowed(!isFollowed)} className={`flex-1 h-12 border border-black flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest ${isFollowed ? 'bg-black text-white' : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
          <Heart size={12} fill={isFollowed ? "currentColor" : "none"} /> {isFollowed ? '已收藏' : '收藏'}
        </button>
        <button onClick={onMessage} className="flex-1 h-12 bg-black text-white flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(234,179,8,1)]">
          <MessageCircle size={12} /> 私信
        </button>
        <button onClick={onZap} className="w-12 h-12 bg-yellow-400 text-black border border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Zap size={16} fill="currentColor" />
        </button>
      </div>

      {selectedPhoto && (
        <div className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-6" onClick={() => setSelectedPhoto(null)}>
          <img src={selectedPhoto} className="max-w-full max-h-[70vh] border-2 border-white shadow-[10px_10px_0px_0px_rgba(234,179,8,1)]" />
        </div>
      )}
    </div>
  );
};

export default UserProfileView;
