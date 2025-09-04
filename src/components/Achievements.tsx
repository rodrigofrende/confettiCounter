import React from 'react';
import type { Achievement, AchievementProgress } from '../types';

interface AchievementsProps {
  achievements?: Achievement[];
  achievementProgress?: AchievementProgress[];
}

export const Achievements: React.FC<AchievementsProps> = ({ 
  achievements = [], 
  achievementProgress = [] 
}) => {
  const getProgressForAchievement = (achievementId: string) => {
    return achievementProgress.find(p => p.achievementId === achievementId);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString('es-AR');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(amount).replace('ARS', '$');
  };

  const getRarityBorder = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  // Safety checks
  if (!achievements || achievements.length === 0) {
    return null;
  }

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200">
      {/* Header - Optimizado para móviles */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl">🏅</span>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Sistema de Logros</h3>
            <p className="text-xs sm:text-sm text-gray-600">Desbloquea medallas especiales</p>
          </div>
        </div>
        <div className="sm:ml-auto flex items-center gap-3 sm:gap-4">
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-gray-800">{unlockedCount}</div>
            <div className="text-xs text-gray-600">desbloqueados</div>
          </div>
          <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2 sm:h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 sm:h-3 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-gray-800">{totalCount}</div>
            <div className="text-xs text-gray-600">total</div>
          </div>
        </div>
      </div>
      
      {/* Descripción - Mejorada para móviles */}
      <div className="mb-4 sm:mb-6">
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Desbloquea logros especiales mientras gestionas tus finanzas. Cada logro te acerca más a tus metas financieras.
        </p>
      </div>

      {/* Grid de Logros - Responsive mejorado */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {achievements.map((achievement) => {
          const progress = getProgressForAchievement(achievement.id);
          const isUnlocked = achievement.isUnlocked;
          const progressValue = progress ? Math.min(progress.currentValue, progress.targetValue) : 0;
          const progressPercentage = progress ? (progressValue / progress.targetValue) * 100 : 0;
          
          return (
            <div
              key={achievement.id}
              className="relative group cursor-pointer"
            >
                          {/* Logro Card - Tamaño uniforme */}
            <div className={`bg-gradient-to-br ${
              isUnlocked 
                ? 'from-green-50 to-emerald-100' 
                : 'from-gray-50 to-gray-100'
            } rounded-xl p-4 border-2 ${
              isUnlocked 
                ? 'border-green-300' 
                : getRarityBorder(achievement.rarity)
            } transition-all duration-300 hover:shadow-lg hover:scale-105 h-[240px] flex flex-col relative`}>
                
                
                {/* Status Indicator */}
                <div className="absolute top-2 right-2">
                  {isUnlocked ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🔒</span>
                    </div>
                  )}
                </div>

                {/* Logro Icon */}
                <div className="text-center mb-3 relative flex-shrink-0">
                  <div className={`text-3xl mb-2 transition-all duration-300 ${
                    isUnlocked ? '' : 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-80'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                    isUnlocked 
                      ? 'text-green-700 bg-green-100' 
                      : 'text-gray-500 bg-gray-200'
                  }`}>
                    {achievement.category === 'goals' ? 'objetivos' : 
                     achievement.category === 'transactions' ? 'transacciones' :
                     achievement.category === 'milestones' ? 'hitos' : 'rachas'}
                  </div>
                </div>
                
                {/* Logro Info */}
                <div className="text-center flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className={`font-bold text-sm mb-1 transition-colors duration-300 ${
                      isUnlocked ? 'text-gray-800' : 'text-gray-700 group-hover:text-gray-800'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-xs leading-tight mb-2 transition-colors duration-300 ${
                      isUnlocked ? 'text-gray-600' : 'text-gray-500 group-hover:text-gray-600'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  
                  {/* Progress Bar - Solo para logros no desbloqueados */}
                  {progress && !isUnlocked && (
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-600">Progreso</span>
                        <span className="text-xs font-bold text-gray-700">
                          {formatNumber(progress.currentValue)}/{formatNumber(progress.targetValue)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2 group-hover:bg-gray-200 transition-colors duration-300">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500 group-hover:from-blue-500 group-hover:to-blue-600"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        {Math.round(progressPercentage)}%
                      </div>
                    </div>
                  )}
                  
                  {/* Requirement */}
                  <div className={`text-xs px-2 py-1.5 rounded-lg mt-auto transition-all duration-300 ${
                    isUnlocked 
                      ? 'text-green-700 bg-green-100 border border-green-200' 
                      : 'text-gray-600 bg-gray-100 border border-gray-200 group-hover:text-gray-700 group-hover:bg-gray-50'
                  }`}>
                    <div className="font-medium text-center text-[10px]">
                      {isUnlocked ? '✓ Completado' : '📋 Requisito'}
                    </div>
                    <div className="text-center mt-1 text-[10px] leading-tight">
                      {achievement.requirement.type === 'amount_saved' 
                        ? achievement.requirement.description.replace(/\$[\d,]+/g, (match) => {
                            const amount = parseInt(match.replace(/[$,]/g, ''));
                            return formatCurrency(amount);
                          })
                        : achievement.requirement.description
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Barra de Progreso - Optimizada para móviles */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <span className="text-sm font-medium text-gray-700">Progreso General</span>
          <span className="text-sm text-gray-500">{unlockedCount}/{totalCount} logros</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 sm:h-3 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">
          {unlockedCount === totalCount 
            ? '¡Felicidades! Has desbloqueado todos los logros 🎉'
            : '¡Sigue gestionando tus finanzas para desbloquear logros!'
          }
        </p>
      </div>
    </div>
  );
};
