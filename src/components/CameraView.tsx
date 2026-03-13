import React, { useRef, useState, useEffect } from 'react';
import { Image as ImageIcon, Zap, X, Focus } from 'lucide-react';
import { motion } from 'motion/react';

interface CameraViewProps {
  onCapture: (base64Image: string) => void;
  onBack: () => void;
}

export default function CameraView({ onCapture, onBack }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', advanced: [{ focusMode: 'continuous' }] as any },
      });
      streamRef.current = newStream;
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setError(null);
    } catch (err) {
      setError("camera_denied");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleBack = () => {
    stopCamera();
    onBack();
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg', 0.8);
        stopCamera();
        onCapture(base64Image);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          stopCamera();
          onCapture(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative h-full w-full bg-[#050505] flex flex-col items-center justify-center overflow-hidden font-sans">
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 p-6 z-50">
          <div className="w-24 h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-[32px] flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
            <ImageIcon className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Нет доступа</h2>
          <p className="text-zinc-400 text-center max-w-[280px] mb-12 leading-relaxed font-medium">
            Разрешите доступ к камере в браузере или загрузите фото вручную.
          </p>
          <div className="w-full flex space-x-4">
            <button
               onClick={handleBack}
               className="flex-1 bg-zinc-900 border border-white/10 text-white rounded-[24px] py-4 font-bold flex items-center justify-center hover:bg-zinc-800 transition-colors"
            >
               Назад
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-[2] bg-white text-black hover:bg-zinc-200 py-4 rounded-[24px] font-bold flex items-center justify-center space-x-3 transition-colors shadow-xl"
            >
              <ImageIcon className="w-5 h-5" />
              <span>Из галереи</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" /> {/* Slight dim applied globally */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Top Bar */}
          <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10 pt-12">
            <button
              onClick={handleBack}
              className="w-12 h-12 rounded-[20px] bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="bg-black/50 backdrop-blur-xl px-5 py-2.5 rounded-[20px] border border-white/10 shadow-lg flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white text-sm font-bold tracking-wide">Сканирование</span>
            </div>
            <div className="w-12 h-12" /> {/* Spacer */}
          </div>

          {/* High-tech Viewfinder Reticle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            {/* The scanning area mask */}
            <div className="absolute inset-0 bg-black/40 [mask-image:radial-gradient(transparent_30%,black_100%)] mix-blend-multiply" />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-[75%] aspect-[3/4] max-w-sm relative"
            >
              <div className="absolute inset-0 border border-white/20 rounded-[40px] shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] bg-emerald-500/5 mix-blend-screen" />
              
              {/* Glowing animated corners */}
              <div className="absolute top-[-2px] left-[-2px] w-16 h-16 border-t-[4px] border-l-[4px] border-emerald-400 rounded-tl-[40px] shadow-[-4px_-4px_16px_rgba(52,211,153,0.3)]" />
              <div className="absolute top-[-2px] right-[-2px] w-16 h-16 border-t-[4px] border-r-[4px] border-emerald-400 rounded-tr-[40px] shadow-[4px_-4px_16px_rgba(52,211,153,0.3)]" />
              <div className="absolute bottom-[-2px] left-[-2px] w-16 h-16 border-b-[4px] border-l-[4px] border-emerald-400 rounded-bl-[40px] shadow-[-4px_4px_16px_rgba(52,211,153,0.3)]" />
              <div className="absolute bottom-[-2px] right-[-2px] w-16 h-16 border-b-[4px] border-r-[4px] border-emerald-400 rounded-br-[40px] shadow-[4px_4px_16px_rgba(52,211,153,0.3)]" />
              
              {/* Focus crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-50">
                <Focus className="w-8 h-8 text-emerald-400" />
              </div>
            </motion.div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 inset-x-0 pb-12 pt-32 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10 flex flex-col items-center">
            
            <div className="flex items-center space-x-2 mb-8 bg-zinc-900/60 backdrop-blur-md px-4 py-2 text-white/80 text-sm font-medium rounded-full border border-white/5">
              <span>Наведите камеру на предмет</span>
            </div>
            
            <div className="flex items-center justify-center w-full px-12 relative h-24">
              {/* Gallery Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute left-[10%] w-14 h-14 rounded-[20px] bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all active:scale-95"
              >
                <ImageIcon className="w-6 h-6 text-white" />
              </button>

              {/* Mega Shutter Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCapture}
                className="w-20 h-20 rounded-full border-[3px] border-emerald-400 flex items-center justify-center p-1.5 absolute left-1/2 -translate-x-1/2 z-20 shadow-[0_0_30px_rgba(52,211,153,0.3)] bg-black/20 backdrop-blur-sm"
              >
                <div className="w-full h-full bg-white rounded-full shadow-inner flex items-center justify-center">
                  <div className="w-6 h-6 bg-emerald-400 rounded-full opacity-0" /> {/* Inner visual, optional */}
                </div>
              </motion.button>
            </div>
          </div>
        </>
      )}
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
