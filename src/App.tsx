import { useState, useEffect } from 'react';
import type { Transaction, Goal } from './types';
import { TransactionList } from './components/TransactionList';
import { Statistics } from './components/Statistics';
import { GoalProgress } from './components/GoalProgress';
import { GoalSettings } from './components/GoalSettings';
import { ResetButton } from './components/ResetButton';
import { Tabs } from './components/Tabs';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Achievements } from './components/Achievements';
import { AchievementPopup } from './components/AchievementPopup';
import { useAchievements } from './hooks/useAchievements';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const STORAGE_KEYS = {
  TRANSACTIONS: 'moneymetrics-transactions',
  GOALS: 'moneymetrics-goals',
  VISITED: 'moneymetrics-visited'
} as const;

const TABS_CONFIG = [
  {
    id: 'objetivos',
    label: 'Objetivos',
    icon: '🎯',
  },
  {
    id: 'historial',
    label: 'Historial',
    icon: '📋',
  },
  {
    id: 'estadisticas',
    label: 'Estadísticas',
    icon: '📊',
  },
] as const;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function App() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  // Achievement system
  const {
    achievements,
    achievementProgress,
    checkNewAchievements,
    clearNewlyUnlocked,
    resetAchievements
  } = useAchievements();
  
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<any>(null);
  const [achievementQueue, setAchievementQueue] = useState<any[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // ============================================================================
  // EFFECTS & DATA PERSISTENCE
  // ============================================================================

  // Check for new achievements when data changes (but not on initial load)
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }
    
    if (transactions.length > 0 || goals.length > 0) {
      const newAchievements = checkNewAchievements(transactions, goals);
      if (newAchievements.length > 0) {
        setAchievementQueue(prev => [...prev, ...newAchievements]);
      }
    }
  }, [transactions, goals, checkNewAchievements, isInitialLoad]);

  // Process achievement queue
  useEffect(() => {
    if (achievementQueue.length > 0 && !showAchievementPopup) {
      const nextAchievement = achievementQueue[0];
      setCurrentAchievement(nextAchievement);
      setShowAchievementPopup(true);
    }
  }, [achievementQueue, showAchievementPopup]);

  // Handle achievement popup close
  const handleAchievementPopupClose = () => {
    setShowAchievementPopup(false);
    setCurrentAchievement(null);
    
    // Remove the current achievement from queue and process next one
    setAchievementQueue(prev => {
      const newQueue = prev.slice(1);
      return newQueue;
    });
    
    clearNewlyUnlocked();
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const savedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);
    const hasVisitedBefore = localStorage.getItem(STORAGE_KEYS.VISITED);
    
    
    // Show welcome screen if it's the first visit
    if (!hasVisitedBefore) {
      setShowWelcomeScreen(true);
    }
    
    if (savedTransactions && savedTransactions !== '[]') {
      try {
        const parsedTransactions = JSON.parse(savedTransactions).map((t: any) => ({
          ...t,
          date: new Date(t.date)
        }));
        setTransactions(parsedTransactions);
      } catch (error) {
        console.error('Error parsing transactions:', error);
      }
    }
    
    if (savedGoals && savedGoals !== '[]') {
      try {
        const parsedGoals = JSON.parse(savedGoals).map((g: any) => ({
          ...g,
          deadline: new Date(g.deadline),
          order: g.order !== undefined ? g.order : 0,
          emoji: g.emoji || '🎯'
        }));
        // Ordenar por el campo order
        parsedGoals.sort((a: Goal, b: Goal) => a.order - b.order);
        setGoals(parsedGoals);
      } catch (error) {
        console.error('Error parsing goals:', error);
      }
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    }
  }, [transactions]);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    }
  }, [goals]);



  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleWelcomeComplete = () => {
    setShowWelcomeScreen(false);
    localStorage.setItem(STORAGE_KEYS.VISITED, 'true');
  };

  const showWelcomeTour = () => {
    setShowWelcomeScreen(true);
  };

  // ============================================================================
  // TRANSACTION MANAGEMENT
  // ============================================================================

  const addTransaction = (amount: number, description: string, type: 'income' | 'expense', goalInfo?: { goalId: string, goalEmoji: string, goalColor: string }) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount,
      description,
      type,
      date: new Date(),
      ...(goalInfo && {
        goalId: goalInfo.goalId,
        goalEmoji: goalInfo.goalEmoji,
        goalColor: goalInfo.goalColor
      })
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updates: Partial<Omit<Transaction, 'id' | 'date'>>) => {
    setTransactions(prev => {
      const originalTransaction = prev.find(t => t.id === id);
      const updatedTransactions = prev.map(t => t.id === id ? { ...t, ...updates } : t);
      const updatedTransaction = updatedTransactions.find(t => t.id === id);
      
      // Sincronizar objetivos si la transacción está relacionada con un objetivo
      if (originalTransaction && updatedTransaction) {
        const originalWasRelated = !!originalTransaction.goalId;
        const updatedIsRelated = !!updatedTransaction.goalId;
        
        if (originalWasRelated || updatedIsRelated) {
          // Actualizar objetivos inmediatamente
          setGoals(currentGoals => {
            return currentGoals.map(goal => {
              // Buscar todas las transacciones relacionadas con este objetivo
              const relatedTransactions = updatedTransactions.filter(t => t.goalId === goal.id);
              
              if (relatedTransactions.length > 0) {
                // Calcular el nuevo monto basado en las transacciones relacionadas
                const newAmount = relatedTransactions.reduce((sum, t) => {
                  return sum + (t.type === 'income' ? t.amount : -t.amount);
                }, 0);
                
                return {
                  ...goal,
                  currentAmount: Math.max(0, newAmount)
                };
              }
              
              return goal;
            });
          });
        }
      }
      
      return updatedTransactions;
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => {
      const deletedTransaction = prev.find(t => t.id === id);
      const updatedTransactions = prev.filter(t => t.id !== id);
      
      // Sincronizar objetivos inmediatamente si la transacción eliminada estaba relacionada con un objetivo
      if (deletedTransaction && deletedTransaction.goalId) {
        // Actualizar objetivos inmediatamente
        setGoals(currentGoals => {
          return currentGoals.map(goal => {
            if (goal.id === deletedTransaction.goalId) {
              // Buscar todas las transacciones restantes relacionadas con este objetivo
              const remainingTransactions = updatedTransactions.filter(t => t.goalId === goal.id);
              
              // Calcular el nuevo monto basado en las transacciones restantes
              const newAmount = remainingTransactions.reduce((sum, t) => {
                return sum + (t.type === 'income' ? t.amount : -t.amount);
              }, 0);
              
              return {
                ...goal,
                currentAmount: Math.max(0, newAmount)
              };
            }
            return goal;
          });
        });
      }
      
      return updatedTransactions;
    });
  };



  // ============================================================================
  // GOAL MANAGEMENT
  // ============================================================================

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      order: goals.length
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const reorderGoals = (startIndex: number, endIndex: number) => {
    setGoals(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      // Actualizar los índices de orden
      return result.map((goal, index) => ({
        ...goal,
        order: index
      }));
    });
  };

  // ============================================================================
  // RESET FUNCTIONALITY
  // ============================================================================

  const resetAll = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setTransactions([]);
    setGoals([]);
    resetAchievements();
    setAchievementQueue([]);
    setShowAchievementPopup(false);
    setCurrentAchievement(null);
    setIsInitialLoad(true);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    setShowResetModal(false);
  };

  const cancelReset = () => {
    setShowResetModal(false);
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  // Welcome Screen debe renderizarse siempre, independientemente de si hay objetivos
  const welcomeScreenModal = showWelcomeScreen && (
    <WelcomeScreen onComplete={handleWelcomeComplete} />
  );
  
  // Modal de confirmación de reseteo
  const renderResetModal = () => (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative z-60 animate-modalIn">
              <div className="mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¿Estás seguro?
                </h2>
                <p className="text-lg text-gray-700 mb-4">
                  Gestión de Datos
                </p>
                <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-4 mb-4 border border-red-200">
                  <p className="text-red-800 font-bold text-lg mb-2">
                    Esta acción eliminará todas las transacciones y reseteará el objetivo.
                  </p>
                  <p className="text-red-700 text-sm">
                    Esta acción no se puede deshacer.
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                  <p className="text-yellow-800 text-sm font-medium">
                    ⚠️ Se perderán todos los datos guardados incluyendo:
                  </p>
                  <ul className="text-yellow-700 text-sm mt-2 space-y-1">
                    <li>• Todos los objetivos creados</li>
                    <li>• Historial completo de transacciones</li>
                    <li>• Progreso de ahorros</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={cancelReset}
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
                  onClick={confirmReset}
                  className="flex-1 group relative bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Sí, Resetear Todo</span>
                  </div>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
  );

  // Test Welcome Screen (para debugging)
  const renderTestWelcomeScreen = () => (
        <div 
          id="welcome-test-screen"
          className="fixed inset-0 bg-red-500 z-50 flex items-center justify-center"
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            zIndex: 99999,
            backgroundColor: 'red',
            display: 'flex'
          }}
          onClick={() => {}}
        >
          <div 
            className="bg-white p-8 rounded shadow-lg"
            style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px' }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h1 className="text-xl font-bold mb-4" style={{ fontSize: '24px', fontWeight: 'bold' }}>
              TEST WELCOME SCREEN
            </h1>
            <p className="mb-4" style={{ marginBottom: '16px' }}>
              If you see this, the state is working!
            </p>
            <button 
              onClick={handleWelcomeComplete}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              style={{ backgroundColor: 'blue', color: 'white', padding: '8px 16px', borderRadius: '4px' }}
            >
              Close Test
            </button>
          </div>
        </div>
  );
  
  // ============================================================================
  // RENDER CONDITIONS
  // ============================================================================
  
  // Si no hay objetivos, mostrar la página de configuración inicial
  if (goals.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                💰 MoneyMetrics
              </h1>
              <p className="text-gray-600 text-lg">
                Gestiona tus finanzas con objetivos claros
              </p>
            </div>
            
            <GoalSettings onAddGoal={addGoal} onShowWelcomeTour={showWelcomeTour} />
          </div>
        </div>

        {showResetModal && renderResetModal()}
        {welcomeScreenModal}
      </>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main Content */}
      <div className="py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs
            defaultTab="objetivos"
            tabs={[
              {
                id: TABS_CONFIG[0].id,
                label: TABS_CONFIG[0].label,
                icon: TABS_CONFIG[0].icon,
                content: (
                  <div className="space-y-6">
                    <GoalProgress 
                      goals={goals}
                      onUpdateGoal={updateGoal}
                      onDeleteGoal={deleteGoal}
                      onAddGoal={addGoal}
                      onAddTransaction={addTransaction}
                      onReorderGoals={reorderGoals}
                    />
                  </div>
                ),
              },
              {
                id: TABS_CONFIG[1].id,
                label: TABS_CONFIG[1].label,
                icon: TABS_CONFIG[1].icon,
                content: (
                  <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-sm text-gray-600">Ingresos</div>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
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
                        onUpdateTransaction={updateTransaction}
                        onDeleteTransaction={deleteTransaction}
                        goals={goals}
                      />
                    </div>
                  </div>
                ),
              },
              {
                id: TABS_CONFIG[2].id,
                label: TABS_CONFIG[2].label,
                icon: TABS_CONFIG[2].icon,
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
                    
                    {/* Sistema de Logros */}
                    <Achievements 
                      achievements={achievements}
                      achievementProgress={achievementProgress}
                    />
                    
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

      {/* Modals */}
      {showResetModal && renderResetModal()}
      {showWelcomeScreen && renderTestWelcomeScreen()}
      {welcomeScreenModal}
      
      {/* Achievement Popup */}
      {showAchievementPopup && currentAchievement && (
        <AchievementPopup
          achievement={currentAchievement}
          onClose={handleAchievementPopupClose}
          show={showAchievementPopup}
          queueLength={achievementQueue.length - 1}
        />
      )}
    </div>
  );
}

export default App;
