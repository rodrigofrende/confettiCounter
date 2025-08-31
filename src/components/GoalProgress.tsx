import React from 'react';
import type { Goal } from '../types';

interface GoalProgressProps {
  goals: Goal[];
  onUpdateGoal: (id: string, updates: Partial<Goal>) => void;
  onDeleteGoal: (id: string) => void;
}

export const GoalProgress: React.FC<GoalProgressProps> = ({ 
  goals, 
  onUpdateGoal, 
  onDeleteGoal 
}) => {
  if (goals.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">🎯</div>
          <h3 className="empty-state-title">
            ¡Tiempo de establecer objetivos!
          </h3>
          <p className="empty-state-description">
            Crea tus primeras metas financieras para comenzar a ahorrar de manera inteligente. Define objetivos claros y alcanzables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          const remaining = goal.targetAmount - goal.currentAmount;
          const isGoalReached = goal.currentAmount >= goal.targetAmount;
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

          return (
            <div key={goal.id} className="p-6 bg-gradient-to-br from-white/90 to-gray-50/90 rounded-2xl border-l-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in" style={{borderColor: goal.color}}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  {goal.name}
                </h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onUpdateGoal(goal.id, { 
                      currentAmount: Math.min(goal.currentAmount + 100, goal.targetAmount) 
                    })}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm"
                    disabled={isGoalReached}
                  >
                    +$100
                  </button>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="text-center mb-3">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  ${goal.currentAmount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  de ${goal.targetAmount.toLocaleString()}
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progreso</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${
                      isGoalReached 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Fecha límite: {goal.deadline.toLocaleDateString('es-ES')}</span>
                {!isGoalReached && (
                  <span className={daysLeft < 7 ? 'text-red-600 font-semibold' : ''}>
                    {daysLeft > 0 ? `${daysLeft} días restantes` : '¡Vencido!'}
                  </span>
                )}
              </div>

              {!isGoalReached && remaining > 0 && (
                <div className="text-center text-gray-600 mt-2">
                  Te faltan <span className="font-semibold text-blue-600">${remaining.toLocaleString()}</span> para alcanzar tu objetivo
                </div>
              )}

              {isGoalReached && (
                <div className="text-center text-green-600 font-bold text-lg mt-3 p-3 bg-green-50 rounded-xl animate-bounce-in">
                  🎉 ¡Objetivo alcanzado! 🎊
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
