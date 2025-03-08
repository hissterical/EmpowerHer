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
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FinancialContext } from '../context/FinancialContext';
import { useNavigation } from '@react-navigation/native';

const AddTransaction = () => {
  const navigation = useNavigation();
  const context = useContext(FinancialContext);

  // If context is not available, show loading
  if (!context) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </View>
    );
  }

  const { addIncome, addExpense } = context;
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState('expense'); // Default to expense

  const handleSubmit = () => {
    if (!amount || !category) {
      alert('Please fill in amount and category');
      return;
    }

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
          <Text style={styles.headerTitle}>Add Transaction</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.typeSelector}>
            <TouchableOpacity 
              style={[
                styles.typeButton, 
                type === 'expense' && styles.typeButtonSelected
              ]}
              onPress={() => setType('expense')}
            >
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
              <Text style={[
                styles.typeButtonText,
                type === 'income' && styles.typeButtonTextSelected
              ]}>Income</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter category"
              value={category}
              onChangeText={setCategory}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Note (Optional)</Text>
            <TextInput
              style={[styles.input, styles.noteInput]}
              placeholder="Enter note"
              value={note}
              onChangeText={setNote}
              multiline
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Add Transaction</Text>
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
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  typeButtonSelected: {
    backgroundColor: '#8A2BE2',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#666',
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
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
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
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});

export default AddTransaction; 