import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Trash2, Star, ShoppingBag } from 'lucide-react';
import { FavoriteItem, removeFavorite } from '../services/favoritesService';
import { ScanResult } from '../services/geminiService';

interface FavoritesViewProps {
  onBack: () => void;
  onViewResult: (image: string, result: ScanResult) => void;
}

export default function FavoritesView({ onBack, onViewResult }: FavoritesViewProps) {
  const [items, setItems] = useState<FavoriteItem[]>(() => {
    try {
      const raw = localStorage.getItem('scan_sell_favorites');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFavorite(id);
    setItems(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="h-full w-full bg-[#f5f5f5] flex flex-col font-sans">
      {/* Header */}
      <div className="relative pt-14 pb-8 px-6 bg-black rounded-b-[32px] shadow-xl z-10">
        <div className="absolute inset-0 overflow-hidden rounded-b-[32px]">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex items-center space-x-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Избранное</h1>
            <p className="text-zinc-400 text-sm">{items.length} предметов сохранено</p>
          </div>
          <Star className="w-6 h-6 text-amber-400 ml-auto fill-amber-400" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-64 text-center"
          >
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
              <Star className="w-10 h-10 text-zinc-300" />
            </div>
            <h2 className="text-lg font-bold text-zinc-700 mb-2">Пока пусто</h2>
            <p className="text-zinc-400 text-sm max-w-[220px] leading-relaxed">
              Нажмите ⭐ в результате сканирования, чтобы сохранить предмет здесь
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onViewResult(item.image, item.result)}
                className="bg-white rounded-2xl shadow-sm overflow-hidden flex items-center cursor-pointer hover:shadow-md transition-shadow border border-transparent hover:border-zinc-200 active:scale-[0.98]"
              >
                <img
                  src={item.image}
                  alt={item.result.exactProductName}
                  className="w-20 h-20 object-cover shrink-0"
                />
                <div className="flex-1 px-4 py-3 min-w-0">
                  <p className="font-bold text-zinc-900 text-sm leading-tight truncate">
                    {item.result.exactProductName}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">{item.result.brand}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-sm font-bold text-emerald-600">
                      {item.result.estimatedValueRange}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleRemove(item.id, e)}
                  className="w-10 h-10 flex items-center justify-center mr-3 text-zinc-300 hover:text-red-400 transition-colors rounded-full hover:bg-red-50 shrink-0"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
