import React, { useState } from 'react';
import type { Goal } from '../types';

interface GoalSettingsProps {
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
}

export const GoalSettings: React.FC<GoalSettingsProps> = ({ onAddGoal }) => {
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del Objetivo
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Vacaciones, Auto, Casa..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Color del Objetivo
        </label>
        <div className="flex space-x-3 justify-center">
          {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              onClick={() => setColor(colorOption)}
              className={`w-10 h-10 rounded-full border-3 transition-all duration-300 transform hover:scale-110 ${
                color === colorOption ? 'border-gray-800 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: colorOption }}
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
      >
        🎯 Crear Mi Primer Objetivo
      </button>
    </form>
  );
};
