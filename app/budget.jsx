import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Dimensions 
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

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
      color: '#FF6B6B',
      legendFontColor: '#333',
      legendFontSize: 14,
      icon: 'card-outline'
    },
    {
      name: 'Savings',
      amount: parseFloat(savings) || 0,
      color: '#4ECDC4',
      legendFontColor: '#333',
      legendFontSize: 14,
      icon: 'save-outline'
    },
    {
      name: 'Remaining',
      amount: parseFloat(budget) || 0,
      color: '#8A2BE2',
      legendFontColor: '#333',
      legendFontSize: 14,
      icon: 'wallet-outline'
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Budget Planner</Text>
        <Text style={styles.headerSubtitle}>Plan your finances wisely</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="cash-outline" size={24} color="#8A2BE2" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Monthly Income"
              value={income}
              keyboardType="numeric"
              onChangeText={setIncome}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="card-outline" size={24} color="#FF6B6B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Monthly Expenses"
              value={expense}
              keyboardType="numeric"
              onChangeText={setExpense}
            />
          </View>
        </View>

        <View style={styles.savingsOptions}>
          <Text style={styles.savingsTitle}>
            <Ionicons name="save" size={20} color="#333" /> Choose Savings Target
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.savingsButton, savingsPercentage === 30 && styles.activeButton]}
              onPress={() => calculateBudget(30)}
            >
              <Ionicons 
                name="trending-up" 
                size={20} 
                color={savingsPercentage === 30 ? '#fff' : '#4ECDC4'} 
              />
              <Text style={[
                styles.savingsButtonText,
                savingsPercentage === 30 && styles.activeButtonText
              ]}>Save 30%</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.savingsButton, savingsPercentage === 20 && styles.activeButton]}
              onPress={() => calculateBudget(20)}
            >
              <Ionicons 
                name="trending-up" 
                size={20} 
                color={savingsPercentage === 20 ? '#fff' : '#8A2BE2'} 
              />
              <Text style={[
                styles.savingsButtonText,
                savingsPercentage === 20 && styles.activeButtonText
              ]}>Save 20%</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.savingsButton, savingsPercentage === 0 && styles.activeButton]}
              onPress={() => calculateBudget(0)}
            >
              <Ionicons 
                name="trending-down" 
                size={20} 
                color={savingsPercentage === 0 ? '#fff' : '#FF6B6B'} 
              />
              <Text style={[
                styles.savingsButtonText,
                savingsPercentage === 0 && styles.activeButtonText
              ]}>No Savings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {(budget || savings) ? (
          <View style={styles.resultBox}>
            <View style={styles.resultItem}>
              <Ionicons name="wallet-outline" size={24} color="#fff" />
              <Text style={styles.resultLabel}>Budget</Text>
              <Text style={styles.resultText}>${budget}</Text>
            </View>
            <View style={styles.resultDivider} />
            <View style={styles.resultItem}>
              <Ionicons name="save-outline" size={24} color="#fff" />
              <Text style={styles.resultLabel}>Savings</Text>
              <Text style={styles.resultText}>${savings}</Text>
            </View>
          </View>
        ) : null}
      </View>

      {(budget || savings) ? (
        <View style={styles.section}>
          <Text style={styles.chartTitle}>
            <Ionicons name="pie-chart" size={20} color="#333" /> Budget Breakdown
          </Text>
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
          <View style={styles.legendContainer}>
            {data.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <Ionicons name={item.icon} size={20} color={item.color} />
                <Text style={[styles.legendText, { color: item.color }]}>
                  {item.name}: ${item.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#8A2BE2',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  savingsOptions: {
    marginBottom: 20,
  },
  savingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  savingsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeButton: {
    backgroundColor: '#8A2BE2',
    borderColor: '#8A2BE2',
  },
  savingsButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  activeButtonText: {
    color: '#fff',
  },
  resultBox: {
    flexDirection: 'row',
    backgroundColor: '#8A2BE2',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  resultItem: {
    flex: 1,
    alignItems: 'center',
  },
  resultDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
  },
  resultLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  resultText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  legendContainer: {
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default BudgetingScreen;
