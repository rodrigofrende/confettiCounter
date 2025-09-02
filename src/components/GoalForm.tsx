import React, { useState } from 'react';
import type { Goal } from '../types';
import { MoneyInput } from './MoneyInput';

interface GoalFormProps {
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onCancel?: () => void;
  buttonText?: string;
  showCancelButton?: boolean;
}

export const GoalForm: React.FC<GoalFormProps> = ({ 
  onAddGoal, 
  onCancel, 
  buttonText = "🎯 Crear Mi Primer Objetivo",
  showCancelButton = false 
}) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [color, setColor] = useState('#3B82F6');

  const MAX_NAME_LENGTH = 50;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numTarget = parseFloat(targetAmount);
    
    if (isNaN(numTarget) || numTarget <= 0 || !name.trim() || !deadline) return;
    
    // Create dates more safely using the date string format YYYY-MM-DD
    const deadlineParts = deadline.split('-');
    const selectedDate = new Date(parseInt(deadlineParts[0]), parseInt(deadlineParts[1]) - 1, parseInt(deadlineParts[2]));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Compare using getTime() for more reliable comparison
    if (selectedDate.getTime() < today.getTime()) {
      alert('La fecha límite no puede ser anterior a hoy.');
      return;
    }
    
    const newGoal: Omit<Goal, 'id'> = {
      name: name.trim(),
      targetAmount: numTarget,
      currentAmount: 0,
      deadline: selectedDate,
      color
    };
    
    onAddGoal(newGoal);
    setName('');
    setTargetAmount('');
    setDeadline('');
    setColor('#3B82F6');
    
    // Call onCancel to close the form if it's in modal mode
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Nombre del Objetivo
          </label>
          <span className={`text-xs font-medium ${
            name.length > MAX_NAME_LENGTH * 0.8 
              ? name.length >= MAX_NAME_LENGTH 
                ? 'text-red-600' 
                : 'text-orange-600'
              : 'text-gray-500'
          }`}>
            {name.length}/{MAX_NAME_LENGTH}
          </span>
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            if (e.target.value.length <= MAX_NAME_LENGTH) {
              setName(e.target.value);
            }
          }}
          placeholder="Ej: Vacaciones, Auto, Casa..."
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-300 ${
            name.length >= MAX_NAME_LENGTH 
              ? 'border-red-300 bg-red-50' 
              : name.length > MAX_NAME_LENGTH * 0.8
              ? 'border-orange-300 bg-orange-50'
              : 'border-gray-300'
          }`}
          maxLength={MAX_NAME_LENGTH}
          required
        />
        {name.length >= MAX_NAME_LENGTH && (
          <p className="text-xs text-red-600 mt-1">
            Has alcanzado el límite máximo de caracteres
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta de Ahorro
          </label>
          <MoneyInput
            value={targetAmount}
            onChange={setTargetAmount}
            placeholder="0.00"
            className=""
            min={0.01}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Límite
          </label>
          <div className="date-input-wrapper">
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)} 
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-300"
              required
            />
          </div>
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

      <div className={`${showCancelButton ? 'flex space-x-3' : ''}`}>
        <button
          type="submit"
          className={`${showCancelButton ? 'flex-1' : 'w-full'} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg`}
        >
          {buttonText}
        </button>
        {showCancelButton && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
