import React, { useState } from 'react';
import type { Transaction } from '../types';
import { MoneyInput } from './MoneyInput';

interface TransactionListProps {
  transactions: Transaction[];
  onUpdateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id' | 'date'>>) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onUpdateTransaction 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ description: '', amount: '' });

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      description: transaction.description,
      amount: Math.abs(transaction.amount).toString()
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ description: '', amount: '' });
  };

  const saveEdit = () => {
    const amount = parseFloat(editForm.amount);
    if (editingId && editForm.description.trim() && amount > 0) {
      onUpdateTransaction(editingId, {
        description: editForm.description.trim(),
        amount: amount
      });
      cancelEdit();
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 opacity-50">💰</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Tu historial está vacío
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Comienza agregando transacciones desde la pestaña "Objetivos" para empezar a controlar tus finanzas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction, index) => (
        <div
          key={transaction.id}
          className={`relative bg-white rounded-2xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg ${
            transaction.type === 'income' 
              ? 'hover:border-green-300' 
              : 'hover:border-red-300'
          }`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {editingId === transaction.id ? (
            // Modo edición
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`text-2xl ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '💰' : '💸'}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  Editando transacción
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({...prev, description: e.target.value}))}
                    className="input-field"
                    placeholder="Descripción de la transacción"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto
                  </label>
                  <MoneyInput
                    value={editForm.amount}
                    onChange={(value) => setEditForm(prev => ({...prev, amount: value}))}
                    placeholder="0.00"
                    min={0.01}
                    required
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={saveEdit}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Guardar
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            // Modo visualización
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`text-3xl ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '💰' : '💸'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-lg truncate">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {transaction.date.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`text-xl font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => startEdit(transaction)}
                    className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                    title="Editar transacción"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Indicador visual del tipo de transacción */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
