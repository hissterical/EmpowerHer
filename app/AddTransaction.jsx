import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FinancialContext } from '../context/FinancialContext';
import { useNavigation, useLocalSearchParams } from 'expo-router';

const AddScreen = () => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const context = useContext(FinancialContext);
  const mode = params.mode || 'transaction'; // 'transaction', 'goal', or 'budget'

  if (!context) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </View>
    );
  }

  const { addIncome, addExpense, addGoal, addBudget } = context;
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [goalName, setGoalName] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const getHeaderTitle = () => {
    switch (mode) {
      case 'goal':
        return 'Add Financial Goal';
      case 'budget':
        return 'Add Budget';
      default:
        return 'Add Transaction';
    }
  };

  const handleSubmit = () => {
    if (!amount || (mode === 'transaction' && !category) || (mode === 'goal' && !goalName)) {
      alert('Please fill in all required fields');
      return;
    }

    switch (mode) {
      case 'goal':
        const goalData = {
          name: goalName,
          target: parseFloat(amount),
          current: 0,
          date: targetDate || new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
        };
        addGoal(goalData);
        break;

      case 'budget':
        const budgetData = {
          category,
          amount: parseFloat(amount),
          period: new Date().toLocaleString('default', { month: 'long' }),
          note
        };
        addBudget(budgetData);
        break;

      default:
        const transactionData = {
          amount: parseFloat(amount),
          category,
          note,
          date: new Date().toISOString(),
        };
        if (type === 'income') {
          addIncome(transactionData);
        } else {
          addExpense(transactionData);
        }
    }
    
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
        </View>

        <View style={styles.form}>
          {mode === 'transaction' && (
            <View style={styles.typeSelector}>
              <TouchableOpacity 
                style={[
                  styles.typeButton, 
                  type === 'expense' && styles.typeButtonSelected
                ]}
                onPress={() => setType('expense')}
              >
                <Ionicons 
                  name="arrow-down-circle" 
                  size={24} 
                  color={type === 'expense' ? '#fff' : '#666'} 
                />
                <Text style={[
                  styles.typeButtonText,
                  type === 'expense' && styles.typeButtonTextSelected
                ]}>Expense</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.typeButton, 
                  type === 'income' && styles.typeButtonSelected
                ]}
                onPress={() => setType('income')}
              >
                <Ionicons 
                  name="arrow-up-circle" 
                  size={24} 
                  color={type === 'income' ? '#fff' : '#666'} 
                />
                <Text style={[
                  styles.typeButtonText,
                  type === 'income' && styles.typeButtonTextSelected
                ]}>Income</Text>
              </TouchableOpacity>
            </View>
          )}

          {mode === 'goal' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="flag-outline" size={20} color="#333" style={styles.inputIcon} />
                Goal Name
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Emergency Fund, New Car"
                  value={goalName}
                  onChangeText={setGoalName}
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="cash-outline" size={20} color="#333" style={styles.inputIcon} />
              {mode === 'goal' ? 'Target Amount' : 'Amount'}
            </Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={[styles.input, styles.amountInput]}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
          </View>

          {mode !== 'goal' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="pricetag-outline" size={20} color="#333" style={styles.inputIcon} />
                Category
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={mode === 'budget' ? "e.g., Groceries, Rent" : type === 'income' ? "e.g., Salary, Freelance" : "e.g., Food, Transport"}
                  value={category}
                  onChangeText={setCategory}
                />
              </View>
            </View>
          )}

          {mode === 'goal' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="calendar-outline" size={20} color="#333" style={styles.inputIcon} />
                Target Date (Optional)
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YYYY"
                  value={targetDate}
                  onChangeText={setTargetDate}
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="create-outline" size={20} color="#333" style={styles.inputIcon} />
              Note (Optional)
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.noteInput]}
                placeholder="Add a note..."
                value={note}
                onChangeText={setNote}
                multiline
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Ionicons name="checkmark-circle" size={24} color="#fff" />
        <Text style={styles.submitButtonText}>
          {mode === 'goal' ? 'Add Goal' : mode === 'budget' ? 'Add Budget' : 'Add Transaction'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#8A2BE2',
    padding: 20,
    paddingTop: 50,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  form: {
    padding: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#8A2BE2',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  typeButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 8,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    paddingLeft: 15,
    fontSize: 16,
    color: '#666',
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  amountInput: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  noteInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#8A2BE2',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});

export default AddScreen; 