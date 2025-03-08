import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FinancialContext = createContext(null);

export const FinancialContextProvider = ({ children }) => {
  const [financialData, setFinancialData] = useState({
    balance: 0,
    income: [],
    expenses: [],
    budgets: [],
    goals: [],
    transactions: [],
    savings: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem('@financial_data');
        if (data) {
          setFinancialData(JSON.parse(data));
        } else {
          setSampleData();
        }
      } catch (error) {
        console.log('Error loading data', error);
      }
    };

    loadData();
  }, []);

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

  const setSampleData = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    setFinancialData({
      balance: 1250,
      income: [
        { id: '1', type: 'income', category: 'Salary', amount: 3000, date: new Date().toISOString() },
      ],
      expenses: [
        { id: '2', type: 'expense', category: 'Rent', amount: 1000, date: new Date().toISOString() },
        { id: '3', type: 'expense', category: 'Groceries', amount: 400, date: new Date().toISOString() },
        { id: '4', type: 'expense', category: 'Utilities', amount: 150, date: new Date().toISOString() },
        { id: '5', type: 'expense', category: 'Transportation', amount: 200, date: new Date().toISOString() },
      ],
      budgets: [
        { id: '1', category: 'Rent', amount: 1000, period: currentMonth },
        { id: '2', category: 'Groceries', amount: 500, period: currentMonth },
        { id: '3', category: 'Entertainment', amount: 200, period: currentMonth },
        { id: '4', category: 'Transportation', amount: 250, period: currentMonth },
        { id: '5', category: 'Utilities', amount: 150, period: currentMonth },
      ],
      goals: [
        { id: '1', name: 'Emergency Fund', target: 5000, current: 1000, date: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString() },
        { id: '2', name: 'Vacation', target: 2000, current: 250, date: new Date(new Date().setMonth(new Date().getMonth() + 10)).toISOString() },
      ],
      transactions: [
        { id: '1', type: 'income', category: 'Salary', amount: 3000, date: new Date().toISOString() },
        { id: '2', type: 'expense', category: 'Rent', amount: 1000, date: new Date().toISOString() },
        { id: '3', type: 'expense', category: 'Groceries', amount: 400, date: new Date().toISOString() },
        { id: '4', type: 'expense', category: 'Utilities', amount: 150, date: new Date().toISOString() },
        { id: '5', type: 'expense', category: 'Transportation', amount: 200, date: new Date().toISOString() },
      ],
      savings: 1250,
    });
  };

  const addIncome = (income) => {
    const newIncome = {
      id: Date.now().toString(),
      type: 'income',
      ...income,
      date: income.date || new Date().toISOString(),
    };

    setFinancialData((prevData) => ({
      ...prevData,
      income: [...prevData.income, newIncome],
      transactions: [...prevData.transactions, newIncome],
      balance: prevData.balance + parseFloat(newIncome.amount.toString()),
      savings: prevData.savings + parseFloat(newIncome.amount.toString()),
    }));
  };

  const addExpense = (expense) => {
    const newExpense = {
      id: Date.now().toString(),
      type: 'expense',
      ...expense,
      date: expense.date || new Date().toISOString(),
    };

    setFinancialData((prevData) => ({
      ...prevData,
      expenses: [...prevData.expenses, newExpense],
      transactions: [...prevData.transactions, newExpense],
      balance: prevData.balance - parseFloat(newExpense.amount.toString()),
      savings: prevData.savings - parseFloat(newExpense.amount.toString()),
    }));
  };

  const addBudget = (budget) => {
    const newBudget = {
      id: Date.now().toString(),
      ...budget,
    };

    setFinancialData((prevData) => ({
      ...prevData,
      budgets: [...prevData.budgets, newBudget],
    }));
  };

  const addGoal = (goal) => {
    const newGoal = {
      id: Date.now().toString(),
      current: 0,
      ...goal,
    };

    setFinancialData((prevData) => ({
      ...prevData,
      goals: [...prevData.goals, newGoal],
    }));
  };

  const updateGoal = (goalId, amount) => {
    setFinancialData((prevData) => ({
      ...prevData,
      goals: prevData.goals.map((goal) =>
        goal.id === goalId ? { ...goal, current: goal.current + amount } : goal
      ),
      savings: prevData.savings - amount,
    }));
  };

  const deleteTransaction = (id) => {
    setFinancialData((prevData) => {
      const transaction = prevData.transactions.find((t) => t.id === id);
      if (!transaction) return prevData;

      const updatedTransactions = prevData.transactions.filter((t) => t.id !== id);

      let updatedBalance = prevData.balance;
      let updatedSavings = prevData.savings;

      if (transaction.type === 'income') {
        updatedBalance -= transaction.amount;
        updatedSavings -= transaction.amount;
      } else if (transaction.type === 'expense') {
        updatedBalance += transaction.amount;
        updatedSavings += transaction.amount;
      }

      return {
        ...prevData,
        transactions: updatedTransactions,
        income: prevData.income.filter((t) => t.id !== id),
        expenses: prevData.expenses.filter((t) => t.id !== id),
        balance: updatedBalance,
        savings: updatedSavings,
      };
    });
  };

  const deleteBudget = (id) => {
    setFinancialData((prevData) => ({
      ...prevData,
      budgets: prevData.budgets.filter((b) => b.id !== id),
    }));
  };

  const deleteGoal = (id) => {
    setFinancialData((prevData) => ({
      ...prevData,
      goals: prevData.goals.filter((g) => g.id !== id),
    }));
  };

  return (
    <FinancialContext.Provider
      value={{
        ...financialData,
        addIncome,
        addExpense,
        addBudget,
        addGoal,
        updateGoal,
        deleteTransaction,
        deleteBudget,
        deleteGoal,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};