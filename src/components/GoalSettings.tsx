import React, { useState } from 'react';
import type { Goal } from '../types';

interface GoalSettingsProps {
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
}

export const GoalSettings: React.FC<GoalSettingsProps> = ({ onAddGoal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [color, setColor] = useState('#3B82F6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numTarget = parseFloat(targetAmount);
    if (isNaN(numTarget) || numTarget <= 0 || !name.trim() || !deadline) return;
    
    const newGoal: Omit<Goal, 'id'> = {
      name: name.trim(),
      targetAmount: numTarget,
      currentAmount: 0,
      deadline: new Date(deadline),
      color
    };
    
    onAddGoal(newGoal);
    setName('');
    setTargetAmount('');
    setDeadline('');
    setColor('#3B82F6');
    setIsOpen(false);
  };

  return (
    <div className="card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          🎯 Configurar Nuevo Objetivo
        </h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          {isOpen ? 'Cerrar' : 'Nuevo Objetivo'}
        </button>
      </div>

      {!isOpen && (
        <div className="text-center py-4">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-gray-600">
            Configura tus metas financieras para comenzar a ahorrar
          </p>
        </div>
      )}

      {isOpen && (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Objetivo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Vacaciones, Auto, Casa..."
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta de Ahorro
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="0.00"
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Límite
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color del Objetivo
            </label>
            <div className="flex space-x-2">
              {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === colorOption ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex-1"
            >
              Crear Objetivo
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex-1"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
