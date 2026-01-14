
import React, { useState, useRef } from 'react';
import { ChevronLeft, Camera, X, Image as ImageIcon, Send, Sparkles, Video } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface CreatePostViewProps {
  onBack: () => void;
  onPost: (content: string, image?: string, video?: string) => void;
}

const CreatePostView: React.FC<CreatePostViewProps> = ({ onBack, onPost }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<{ type: 'image' | 'video', url: string } | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedia({
          type: isVideo ? 'video' : 'image',
          url: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIContent = async () => {
    if (!media || media.type !== 'image') {
      alert('请先上传一张图片，我来帮你构思配文 (暂不支持视频配文)');
      return;
    }
    
    setIsPosting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = media.url.split(',')[1];
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
            { text: "根据这张图，写一段极简主义、有张力的中文社交媒体动态配文，不要超过30字，带一个话题。" }
          ]
        }
      });
      setContent(response.text || '');
    } catch (err) {
      console.error(err);
      alert('AI 思考失败，请手动输入');
    } finally {
      setIsPosting(false);
    }
  };

  const handlePost = () => {
    if (!content.trim() && !media) return;
    setIsPosting(true);
    setTimeout(() => {
      onPost(
        content, 
        media?.type === 'image' ? media.url : undefined, 
        media?.type === 'video' ? media.url : undefined
      );
      setIsPosting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-6 py-6 border-b border-black flex items-center justify-between sticky top-0 bg-white z-20">
        <button onClick={onBack} className="w-10 h-10 border border-black flex items-center justify-center active:scale-95 transition-transform">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter italic">发布动态.</h1>
        <button 
          onClick={handlePost}
          disabled={isPosting || (!content.trim() && !media)}
          className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors disabled:opacity-50"
        >
          {isPosting ? <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div> : <Send size={20} />}
        </button>
      </header>

      <div className="p-8 space-y-8 flex-1 overflow-y-auto pb-32">
        {/* Content Area */}
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="分享此瞬间的深度..."
          className="w-full text-lg font-black uppercase italic tracking-tight placeholder:text-gray-200 outline-none min-h-[120px] resize-none"
        />

        {/* Media Area */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-[10px] font-black text-gray-300 tracking-[0.4em] uppercase">视觉纪实.</h3>
            {media && (
               <button onClick={() => setMedia(null)} className="text-[8px] font-black uppercase text-red-500 border-b border-red-500">移除媒体</button>
            )}
          </div>
          
          {media ? (
            <div className="relative group border-2 border-black p-1 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              {media.type === 'image' ? (
                <img src={media.url} className="w-full aspect-[4/3] object-cover grayscale" alt="upload preview" />
              ) : (
                <video src={media.url} className="w-full aspect-[4/3] object-cover grayscale" controls muted />
              )}
              <button 
                onClick={() => setMedia(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black text-white flex items-center justify-center border border-white"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-4 left-4 bg-black/50 px-2 py-1 text-[8px] font-black text-white uppercase tracking-widest">
                {media.type === 'video' ? '视频记录' : '静态影像'}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-4 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 hover:border-black hover:bg-gray-50 transition-all text-gray-200 hover:text-black group"
              >
                <ImageIcon size={32} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-black uppercase tracking-widest">上传照片</span>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-4 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 hover:border-black hover:bg-gray-50 transition-all text-gray-200 hover:text-black group"
              >
                <Video size={32} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-black uppercase tracking-widest">上传视频</span>
              </button>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleMediaSelect} 
            accept="image/*,video/*" 
            className="hidden" 
          />
        </div>

        {/* Tools */}
        <div className="pt-6 flex flex-wrap gap-4">
           <button 
             onClick={generateAIContent}
             disabled={!media || media.type !== 'image'}
             className="flex items-center gap-3 border-2 border-black px-6 py-3 hover:bg-yellow-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none disabled:opacity-30 disabled:grayscale disabled:hover:bg-white"
           >
             <Sparkles size={18} className="text-yellow-600"/>
             <span className="text-[10px] font-black uppercase tracking-widest">AI 灵感配文</span>
           </button>
           <button 
             className="flex items-center gap-3 border-2 border-black px-6 py-3 hover:bg-gray-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
           >
             <Camera size={18}/>
             <span className="text-[10px] font-black uppercase tracking-widest">滤镜工作室</span>
           </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-black">
        <button 
          onClick={handlePost}
          disabled={isPosting || (!content.trim() && !media)}
          className="w-full bg-black text-white py-5 font-black text-sm uppercase tracking-[0.8em] shadow-[6px_6px_0px_0px_rgba(234,179,8,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
        >
          {isPosting ? '发布中...' : '确认发布'}
        </button>
      </div>
    </div>
  );
};

export default CreatePostView;
