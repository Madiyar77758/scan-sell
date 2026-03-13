import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, Image as ImageIcon, ScanLine, Sparkles, Tag, Zap } from 'lucide-react';

interface HomeViewProps {
  onStartCamera: () => void;
  onImageUpload: (base64Image: string) => void;
}

export default function HomeView({ onStartCamera, onImageUpload }: HomeViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageUpload(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full w-full bg-[#050505] flex flex-col font-sans overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-8">
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-white/10 flex items-center justify-center mb-10 shadow-2xl relative"
          >
            <div className="absolute inset-0 bg-emerald-500/20 rounded-[32px] blur-xl opacity-50 mix-blend-screen" />
            <ScanLine className="w-12 h-12 text-emerald-400 relative z-10" />
            
            {/* Animated scanning line inside the logo */}
            <motion.div 
              animate={{ top: ['10%', '90%', '10%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute left-4 right-4 h-0.5 bg-emerald-400/50 shadow-[0_0_8px_rgba(52,211,153,0.8)] z-20 rounded-full"
            />
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl font-extrabold text-white mb-5 tracking-tight leading-tight text-center"
          >
            Умная <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">
              Оценка вещей
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-zinc-400 text-lg max-w-[280px] leading-relaxed text-center font-medium"
          >
            Мгновенно узнайте рыночную цену и получите текст для объявления.
          </motion.p>
        </div>

        {/* Action Buttons Section */}
        <div className="px-6 pb-12 pt-4 flex flex-col space-y-4 w-full max-w-md mx-auto relative z-20">
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileTap={{ scale: 0.96 }}
            onClick={onStartCamera}
            className="w-full relative group overflow-hidden rounded-[28px] p-[2px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-zinc-950/90 backdrop-blur-xl h-full w-full rounded-[26px] p-5 flex items-center shadow-2xl transition-all group-hover:bg-zinc-900/90 border border-white/5">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mr-5 border border-emerald-500/20">
                <Camera className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-xl text-white tracking-wide">Сканировать</h3>
                <p className="text-emerald-400/80 text-sm font-medium mt-0.5 flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-1" /> Быстрый анализ
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-zinc-900/50 backdrop-blur-md text-white p-5 rounded-[28px] flex items-center border border-white/10 hover:bg-zinc-800/50 transition-colors shadow-xl"
          >
            <div className="w-14 h-14 bg-zinc-800/50 rounded-2xl flex items-center justify-center mr-5 border border-white/5">
              <ImageIcon className="w-7 h-7 text-zinc-300" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-xl tracking-wide">Загрузить фото</h3>
              <p className="text-zinc-500 text-sm font-medium mt-0.5">Из галереи устройства</p>
            </div>
          </motion.button>
        </div>

        {/* Features Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="px-8 pb-10 flex justify-center items-center space-x-8 text-zinc-500 relative z-10"
        >
          <div className="flex flex-col items-center">
            <Sparkles className="w-5 h-5 mb-2 text-zinc-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">AI Анализ</span>
          </div>
          <div className="w-1 h-1 bg-zinc-800 rounded-full" />
          <div className="flex flex-col items-center">
            <Tag className="w-5 h-5 mb-2 text-zinc-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Цены</span>
          </div>
          <div className="w-1 h-1 bg-zinc-800 rounded-full" />
          <div className="flex flex-col items-center">
            <ScanLine className="w-5 h-5 mb-2 text-zinc-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Текст</span>
          </div>
        </motion.div>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
