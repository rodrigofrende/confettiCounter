import React, { useState, useEffect } from 'react';
import type { Goal } from '../types';
import { GoalForm } from './GoalForm';
import { AddMoneyModal } from './AddMoneyModal';
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
  onAddTransaction?: (amount: number, description: string, type: 'income' | 'expense') => void;
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
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
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
    const newAmount = selectedGoal.currentAmount + finalAmount;
    
    // Update goal current amount
    handleUpdateGoal(selectedGoal.id, { currentAmount: newAmount });
    
    // Add transaction if callback is provided
    if (onAddTransaction) {
      const transactionType = isAddition ? 'income' : 'expense';
      const actionText = isAddition ? 'Agregado a' : 'Quitado de';
      onAddTransaction(amount, `${description} (${actionText} objetivo: ${selectedGoal.name})`, transactionType);
    }
    
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
    useSensor(PointerSensor),
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

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    const remaining = goal.targetAmount - goal.currentAmount;
    const isGoalReached = goal.currentAmount >= goal.targetAmount;
    const isNewlyAdded = newlyAddedGoals.has(goal.id);
    const { daysLeft, isExpired, isToday, isUrgent } = calculateDateStatus(goal.deadline);

    return (
      <div 
        ref={setNodeRef}
        style={{
          ...style,
          borderLeft: `4px solid ${goal.color}`, 
          background: `linear-gradient(135deg, #ffffff 0%, ${goal.color}06 100%)`
        }}
        className={`goal-item group bg-white rounded-xl p-3 sm:p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 ${
          isNewlyAdded ? 'animate-new-goal' : ''
        } ${isDragging ? 'shadow-2xl scale-105 z-50' : ''}`} 
        {...attributes}
        {...listeners}
        data-goal-id={goal.id}
      >
        {/* Header - Unified responsive layout */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <div className="drag-handle cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mr-1" title="Arrastra para reordenar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zM13 3h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
              </svg>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base" style={{backgroundColor: `${goal.color}20`, color: goal.color}}>
              🎯
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-base sm:text-lg leading-tight truncate">
                {goal.name}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs sm:text-sm text-gray-500">Meta: ${goal.targetAmount.toLocaleString()}</span>
                {isGoalReached && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Completado
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-1.5 ml-2">
            <button
              onClick={() => handleAddMoneyClick(goal)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium p-1.5 sm:px-3 sm:py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
              disabled={isGoalReached}
              title="Gestionar dinero"
            >
              <span className="text-sm sm:text-base">💰</span>
              <span className="hidden sm:inline ml-1 text-xs font-semibold">Agregar</span>
            </button>
            <button
              onClick={() => handleDeleteClick(goal)}
              className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium p-1.5 sm:p-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              title="Eliminar objetivo"
            >
              <span className="text-sm sm:text-base">🗑️</span>
            </button>
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="text-xl sm:text-2xl font-bold mb-1" style={{color: goal.color}}>
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
          <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${
                isGoalReached 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : 'bg-gradient-to-r'
              }`}
              style={{ 
                width: `${progress}%`,
                background: isGoalReached 
                  ? 'linear-gradient(90deg, #10b981, #059669)'
                  : `linear-gradient(90deg, ${goal.color}, ${goal.color}dd)`
              }}
            />
          </div>
        </div>

        {/* Info Section - Unified responsive layout */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">📅</span>
            <span className="font-medium text-gray-700">{goal.deadline.toLocaleDateString('es-ES')}</span>
          </div>
          {!isGoalReached && (
            <span className={`font-semibold px-2 py-1 rounded-full text-xs ${
              isExpired 
                ? 'bg-red-100 text-red-700' 
                : isToday 
                ? 'bg-orange-100 text-orange-700'
                : isUrgent 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-blue-100 text-blue-700'
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
          <div className="mt-3 p-2.5 rounded-lg" style={{backgroundColor: `${goal.color}10`}}>
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
            className="group relative bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-2.5 px-4 sm:py-3 sm:px-5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{showNewGoalForm ? '✖️' : '➕'}</span>
              <span className="font-bold">{showNewGoalForm ? 'Cancelar' : 'Nuevo Objetivo'}</span>
            </div>
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
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={goals.map(goal => goal.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3 goals-container">
              {goals.map((goal, index) => (
                <SortableGoalItem key={goal.id} goal={goal} index={index} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{backgroundColor: `${goalToDelete.color}20`, color: goalToDelete.color}}>
                    🎯
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
                className="flex-1 group relative bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg">❌</span>
                  <span>Cancelar</span>
                </div>
              </button>
              <button
                onClick={confirmDeleteGoal}
                className="flex-1 group relative bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg">🗑️</span>
                  <span>Sí, eliminar</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
