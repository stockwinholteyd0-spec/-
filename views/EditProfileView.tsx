
import React, { useState, useRef } from 'react';
import { ChevronLeft, Camera, Check, X, Ruler, Dumbbell, Briefcase, GraduationCap, Coins } from 'lucide-react';
import { User } from '../types';

interface EditProfileViewProps {
  user: User & { tags: string[] };
  onBack: () => void;
  onUpdate: (updates: Partial<User & { tags: string[] }>) => void;
}

const EditProfileView: React.FC<EditProfileViewProps> = ({ user, onBack, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [gender, setGender] = useState(user.gender || '男');
  const [height, setHeight] = useState(user.height || 170);
  const [weight, setWeight] = useState(user.weight || 60);
  const [income, setIncome] = useState(user.income || '10w - 20w');
  const [education, setEducation] = useState(user.education || '本科');
  const [occupation, setOccupation] = useState(user.occupation || '');
  const [tags, setTags] = useState<string[]>(user.tags);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdate({ name, bio, avatar, tags, gender, height, weight, income, education, occupation });
      setIsSaving(false);
      onBack();
    }, 1000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-6 py-6 border-b border-black flex items-center justify-between sticky top-0 bg-white z-10">
        <button onClick={onBack} className="w-10 h-10 border border-black flex items-center justify-center active:scale-95 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter italic">编辑资料.</h1>
        <button onClick={handleSave} disabled={isSaving} className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div> : <Check size={20} />}
        </button>
      </header>

      <div className="p-8 space-y-8 pb-32 overflow-y-auto no-scrollbar">
        <div className="flex flex-col items-center">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-32 h-32 border-2 border-black p-1 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <img src={avatar} className="w-full h-full object-cover grayscale" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-black text-white flex items-center justify-center border border-white">
              <Camera size={16} />
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">昵称 / NAME</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full border-2 border-black p-4 text-xs font-black uppercase outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">性别 / GENDER</label>
               <select value={gender} onChange={e => setGender(e.target.value as any)} className="w-full border-2 border-black p-4 text-xs font-black uppercase outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                 <option>男</option>
                 <option>女</option>
               </select>
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">学历 / EDUCATION</label>
               <select value={education} onChange={e => setEducation(e.target.value)} className="w-full border-2 border-black p-4 text-xs font-black uppercase outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                 <option>专科</option>
                 <option>本科</option>
                 <option>硕士研究生</option>
                 <option>博士及以上</option>
               </select>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">身高 (CM) / HEIGHT</label>
               <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full border-2 border-black p-4 text-xs font-black uppercase outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">体重 (KG) / WEIGHT</label>
               <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full border-2 border-black p-4 text-xs font-black uppercase outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">年收入 / ANNUAL INCOME</label>
            <select value={income} onChange={e => setIncome(e.target.value)} className="w-full border-2 border-black p-4 text-xs font-black uppercase outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <option>10w 以下</option>
              <option>10w - 30w</option>
              <option>30w - 50w</option>
              <option>50w - 100w</option>
              <option>100w 以上</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">职业 / OCCUPATION</label>
            <input value={occupation} onChange={e => setOccupation(e.target.value)} placeholder="如：资深交互设计师" className="w-full border-2 border-black p-4 text-xs font-black uppercase outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">自我阐述 / BIO</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full border-2 border-black p-4 text-xs font-black uppercase outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] resize-none" />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">身份标签 / TAGS</label>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <div key={tag} className="border border-black px-3 py-1.5 text-[8px] font-black uppercase flex items-center gap-2 bg-white">
                #{tag}
                <button onClick={() => setTags(tags.filter(t => t !== tag))} className="text-gray-400 hover:text-red-500"><X size={10} /></button>
              </div>
            ))}
            <button onClick={() => { const t = prompt('新标签:'); if(t) setTags([...tags, t])}} className="border-2 border-dashed border-gray-300 px-3 py-1.5 text-[8px] font-black uppercase text-gray-300">+ 添加标签</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileView;
