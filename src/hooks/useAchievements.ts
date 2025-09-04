import { useState, useEffect, useCallback } from 'react';
import type { Achievement, AchievementProgress, Transaction, Goal } from '../types';

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_goal',
    title: 'Primer Paso',
    description: 'Crea tu primer objetivo financiero',
    icon: '🎯',
    category: 'goals',
    isUnlocked: false,
    requirement: {
      type: 'goals_created',
      value: 1,
      description: '1 objetivo creado'
    },
    rarity: 'common'
  },
  {
    id: 'first_transaction',
    title: 'Primera Transacción',
    description: 'Registra tu primera transacción',
    icon: '📝',
    category: 'transactions',
    isUnlocked: false,
    requirement: {
      type: 'transactions_count',
      value: 1,
      description: '1 transacción registrada'
    },
    rarity: 'common'
  },
  {
    id: 'goal_master',
    title: 'Maestro de Objetivos',
    description: 'Crea 5 objetivos diferentes',
    icon: '🏆',
    category: 'goals',
    isUnlocked: false,
    requirement: {
      type: 'goals_created',
      value: 5,
      description: '5 objetivos creados'
    },
    rarity: 'rare'
  },
  {
    id: 'first_completion',
    title: 'Primera Victoria',
    description: 'Completa tu primer objetivo',
    icon: '✅',
    category: 'goals',
    isUnlocked: false,
    requirement: {
      type: 'goals_completed',
      value: 1,
      description: '1 objetivo completado'
    },
    rarity: 'rare'
  },
  {
    id: 'transaction_tracker',
    title: 'Rastreador de Gastos',
    description: 'Registra 25 transacciones',
    icon: '📊',
    category: 'transactions',
    isUnlocked: false,
    requirement: {
      type: 'transactions_count',
      value: 25,
      description: '25 transacciones registradas'
    },
    rarity: 'rare'
  },
  {
    id: 'transaction_master',
    title: 'Experto en Transacciones',
    description: 'Registra 100 transacciones',
    icon: '💼',
    category: 'transactions',
    isUnlocked: false,
    requirement: {
      type: 'transactions_count',
      value: 100,
      description: '100 transacciones registradas'
    },
    rarity: 'epic'
  },
  {
    id: 'balance_positive_week',
    title: 'Balance Positivo',
    description: 'Mantén balance positivo por 14 días',
    icon: '💰',
    category: 'streaks',
    isUnlocked: false,
    requirement: {
      type: 'balance_positive_days',
      value: 14,
      description: '14 días con balance positivo'
    },
    rarity: 'rare'
  },
  {
    id: 'balance_positive_month',
    title: 'Estabilidad Financiera',
    description: 'Mantén balance positivo por 30 días',
    icon: '🏦',
    category: 'streaks',
    isUnlocked: false,
    requirement: {
      type: 'balance_positive_days',
      value: 30,
      description: '30 días con balance positivo'
    },
    rarity: 'epic'
  },
  {
    id: 'savings_streak_week',
    title: 'Racha de Ahorros',
    description: 'Ahorra dinero por 7 días consecutivos',
    icon: '🔥',
    category: 'streaks',
    isUnlocked: false,
    requirement: {
      type: 'savings_streak',
      value: 7,
      description: '7 días consecutivos ahorrando'
    },
    rarity: 'rare'
  },
  {
    id: 'savings_streak_month',
    title: 'Disciplina Financiera',
    description: 'Ahorra dinero por 30 días consecutivos',
    icon: '💪',
    category: 'streaks',
    isUnlocked: false,
    requirement: {
      type: 'savings_streak',
      value: 30,
      description: '30 días consecutivos ahorrando'
    },
    rarity: 'epic'
  },
  {
    id: 'big_saver',
    title: 'Gran Ahorrador',
    description: 'Ahorra más de $500,000 en total',
    icon: '💎',
    category: 'milestones',
    isUnlocked: false,
    requirement: {
      type: 'amount_saved',
      value: 500000,
      description: '$500,000 ahorrados'
    },
    rarity: 'epic'
  },
  {
    id: 'financial_guru',
    title: 'Gurú Financiero',
    description: 'Alcanza un balance positivo de $1,000,000',
    icon: '🧙‍♂️',
    category: 'milestones',
    isUnlocked: false,
    requirement: {
      type: 'amount_saved',
      value: 1000000,
      description: '$1,000,000 de balance positivo'
    },
    rarity: 'legendary'
  },
  {
    id: 'millionaire',
    title: 'Millonario',
    description: 'Ahorra más de $2,000,000 en total',
    icon: '👑',
    category: 'milestones',
    isUnlocked: false,
    requirement: {
      type: 'amount_saved',
      value: 2000000,
      description: '$2,000,000 ahorrados'
    },
    rarity: 'legendary'
  }
];

const STORAGE_KEY = 'moneymetrics-achievements';

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [achievementProgress, setAchievementProgress] = useState<AchievementProgress[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  // Load achievements from localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem(STORAGE_KEY);
    if (savedAchievements) {
      try {
        const parsedAchievements = JSON.parse(savedAchievements);
        setAchievements(parsedAchievements);
      } catch (error) {
        console.error('Error parsing achievements:', error);
        setAchievements(ACHIEVEMENTS);
      }
    }
  }, []);

  // Save achievements to localStorage
  useEffect(() => {
    if (achievements.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
    }
  }, [achievements]);

  // Calculate achievement progress
  const calculateProgress = useCallback((transactions: Transaction[], goals: Goal[]) => {
    const progress: AchievementProgress[] = [];
    
    // Calculate goals created
    const goalsCreated = goals.length;
    
    // Calculate goals completed
    const goalsCompleted = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;
    
    // Calculate transactions count
    const transactionsCount = transactions.length;
    
    // Calculate total savings
    const totalSavings = transactions.reduce((sum, transaction) => {
      return sum + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
    }, 0);
    
    // Calculate balance positive days (simplified - check if current balance is positive)
    const balancePositiveDays = totalSavings > 0 ? 1 : 0;
    
    // Calculate savings streak (simplified - check if last 7 days had positive transactions)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const recentTransactions = transactions.filter(t => new Date(t.date) >= last7Days);
    const recentSavings = recentTransactions.reduce((sum, transaction) => {
      return sum + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
    }, 0);
    const savingsStreak = recentSavings > 0 ? 7 : 0;

    achievements.forEach(achievement => {
      let currentValue = 0;
      
      switch (achievement.requirement.type) {
        case 'goals_created':
          currentValue = goalsCreated;
          break;
        case 'goals_completed':
          currentValue = goalsCompleted;
          break;
        case 'transactions_count':
          currentValue = transactionsCount;
          break;
        case 'balance_positive_days':
          currentValue = balancePositiveDays;
          break;
        case 'savings_streak':
          currentValue = savingsStreak;
          break;
        case 'amount_saved':
          currentValue = Math.max(0, totalSavings);
          break;
      }
      
      progress.push({
        achievementId: achievement.id,
        currentValue,
        targetValue: achievement.requirement.value,
        isCompleted: currentValue >= achievement.requirement.value
      });
    });
    
    setAchievementProgress(progress);
    return progress;
  }, [achievements]);

  // Check for newly unlocked achievements
  const checkNewAchievements = useCallback((transactions: Transaction[], goals: Goal[]) => {
    const progress = calculateProgress(transactions, goals);
    const newlyUnlockedAchievements: Achievement[] = [];
    
    progress.forEach(progressItem => {
      if (progressItem.isCompleted) {
        const achievement = achievements.find(a => a.id === progressItem.achievementId);
        if (achievement && !achievement.isUnlocked) {
          const updatedAchievement = {
            ...achievement,
            isUnlocked: true,
            unlockedAt: new Date()
          };
          
          setAchievements(prev => 
            prev.map(a => a.id === achievement.id ? updatedAchievement : a)
          );
          
          newlyUnlockedAchievements.push(updatedAchievement);
        }
      }
    });
    
    if (newlyUnlockedAchievements.length > 0) {
      setNewlyUnlocked(prev => [...prev, ...newlyUnlockedAchievements]);
    }
    
    return newlyUnlockedAchievements;
  }, [achievements, calculateProgress]);

  // Clear newly unlocked achievements
  const clearNewlyUnlocked = useCallback(() => {
    setNewlyUnlocked([]);
  }, []);

  // Get achievement by ID
  const getAchievement = useCallback((id: string) => {
    return achievements.find(a => a.id === id);
  }, [achievements]);

  // Get progress for specific achievement
  const getAchievementProgress = useCallback((achievementId: string) => {
    return achievementProgress.find(p => p.achievementId === achievementId);
  }, [achievementProgress]);

  // Reset all achievements
  const resetAchievements = useCallback(() => {
    setAchievements(ACHIEVEMENTS);
    setAchievementProgress([]);
    setNewlyUnlocked([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    achievements,
    achievementProgress,
    newlyUnlocked,
    calculateProgress,
    checkNewAchievements,
    clearNewlyUnlocked,
    getAchievement,
    getAchievementProgress,
    resetAchievements
  };
};
