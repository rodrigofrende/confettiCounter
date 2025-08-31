import React from 'react';
import type { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onDeleteTransaction 
}) => {
  if (transactions.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">💰</div>
          <h3 className="empty-state-title">
            Tu historial está vacío
          </h3>
          <p className="empty-state-description">
            Comienza agregando tu primera transacción en la pestaña "Transacciones" para empezar a controlar tus finanzas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      
      <div className="space-y-3">
        {transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 transition-all duration-300 hover:shadow-md animate-slide-in ${
              transaction.type === 'income' 
                ? 'border-l-green-500 bg-green-50' 
                : 'border-l-red-500 bg-red-50'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className={`text-2xl ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '💰' : '💸'}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    {transaction.description}
                  </div>
                  <div className="text-sm text-gray-500">
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
            </div>
            
            <div className="text-right">
              <div className={`text-lg font-bold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
              </div>
            </div>
            
            <button
              onClick={() => onDeleteTransaction(transaction.id)}
              className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
              title="Eliminar transacción"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
