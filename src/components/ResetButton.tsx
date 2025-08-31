import React, { useState } from 'react';

interface ResetButtonProps {
  onReset: () => void;
}

export const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    onReset();
    setShowConfirm(false);
  };

  return (
    <div className="card mb-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Gestión de Datos
        </h3>
        
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            🔄 Resetear Todo
          </button>
        ) : (
          <div className="space-y-4 animate-scale-in">
            <div className="text-red-600 font-semibold">
              ⚠️ ¿Estás seguro?
            </div>
            <p className="text-gray-600">
              Esta acción eliminará todas las transacciones y reseteará el objetivo.
              <br />
              <strong>Esta acción no se puede deshacer.</strong>
            </p>
            
            <div className="flex space-x-3 justify-center">
              <button
                onClick={handleReset}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
              >
                Sí, Resetear Todo
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
