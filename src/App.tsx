import { useState, useEffect } from 'react';
import type { Transaction, Goal } from './types';
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

  // Si no hay objetivos, mostrar la página de configuración inicial
  if (goals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              💰 Money Counter
            </h1>
            <p className="text-gray-600 text-lg">
              Gestiona tus finanzas con objetivos claros
            </p>
          </div>
          
          <GoalSettings onAddGoal={addGoal} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs
          defaultTab="objetivos"
          tabs={[
            {
              id: 'objetivos',
              label: 'Objetivos',
              icon: '🎯',
              content: (
                <div className="space-y-6">
                  <GoalProgress 
                    goals={goals}
                    onUpdateGoal={updateGoal}
                    onDeleteGoal={deleteGoal}
                    onAddGoal={addGoal}
                    onAddTransaction={addTransaction}
                  />
                </div>
              ),
            },

            {
              id: 'historial',
              label: 'Historial',
              icon: '📋',
              content: (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">Ingresos</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">Gastos</div>
                      </div>
                    </div>
                  </div>

                  {/* Transaction History */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                      Historial de Transacciones
                    </h2>
                    <TransactionList 
                      transactions={transactions}
                      onDeleteTransaction={deleteTransaction}
                    />
                  </div>
                </div>
              ),
            },
            {
              id: 'estadisticas',
              label: 'Estadísticas',
              icon: '📊',
              content: (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                      Estadísticas Financieras
                    </h2>
                    <Statistics 
                      transactions={transactions}
                      totalIncome={totalIncome}
                      totalExpenses={totalExpenses}
                      balance={balance}
                    />
                  </div>
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
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
    </div>
  );
}

export default App;