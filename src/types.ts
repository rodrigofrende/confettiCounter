export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  date: Date;
  goalId?: string;
  goalEmoji?: string;
  goalColor?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  color: string;
  emoji: string;
  order: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'goals' | 'transactions' | 'milestones' | 'streaks';
  isUnlocked: boolean;
  unlockedAt?: Date;
  requirement: {
    type: 'goals_created' | 'goals_completed' | 'transactions_count' | 'balance_positive_days' | 'savings_streak' | 'amount_saved';
    value: number;
    description: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface AchievementProgress {
  achievementId: string;
  currentValue: number;
  targetValue: number;
  isCompleted: boolean;
}