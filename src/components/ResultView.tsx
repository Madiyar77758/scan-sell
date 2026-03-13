import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ScanResult } from '../services/geminiService';
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  CheckCircle2,
  ShoppingBag,
  BadgeCheck,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface ResultViewProps {
  result: ScanResult;
  image: string;
  onBack: () => void;
  onRescan: () => void;
}

const MARKETPLACE_URLS: Record<string, (q: string) => string> = {
  kaspi:       (q) => `https://kaspi.kz/shop/search/?q=${encodeURIComponent(q)}`,
  wildberries: (q) => `https://www.wildberries.kz/catalog/0/search.aspx?search=${encodeURIComponent(q)}`,
  olx:         (q) => `https://www.olx.kz/q-${encodeURIComponent(q).replace(/%20/g, '-')}/`,
};

function getMarketplaceUrl(name: string, query: string): string {
  const key = name.toLowerCase();
  for (const [k, fn] of Object.entries(MARKETPLACE_URLS)) {
    if (key.includes(k)) return fn(query);
  }
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

const CONFIDENCE_BADGE: Record<string, { label: string; className: string }> = {
  High:   { label: 'ТОЧНОЕ СОВПАДЕНИЕ', className: 'bg-emerald-500/90 shadow-[0_0_15px_rgba(16,185,129,0.5)]' },
  Medium: { label: 'СРЕДНЕЕ СОВПАДЕНИЕ', className: 'bg-amber-500/90 shadow-[0_0_15px_rgba(245,158,11,0.5)]' },
  Low:    { label: 'НИЗКАЯ ТОЧНОСТЬ',   className: 'bg-red-500/90 shadow-[0_0_15px_rgba(239,68,68,0.5)]'     },
};

function getKaspiTemplate(result: ScanResult): string {
  return `📦 ${result.listing.title}\n\n${result.listing.description}\n\n💰 Цена: ${result.listing.suggestedPrice}\n📍 Самовывоз / Доставка Kaspi\n\n${result.listing.tags.map(t => `#${t.replace(/\s+/g, '')}`).join(' ')}`;
}

function getOlxTemplate(result: ScanResult): string {
  return `${result.listing.title}\n\n${result.listing.description}\n\nСостояние: Б/у\nЦена: ${result.listing.suggestedPrice}\n\nТорг уместен. Пишите в личные сообщения.\n\n${result.listing.tags.slice(0, 5).map(t => `#${t.replace(/\s+/g, '')}`).join(' ')}`;
}

function getWildberriesTemplate(result: ScanResult): string {
  return `${result.listing.title}\n\nБренд: ${result.brand}\nМодель: ${result.model}\n\n${result.listing.description}\n\nРекомендуемая цена продажи: ${result.listing.suggestedPrice}\nРыночная стоимость: ${result.estimatedValueRange}`;
}

const PLATFORMS = [
  { key: 'kaspi',       label: 'Kaspi',       fn: getKaspiTemplate,       color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { key: 'olx',         label: 'OLX',         fn: getOlxTemplate,         color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  { key: 'wildberries', label: 'Wildberries', fn: getWildberriesTemplate, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
];

function formatCurrency(val: number): string {
  if (!val) return '0 ₸';
  return val.toLocaleString('ru-RU') + ' ₸';
}

export default function ResultView({ result, image, onBack, onRescan }: ResultViewProps) {
  const [activePlatform, setActivePlatform] = useState('kaspi');
  const [copiedPlatform, setCopiedPlatform] = useState(false);
  const [showSpeedometer, setShowSpeedometer] = useState(false);

  useEffect(() => {
    // Slight delay for animation effect
    const timer = setTimeout(() => setShowSpeedometer(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const activeTemplate = PLATFORMS.find(p => p.key === activePlatform)!.fn(result);

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(activeTemplate);
    setCopiedPlatform(true);
    setTimeout(() => setCopiedPlatform(false), 2000);
  };

  return (
    <div className="h-full w-full bg-[#050505] flex flex-col font-sans overflow-hidden text-white">
      {/* Header / Image Area */}
      <div className="relative h-[42%] w-full shrink-0 rounded-b-[40px] overflow-hidden shadow-2xl z-20 border-b border-white/5">
        <img src={image} alt={result.exactProductName} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-black/10" />

        {/* Top bar */}
        <div className="absolute top-10 inset-x-0 px-6 flex items-center justify-between z-10">
          <button
            onClick={onBack}
            className="w-12 h-12 bg-black/40 backdrop-blur-xl rounded-[20px] flex items-center justify-center text-white border border-white/10 hover:bg-white/20 transition-all active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <button
            onClick={onRescan}
            className="flex items-center space-x-2 bg-black/40 backdrop-blur-xl px-4 py-3 rounded-[20px] border border-white/10 hover:bg-white/20 transition-all text-white text-sm font-bold active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Пересканировать</span>
          </button>
        </div>

        <div className="absolute bottom-8 left-6 right-6">
          {CONFIDENCE_BADGE[result.confidence] && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`inline-flex items-center space-x-1.5 ${CONFIDENCE_BADGE[result.confidence].className} backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest mb-4 border border-white/20 uppercase ring-1 ring-white/10`}
            >
              <BadgeCheck className="w-4 h-4" />
              <span>{CONFIDENCE_BADGE[result.confidence].label}</span>
            </motion.div>
          )}
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold text-white leading-tight mb-2 tracking-tight"
          >
            {result.exactProductName}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-base font-medium"
          >
            {result.brand} {result.model ? `• ${result.model}` : ''}
          </motion.p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-12 -mt-6 relative z-10">
        <div className="px-6 pt-10 pb-6 space-y-6">

          {/* Value Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 border-emerald-500/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-colors duration-500" />
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center">
               <ShoppingBag className="w-4 h-4 mr-2" /> Оценочная стоимость
            </p>

            {/* Price Speedometer / Bar */}
            {result.priceMin && result.priceMax && result.suggestedPriceNum ? (
              <div className="mb-6 relative pt-2 pb-6">
                <div className="flex justify-between text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                  <span>Срочно</span>
                  <span>Долго</span>
                </div>
                
                {/* Background Track */}
                <div className="h-3 w-full bg-zinc-800/50 rounded-full overflow-hidden relative border border-white/5">
                  {/* Colored Range */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: showSpeedometer ? '100%' : 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-500"
                  />
                </div>

                {/* Suggested Price Marker logic */}
                {(() => {
                  const range = result.priceMax - result.priceMin;
                  const clamped = Math.max(result.priceMin, Math.min(result.suggestedPriceNum, result.priceMax));
                  const percentage = Math.round(((clamped - result.priceMin) / (range || 1)) * 100);
                  
                  return (
                    <>
                      {/* Range Labels */}
                      <div className="flex justify-between text-xs font-bold text-zinc-400 mt-2">
                        <span>{formatCurrency(result.priceMin)}</span>
                        <span>{formatCurrency(result.priceMax)}</span>
                      </div>

                      {/* Moving Marker */}
                      <motion.div
                        initial={{ left: '0%', opacity: 0 }}
                        animate={{ left: showSpeedometer ? `${percentage}%` : '0%', opacity: showSpeedometer ? 1 : 0 }}
                        transition={{ duration: 1, delay: 0.5, type: "spring", damping: 15 }}
                        className="absolute top-6 -ml-3 flex flex-col items-center"
                      >
                        <div className="w-6 h-6 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)] flex items-center justify-center -mt-1.5 z-10">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        </div>
                        
                        {/* Selected Price Tooltip */}
                        <div className="mt-1 bg-white text-zinc-900 px-3 py-1 rounded-lg text-sm font-extrabold shadow-lg whitespace-nowrap">
                          {formatCurrency(result.suggestedPriceNum)}
                        </div>
                      </motion.div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <p className="text-4xl font-extrabold text-white tracking-tight">{result.estimatedValueRange}</p>
            )}

            <p className="text-zinc-400 text-sm mt-4 leading-relaxed font-medium">{result.description}</p>
          </motion.div>

          {/* Marketplaces */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center tracking-wide">
              Сравнить цены
            </h2>
            <div className="space-y-3">
              {result.marketplaces.map((market, idx) => (
                <a
                  key={idx}
                  href={getMarketplaceUrl(market.name, market.searchQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card flex items-center justify-between p-4 hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-extrabold text-xl text-white border border-white/10 group-hover:scale-105 transition-transform">
                      {market.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white text-base tracking-wide">{market.name}</p>
                      <p className="text-sm text-zinc-500 font-medium">Искать объявления</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-emerald-400 text-base">{market.estimatedPrice}</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition">
                       <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Marketplace Templates (Glassmorphic) */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />

            <div className="flex items-center space-x-2 mb-6 relative z-10">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <h2 className="text-lg font-bold text-white tracking-wide">Готовые объявления</h2>
            </div>

            {/* Platform Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 relative z-10">
              {PLATFORMS.map((p) => {
                const isActive = activePlatform === p.key;
                return (
                  <button
                    key={p.key}
                    onClick={() => setActivePlatform(p.key)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                      isActive
                        ? `${p.color} shadow-lg scale-105 ring-1 ring-white/10`
                        : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Template Text Area */}
            <div className="relative z-10 bg-black/40 rounded-2xl p-5 border border-white/5 shadow-inner backdrop-blur-sm">
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {activeTemplate}
              </p>
            </div>

            {/* Premium Copy Button */}
            <button
              onClick={handleCopyTemplate}
              className="relative z-10 mt-5 w-full flex items-center justify-center space-x-2 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 px-4 py-4 rounded-2xl transition-all font-bold active:scale-[0.98]"
            >
              {copiedPlatform ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span>{copiedPlatform ? 'Скопировано!' : `Скопировать для ${PLATFORMS.find(p => p.key === activePlatform)?.label}`}</span>
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
