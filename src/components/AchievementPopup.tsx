import React, { useEffect, useState } from 'react';
import type { Achievement } from '../types';

interface AchievementPopupProps {
  achievement: Achievement;
  onClose: () => void;
  show: boolean;
  queueLength?: number;
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({ 
  achievement, 
  onClose, 
  show,
  queueLength = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsAnimating(true);
      
      // Auto close after 4 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'rare': return 'from-blue-400 to-blue-500';
      case 'epic': return 'from-purple-400 to-purple-500';
      case 'legendary': return 'from-yellow-400 to-yellow-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityGlow = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'shadow-gray-400/50';
      case 'rare': return 'shadow-blue-400/50';
      case 'epic': return 'shadow-purple-400/50';
      case 'legendary': return 'shadow-yellow-400/50';
      default: return 'shadow-gray-400/50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Popup Card */}
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-all duration-500 ${
          isAnimating 
            ? 'scale-100 translate-y-0 opacity-100' 
            : 'scale-95 translate-y-4 opacity-0'
        } ${getRarityGlow(achievement.rarity)}`}
        style={{
          boxShadow: `0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1), 0 0 20px ${
            achievement.rarity === 'legendary' ? 'rgba(255, 215, 0, 0.3)' :
            achievement.rarity === 'epic' ? 'rgba(147, 51, 234, 0.3)' :
            achievement.rarity === 'rare' ? 'rgba(59, 130, 246, 0.3)' :
            'rgba(107, 114, 128, 0.3)'
          }`
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Achievement Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 mb-3">
            <span className="text-3xl">{achievement.icon}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Logro Desbloqueado
            </span>
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`} />
            {queueLength > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                +{queueLength} más
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            {achievement.title}
          </h3>
          
          <p className="text-sm text-gray-600 leading-relaxed">
            {achievement.description}
          </p>
        </div>

        {/* Achievement Details */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Categoría:</span>
            <span className="font-medium text-gray-700 capitalize">
              {achievement.category === 'goals' ? 'Objetivos' :
               achievement.category === 'transactions' ? 'Transacciones' :
               achievement.category === 'milestones' ? 'Hitos' : 'Rachas'}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-500">Rareza:</span>
            <span className={`font-medium capitalize ${
              achievement.rarity === 'legendary' ? 'text-yellow-600' :
              achievement.rarity === 'epic' ? 'text-purple-600' :
              achievement.rarity === 'rare' ? 'text-blue-600' :
              'text-gray-600'
            }`}>
              {achievement.rarity === 'legendary' ? 'Legendario' :
               achievement.rarity === 'epic' ? 'Épico' :
               achievement.rarity === 'rare' ? 'Raro' : 'Común'}
            </span>
          </div>
        </div>

        {/* Celebration Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)} animate-ping`}
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 20}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleClose}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
        >
          ¡Genial! 🎉
        </button>
      </div>
    </div>
  );
};
