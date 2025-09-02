import React from 'react';
import type { Goal } from '../types';
import { GoalForm } from './GoalForm';

interface GoalSettingsProps {
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
}

export const GoalSettings: React.FC<GoalSettingsProps> = ({ onAddGoal }) => {
  return (
    <GoalForm 
      onAddGoal={onAddGoal}
      buttonText="🎯 Crear Mi Primer Objetivo"
    />
  );
};
