import React, { useState, useEffect, useRef } from 'react';
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
  showCancelButton = false 
}) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [emoji, setEmoji] = useState('🎯');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const MAX_NAME_LENGTH = 50;

  // Cerrar el selector de emojis al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

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
      color,
      emoji,
      order: 0
    };
    
    onAddGoal(newGoal);
    setName('');
    setTargetAmount('');
    setDeadline('');
    setColor('#3B82F6');
    setEmoji('🎯');
    
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
          placeholder="Ej: Vacaciones, Auto, Casa, Moto..."
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-300 h-[52px] ${
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
            Llegaste al límite máximo de caracteres
          </p>
        )}
      </div>

      {/* Layout responsive: vertical en mobile, horizontal en desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Emoji Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icono del Objetivo
          </label>
          <div className="relative" ref={emojiPickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white hover:bg-gray-50 text-lg h-[52px]"
            >
              <span className="text-2xl">{emoji}</span>
              <div className="text-left flex-1">
                <div className="text-sm font-medium text-gray-900">Elegir</div>
                <div className="text-xs text-gray-500">emoji</div>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showEmojiPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Emoji Picker Popover */}
            {showEmojiPicker && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 min-w-[320px]">
                <div className="grid grid-cols-6 gap-3">
                  {['🎯', '💰', '🏆', '⭐', '💎', '🏠', '🚗', '✈️', '🎓', '💍', '📱', '💻', '🎮', '📷', '⌚', '🎵', '📚', '🎨', '🏖️', '🎪', '🍕', '👕', '🏃', '🌱'].map((emojiOption) => (
                    <button
                      key={emojiOption}
                      type="button"
                      onClick={() => {
                        setEmoji(emojiOption);
                        setShowEmojiPicker(false);
                      }}
                      className={`w-12 h-12 text-xl rounded-lg border transition-all duration-200 hover:scale-110 flex items-center justify-center ${
                        emoji === emojiOption ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      title={emojiOption}
                    >
                      {emojiOption}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Meta de Ahorro */}
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
            max={999999999}
            required
          />
        </div>
        
        {/* Fecha Límite */}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-300 h-[52px]"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Color del Objetivo
        </label>
        <div className="flex space-x-3 justify-center flex-wrap gap-2">
          {['#3B82F6', '#10B981', '#8B4513', '#EF4444', '#8B5CF6', '#EC4899', '#374151', '#FBBF24', '#06B6D4'].map((colorOption) => (
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
        {showCancelButton && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="group relative flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancelar</span>
            </div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
          </button>
        )}
        <button
          type="submit"
          className={`group relative ${showCancelButton ? 'flex-1' : 'w-full'} bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer`}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Crear Objetivo</span>
          </div>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
        </button>
      </div>
    </form>
  );
};
