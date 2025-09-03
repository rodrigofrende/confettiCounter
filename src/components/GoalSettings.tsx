import React from 'react';
import type { Goal } from '../types';
import { GoalForm } from './GoalForm';

interface GoalSettingsProps {
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onShowWelcomeTour?: () => void;
}

export const GoalSettings: React.FC<GoalSettingsProps> = ({ onAddGoal, onShowWelcomeTour }) => {
  return (
    <div className="space-y-6">
      <GoalForm 
        onAddGoal={onAddGoal}
        buttonText="🎯 Crear Mi Primer Objetivo"
      />
      
      {onShowWelcomeTour && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              ¿Necesitas ayuda?
            </h3>
            <p className="text-blue-600 text-sm mb-4">
              Vuelve a ver el tour de bienvenida para recordar cómo funciona la aplicación
            </p>
            <button
              onClick={onShowWelcomeTour}
              className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">🎬</span>
                <span>Ver Tour de Bienvenida</span>
              </div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


