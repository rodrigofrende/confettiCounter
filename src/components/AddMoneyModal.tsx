import React, { useState } from 'react';

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
      alert(`No puedes restar más dinero del disponible. Máximo: $${currentAmount.toFixed(2)}`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      onAddMoney(numAmount, description.trim(), isAddition);
      
      // Reset form
      setAmount('');
      setDescription('');
      setIsAddition(true); // Reset to addition
      onClose();
    } catch (error) {
      console.error('Error processing transaction:', error);
    } finally {
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
            <h2 className="text-xl font-bold text-gray-900">
              {isAddition ? '💰 Agregar Dinero' : '💸 Quitar Dinero'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
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
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform ${
                  isAddition 
                    ? 'bg-green-500 text-white shadow-md scale-105' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                💰 Agregar
              </button>
              <button
                type="button"
                onClick={() => setIsAddition(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform ${
                  !isAddition 
                    ? 'bg-red-500 text-white shadow-md scale-105' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                💸 Quitar
              </button>
            </div>
          </div>

          {/* Goal Info */}
          <div className={`rounded-xl p-4 mb-6 ${isAddition ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-center">
              <div className={`text-sm font-medium mb-1 ${isAddition ? 'text-green-600' : 'text-red-600'}`}>
                {isAddition ? 'Agregando dinero a:' : 'Quitando dinero de:'}
              </div>
              <div className={`text-lg font-bold ${isAddition ? 'text-green-800' : 'text-red-800'}`}>
                🎯 {goalName}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Disponible: ${currentAmount.toFixed(2)}
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
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg font-medium">$</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  max={!isAddition ? currentAmount : undefined}
                  step="0.01"
                  className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent text-lg font-medium ${
                    isAddition 
                      ? 'border-gray-300 focus:ring-green-500' 
                      : 'border-gray-300 focus:ring-red-500'
                  }`}
                  required
                  autoComplete="off"
                />
              </div>
              {/* Espacio reservado para evitar layout shift */}
              <div className="h-4 mt-1">
                {!isAddition && (
                  <div className="text-xs text-red-600">
                    Máximo: ${currentAmount.toFixed(2)}
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
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !amount || !description.trim()}
                className={`flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg ${
                  isAddition 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isAddition ? 'Agregando...' : 'Quitando...'}
                  </div>
                ) : (
                  isAddition ? '💰 Agregar Dinero' : '💸 Quitar Dinero'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
