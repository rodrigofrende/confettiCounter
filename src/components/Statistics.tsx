import React from 'react';
import type { Transaction } from '../types';
import { Achievements } from './Achievements';

interface StatisticsProps {
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export const Statistics: React.FC<StatisticsProps> = ({ 
  transactions, 
  totalIncome, 
  totalExpenses, 
  balance 
}) => {
  const transactionCount = transactions.length;
  const averageTransaction = transactionCount > 0 ? balance / transactionCount : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-2xl">📊</span>
          Estadísticas Financieras
        </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200 group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/60 rounded-2xl">
              <div className="text-3xl text-emerald-600 group-hover:scale-110 transition-transform duration-300">💰</div>
            </div>
            <div className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full font-semibold">
              +{((totalIncome / (totalIncome + totalExpenses)) * 100 || 0).toFixed(0)}%
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mb-1">
            ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-emerald-600 font-medium">Total Ingresos</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200 group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/60 rounded-2xl">
              <div className="text-3xl text-red-600 group-hover:scale-110 transition-transform duration-300">💸</div>
            </div>
            <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full font-semibold">
              -{((totalExpenses / (totalIncome + totalExpenses)) * 100 || 0).toFixed(0)}%
            </div>
          </div>
          <div className="text-2xl font-bold text-red-700 mb-1">
            ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-red-600 font-medium">Total Gastos</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/60 rounded-2xl">
              <div className="text-3xl text-blue-600 group-hover:scale-110 transition-transform duration-300">📈</div>
            </div>
            <div className={`text-xs px-2 py-1 rounded-full font-semibold ${
              balance >= 0 ? 'text-blue-600 bg-blue-100' : 'text-red-600 bg-red-100'
            }`}>
              {balance >= 0 ? 'Positivo' : 'Negativo'}
            </div>
          </div>
          <div className={`text-2xl font-bold mb-1 ${balance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-blue-600 font-medium">Balance Neto</div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/60 rounded-2xl">
              <div className="text-3xl text-gray-600 group-hover:scale-110 transition-transform duration-300">📝</div>
            </div>
            <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full font-semibold">
              Total
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-700 mb-1">
            {transactionCount}
          </div>
          <div className="text-sm text-gray-600 font-medium">Transacciones</div>
        </div>
      </div>
      
      {transactionCount > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
          <div className="text-sm text-gray-600 mb-1">Promedio por Transacción</div>
          <div className={`text-lg font-bold ${averageTransaction >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${averageTransaction.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      )}
      </div>
      
      {/* Sistema de Logros */}
      <Achievements />
    </div>
  );
};
