import React, { useState } from 'react';
import type { Transaction } from '../types';
import { MoneyInput } from './MoneyInput';
import { useLazyLoad } from '../hooks/useLazyLoad';
import { TransactionItemSkeleton, LoadingSpinner } from './SkeletonLoader';

interface TransactionListProps {
  transactions: Transaction[];
  onUpdateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id' | 'date'>>) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onUpdateTransaction,
  onDeleteTransaction 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ description: '', amount: '' });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  // Lazy loading hook
  const { 
    visibleItems: visibleTransactions, 
    hasMore, 
    isLoading, 
    observerRef 
  } = useLazyLoad({
    items: transactions,
    initialLoadCount: 8,
    loadMoreCount: 6,
    threshold: 0.3
  });

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

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteTransaction = () => {
    if (transactionToDelete) {
      onDeleteTransaction(transactionToDelete.id);
      setShowDeleteConfirmation(false);
      setTransactionToDelete(null);
    }
  };

  const cancelDeleteTransaction = () => {
    setShowDeleteConfirmation(false);
    setTransactionToDelete(null);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Tu historial está vacío
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Comienza agregando transacciones desde la pestaña "Objetivos" para empezar a controlar tus finanzas.
        </p>
      </div>
    );
  }

  // Mostrar skeletons durante la carga inicial
  if (transactions.length > 0 && visibleTransactions.length === 0) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <TransactionItemSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visibleTransactions.map((transaction, index) => (
        <div
          key={transaction.id}
          className={`relative rounded-2xl shadow-md border transition-all duration-300 ${
            editingId === transaction.id
              ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg'
              : `bg-white border-gray-200 hover:shadow-lg ${
                  transaction.type === 'income' 
                    ? 'hover:border-green-300' 
                    : 'hover:border-red-300'
                }`
          }`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {editingId === transaction.id ? (
            // Modo edición
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                {transaction.goalEmoji && transaction.goalColor ? (
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md"
                    style={{ backgroundColor: transaction.goalColor }}
                  >
                    {transaction.goalEmoji}
                  </div>
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {transaction.type === 'income' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      )}
                    </svg>
                  </div>
                )}
                <div className="text-sm text-gray-500 font-medium">
                  Editando transacción
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({...prev, description: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg font-medium"
                    placeholder="Descripción de la transacción"
                    maxLength={35}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {editForm.description.length}/35 caracteres
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto
                  </label>
                  <MoneyInput
                    value={editForm.amount}
                    onChange={(value) => setEditForm(prev => ({...prev, amount: value}))}
                    placeholder="0.00"
                    min={0.01}
                    className="border-gray-300 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={saveEdit}
                  className="group relative flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Guardar</span>
                  </div>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
                </button>
                <button
                  onClick={cancelEdit}
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
              </div>
            </div>
          ) : (
            // Modo visualización
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {transaction.goalEmoji && transaction.goalColor ? (
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md"
                      style={{ backgroundColor: transaction.goalColor }}
                    >
                      {transaction.goalEmoji}
                    </div>
                  ) : (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {transaction.type === 'income' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        )}
                      </svg>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-lg truncate">
                      {transaction.description.includes(' - ') ? (
                        <>
                          {transaction.description.split(' - ')[0]}
                          <span className="text-gray-500 font-normal"> - {transaction.description.split(' - ')[1]}</span>
                        </>
                      ) : (
                        transaction.description
                      )}
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
                      {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(transaction)}
                      className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 transform hover:scale-110 group cursor-pointer"
                      title="Editar transacción"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleDeleteClick(transaction)}
                      className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 transform hover:scale-110 group cursor-pointer"
                      title="Eliminar transacción"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
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
      
      {/* Elemento observador para lazy loading */}
      {hasMore && (
        <div ref={observerRef} className="h-4 flex justify-center items-center">
          {isLoading && <LoadingSpinner size="sm" />}
        </div>
      )}
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirmation && transactionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative z-60 animate-modalIn">
            <div className="mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¿Eliminar transacción?
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                Estás a punto de eliminar esta transacción:
              </p>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-4 mb-4 border border-red-200">
                <div className="flex items-center justify-center gap-3 mb-2">
                  {transactionToDelete.goalEmoji && transactionToDelete.goalColor ? (
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md"
                      style={{ backgroundColor: transactionToDelete.goalColor }}
                    >
                      {transactionToDelete.goalEmoji}
                    </div>
                  ) : (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transactionToDelete.type === 'income' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {transactionToDelete.type === 'income' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        )}
                      </svg>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-red-800">
                    {transactionToDelete.description}
                  </h3>
                </div>
                <div className="text-red-700 text-sm">
                  Monto: {transactionToDelete.type === 'income' ? '+' : '-'}${Math.abs(transactionToDelete.amount).toLocaleString()}
                </div>
                <div className="text-red-600 text-xs mt-1">
                  {transactionToDelete.date.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              {transactionToDelete.description.includes('objetivo:') && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                  <p className="text-yellow-800 text-sm font-medium">
                    ⚠️ Esta transacción está asociada a un objetivo. Su eliminación afectará el progreso del objetivo.
                  </p>
                </div>
              )}
              <p className="text-gray-600 text-sm">
                Esta acción no se puede deshacer.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelDeleteTransaction}
                className="flex-1 group relative bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
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
                onClick={confirmDeleteTransaction}
                className="flex-1 group relative bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Sí, eliminar</span>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
