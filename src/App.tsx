import { useState, useEffect } from 'react';
import type { Transaction, Goal } from './types';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Statistics } from './components/Statistics';
import { GoalProgress } from './components/GoalProgress';
import { GoalSettings } from './components/GoalSettings';
import { ResetButton } from './components/ResetButton';
import { Tabs } from './components/Tabs';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('money-counter-transactions');
    const savedGoals = localStorage.getItem('money-counter-goals');
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date)
      })));
    }
    
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals).map((g: any) => ({
        ...g,
        deadline: new Date(g.deadline)
      })));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('money-counter-transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('money-counter-goals', JSON.stringify(goals));
  }, [goals]);

  const addTransaction = (amount: number, description: string, type: 'income' | 'expense') => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount,
      description,
      type,
      date: new Date()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString()
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const resetAll = () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar todo? Esta acción no se puede deshacer.')) {
      setTransactions([]);
      setGoals([]);
      localStorage.removeItem('money-counter-transactions');
      localStorage.removeItem('money-counter-goals');
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              💰 Money Counter
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Gestiona tus finanzas de manera inteligente
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-6 sm:py-8">
        <Tabs
          defaultTab="objetivos"
          tabs={[
            {
              id: 'objetivos',
              label: 'Objetivos',
              icon: '🎯',
              content: (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                      Configurar Objetivos
                    </h2>
                    <GoalSettings onAddGoal={addGoal} />
                  </div>
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                      Progreso de Objetivos
                    </h2>
                    <GoalProgress 
                      goals={goals}
                      onUpdateGoal={updateGoal}
                      onDeleteGoal={deleteGoal}
                    />
                  </div>
                </div>
              ),
            },
            {
              id: 'transacciones',
              label: 'Transacciones',
              icon: '💳',
              disabled: goals.length === 0,
              content: (
                <div className="space-y-4 sm:space-y-6">
                  {/* Balance Overview */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6">
                    <div className="text-center mb-6">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Balance Total</h2>
                      <div className={`text-3xl sm:text-4xl font-bold mb-4 ${
                        balance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${balance.toFixed(2)}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 rounded-lg p-3 sm:p-4 text-center">
                          <div className="text-lg sm:text-xl font-bold text-green-700">
                            ${totalIncome.toFixed(2)}
                          </div>
                          <div className="text-xs sm:text-sm text-green-600 font-medium">
                            Ingresos
                          </div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3 sm:p-4 text-center">
                          <div className="text-lg sm:text-xl font-bold text-red-700">
                            ${totalExpenses.toFixed(2)}
                          </div>
                          <div className="text-xs sm:text-sm text-red-600 font-medium">
                            Gastos
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Form */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 text-center">
                      Nueva Transacción
                    </h2>
                    <TransactionForm onAddTransaction={addTransaction} />
                  </div>
                </div>
              ),
            },
            {
              id: 'historial',
              label: 'Historial',
              icon: '📋',
              disabled: goals.length === 0,
              content: (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                    Historial de Transacciones
                  </h2>
                  <TransactionList 
                    transactions={transactions}
                    onDeleteTransaction={deleteTransaction}
                  />
                </div>
              ),
            },
            {
              id: 'estadisticas',
              label: 'Estadísticas',
              icon: '📊',
              disabled: goals.length === 0,
              content: (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                      Estadísticas Financieras
                    </h2>
                    <Statistics 
                      transactions={transactions}
                      totalIncome={totalIncome}
                      totalExpenses={totalExpenses}
                      balance={balance}
                    />
                  </div>
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                      Configuración
                    </h2>
                    <div className="text-center">
                      <ResetButton onReset={resetAll} />
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}

export default App;