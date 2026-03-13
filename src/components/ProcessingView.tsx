import React from 'react';
import { motion } from 'motion/react';
import { ScanSearch } from 'lucide-react';

interface ProcessingViewProps {
  image: string;
}

export default function ProcessingView({ image }: ProcessingViewProps) {
  return (
    <div className="h-full w-full bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background Deep Blur */}
      <div
        className="absolute inset-0 opacity-15 bg-cover bg-center filter blur-3xl scale-125"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />

      <div className="relative z-10 flex flex-col items-center w-full px-8">
        
        {/* Main Scanner Container */}
        <div className="relative mb-16">
          {/* Outer Pulsing Rings */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-[-40px] border border-emerald-500/30 rounded-[48px]"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0, 0.2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            className="absolute inset-[-60px] border border-emerald-500/20 rounded-[64px]"
          />

          {/* Image Container with Glass Frame */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-64 h-64 rounded-[40px] p-2 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl shadow-2xl z-10"
          >
            <div className="w-full h-full rounded-[32px] overflow-hidden relative">
              <img src={image} alt="Scanned item" className="w-full h-full object-cover" />
              
              {/* High-tech Scanning Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(52,211,153,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.15)_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />

              {/* Laser Scanning Line */}
              <motion.div
                animate={{ top: ['-20%', '120%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-emerald-400/20 to-emerald-400/50 border-b-[3px] border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)] z-20"
              />
            </div>
          </motion.div>
        </div>

        {/* Text Area */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center text-center w-full"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/20 opacity-50 pulse-fast" />
            <ScanSearch className="w-7 h-7 text-emerald-400 relative z-10 animate-pulse" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Анализ ИИ</h2>
          
          <div className="flex flex-col items-center space-y-2">
            <p className="text-zinc-400 text-base max-w-[280px] leading-relaxed font-medium">
              Определяем модель, сравниваем цены и создаем объявление...
            </p>
            
            {/* Loading Dots */}
            <div className="flex space-x-2 mt-4">
              <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="w-2 h-2 rounded-full bg-emerald-500" />
              <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 rounded-full bg-emerald-500" />
              <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
