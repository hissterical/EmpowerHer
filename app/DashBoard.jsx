import React, { useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { FinancialContext } from '../context/FinancialContext';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const DashboardScreen = ({ navigation }) => {
  const financial = useContext(FinancialContext);
  const screenWidth = Dimensions.get('window').width;
  
  // Calculate total income and expenses for the current monavinth
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyIncome = financial.income
    .filter(item => {
      const date = new Date(item.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);
  
  const monthlyExpenses = financial.expenses
    .filter(item => {
      const date = new Date(item.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);
  
  // Format currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };
  
  // Get expense categories for pie chart
  const getExpenseCategories = () => {
    const categories = {};
    
    financial.expenses
      .filter(item => {
        const date = new Date(item.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .forEach(expense => {
        if (categories[expense.category]) {
          categories[expense.category] += parseFloat(expense.amount);
        } else {
          categories[expense.category] = parseFloat(expense.amount);
        }
      });
    
    // Convert to array for chart
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }));
  };
  
  // Prepare data for line chart (last 6 months)
  const getMonthlyData = () => {
    const months = [];
    const incomeData = [];
    const expenseData = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthYear = date.toLocaleString('default', { month: 'short' });
      months.push(monthYear);
      
      const monthNum = date.getMonth();
      const yearNum = date.getFullYear();
      
      const monthIncome = financial.income
        .filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getMonth() === monthNum && itemDate.getFullYear() === yearNum;
        })
        .reduce((sum, item) => sum + parseFloat(item.amount), 0);
      
      const monthExpense = financial.expenses
        .filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getMonth() === monthNum && itemDate.getFullYear() === yearNum;
        })
        .reduce((sum, item) => sum + parseFloat(item.amount), 0);
      
      incomeData.push(monthIncome);
      expenseData.push(monthExpense);
    }
    
    return {
      labels: months,
      datasets: [
        {
          data: incomeData,
          color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
          strokeWidth: 2
        },
        {
          data: expenseData,
          color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
          strokeWidth: 2
        }
      ],
      legend: ['Income', 'Expenses']
    };
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Hello, Financial Queen!</Text>
        <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
      </View>
      
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(financial.balance)}</Text>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={[styles.summaryAmount, styles.incomeText]}>
              {formatCurrency(monthlyIncome)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Expenses</Text>
            <Text style={[styles.summaryAmount, styles.expenseText]}>
              {formatCurrency(monthlyExpenses)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly Overview</Text>
        <Text style={styles.sectionSubtitle}>Income vs. Expenses</Text>
        
        <LineChart
          data={getMonthlyData()}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
            }
          }}
          bezier
          style={styles.chart}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expense Breakdown</Text>
        <Text style={styles.sectionSubtitle}>Where your money goes</Text>
        
        {getExpenseCategories().length > 0 ? (
          <PieChart
            data={getExpenseCategories()}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No expense data for this month</Text>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Goals</Text>
        {financial.goals.length > 0 ? (
          <View>
            {financial.goals.map(goal => {
              const progress = Math.min((goal.current / goal.target) * 100, 100);
              return (
                <View key={goal.id} style={styles.goalItem}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalAmount}>
                      {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                    </Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { width: `${progress}%` },
                        progress === 100 ? styles.progressComplete : null
                      ]} 
                    />
                  </View>
                  <Text style={styles.goalDate}>
                    Target Date: {new Date(goal.date).toLocaleDateString()}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No goals set</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddGoal')}
            >
              <Text style={styles.addButtonText}>Set a Goal</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {financial.transactions.length > 0 ? (
          <View>
            {financial.transactions
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5)
              .map(transaction => (
                <View 
                  key={transaction.id} 
                  style={styles.transactionItem}
                >
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionCategory}>
                      {transaction.category}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text 
                    style={[
                      styles.transactionAmount,
                      transaction.type === 'income' ? styles.incomeText : styles.expenseText
                    ]}
                  >
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </Text>
                </View>
              ))}
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Transactions')}
            >
              <Text style={styles.viewAllText}>View All Transactions</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No transactions yet</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddTransaction')}
            >
              <Text style={styles.addButtonText}>Add Transaction</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Women's Financial Tip</Text>
        <View style={styles.tipContainer}>
          <Text style={styles.tipText}>
            "Pay yourself first" isn't just a saying—it's a strategy. Aim to set aside 20% of your income for future you, before other expenses.
          </Text>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddTransaction')}
        >
          <Text style={styles.actionButtonText}>Add Transaction</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  dateText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  balanceContainer: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: -20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 10,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  incomeText: {
    color: '#2ecc71',
  },
  expenseText: {
    color: '#e74c3c',
  },
  section: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    marginBottom: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  goalItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  goalAmount: {
    fontSize: 14,
    color: '#666',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginVertical: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#8A2BE2',
    borderRadius: 5,
  },
  progressComplete: {
    backgroundColor: '#2ecc71',
  },
  goalDate: {
    fontSize: 12,
    color: '#888',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  viewAllText: {
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tipContainer: {
    backgroundColor: '#f0f5ff',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#8A2BE2',
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    fontStyle: 'italic',
  },
  actionsContainer: {
    margin: 20,
    marginTop: 0,
    marginBottom: 40,
  },
  actionButton: {
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DashboardScreen;