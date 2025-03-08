import React, { useContext, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { FinancialContext } from '../context/FinancialContext';
import { Ionicons } from '@expo/vector-icons';

const TransactionScreen = () => {
  const router = useRouter();
  const financial = useContext(FinancialContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  const [filterDateRange, setFilterDateRange] = useState('all'); // 'all', 'today', 'week', 'month', 'year'
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'highest', 'lowest'

  // Format currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Filter transactions based on current filters
  const getFilteredTransactions = () => {
    let filtered = [...financial.transactions];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction => 
        transaction.category.toLowerCase().includes(query)
      );
    }
    
    // Filter by transaction type
    if (filterType !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === filterType);
    }
    
    // Filter by date range
    if (filterDateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (filterDateRange) {
        case 'today':
          filtered = filtered.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= today;
          });
          break;
        case 'week':
          const oneWeekAgo = new Date(today);
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          filtered = filtered.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= oneWeekAgo;
          });
          break;
        case 'month':
          const oneMonthAgo = new Date(today);
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          filtered = filtered.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= oneMonthAgo;
          });
          break;
        case 'year':
          const oneYearAgo = new Date(today);
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          filtered = filtered.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= oneYearAgo;
          });
          break;
      }
    }
    
    // Sort transactions
    switch (sortOrder) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'highest':
        filtered.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
        break;
      case 'lowest':
        filtered.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
        break;
    }
    
    return filtered;
  };

  // Group transactions by date
  const groupTransactionsByDate = () => {
    const filtered = getFilteredTransactions();
    const grouped = {};
    
    filtered.forEach(transaction => {
      const date = new Date(transaction.date);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          title: formatDate(transaction.date),
          data: []
        };
      }
      
      grouped[dateKey].data.push(transaction);
    });
    
    return Object.values(grouped).sort((a, b) => {
      const dateA = new Date(a.data[0].date);
      const dateB = new Date(b.data[0].date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };

  // Calculate total for a group of transactions
  const calculateGroupTotal = (transactions) => {
    let income = 0;
    let expense = 0;
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        income += parseFloat(transaction.amount);
      } else {
        expense += parseFloat(transaction.amount);
      }
    });
    
    return { income, expense };
  };

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => {
        // Show transaction details or edit options
        // This could be implemented as a modal or navigation to a details screen
      }}
    >
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionCategory}>
          {item.category}
        </Text>
        <Text style={styles.transactionNote}>
          {item.note || 'No description'}
        </Text>
      </View>
      <View style={styles.transactionAmountContainer}>
        <Text 
          style={[
            styles.transactionAmount,
            item.type === 'income' ? styles.incomeText : styles.expenseText
          ]}
        >
          {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }) => {
    const { income, expense } = calculateGroupTotal(section.data);
    const net = income - expense;
    
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionDate}>{section.title}</Text>
        <View style={styles.sectionSummary}>
          <Text style={[styles.sectionNet, net >= 0 ? styles.incomeText : styles.expenseText]}>
            {net >= 0 ? '+' : ''}{formatCurrency(net)}
          </Text>
        </View>
      </View>
    );
  };

  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={filterModalVisible}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter Transactions</Text>
          
          <Text style={styles.filterTitle}>Transaction Type</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity 
              style={[styles.filterOption, filterType === 'all' && styles.filterOptionSelected]}
              onPress={() => setFilterType('all')}
            >
              <Text style={[styles.filterText, filterType === 'all' && styles.filterTextSelected]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterOption, filterType === 'income' && styles.filterOptionSelected]}
              onPress={() => setFilterType('income')}
            >
              <Text style={[styles.filterText, filterType === 'income' && styles.filterTextSelected]}>Income</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterOption, filterType === 'expense' && styles.filterOptionSelected]}
              onPress={() => setFilterType('expense')}
            >
              <Text style={[styles.filterText, filterType === 'expense' && styles.filterTextSelected]}>Expense</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.filterTitle}>Time Period</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity 
              style={[styles.filterOption, filterDateRange === 'all' && styles.filterOptionSelected]}
              onPress={() => setFilterDateRange('all')}
            >
              <Text style={[styles.filterText, filterDateRange === 'all' && styles.filterTextSelected]}>All Time</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterOption, filterDateRange === 'today' && styles.filterOptionSelected]}
              onPress={() => setFilterDateRange('today')}
            >
              <Text style={[styles.filterText, filterDateRange === 'today' && styles.filterTextSelected]}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterOption, filterDateRange === 'week' && styles.filterOptionSelected]}
              onPress={() => setFilterDateRange('week')}
            >
              <Text style={[styles.filterText, filterDateRange === 'week' && styles.filterTextSelected]}>This Week</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterOption, filterDateRange === 'month' && styles.filterOptionSelected]}
              onPress={() => setFilterDateRange('month')}
            >
              <Text style={[styles.filterText, filterDateRange === 'month' && styles.filterTextSelected]}>This Month</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterOption, filterDateRange === 'year' && styles.filterOptionSelected]}
              onPress={() => setFilterDateRange('year')}
            >
              <Text style={[styles.filterText, filterDateRange === 'year' && styles.filterTextSelected]}>This Year</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.filterTitle}>Sort By</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity 
              style={[styles.filterOption, sortOrder === 'newest' && styles.filterOptionSelected]}
              onPress={() => setSortOrder('newest')}
            >
              <Text style={[styles.filterText, sortOrder === 'newest' && styles.filterTextSelected]}>Newest First</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterOption, sortOrder === 'oldest' && styles.filterOptionSelected]}
              onPress={() => setSortOrder('oldest')}
            >
              <Text style={[styles.filterText, sortOrder === 'oldest' && styles.filterTextSelected]}>Oldest First</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterOption, sortOrder === 'highest' && styles.filterOptionSelected]}
              onPress={() => setSortOrder('highest')}
            >
              <Text style={[styles.filterText, sortOrder === 'highest' && styles.filterTextSelected]}>Highest Amount</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterOption, sortOrder === 'lowest' && styles.filterOptionSelected]}
              onPress={() => setSortOrder('lowest')}
            >
              <Text style={[styles.filterText, sortOrder === 'lowest' && styles.filterTextSelected]}>Lowest Amount</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => {
                // Reset all filters
                setFilterType('all');
                setFilterDateRange('all');
                setSortOrder('newest');
              }}
            >
              <Text style={styles.modalButtonText}>Reset Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.applyButton]}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, styles.applyButtonText]}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Create an array for SectionList from the grouped transactions
  const sections = groupTransactionsByDate();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transaction History</Text>
      </View>
      
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="filter" size={24} color="#8A2BE2" />
        </TouchableOpacity>
      </View>
      
      {sections.length > 0 ? (
        <FlatList
          data={sections}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View>
              {renderSectionHeader({ section: item })}
              <FlatList
                data={item.data}
                keyExtractor={(transaction) => transaction.id}
                renderItem={renderTransactionItem}
                scrollEnabled={false}
              />
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No transactions found</Text>
          {(searchQuery || filterType !== 'all' || filterDateRange !== 'all') ? (
            <TouchableOpacity
              style={styles.resetFiltersButton}
              onPress={() => {
                setSearchQuery('');
                setFilterType('all');
                setFilterDateRange('all');
              }}
            >
              <Text style={styles.resetFiltersText}>Reset Filters</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('AddTransaction')}
            >
              <Text style={styles.addButtonText}>Add Transaction</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push('AddTransaction')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
      
      {renderFilterModal()}
    </View>
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
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchFilterContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    paddingHorizontal: 15,
  },
  sectionDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  sectionSummary: {
    flexDirection: 'row',
  },
  sectionNet: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
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
  transactionNote: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  transactionAmountContainer: {
    justifyContent: 'center',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeText: {
    color: '#2ecc71',
  },
  expenseText: {
    color: '#e74c3c',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginTop: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetFiltersButton: {
    marginTop: 10,
    padding: 10,
  },
  resetFiltersText: {
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  filterOption: {
    margin: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  filterOptionSelected: {
    borderColor: '#8A2BE2',
    backgroundColor: '#f0e6ff',
  },
  filterText: {
    color: '#666',
  },
  filterTextSelected: {
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalButtonText: {
    fontWeight: 'bold',
    color: '#666',
  },
  applyButton: {
    backgroundColor: '#8A2BE2',
    borderColor: '#8A2BE2',
  },
  applyButtonText: {
    color: '#fff',
  },
});

export default TransactionScreen;