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
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🏅</span>
        <h3 className="text-xl font-semibold text-gray-800">Sistema de Logros</h3>
        <div className="ml-auto">
          <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium border border-purple-200">
            Próximamente
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600 text-sm leading-relaxed">
          Desbloquea logros especiales mientras gestionas tus finanzas. Cada logro te acerca más a tus metas financieras.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {LOGROS.map((logro) => (
          <div
            key={logro.id}
            className="relative group cursor-pointer"
          >
            {/* Logro Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-105">
              {/* Lock Overlay */}
              <div className="absolute inset-0 bg-gray-900/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <div className="text-gray-400 text-2xl opacity-60">
                  🔒
                </div>
              </div>
              
              {/* Logro Icon */}
              <div className="text-center mb-3 relative">
                <div className="text-4xl mb-2 grayscale opacity-50">
                  {logro.icon}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {logro.category === 'goals' ? 'objetivos' : 
                   logro.category === 'savings' ? 'ahorros' :
                   logro.category === 'transactions' ? 'transacciones' : 'hitos'}
                </div>
              </div>
              
              {/* Logro Info */}
              <div className="text-center">
                <h4 className="font-semibold text-gray-700 text-sm mb-1 truncate">
                  {logro.title}
                </h4>
                <p className="text-xs text-gray-500 leading-tight mb-2">
                  {logro.description}
                </p>
                {logro.requirement && (
                  <div className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-full">
                    {logro.requirement}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
             {/* Barra de Progreso */}
       <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
         <div className="flex items-center justify-between mb-2">
           <span className="text-sm font-medium text-gray-700">Progreso General</span>
           <span className="text-sm text-gray-500">0/8 logros</span>
         </div>
         <div className="w-full bg-gray-200 rounded-full h-2">
           <div className="bg-gradient-to-r from-gray-300 to-gray-400 h-2 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
         </div>
         <p className="text-xs text-gray-500 mt-2 text-center">
           ¡Sigue gestionando tus finanzas para desbloquear logros!
         </p>
       </div>
    </div>
  );
};
