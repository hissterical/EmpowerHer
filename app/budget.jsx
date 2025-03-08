import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const BudgetingScreen = () => {
  const [income, setIncome] = useState('');
  const [expense, setExpense] = useState('');
  const [budget, setBudget] = useState('');
  const [savingsPercentage, setSavingsPercentage] = useState(0);
  const [savings, setSavings] = useState(0);

  const calculateBudget = (percentage) => {
    const parsedIncome = parseFloat(income) || 0;
    const parsedExpense = parseFloat(expense) || 0;
    const savingsAmount = (percentage / 100) * parsedIncome;
    const remainingBudget = parsedIncome - parsedExpense - savingsAmount;
    
    setSavingsPercentage(percentage);
    setSavings(savingsAmount.toFixed(2));
    setBudget(remainingBudget.toFixed(2));
  };

  const data = [
    {
      name: 'Expenses',
      amount: parseFloat(expense) || 0,
      color: '#FF4500',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Savings',
      amount: parseFloat(savings) || 0,
      color: '#10B981',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Remaining Budget',
      amount: parseFloat(budget) || 0,
      color: '#4169e1',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.header}>Smart Budgeting Tool</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your monthly income"
          value={income}
          keyboardType="numeric"
          onChangeText={setIncome}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your monthly expenses"
          value={expense}
          keyboardType="numeric"
          onChangeText={setExpense}
        />
        <View style={styles.buttonContainer}>
          <Button title="Save 30%" color="#10B981" onPress={() => calculateBudget(30)} />
          <Button title="Save 20%" color="#8A2BE2" onPress={() => calculateBudget(20)} />
          <Button title="No Savings" color="#FF4500" onPress={() => calculateBudget(0)} />
        </View>
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Remaining Budget: ${budget}</Text>
          <Text style={styles.resultText}>Savings: ${savings} ({savingsPercentage}%)</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.header}>Budget Breakdown</Text>
        <PieChart
          data={data}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  resultBox: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#8A2BE2',
    borderRadius: 8,
    alignItems: 'center',
  },
  resultText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BudgetingScreen;
