import React, { useState } from 'react';
import { MoneyInput } from './MoneyInput';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMoney: (amount: number, description: string, isAddition: boolean) => void;
  goalName: string;
  currentAmount: number;
}

export const AddMoneyModal: React.FC<AddMoneyModalProps> = ({
  isOpen,
  onClose,
  onAddMoney,
  goalName,
  currentAmount
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddition, setIsAddition] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }
    
    if (!description.trim()) {
      alert('Por favor ingresa una descripción');
      return;
    }

    // Validation for subtraction
    if (!isAddition && numAmount > currentAmount) {
      alert(`No puedes restar más dinero del disponible. Máximo: $${currentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      onAddMoney(numAmount, description.trim(), isAddition);
      
      // Delay closing the modal to allow users to see the progress animation
      setTimeout(() => {
        // Reset form
        setAmount('');
        setDescription('');
        setIsAddition(true); // Reset to addition
        onClose();
        setIsSubmitting(false);
      }, 1500); // 1.5 second delay to see the animation
    } catch (error) {
      console.error('Error processing transaction:', error);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setDescription('');
    setIsAddition(true); // Reset to addition
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full relative z-60"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAddition ? 'bg-green-100' : 'bg-red-100'}`}>
                <svg className={`w-5 h-5 ${isAddition ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isAddition ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  )}
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {isAddition ? 'Agregar Dinero' : 'Quitar Dinero'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Toggle for Add/Subtract */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-xl p-1 flex">
              <button
                type="button"
                onClick={() => setIsAddition(true)}
                className={`group relative px-4 py-2 rounded-lg font-medium transition-all duration-300 transform cursor-pointer ${
                  isAddition 
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg scale-105 hover:shadow-xl' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Agregar</span>
                </div>
                {isAddition && (
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsAddition(false)}
                className={`group relative px-4 py-2 rounded-lg font-medium transition-all duration-300 transform cursor-pointer ${
                  !isAddition 
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg scale-105 hover:shadow-xl' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                  <span>Quitar</span>
                </div>
                {!isAddition && (
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                )}
              </button>
            </div>
          </div>

          {/* Goal Info */}
          <div className={`rounded-xl p-4 mb-6 ${isAddition ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-center">
              <div className={`text-sm font-medium mb-1 ${isAddition ? 'text-green-600' : 'text-red-600'}`}>
                {isAddition ? 'Agregando dinero a:' : 'Quitando dinero de:'}
              </div>
              <div className={`text-lg font-bold ${isAddition ? 'text-green-800' : 'text-red-800'} flex items-center justify-center space-x-2`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>{goalName}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Disponible: ${currentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <MoneyInput
                id="amount"
                value={amount}
                onChange={setAmount}
                placeholder="0.00"
                min={0.01}
                max={!isAddition ? currentAmount : undefined}
                className={isAddition 
                  ? 'border-gray-300 focus:ring-green-500' 
                  : 'border-gray-300 focus:ring-red-500'
                }
                required
                autoComplete="off"
              />
              {/* Espacio reservado para evitar layout shift */}
              <div className="h-4 mt-1">
                {!isAddition && (
                  <div className="text-xs text-red-600">
                    Máximo: ${currentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                )}
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isAddition ? "Ej: Ahorro mensual, bono extra, etc." : "Ej: Emergencia, gasto urgente, etc."}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent ${
                  isAddition ? 'focus:ring-green-500' : 'focus:ring-red-500'
                }`}
                required
                maxLength={100}
              />
              <div className="text-xs text-gray-500 mt-1">
                {description.length}/100 caracteres
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="group relative flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl cursor-pointer"
                disabled={isSubmitting}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancelar</span>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !amount || !description.trim()}
                className={`group relative flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl cursor-pointer ${
                  isAddition 
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700' 
                    : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isAddition ? 'Agregando...' : 'Quitando...'}
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isAddition ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      )}
                    </svg>
                    <span>{isAddition ? 'Agregar Dinero' : 'Quitar Dinero'}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
