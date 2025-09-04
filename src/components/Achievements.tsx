import React from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'savings' | 'goals' | 'transactions' | 'milestones';
  isUnlocked: boolean;
  requirement?: string;
}

const LOGROS: Achievement[] = [
  {
    id: 'first_goal',
    title: 'Primer Paso',
    description: 'Crea tu primer objetivo financiero',
    icon: '🎯',
    category: 'goals',
    isUnlocked: false,
    requirement: '1 objetivo creado'
  },
  {
    id: 'savings_streak',
    title: 'Racha de Ahorros',
    description: 'Ahorra dinero por 7 días consecutivos',
    icon: '🔥',
    category: 'savings',
    isUnlocked: false,
    requirement: '7 días consecutivos'
  },
  {
    id: 'goal_master',
    title: 'Maestro de Objetivos',
    description: 'Completa 5 objetivos diferentes',
    icon: '🏆',
    category: 'goals',
    isUnlocked: false,
    requirement: '5 objetivos completados'
  },
  {
    id: 'big_saver',
    title: 'Gran Ahorrador',
    description: 'Ahorra más de $10,000 en total',
    icon: '💎',
    category: 'savings',
    isUnlocked: false,
    requirement: '$10,000 ahorrados'
  },
  {
    id: 'transaction_tracker',
    title: 'Rastreador de Gastos',
    description: 'Registra 50 transacciones',
    icon: '📊',
    category: 'transactions',
    isUnlocked: false,
    requirement: '50 transacciones'
  },
  {
    id: 'early_bird',
    title: 'Madrugador',
    description: 'Completa un objetivo antes de la fecha límite',
    icon: '⏰',
    category: 'milestones',
    isUnlocked: false,
    requirement: 'Objetivo completado antes del plazo'
  },
  {
    id: 'consistency_king',
    title: 'Rey de la Consistencia',
    description: 'Mantén un objetivo activo por 30 días',
    icon: '👑',
    category: 'milestones',
    isUnlocked: false,
    requirement: '30 días activo'
  },
  {
    id: 'financial_guru',
    title: 'Gurú Financiero',
    description: 'Alcanza un balance positivo de $5,000',
    icon: '🧙‍♂️',
    category: 'milestones',
    isUnlocked: false,
    requirement: '$5,000 de balance positivo'
  }
];

export const Achievements: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200">
      {/* Header - Optimizado para móviles */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏅</span>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Sistema de Logros</h3>
        </div>
        <div className="sm:ml-auto">
          <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-purple-200">
            Próximamente
          </span>
        </div>
      </div>
      
      {/* Descripción - Mejorada para móviles */}
      <div className="mb-4 sm:mb-6">
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Desbloquea logros especiales mientras gestionas tus finanzas. Cada logro te acerca más a tus metas financieras.
        </p>
      </div>

      {/* Grid de Logros - Responsive mejorado */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {LOGROS.map((logro) => (
          <div
            key={logro.id}
            className="relative group cursor-pointer"
          >
            {/* Logro Card - Optimizada para móviles */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 border-2 border-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-105 min-h-[140px] sm:min-h-[160px] flex flex-col">
              {/* Lock Overlay */}
              <div className="absolute inset-0 bg-gray-900/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <div className="text-gray-400 text-xl sm:text-2xl opacity-60">
                  🔒
                </div>
              </div>
              
              {/* Logro Icon */}
              <div className="text-center mb-2 sm:mb-3 relative flex-shrink-0">
                <div className="text-3xl sm:text-4xl mb-1 sm:mb-2 grayscale opacity-50">
                  {logro.icon}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {logro.category === 'goals' ? 'objetivos' : 
                   logro.category === 'savings' ? 'ahorros' :
                   logro.category === 'transactions' ? 'transacciones' : 'hitos'}
                </div>
              </div>
              
              {/* Logro Info */}
              <div className="text-center flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-gray-700 text-xs sm:text-sm mb-1 line-clamp-2">
                    {logro.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-tight mb-2 line-clamp-2">
                    {logro.description}
                  </p>
                </div>
                {logro.requirement && (
                  <div className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-full mt-auto">
                    <span className="line-clamp-1">{logro.requirement}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Barra de Progreso - Optimizada para móviles */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <span className="text-sm font-medium text-gray-700">Progreso General</span>
          <span className="text-sm text-gray-500">0/8 logros</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
          <div className="bg-gradient-to-r from-gray-300 to-gray-400 h-2 sm:h-3 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">
          ¡Sigue gestionando tus finanzas para desbloquear logros!
        </p>
      </div>
    </div>
  );
};
