
import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Plus, Send, X, Camera, RefreshCw, MapPin, Clock, Sparkles, Smile, Crown, Link as LinkIcon, Share, Copy, Check } from 'lucide-react';
import { Post, Comment } from '../types';
import { GoogleGenAI } from "@google/genai";

interface HomeViewProps {
  posts: Post[];
  onLike: (id: string) => void;
  onAddPost: (content: string) => void;
  onAvatarClick: (userId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onCreatePost: () => void;
  userMood?: { emoji: string; text: string; color: string };
  currentUserAvatar?: string;
  isMember?: boolean;
}

const HomeView: React.FC<HomeViewProps> = ({ posts, onLike, onAddPost, onAvatarClick, onAddComment, onCreatePost, userMood, currentUserAvatar, isMember }) => {
  const [activeCommentsPost, setActiveCommentsPost] = useState<string | null>(null);
  const [activeSharePost, setActiveSharePost] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [quickComments, setQuickComments] = useState<Record<string, string>>({});
  const [isGeneratingAI, setIsGeneratingAI] = useState<Record<string, boolean>>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationName, setLocationName] = useState('定位中...');
  const [pullOffset, setPullOffset] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const threshold = 80;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!navigator.geolocation) {
        setLocationName('位置不可用');
        return;
      }
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `我现在 GPS 坐标: 纬度 ${latitude}, 经度 ${longitude}。请告诉我这个坐标所在的城市 and 大概区域（例如：上海 · 静安区）。仅回复地名。`,
          });
          setLocationName(response.text?.trim() || '未知领域');
        } catch (error) {
          setLocationName('中国 · 互联网');
        }
      }, () => setLocationName('离线模式'));
    };
    fetchLocation();
  }, []);

  const handleAISmartReply = async (postId: string, postContent: string) => {
    setIsGeneratingAI(prev => ({ ...prev, [postId]: true }));
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `针对这条动态内容：“${postContent}”，写一个非常有张力、酷酷的中文短评（15字以内）。直接给出回复文字。`,
      });
      setQuickComments(prev => ({ ...prev, [postId]: response.text?.trim() || '很有深度。' }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAI(prev => ({ ...prev, [postId]: false }));
    }
  };

  const submitQuickComment = (postId: string) => {
    const text = quickComments[postId];
    if (text?.trim()) {
      onAddComment(postId, text);
      setQuickComments(prev => ({ ...prev, [postId]: '' }));
    }
  };

  const handleCopyLink = (postId: string) => {
    const link = `https://miaohui.app/post/${postId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const stories = [
    { id: 'me', name: '我', avatar: currentUserAvatar || 'https://picsum.photos/seed/me/200', mood: userMood, member: isMember },
    { id: 'u1', name: '莉莉', avatar: 'https://picsum.photos/seed/story1/200', mood: { emoji: '☕', text: '下午茶', color: 'bg-yellow-500' }, member: true },
    { id: 's2', name: '阿强', avatar: 'https://picsum.photos/seed/story2/200', mood: { emoji: '🎧', text: 'EMO中', color: 'bg-blue-500' } },
    { id: 's3', name: '苏菲', avatar: 'https://picsum.photos/seed/story3/200' },
  ];

  const shareOptions = [
    { name: '微信', icon: '💬', color: 'bg-[#07C160]' },
    { name: '朋友圈', icon: '🎡', color: 'bg-[#2782D7]' },
    { name: 'QQ', icon: '🐧', color: 'bg-[#12B7F5]' },
    { name: '微博', icon: '👁️‍🗨️', color: 'bg-[#E6162D]' },
    { name: 'Telegram', icon: '✈️', color: 'bg-[#24A1DE]' },
    { name: '其他', icon: '🔗', color: 'bg-black' },
  ];

  return (
    <div 
      ref={containerRef}
      onTouchStart={(e) => { if (containerRef.current?.scrollTop === 0) startY.current = e.touches[0].pageY; }}
      onTouchMove={(e) => {
        if (startY.current === 0 || isRefreshing) return;
        const diff = e.touches[0].pageY - startY.current;
        if (diff > 0 && containerRef.current?.scrollTop === 0) {
          setPullOffset(Math.min(diff * 0.4, 120));
          if (e.cancelable) e.preventDefault();
        }
      }}
      onTouchEnd={() => {
        if (pullOffset > threshold) {
          setIsRefreshing(true); setPullOffset(threshold);
          setTimeout(() => { setIsRefreshing(false); setPullOffset(0); startY.current = 0; }, 1500);
        } else { setPullOffset(0); startY.current = 0; }
      }}
      className="flex flex-col min-h-screen bg-white pb-24 relative overflow-y-auto no-scrollbar"
    >
      {/* Header */}
      <header className="px-5 py-6 border-b-2 border-black flex justify-between items-end bg-white sticky top-0 z-20">
        <div>
          <h1 className="text-3xl font-black tracking-tighter leading-none mb-1">秒回.</h1>
          <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-gray-400">即时动态纪实</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-[9px] font-black uppercase flex items-center gap-1.5 mb-1">
            <span className={`w-1.5 h-1.5 rounded-full ${locationName === '定位中...' ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
            <MapPin size={10} /> {locationName}
          </p>
          <p className="text-[9px] font-black uppercase tracking-tight flex items-center gap-1.5 text-gray-400">
            <Clock size={10} /> {currentTime.toLocaleTimeString('zh-CN', { hour12: false })}
          </p>
        </div>
      </header>

      {/* Stories with Member Aura */}
      <div className="border-b border-black overflow-hidden bg-gray-50">
        <div className="flex overflow-x-auto no-scrollbar py-4 px-5 gap-6">
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0 group cursor-pointer" onClick={onCreatePost}>
            <div className="w-14 h-14 border border-dashed border-black p-0.5 flex items-center justify-center bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Camera size={20} />
            </div>
            <span className="text-[8px] font-black tracking-widest uppercase text-gray-400">发布动态</span>
          </div>
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 group cursor-pointer relative" onClick={() => onAvatarClick(story.id)}>
              <div className={`w-14 h-14 border-2 p-0.5 transition-transform group-hover:-rotate-3 bg-white relative ${story.member ? 'border-yellow-400 shadow-[3px_3px_0px_0px_rgba(234,179,8,1)]' : 'border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'}`}>
                <img src={story.avatar} className="w-full h-full object-cover grayscale" />
                {story.member && (
                   <div className="absolute -top-1 -left-1 bg-yellow-400 text-black p-0.5 border border-black animate-pulse">
                      <Crown size={6} />
                   </div>
                )}
                {story.mood && (
                  <div className={`absolute -top-1.5 -right-1.5 ${story.mood.color} text-white text-[8px] w-5 h-5 flex items-center justify-center border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]`}>
                    {story.mood.emoji}
                  </div>
                )}
              </div>
              <span className={`text-[8px] font-black tracking-widest uppercase ${story.member ? 'text-yellow-600' : ''}`}>{story.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="divide-y divide-black relative">
        {posts.map(post => (
          <article key={post.id} className="group relative">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 border border-black overflow-hidden bg-black cursor-pointer" onClick={() => onAvatarClick(post.authorId)}>
                    <img src={post.avatar} className="w-full h-full object-cover grayscale" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-tight">{post.author}</h4>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{post.time}</p>
                  </div>
                </div>
                <button onClick={() => setActiveMenu(activeMenu === post.id ? null : post.id)} className="p-1.5 hover:bg-gray-100"><MoreHorizontal size={16} /></button>
              </div>
              <div className="w-3/4 border border-black bg-black overflow-hidden aspect-[4/3] mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {post.video ? <video src={post.video} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" autoPlay muted loop playsInline /> : post.image ? <img src={post.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" /> : null}
              </div>
              <p className="text-sm font-bold leading-snug tracking-tight mb-4 uppercase">{post.content}</p>
              <div className="mb-4 space-y-3">
                 <div className="flex gap-2 relative">
                    <div className="flex-1 relative border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-within:shadow-[3px_3px_0px_0px_rgba(234,179,8,1)] transition-all">
                       <input type="text" value={quickComments[post.id] || ''} onChange={(e) => setQuickComments(prev => ({ ...prev, [post.id]: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && submitQuickComment(post.id)} placeholder="即刻回应..." className="w-full bg-white p-2.5 pr-10 text-[10px] font-black uppercase outline-none" />
                       <button onClick={() => handleAISmartReply(post.id, post.content)} disabled={isGeneratingAI[post.id]} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-yellow-500 transition-colors disabled:opacity-50"><Sparkles size={14} className={isGeneratingAI[post.id] ? 'animate-spin' : ''} /></button>
                    </div>
                    <button onClick={() => submitQuickComment(post.id)} disabled={!quickComments[post.id]} className="w-10 bg-black text-white flex items-center justify-center border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-20"><Send size={14} /></button>
                 </div>
              </div>
              <div className="flex items-stretch border border-black h-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <button onClick={() => onLike(post.id)} className={`flex-1 flex items-center justify-center gap-2 font-black text-[10px] uppercase border-r border-black ${post.isLiked ? 'bg-black text-white' : 'hover:bg-gray-50'}`}><Heart size={14} fill={post.isLiked ? 'currentColor' : 'none'} /> {post.likes}</button>
                <button onClick={() => setActiveCommentsPost(post.id)} className="flex-1 flex items-center justify-center gap-2 font-black text-[10px] uppercase border-r border-black hover:bg-gray-50"><MessageCircle size={14} /> 评论 ({post.comments.length})</button>
                <button onClick={() => setActiveSharePost(post.id)} className="w-10 flex items-center justify-center hover:bg-gray-50"><Share2 size={14} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <button onClick={onCreatePost} className="fixed bottom-28 right-6 w-14 h-14 bg-yellow-400 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all z-30"><Plus size={28} /></button>

      {/* Comments Modal */}
      {activeCommentsPost && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={() => setActiveCommentsPost(null)}>
          <div className="w-full max-w-[430px] bg-white border-t-2 border-black flex flex-col max-h-[70vh] animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-black flex justify-between items-center"><h3 className="font-black text-xs uppercase italic">讨论区.</h3><button onClick={() => setActiveCommentsPost(null)}><X size={20} /></button></div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">{posts.find(p => p.id === activeCommentsPost)?.comments.map(c => (<div key={c.id} className="flex gap-3"><div className="w-8 h-8 bg-gray-100 border border-black flex-shrink-0"></div><div><p className="text-[9px] font-black uppercase text-gray-400 mb-0.5">{c.user}</p><p className="text-xs font-bold leading-tight uppercase">{c.text}</p></div></div>))}</div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {activeSharePost && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={() => setActiveSharePost(null)}>
          <div className="w-full max-w-[430px] bg-white border-t-2 border-black flex flex-col animate-slide-up pb-10" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-black flex justify-between items-center">
              <div className="flex flex-col">
                <h3 className="font-black text-sm uppercase tracking-tighter italic">扩散纪实 / DISPATCH.</h3>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">选择目标频道进行信息分发</p>
              </div>
              <button onClick={() => setActiveSharePost(null)} className="w-10 h-10 border border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><X size={20} /></button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-3 gap-3 mb-8">
                {shareOptions.map((opt, i) => (
                  <button 
                    key={i} 
                    className="flex flex-col items-center gap-2 p-4 border border-black hover:bg-gray-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                    onClick={() => { alert(`正在拉起 ${opt.name}...`); setActiveSharePost(null); }}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">{opt.name}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400">直连地址 / DIRECT LINK</h4>
                <div className="flex border-2 border-black p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex-1 bg-gray-50 p-3 text-[10px] font-black uppercase tracking-tight truncate">
                    https://miaohui.app/post/{activeSharePost}
                  </div>
                  <button 
                    onClick={() => handleCopyLink(activeSharePost)}
                    className={`px-4 flex items-center gap-2 font-black text-[9px] uppercase tracking-widest transition-all ${copySuccess ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-yellow-400 hover:text-black'}`}
                  >
                    {copySuccess ? <Check size={14} /> : <Copy size={14} />}
                    {copySuccess ? '已复制' : '复制'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast for Copy Success */}
      {copySuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-black text-yellow-400 border border-yellow-400 px-6 py-3 font-black text-[10px] uppercase tracking-[0.4em] shadow-[4px_4px_0px_0px_rgba(234,179,8,1)] animate-in fade-in slide-in-from-top-4 duration-300">
           链接已复制到剪贴板.
        </div>
      )}

      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } } 
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default HomeView;
