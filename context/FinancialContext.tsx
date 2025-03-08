import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types for our financial data
type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  note?: string;
  date: string;
};

type Budget = {
  id: string;
  category: string;
  amount: number;
  period: string;
};

type Goal = {
  id: string;
  name: string;
  target: number;
  current: number;
  date: string;
};

type FinancialData = {
  balance: number;
  income: Transaction[];
  expenses: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  transactions: Transaction[];
  savings: number;
};

type FinancialContextType = FinancialData & {
  addIncome: (income: Omit<Transaction, 'id' | 'type'>) => void;
  addExpense: (expense: Omit<Transaction, 'id' | 'type'>) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'current'>) => void;
  updateGoal: (goalId: string, amount: number) => void;
  deleteTransaction: (id: string) => void;
  deleteBudget: (id: string) => void;
  deleteGoal: (id: string) => void;
};

export const FinancialContext = createContext<FinancialContextType | null>(null);

export const FinancialContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [financialData, setFinancialData] = useState<FinancialData>({
    balance: 0,
    income: [],
    expenses: [],
    budgets: [],
    goals: [],
    transactions: [],
    savings: 0
  });

  // Load data from storage on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem('@financial_data');
        if (data) {
          setFinancialData(JSON.parse(data));
        } else {
          // Set sample data for first-time users
          setSampleData();
        }
      } catch (error) {
        console.log('Error loading data', error);
      }
    };
    
    loadData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('@financial_data', JSON.stringify(financialData));
      } catch (error) {
        console.log('Error saving data', error);
      }
    };
    
    saveData();
  }, [financialData]);

  // Sample data for first-time users
  const setSampleData = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    
    setFinancialData({
      balance: 1250,
      income: [
        { id: '1', type: 'income', category: 'Salary', amount: 3000, date: new Date().toISOString() }
      ],
      expenses: [
        { id: '2', type: 'expense', category: 'Rent', amount: 1000, date: new Date().toISOString() },
        { id: '3', type: 'expense', category: 'Groceries', amount: 400, date: new Date().toISOString() },
        { id: '4', type: 'expense', category: 'Utilities', amount: 150, date: new Date().toISOString() },
        { id: '5', type: 'expense', category: 'Transportation', amount: 200, date: new Date().toISOString() }
      ],
      budgets: [
        { id: '1', category: 'Rent', amount: 1000, period: currentMonth },
        { id: '2', category: 'Groceries', amount: 500, period: currentMonth },
        { id: '3', category: 'Entertainment', amount: 200, period: currentMonth },
        { id: '4', category: 'Transportation', amount: 250, period: currentMonth },
        { id: '5', category: 'Utilities', amount: 150, period: currentMonth }
      ],
      goals: [
        { id: '1', name: 'Emergency Fund', target: 5000, current: 1000, date: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString() },
        { id: '2', name: 'Vacation', target: 2000, current: 250, date: new Date(new Date().setMonth(new Date().getMonth() + 10)).toISOString() }
      ],
      transactions: [
        { id: '1', type: 'income', category: 'Salary', amount: 3000, date: new Date().toISOString() },
        { id: '2', type: 'expense', category: 'Rent', amount: 1000, date: new Date().toISOString() },
        { id: '3', type: 'expense', category: 'Groceries', amount: 400, date: new Date().toISOString() },
        { id: '4', type: 'expense', category: 'Utilities', amount: 150, date: new Date().toISOString() },
        { id: '5', type: 'expense', category: 'Transportation', amount: 200, date: new Date().toISOString() }
      ],
      savings: 1250
    });
  };

  // Add income
  const addIncome = (income: Omit<Transaction, 'id' | 'type'>) => {
    const newIncome = {
      id: Date.now().toString(),
      type: 'income' as const,
      ...income,
      date: income.date || new Date().toISOString()
    };
    
    setFinancialData(prevData => ({
      ...prevData,
      income: [...prevData.income, newIncome],
      transactions: [...prevData.transactions, newIncome],
      balance: prevData.balance + parseFloat(newIncome.amount.toString()),
      savings: prevData.savings + parseFloat(newIncome.amount.toString())
    }));
  };

  // Add expense
  const addExpense = (expense: Omit<Transaction, 'id' | 'type'>) => {
    const newExpense = {
      id: Date.now().toString(),
      type: 'expense' as const,
      ...expense,
      date: expense.date || new Date().toISOString()
    };
    
    setFinancialData(prevData => ({
      ...prevData,
      expenses: [...prevData.expenses, newExpense],
      transactions: [...prevData.transactions, newExpense],
      balance: prevData.balance - parseFloat(newExpense.amount.toString()),
      savings: prevData.savings - parseFloat(newExpense.amount.toString())
    }));
  };

  // Add budget
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget = {
      id: