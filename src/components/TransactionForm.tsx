import React, { useState } from 'react';
import { MoneyInput } from './MoneyInput';

interface TransactionFormProps {
  onAddTransaction: (amount: number, description: string, type: 'income' | 'expense') => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description.trim()) return;
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setIsSubmitting(true);
    
    // Simular un pequeño delay para la animación
    setTimeout(() => {
      onAddTransaction(numAmount, description.trim(), type);
      setAmount('');
      setDescription('');
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="card mb-6 animate-slide-in">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
        <span className="text-2xl">💳</span>
        Registrar Transacción
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad
            </label>
            <MoneyInput
              value={amount}
              onChange={setAmount}
              placeholder="0.00"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white text-gray-900 font-medium"
              min={0.01}
              required
            />
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'income' | 'expense')}
              className="input-field"
            >
              <option value="income">Ingreso</option>
              <option value="expense">Gasto</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción de la transacción"
            className="input-field"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !amount || !description.trim()}
          className={`bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg w-full flex items-center justify-center gap-2 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin">⏳</span>
              Agregando...
            </>
          ) : (
            <>
              <span>✨</span>
              Registrar Transacción
            </>
          )}
        </button>
      </form>
    </div>
  );
};
