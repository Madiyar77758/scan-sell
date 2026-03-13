import React, { useState } from 'react';
import HomeView from './components/HomeView';
import CameraView from './components/CameraView';
import ProcessingView from './components/ProcessingView';
import ResultView from './components/ResultView';
import { analyzeImage, ScanResult } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

type AppState = 'home' | 'camera' | 'processing' | 'result';

export default function App() {
  const [appState, setAppState] = useState<AppState>('home');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartCamera = () => {
    setAppState('camera');
  };

  const handleCapture = async (base64Image: string) => {
    setCapturedImage(base64Image);
    setAppState('processing');
    setError(null);

    try {
      const result = await analyzeImage(base64Image);
      setScanResult(result);
      setAppState('result');
    } catch (err) {
      console.error(err);
      setError('Не удалось проанализировать изображение. Пожалуйста, попробуйте еще раз.');
      setAppState('home');
    }
  };

  const handleReset = () => {
    setAppState('home');
    setCapturedImage(null);
    setScanResult(null);
    setError(null);
  };

  const handleRescan = () => {
    setAppState('camera');
  };

  return (
    <div className="h-screen w-full bg-[#050505] overflow-hidden text-white font-sans selection:bg-emerald-500/30">
      <AnimatePresence mode="wait">
        {appState === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full"
          >
            <HomeView onStartCamera={handleStartCamera} onImageUpload={handleCapture} />
            {error && (
              <div className="absolute top-20 left-4 right-4 bg-red-500/90 text-white p-4 rounded-2xl shadow-lg backdrop-blur text-center text-sm font-medium z-50">
                {error}
              </div>
            )}
          </motion.div>
        )}

        {appState === 'camera' && (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full"
          >
            <CameraView onCapture={handleCapture} onBack={handleReset} />
          </motion.div>
        )}

        {appState === 'processing' && capturedImage && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full"
          >
            <ProcessingView image={capturedImage} />
          </motion.div>
        )}

        {appState === 'result' && scanResult && capturedImage && (
          <motion.div
            key="result"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="h-full w-full"
          >
            <ResultView
              result={scanResult}
              image={capturedImage}
              onBack={handleReset}
              onRescan={handleRescan}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
