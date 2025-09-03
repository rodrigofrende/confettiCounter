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
