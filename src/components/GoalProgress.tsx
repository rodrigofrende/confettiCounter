import React, { useState, useEffect } from 'react';
import type { Goal } from '../types';
import { GoalForm } from './GoalForm';
import { AddMoneyModal } from './AddMoneyModal';
import { useLazyLoad } from '../hooks/useLazyLoad';
import { GoalItemSkeleton, LoadingSpinner } from './SkeletonLoader';
import Confetti from 'react-confetti';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface GoalProgressProps {
  goals: Goal[];
  onUpdateGoal: (id: string, updates: Partial<Goal>) => void;
  onDeleteGoal: (id: string) => void;
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onAddTransaction?: (amount: number, description: string, type: 'income' | 'expense', goalInfo?: { goalId: string, goalEmoji: string, goalColor: string }) => void;
  onReorderGoals: (startIndex: number, endIndex: number) => void;
}

export const GoalProgress: React.FC<GoalProgressProps> = ({ 
  goals, 
  onUpdateGoal, 
  onDeleteGoal,
  onAddGoal,
  onAddTransaction,
  onReorderGoals
}) => {
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationGoal, setCelebrationGoal] = useState<Goal | null>(null);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [newlyAddedGoals, setNewlyAddedGoals] = useState<Set<string>>(new Set());
  const [animatingGoals, setAnimatingGoals] = useState<Set<string>>(new Set());
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Lazy loading hook para objetivos
  const { 
    visibleItems: visibleGoals, 
    hasMore, 
    isLoading, 
    observerRef 
  } = useLazyLoad({
    items: goals,
    initialLoadCount: 6,
    loadMoreCount: 4,
    threshold: 0.3
  });

  // Update window dimensions for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGoalAdded = (goal: Omit<Goal, 'id'>) => {
    const newGoalId = Date.now().toString();
    
    // Marcar como recién agregado
    setNewlyAddedGoals(prev => new Set(prev).add(newGoalId));
    
    // Remover de recién agregados después de 2.5 segundos (tiempo de animación completa)
    setTimeout(() => {
      setNewlyAddedGoals(prev => {
        const newSet = new Set(prev);
        newSet.delete(newGoalId);
        return newSet;
      });
    }, 2500);
    
    onAddGoal(goal);
    setShowNewGoalForm(false);
  };

  const handleUpdateGoal = (id: string, updates: Partial<Goal>) => {
    const goal = goals.find(g => g.id === id);
    if (goal && updates.currentAmount) {
      const wasGoalReached = goal.currentAmount >= goal.targetAmount;
      const willGoalBeReached = updates.currentAmount >= goal.targetAmount;
      
      // Trigger celebration if goal is reached for the first time
      if (!wasGoalReached && willGoalBeReached) {
        const updatedGoal = { ...goal, currentAmount: updates.currentAmount };
        setCelebrationGoal(updatedGoal);
        setShowCelebration(true);
      }
    }
    
    onUpdateGoal(id, updates);
  };

  const closeCelebration = () => {
    setShowCelebration(false);
    setCelebrationGoal(null);
  };

  const handleAddMoneyClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowAddMoneyModal(true);
  };

  const handleAddMoney = (amount: number, description: string, isAddition: boolean) => {
    if (!selectedGoal) return;
    
    // Calculate new amount based on addition or subtraction
    const finalAmount = isAddition ? amount : -amount;
    const newAmount = Math.max(0, selectedGoal.currentAmount + finalAmount);
    
    // Activar animación para este objetivo inmediatamente
    setAnimatingGoals(prev => new Set(prev).add(selectedGoal.id));
    
    // Update goal current amount con un pequeño delay para que la animación sea visible
    setTimeout(() => {
      handleUpdateGoal(selectedGoal.id, { currentAmount: newAmount });
    }, 150);
    
    // Add transaction if callback is provided
    if (onAddTransaction) {
      const transactionType = isAddition ? 'income' : 'expense';
      const actionText = isAddition ? 'Agregado a' : 'Quitado de';
      onAddTransaction(amount, `${description} (${actionText} objetivo: ${selectedGoal.name})`, transactionType, {
        goalId: selectedGoal.id,
        goalEmoji: selectedGoal.emoji,
        goalColor: selectedGoal.color
      });
    }
    
    // Remover animación después de que termine (extendido para las animaciones más lentas)
    setTimeout(() => {
      setAnimatingGoals(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedGoal.id);
        return newSet;
      });
    }, 2400);
    
    // Close modal and reset selected goal
    setShowAddMoneyModal(false);
    setSelectedGoal(null);
  };

  const closeAddMoneyModal = () => {
    setShowAddMoneyModal(false);
    setSelectedGoal(null);
  };

  const handleDeleteClick = (goal: Goal) => {
    setGoalToDelete(goal);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteGoal = () => {
    if (goalToDelete) {
      onDeleteGoal(goalToDelete.id);
      setShowDeleteConfirmation(false);
      setGoalToDelete(null);
    }
  };

  const cancelDeleteGoal = () => {
    setShowDeleteConfirmation(false);
    setGoalToDelete(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = goals.findIndex((goal) => goal.id === active.id);
      const newIndex = goals.findIndex((goal) => goal.id === over?.id);

      onReorderGoals(oldIndex, newIndex);
    }
  };

  // Componente para un objetivo sortable
  const SortableGoalItem: React.FC<{ goal: Goal; index: number }> = ({ goal }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: goal.id });

    // Separar los estilos DND de las animaciones de progreso
    const dndStyle = {
      transform: CSS.Transform.toString(transform),
      transition: isDragging ? transition : undefined, // Solo aplicar transition DND cuando se arrastra
    };

    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    const remaining = goal.targetAmount - goal.currentAmount;
    const isGoalReached = goal.currentAmount >= goal.targetAmount;
    const isNewlyAdded = newlyAddedGoals.has(goal.id);
    const isAnimating = animatingGoals.has(goal.id) && !isDragging; // Desactivar animaciones durante el drag
    const { daysLeft, isExpired, isToday, isUrgent } = calculateDateStatus(goal.deadline);

    return (
      <div 
        ref={setNodeRef}
        style={{
          ...dndStyle,
          borderLeft: `4px solid ${goal.color}`, 
          background: `linear-gradient(135deg, #ffffff 0%, ${goal.color}06 100%)`,
          boxShadow: isAnimating 
            ? `0 0 0 2px ${goal.color}40, 0 8px 25px rgba(0,0,0,0.15)` 
            : undefined
        }}
        className={`goal-item group bg-white rounded-xl p-3 sm:p-4 lg:p-3 shadow-md border border-gray-100 hover:shadow-lg ${
          !isDragging ? 'transition-all duration-300' : ''
        } ${isNewlyAdded ? 'animate-new-goal' : ''} ${
          isDragging ? 'shadow-2xl scale-105 z-50' : ''
        } ${isAnimating && !isDragging ? 'ring-2 ring-opacity-50 shadow-xl' : ''}`} 
        {...attributes}
        data-goal-id={goal.id}
      >
        {/* Layout responsive: vertical en mobile, horizontal en desktop */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-6">
          {/* Left section: Goal info */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div 
              className="drag-handle cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 touch-manipulation select-none" 
              title="Arrastra para reordenar"
              {...listeners}
              style={{ touchAction: 'none' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg sm:text-xl" style={{backgroundColor: `${goal.color}20`}}>
              {goal.emoji || '🎯'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-base sm:text-lg leading-tight truncate">
                {goal.name}
              </h4>
              {isGoalReached && (
                <div className="mt-0.5">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Completado
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Center section: Progress info - hidden on mobile, shown on desktop */}
          <div className="hidden lg:flex lg:items-center lg:gap-8 flex-1">
            <div className="text-center min-w-0 flex-shrink-0">
              <div 
                className={`text-xl font-bold transition-all duration-500 ease-out ${
                  isAnimating ? 'progress-animating' : ''
                }`} 
                style={{
                  color: goal.color,
                  ...(isAnimating && {
                    textShadow: `0 0 25px ${goal.color}60, 0 0 10px ${goal.color}40, 0 0 5px ${goal.color}20`,
                    filter: 'brightness(1.3) saturate(1.2)',
                    animation: 'amount-highlight 1.8s ease-out',
                    transform: 'scale(1.15)',
                    willChange: 'transform, filter'
                  }),
                  ...(!isAnimating && {
                    textShadow: 'none',
                    filter: 'brightness(1)',
                    transform: 'scale(1)'
                  })
                }}
                key={`amount-text-${goal.id}`}
              >
                ${goal.currentAmount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                Meta: ${goal.targetAmount.toLocaleString()}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Progreso</span>
                <span className="font-bold">{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden relative">
                <div 
                  className={`h-full rounded-full relative transition-all duration-1000 ease-out ${
                    isGoalReached 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r'
                  } ${isAnimating ? 'progress-animating' : ''}`}
                  style={{ 
                    width: `${progress}%`,
                    background: isGoalReached 
                      ? 'linear-gradient(90deg, #10b981, #059669)'
                      : `linear-gradient(90deg, ${goal.color}, ${goal.color}dd)`,
                    transitionDuration: isAnimating ? '2200ms' : '800ms',
                    transitionTimingFunction: isAnimating 
                      ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
                      : 'cubic-bezier(0.4, 0, 0.2, 1)',
                    ...(isAnimating && {
                      transform: 'scaleY(1.2) scaleX(1.01)',
                      transformOrigin: 'left center',
                      boxShadow: `0 0 15px ${goal.color}60, 0 2px 8px ${goal.color}40, inset 0 1px 0 rgba(255,255,255,0.4)`,
                    }),
                    ...(!isAnimating && {
                      transform: 'scaleY(1) scaleX(1)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }),
                    position: 'relative',
                    zIndex: 1,
                    willChange: isAnimating ? 'transform, box-shadow, width' : 'width'
                  }}
                  key={`progress-bar-${goal.id}`}
                >
                  {isAnimating && (
                    <div 
                      className="absolute inset-0 rounded-full opacity-60"
                      style={{
                        background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)`,
                        animation: 'shimmer 1.8s ease-in-out infinite',
                        willChange: 'transform, opacity'
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            
            {/* Additional info section */}
            <div className="text-center min-w-0 flex-shrink-0">
              <div className="text-sm font-medium text-gray-700 mb-1">
                {!isGoalReached ? 'Faltan' : 'Completado'}
              </div>
              <div className={`text-lg font-bold ${isGoalReached ? 'text-green-600' : ''}`} style={{color: isGoalReached ? undefined : goal.color}}>
                {isGoalReached ? '🎉' : `$${(goal.targetAmount - goal.currentAmount).toLocaleString()}`}
              </div>
            </div>
          </div>

          {/* Right section: Actions */}
          <div className="flex items-center justify-between lg:justify-end gap-2">
            {/* Date info - shown on mobile, hidden on desktop */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <span className="text-gray-500">📅</span>
              <span className="text-xs font-medium text-gray-700">{goal.deadline.toLocaleDateString('es-ES')}</span>
              {!isGoalReached && (
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                  isExpired 
                    ? 'bg-red-100 text-red-800' 
                    : isToday 
                    ? 'bg-orange-100 text-orange-800' 
                    : isUrgent 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {isExpired ? '⚠️ Vencido' : isToday ? 'Hoy' : isUrgent ? `⚠️ ${daysLeft}d` : `✓ ${daysLeft}d`}
                </span>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddMoneyClick(goal);
                }}
                className="group relative bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium p-1.5 sm:px-3 sm:py-2 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none pointer-events-auto"
                disabled={isGoalReached}
                title="Gestionar dinero"
              >
                <div className="flex items-center space-x-1">
                  <span className="text-sm sm:text-base">💰</span>
                  <span className="hidden sm:inline text-xs font-semibold">Ahorrar</span>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(goal);
                }}
                className="group relative bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-medium p-1.5 sm:p-2 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl pointer-events-auto"
                title="Eliminar objetivo"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile progress section - shown only on mobile */}
        <div className="lg:hidden">
          <div className="text-center mb-4">
            <div 
              className={`text-xl sm:text-2xl font-bold mb-1 transition-all duration-500 ease-out ${
                isAnimating ? 'progress-animating' : ''
              }`} 
              style={{
                color: goal.color,
                ...(isAnimating && {
                  textShadow: `0 0 25px ${goal.color}60, 0 0 10px ${goal.color}40, 0 0 5px ${goal.color}20`,
                  filter: 'brightness(1.3) saturate(1.2)',
                  animation: 'amount-highlight 1.8s ease-out',
                  transform: 'scale(1.15)',
                  willChange: 'transform, filter'
                }),
                ...(!isAnimating && {
                  textShadow: 'none',
                  filter: 'brightness(1)',
                  transform: 'scale(1)'
                })
              }}
              key={`amount-text-${goal.id}`}
            >
              ${goal.currentAmount.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              de ${goal.targetAmount.toLocaleString()}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <span>Progreso</span>
              <span className="font-bold">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3 overflow-hidden relative">
              <div 
                className={`h-full rounded-full relative transition-all duration-1000 ease-out ${
                  isGoalReached 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : 'bg-gradient-to-r'
                } ${isAnimating ? 'progress-animating' : ''}`}
                style={{ 
                  width: `${progress}%`,
                  background: isGoalReached 
                    ? 'linear-gradient(90deg, #10b981, #059669)'
                    : `linear-gradient(90deg, ${goal.color}, ${goal.color}dd)`,
                  transitionDuration: isAnimating ? '2200ms' : '800ms',
                  transitionTimingFunction: isAnimating 
                    ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
                    : 'cubic-bezier(0.4, 0, 0.2, 1)',
                  ...(isAnimating && {
                    transform: 'scaleY(1.2) scaleX(1.01)',
                    transformOrigin: 'left center',
                    boxShadow: `0 0 15px ${goal.color}60, 0 2px 8px ${goal.color}40, inset 0 1px 0 rgba(255,255,255,0.4)`,
                  }),
                  ...(!isAnimating && {
                    transform: 'scaleY(1) scaleX(1)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }),
                  position: 'relative',
                  zIndex: 1,
                  willChange: isAnimating ? 'transform, box-shadow, width' : 'width'
                }}
                key={`progress-bar-${goal.id}`}
              >
                {isAnimating && (
                  <div 
                    className="absolute inset-0 rounded-full opacity-60"
                    style={{
                      background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)`,
                      animation: 'shimmer 1.8s ease-in-out infinite',
                      willChange: 'transform, opacity'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop date info - shown only on desktop */}
        <div className="hidden lg:flex lg:items-center lg:justify-between text-sm mt-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">📅</span>
            <span className="font-medium text-gray-700">{goal.deadline.toLocaleDateString('es-ES')}</span>
          </div>
          {!isGoalReached && (
            <span className={`font-semibold px-3 py-1.5 rounded-full text-sm ${
              isExpired 
                ? 'bg-red-100 text-red-700' 
                : isToday 
                ? 'bg-orange-100 text-orange-700'
                : isUrgent 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {isExpired 
                ? '❌ Vencido' 
                : isToday 
                ? '🔥 Hoy'
                : isUrgent 
                ? `⚠️ ${daysLeft}d`
                : `✅ ${daysLeft}d`
              }
            </span>
          )}
        </div>

        {!isGoalReached && remaining > 0 && (
          <div className="lg:hidden mt-3 p-2.5 rounded-lg" style={{backgroundColor: `${goal.color}10`}}>
            <div className="text-center text-xs sm:text-sm text-gray-700">
              Te faltan <span className="font-bold" style={{color: goal.color}}>${remaining.toLocaleString()}</span> para alcanzar tu objetivo
            </div>
          </div>
        )}

        {isGoalReached && (
          <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="text-center">
              <div className="text-lg mb-1">🎉</div>
              <div className="text-green-700 font-bold text-sm sm:text-base">
                ¡Objetivo alcanzado!
              </div>
              <div className="text-green-600 text-xs mt-0.5">
                ¡Felicitaciones por tu logro! 🎊
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper function to calculate date status (avoid duplication)
  const calculateDateStatus = (deadline: Date) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      daysLeft,
      isExpired: daysLeft < 0,
      isToday: daysLeft === 0,
      isUrgent: daysLeft > 0 && daysLeft <= 7
    };
  };

  // Calculate useful stats for the indicators
  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  const urgentGoals = goals.filter(goal => {
    const { isUrgent } = calculateDateStatus(goal.deadline);
    return isUrgent && goal.currentAmount < goal.targetAmount;
  }).length;

  return (
    <div className="space-y-3">
      {/* Professional Header with Indicators and New Button */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Stats Indicators */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">🎯 Mis Objetivos</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-1 rounded-full">
                {totalGoals}
              </span>
            </div>
            
            {/* Professional Stats Pills */}
            {totalGoals > 0 && (
              <div className="hidden sm:flex items-center space-x-3">
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-green-700">{completedGoals} completados</span>
                </div>
                
                {urgentGoals > 0 && (
                  <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-orange-700">{urgentGoals} urgentes</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-blue-700">{overallProgress.toFixed(0)}% progreso</span>
                </div>
              </div>
            )}
          </div>

          {/* Center Section - Progress Summary (Desktop only) */}
          {totalGoals > 0 && (
            <div className="hidden lg:block flex-1 max-w-xs mx-8">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span className="font-medium">Progreso General</span>
                  <span className="font-bold">{overallProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="h-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${Math.min(overallProgress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Ahorrado:</span>
                  <span className="font-semibold text-gray-700">${totalSaved.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Meta total:</span>
                  <span className="font-semibold text-gray-700">${totalTarget.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Right Section - New Goal Button */}
          <button
            onClick={() => setShowNewGoalForm(!showNewGoalForm)}
            className="group relative bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold py-2.5 px-4 sm:py-3 sm:px-5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              {showNewGoalForm ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}
              <span className="font-bold">{showNewGoalForm ? 'Cancelar' : 'Nuevo Objetivo'}</span>
            </div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Mobile Stats Row */}
        {totalGoals > 0 && (
          <div className="block sm:hidden mt-4">
            <div className={`grid gap-2 ${urgentGoals > 0 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <div className="bg-green-50 rounded-lg p-2 text-center">
                <div className="text-base font-bold text-green-600">{completedGoals}</div>
                <div className="text-xs text-green-700">Completados</div>
              </div>
              {urgentGoals > 0 && (
                <div className="bg-orange-50 rounded-lg p-2 text-center">
                  <div className="text-base font-bold text-orange-600">{urgentGoals}</div>
                  <div className="text-xs text-orange-700">Urgentes</div>
                </div>
              )}
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-base font-bold text-blue-600">{overallProgress.toFixed(0)}%</div>
                <div className="text-xs text-blue-700">Progreso</div>
              </div>
            </div>
            
            {/* Mobile Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progreso Total</span>
                <span>${totalSaved.toLocaleString()} / ${totalTarget.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(overallProgress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* New Goal Form */}
        {showNewGoalForm && (
          <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <GoalForm 
              onAddGoal={handleGoalAdded}
              onCancel={() => setShowNewGoalForm(false)}
              buttonText="Crear Objetivo"
              showCancelButton={true}
            />
          </div>
        )}
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ¡Crea tu primer objetivo!
            </h3>
            <p className="text-gray-600">
              Define metas financieras claras para empezar a ahorrar de manera inteligente
            </p>
          </div>
        </div>
      ) : (
        // Mostrar skeletons durante la carga inicial
        goals.length > 0 && visibleGoals.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <GoalItemSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={visibleGoals.map(goal => goal.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3 goals-container">
                {visibleGoals.map((goal, index) => (
                  <SortableGoalItem key={goal.id} goal={goal} index={index} />
                ))}
                
                {/* Elemento observador para lazy loading */}
                {hasMore && (
                  <div ref={observerRef} className="h-4 flex justify-center items-center">
                    {isLoading && <LoadingSpinner size="sm" />}
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>
        )
      )}
      
      {/* Celebration Modal with Confetti */}
      {showCelebration && celebrationGoal && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn" style={{margin: 0, padding: '1rem', minHeight: '100vh', minWidth: '100vw'}}>
            {/* Modal */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative z-60 animate-modalIn">
              <div className="mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¡Felicitaciones!
                </h2>
                <p className="text-lg text-gray-700 mb-4">
                  Has alcanzado tu objetivo:
                </p>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    🎯 {celebrationGoal.name}
                  </h3>
                  <div className="text-3xl font-bold text-green-600">
                    ${celebrationGoal.targetAmount.toLocaleString()}
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    ¡Meta completada!
                  </p>
                </div>
                <p className="text-gray-600 text-sm">
                  ¡Sigue así y alcanza todos tus sueños financieros! 💪
                </p>
              </div>
              
              <button
                onClick={closeCelebration}
                className="group relative w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg">🚀</span>
                  <span>¡Continuar!</span>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
          
          {/* Confetti Animation - Higher z-index */}
          <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden" style={{margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0}}>
            <Confetti
              width={windowDimensions.width}
              height={windowDimensions.height}
              recycle={true}
              numberOfPieces={150}
              gravity={0.04}
              initialVelocityY={-12}
              initialVelocityX={3}
              wind={0.005}
              colors={['#10B981', '#059669', '#34D399', '#6EE7B7', '#A7F3D0', '#F59E0B']}
            />
          </div>
        </>
      )}

      {/* Add Money Modal */}
      <AddMoneyModal
        isOpen={showAddMoneyModal}
        onClose={closeAddMoneyModal}
        onAddMoney={handleAddMoney}
        goalName={selectedGoal?.name || ''}
        currentAmount={selectedGoal?.currentAmount || 0}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && goalToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative z-60 animate-modalIn">
            <div className="mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¿Estás seguro?
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                Estás a punto de eliminar el objetivo:
              </p>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-4 mb-4 border border-red-200">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: `${goalToDelete.color}20`, color: goalToDelete.color}}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-red-800">
                    {goalToDelete.name}
                  </h3>
                </div>
                <div className="text-red-700 text-sm">
                  Progreso actual: ${goalToDelete.currentAmount.toLocaleString()} de ${goalToDelete.targetAmount.toLocaleString()}
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                <p className="text-yellow-800 text-sm font-medium">
                  ⚠️ Esta acción no se puede deshacer. Se perderá todo el progreso registrado.
                </p>
              </div>
              <p className="text-gray-600 text-sm">
                ¿Realmente quieres continuar?
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelDeleteGoal}
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
                onClick={confirmDeleteGoal}
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
