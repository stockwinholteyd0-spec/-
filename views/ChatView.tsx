
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, MoreVertical, Sparkles, Mic, Square, Play, Pause, Image as ImageIcon, X, Check, CheckCheck, FileText, Loader2, Crown, AlertCircle, Gift, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Message, MessageStatus } from '../types';

interface ChatViewProps {
  userId: string | null;
  onBack: () => void;
  isMember?: boolean;
  messageCount: number;
  onMessageSent: () => void;
  onPurchaseMember: () => void;
  history?: Message[];
  onUpdateHistory?: (messages: Message[]) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ userId, onBack, isMember, messageCount, onMessageSent, onPurchaseMember, history = [], onUpdateHistory }) => {
  const MESSAGE_LIMIT = 5;
  const isLimitReached = !isMember && messageCount >= MESSAGE_LIMIT;

  // Initialize messages from history. 
  // If empty, we simulate a "Mutual Follow" system message as requested.
  const [messages, setMessages] = useState<Message[]>(() => {
    if (history && history.length > 0) return history;
    return [
      {
        id: 'system-mutual',
        senderId: 'system',
        text: '你已和对方达成互相关注，开始聊天吧',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [transcribingIds, setTranscribingIds] = useState<Set<string>>(new Set());
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync back to parent state whenever messages change locally
  useEffect(() => {
    if (onUpdateHistory) {
      onUpdateHistory(messages);
    }
  }, [messages, onUpdateHistory]);

  // Handle auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isRecording]);

  const updateMessageStatus = (id: string, status: MessageStatus) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const handleSend = async (customText?: string, gift?: Message['gift']) => {
    if (isLimitReached) return;
    const textToSend = customText || inputText;
    
    // Prevent empty sends unless it's a gift or image
    if (!textToSend.trim() && !selectedImagePreview && !gift) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgId = `msg-${Date.now()}`;
    const userMsg: Message = {
      id: msgId,
      senderId: 'me',
      text: textToSend || undefined,
      imageUrl: selectedImagePreview || undefined,
      gift: gift,
      timestamp: timestamp,
      status: 'sent'
    };

    // Update LOCAL state immediately to show the message
    setMessages(prev => [...prev, userMsg]);
    
    // Notify parent for quota/history
    onMessageSent(); 
    
    // Clear inputs
    setInputText('');
    setSelectedImagePreview(null);
    if (gift) setShowGiftPanel(false);

    // Simulate delivery
    setTimeout(() => updateMessageStatus(msgId, 'delivered'), 800);
    setTimeout(() => updateMessageStatus(msgId, 'read'), 2000);

    // AI logic if chatting with Gemini
    if (userId === 'gemini' && !gift) {
      setIsTyping(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        let response;
        
        if (userMsg.imageUrl) {
           const base64Data = userMsg.imageUrl.split(',')[1];
           response = await ai.models.generateContent({
             model: 'gemini-3-flash-preview',
             contents: {
               parts: [
                 { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
                 { text: textToSend || "分析一下这张图" }
               ]
             },
             config: { systemInstruction: "You are the Gemini AI assistant inside '秒回' app. Keep responses hard-boiled, minimal and neobrutalist in style." }
           });
        } else {
           response = await ai.models.generateContent({
             model: 'gemini-3-flash-preview',
             contents: textToSend,
             config: { systemInstruction: "You are an assistant. Be direct, extremely concise, and slightly edgy." }
           });
        }

        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          senderId: 'gemini',
          text: response.text || '解析链路中断。',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } catch (err) {
        console.error("AI Error:", err);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const gifts = [
    { id: 'g1', name: '即刻咖啡', icon: '☕', price: 9 },
    { id: 'g2', name: '灵魂火箭', icon: '🚀', price: 99 },
    { id: 'g3', name: '黑金钻戒', icon: '💍', price: 520 },
    { id: 'g4', name: '全域烟花', icon: '🎆', price: 1314 },
    { id: 'g5', name: '能量补给', icon: '🔋', price: 5 },
    { id: 'g6', name: '心动派对', icon: '🎉', price: 66 },
  ];

  const GiftMessage: React.FC<{ gift: NonNullable<Message['gift']>; isMe: boolean }> = ({ gift, isMe }) => (
    <div className={`p-4 flex items-center gap-4 ${isMe ? 'bg-yellow-400 text-black' : 'bg-black text-white'}`}>
       <div className="text-4xl animate-bounce">{gift.icon}</div>
       <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">赠送了礼物 / GIFTED</p>
          <p className="text-sm font-black italic uppercase tracking-tighter">{gift.name}</p>
       </div>
    </div>
  );

  const isGemini = userId === 'gemini';

  return (
    <div className="flex flex-col h-screen bg-white relative overflow-hidden">
      <header className="px-6 py-6 border-b border-black flex items-center justify-between bg-white z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 transition-colors"><ChevronLeft size={24} /></button>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 border border-black p-0.5 bg-white flex items-center justify-center relative ${isMember ? 'shadow-[2px_2px_0px_0px_rgba(234,179,8,1)]' : ''}`}>
              {isGemini ? <Sparkles size={20} className="text-yellow-500" /> : <img src={`https://picsum.photos/seed/${userId}/200`} className="w-full h-full object-cover grayscale" />}
              {isMember && <Crown size={8} className="absolute -top-1 -right-1 text-yellow-400 fill-yellow-400" />}
            </div>
            <div>
              <h3 className={`font-black text-sm uppercase tracking-tight ${isMember ? 'text-yellow-600' : ''}`}>
                {isGemini ? 'Gemini AI' : userId === 'u1' ? '切尔西 · L' : '互相关注的朋友'}
              </h3>
              <p className="text-[8px] font-black text-green-500 uppercase tracking-widest">在线 / ONLINE</p>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100"><MoreVertical size={20} /></button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-10">
        {messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-4">
                <div className="bg-gray-50 border border-black/5 px-4 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
                   <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">{msg.text}</p>
                </div>
              </div>
            );
          }

          const isMe = msg.senderId === 'me';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] border border-black overflow-hidden ${isMe ? 'shadow-[4px_4px_0px_0px_rgba(234,179,8,1)]' : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
                {msg.gift ? (
                   <GiftMessage gift={msg.gift} isMe={isMe} />
                ) : (
                  <div className={`p-4 ${isMe ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
                    {msg.imageUrl && (
                      <div className="mb-3 border border-current p-1 bg-white">
                        <img src={msg.imageUrl} alt="Shared" className="w-full h-auto object-cover grayscale" />
                      </div>
                    )}
                    {msg.audioUrl ? (
                      <AudioMessage msg={msg} isMe={isMe} transcribingIds={transcribingIds} setMessages={setMessages} setTranscribingIds={setTranscribingIds} />
                    ) : (
                      msg.text && <p className="text-xs font-bold leading-relaxed">{msg.text}</p>
                    )}
                  </div>
                )}
                <div className={`flex items-center gap-1.5 p-2 bg-inherit ${isMe ? 'bg-black/90 justify-end' : 'bg-gray-100/50 justify-start'}`}>
                  <p className="text-[7px] font-black uppercase opacity-50">{msg.timestamp}</p>
                  {isMe && <StatusIndicator status={msg.status} />}
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && <div className="flex justify-start"><div className="p-4 border border-black bg-gray-50 animate-pulse"><div className="flex gap-1"><div className="w-1 h-1 bg-black rounded-full"></div><div className="w-1 h-1 bg-black rounded-full"></div><div className="w-1 h-1 bg-black rounded-full"></div></div></div></div>}
        {isRecording && <div className="flex justify-end"><div className="p-4 border-2 border-red-500 bg-white text-red-500 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]"><div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div><span className="text-[10px] font-black uppercase tracking-widest italic">录音中: {recordingDuration}s</span></div></div>}
      </div>

      {isLimitReached ? (
        <div className="p-6 border-t border-black bg-yellow-50 flex flex-col items-center gap-4 text-center animate-in slide-in-from-bottom duration-300">
           <AlertCircle className="text-yellow-600" size={32} />
           <div>
              <h4 className="font-black text-xs uppercase tracking-widest mb-1">已达到今日免费会话上限</h4>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">黑金会员尊享无限量实时聊天特权</p>
           </div>
           <button 
             onClick={onPurchaseMember}
             className="w-full h-14 bg-black text-white flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.4em] shadow-[4px_4px_0px_0px_rgba(234,179,8,1)]"
           >
             <Crown size={14} fill="currentColor" /> 开通黑金会员
           </button>
        </div>
      ) : (
        <div className="p-6 border-t border-black bg-white">
          {selectedImagePreview && <div className="mb-4 relative w-20 h-20 border-2 border-black p-1 bg-white shadow-[4px_4px_0px_0px_rgba(234,179,8,1)]"><img src={selectedImagePreview} className="w-full h-full object-cover grayscale" /><button onClick={() => setSelectedImagePreview(null)} className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"><X size={12} /></button></div>}
          <div className="flex gap-2">
            <button onClick={() => setShowGiftPanel(!showGiftPanel)} className={`w-12 h-14 flex items-center justify-center border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors ${showGiftPanel ? 'bg-yellow-400' : 'bg-white'}`}><Gift size={20} /></button>
            <button onClick={() => fileInputRef.current?.click()} className="w-12 h-14 flex items-center justify-center border border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><ImageIcon size={20} /></button>
            <input type="file" ref={fileInputRef} onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setSelectedImagePreview(reader.result as string);
                reader.readAsDataURL(file);
              }
            }} accept="image/*" className="hidden" />
            
            <input 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              placeholder={isRecording ? "正在录音..." : "输入消息..." } 
              className="flex-1 bg-white border border-black p-4 text-xs font-black uppercase outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(234,179,8,1)] transition-all" 
            />
            
            <button 
              onClick={() => handleSend()} 
              disabled={isRecording || (!inputText.trim() && !selectedImagePreview)} 
              className="w-14 h-14 bg-black text-white flex items-center justify-center border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              <Send size={20} />
            </button>
          </div>
          {!isMember && (
            <p className="mt-3 text-[7px] font-black text-gray-400 text-center uppercase tracking-[0.2em]">今日免费剩余额度: {MESSAGE_LIMIT - messageCount} 条</p>
          )}
        </div>
      )}

      {showGiftPanel && (
        <div className="absolute inset-x-0 bottom-[130px] p-6 bg-white border-y-2 border-black z-20 animate-in slide-in-from-bottom duration-300 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
           <div className="flex justify-between items-center mb-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] italic flex items-center gap-2"><Zap size={14} className="text-yellow-400" /> 能量投递 / ENERGY GIFT</h4>
              <button onClick={() => setShowGiftPanel(false)}><X size={20}/></button>
           </div>
           <div className="grid grid-cols-3 gap-4">
              {gifts.map(g => (
                <button 
                  key={g.id}
                  onClick={() => handleSend(undefined, g)}
                  className="flex flex-col items-center gap-2 p-4 border border-black bg-white hover:bg-yellow-400 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                   <span className="text-3xl group-hover:scale-125 transition-transform">{g.icon}</span>
                   <span className="text-[9px] font-black uppercase tracking-widest">{g.name}</span>
                   <span className="text-[8px] font-black text-gray-400 group-hover:text-black/60">{g.price} 币</span>
                </button>
              ))}
           </div>
           <div className="mt-6 flex justify-between items-center border-t border-black pt-4">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">当前余额: 2,480 币</span>
              <button className="text-[9px] font-black uppercase text-yellow-600 border-b border-yellow-600">立即充值</button>
           </div>
        </div>
      )}
    </div>
  );
};

const StatusIndicator: React.FC<{ status?: MessageStatus }> = ({ status }) => {
  if (!status) return null;
  switch (status) {
    case 'sent': return <Check size={12} className="text-gray-400" />;
    case 'delivered': return <CheckCheck size={12} className="text-gray-400" />;
    case 'read': return <CheckCheck size={12} className="text-blue-500" />;
    default: return null;
  }
};

const AudioMessage: React.FC<{ msg: Message; isMe: boolean; transcribingIds: Set<string>; setMessages: any; setTranscribingIds: any }> = ({ msg, isMe, transcribingIds, setMessages, setTranscribingIds }) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      playing ? audioRef.current.pause() : audioRef.current.play();
      setPlaying(!playing);
    }
  };

  const bars = [4, 6, 8, 5, 9, 7, 4, 6, 8, 5, 7, 6, 4, 8, 9, 5];

  return (
    <div className="flex flex-col w-full min-w-[200px]">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={togglePlay} className={`w-10 h-10 flex items-center justify-center border-2 border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isMe ? 'bg-yellow-400 text-black' : 'bg-black text-white'}`}>
          {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
        </button>
        <div className="flex-1 flex items-center gap-[2px] h-6 overflow-hidden">
          {bars.map((height, i) => (
            <div key={i} className={`flex-1 transition-all duration-300 ${progress >= (i / bars.length) * 100 ? (isMe ? 'bg-yellow-400' : 'bg-white') : 'bg-current opacity-20'}`} style={{ height: `${height * 10}%` }} />
          ))}
        </div>
        <span className="text-[10px] font-black w-8 text-right uppercase">{msg.duration}S</span>
      </div>
      
      {!msg.transcription ? (
         <button 
           onClick={async () => {
             setTranscribingIds((prev: any) => new Set(prev).add(msg.id));
             try {
               const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
               const response = await ai.models.generateContent({
                 model: 'gemini-3-flash-preview',
                 contents: `这里有一段来自社交应用的语音消息（时长 ${msg.duration} 秒）。请构思一段这段语音可能的内容。`,
               });
               const text = response.text || '转写失败';
               setMessages((prev: any) => prev.map((m: any) => m.id === msg.id ? { ...m, transcription: text } : m));
             } finally {
               setTranscribingIds((prev: any) => { const next = new Set(prev); next.delete(msg.id); return next; });
             }
           }}
           className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-widest border border-current w-fit px-2 py-1 hover:bg-current hover:text-white transition-all ${transcribingIds.has(msg.id) ? 'animate-pulse' : ''}`}
         >
           {transcribingIds.has(msg.id) ? <Loader2 size={10} className="animate-spin" /> : <FileText size={10} />}
           {transcribingIds.has(msg.id) ? '正在识别...' : 'AI 转文字'}
         </button>
      ) : (
         <div className="p-3 bg-black/5 border-l-2 border-current mt-2">
            <p className="text-[10px] italic font-bold leading-tight opacity-70">"{msg.transcription}"</p>
         </div>
      )}
      <audio ref={audioRef} src={msg.audioUrl} onTimeUpdate={() => setProgress((audioRef.current!.currentTime / (audioRef.current!.duration || msg.duration || 1)) * 100)} onEnded={() => {setPlaying(false); setProgress(0);}} className="hidden" />
    </div>
  );
};

export default ChatView;
