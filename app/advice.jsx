import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { FinancialContext } from '../context/FinancialContext';
import { Ionicons } from '@expo/vector-icons';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config/api';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const AdviceScreen = () => {
  const financial = useContext(FinancialContext);
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState(null);

  const analyzeFinancialData = async () => {
    setLoading(true);
    try {
      const analysisData = {
        balance: financial.balance,
        monthlyIncome: calculateMonthlyIncome(),
        monthlyExpenses: calculateMonthlyExpenses(),
        savingsRate: calculateSavingsRate(),
        expenseBreakdown: getExpenseBreakdown(),
        goals: financial.goals,
        budgetAdherence: calculateBudgetAdherence()
      };

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `You are a financial advisor AI. Analyze this data and provide specific, quantitative advice. Include exact numbers, amounts, and timeframes. Focus on identifying wasteful spending and specific savings targets. Respond ONLY with a valid JSON object.

        Financial data:
        Balance: $${analysisData.balance}
        Monthly Income: $${analysisData.monthlyIncome}
        Monthly Expenses: $${analysisData.monthlyExpenses}
        Savings Rate: ${analysisData.savingsRate.toFixed(1)}%

        Top Expenses:
        ${Object.entries(analysisData.expenseBreakdown)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([category, amount]) => `${category}: $${amount}`)
          .join('\n')}

        Goals:
        ${analysisData.goals
          .map(goal => `${goal.name}: $${goal.current}/$${goal.target} (${((goal.current/goal.target) * 100).toFixed(0)}% complete)`)
          .join('\n')}

        Over Budget Categories:
        ${Object.entries(analysisData.budgetAdherence)
          .filter(([, info]) => info.adherenceRate > 100)
          .map(([category, info]) => `${category}: $${info.actual} spent vs $${info.budgeted} budget (${info.adherenceRate.toFixed(0)}% of budget)`)
          .join('\n')}

        Return ONLY this JSON structure with no additional text or formatting:
        {
          "summary": "<2-sentence financial assessment with specific numbers>",
          "recommendations": [
            {
              "category": "<specific area>",
              "advice": "<action with exact dollar amounts and timeframes>",
              "priority": "<High or Medium>",
              "potentialSavings": "<monthly dollar amount that could be saved>",
              "implementationTime": "<timeframe in weeks or months>"
            }
          ]
        }`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text().trim();
      
      // Clean up the response text to ensure it's valid JSON
      let cleanText = text;
      // Remove any markdown code block indicators
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      // Remove any leading/trailing whitespace
      cleanText = cleanText.trim();
      
      try {
        const aiAdvice = JSON.parse(cleanText);
        
        // Validate the structure
        if (!aiAdvice.summary || !Array.isArray(aiAdvice.recommendations)) {
          throw new Error('Invalid response structure');
        }
        
        setAdvice(aiAdvice);
      } catch (parseError) {
        console.error('JSON Parse error:', parseError);
        // If parsing fails, create a fallback response
        setAdvice({
          summary: "Based on your financial data, here's a simplified analysis: Your monthly income is $" + 
                  analysisData.monthlyIncome.toFixed(2) + " with expenses of $" + 
                  analysisData.monthlyExpenses.toFixed(2) + ", resulting in a savings rate of " + 
                  analysisData.savingsRate.toFixed(1) + "%.",
          recommendations: [
            {
              category: "General",
              advice: "Please try again for detailed recommendations.",
              priority: "Medium"
            }
          ]
        });
      }
    } catch (error) {
      console.error('Error analyzing financial data:', error);
      Alert.alert(
        'Error',
        'We encountered an issue while analyzing your data. Here\'s a basic overview instead.',
        [{ text: 'OK' }]
      );
      setAdvice({
        summary: "Unable to generate detailed advice. Basic overview: Income $" + 
                calculateMonthlyIncome().toFixed(2) + ", Expenses $" + 
                calculateMonthlyExpenses().toFixed(2),
        recommendations: [
          {
            category: "System",
            advice: "Please try again in a moment for detailed recommendations.",
            priority: "Medium"
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyIncome = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return financial.income
      .filter(item => {
        const date = new Date(item.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, item) => sum + parseFloat(item.amount), 0);
  };

  const calculateMonthlyExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return financial.expenses
      .filter(item => {
        const date = new Date(item.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, item) => sum + parseFloat(item.amount), 0);
  };

  const calculateSavingsRate = () => {
    const monthlyIncome = calculateMonthlyIncome();
    const monthlyExpenses = calculateMonthlyExpenses();
    return monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
  };

  const getExpenseBreakdown = () => {
    const breakdown = {};
    financial.expenses.forEach(expense => {
      if (breakdown[expense.category]) {
        breakdown[expense.category] += parseFloat(expense.amount);
      } else {
        breakdown[expense.category] = parseFloat(expense.amount);
      }
    });
    return breakdown;
  };

  const calculateBudgetAdherence = () => {
    const adherence = {};
    financial.budgets.forEach(budget => {
      const actualExpense = financial.expenses
        .filter(e => e.category === budget.category)
        .reduce((sum, e) => sum + parseFloat(e.amount), 0);
      adherence[budget.category] = {
        budgeted: budget.amount,
        actual: actualExpense,
        adherenceRate: (actualExpense / budget.amount) * 100
      };
    });
    return adherence;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Financial Advisor</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Get Personalized Financial Advice</Text>
          <Text style={styles.cardDescription}>
            Our AI advisor uses advanced machine learning to analyze your financial data
            and provide personalized recommendations for improving your financial health.
          </Text>
          {!advice && !loading && (
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={analyzeFinancialData}
            >
              <Text style={styles.analyzeButtonText}>Analyze My Finances</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8A2BE2" />
            <Text style={styles.loadingText}>Analyzing your financial data...</Text>
          </View>
        )}

        {advice && !loading && (
          <View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Summary</Text>
              <Text style={styles.summaryText}>{advice.summary}</Text>
            </View>

            <View style={styles.recommendationsCard}>
              <Text style={styles.recommendationsTitle}>Recommendations</Text>
              {advice.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={styles.recommendationHeader}>
                    <Text style={styles.recommendationCategory}>{rec.category}</Text>
                    <View style={[
                      styles.priorityBadge,
                      { backgroundColor: rec.priority === 'High' ? '#FF6B6B' : '#4ECDC4' }
                    ]}>
                      <Text style={styles.priorityText}>{rec.priority}</Text>
                    </View>
                  </View>
                  <Text style={styles.recommendationText}>{rec.advice}</Text>
                  {rec.potentialSavings && (
                    <View style={styles.savingsContainer}>
                      <Ionicons name="trending-up" size={16} color="#4ECDC4" />
                      <Text style={styles.savingsText}>
                        Potential monthly savings: {rec.potentialSavings}
                      </Text>
                    </View>
                  )}
                  {rec.implementationTime && (
                    <View style={styles.timeContainer}>
                      <Ionicons name="time-outline" size={16} color="#666" />
                      <Text style={styles.timeText}>
                        Time to implement: {rec.implementationTime}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={analyzeFinancialData}
            >
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.refreshButtonText}>Refresh Analysis</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  analyzeButton: {
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  recommendationsCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  recommendationItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationCategory: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  refreshButton: {
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#E8F8F5',
    padding: 8,
    borderRadius: 4,
  },
  savingsText: {
    marginLeft: 6,
    color: '#2ECC71',
    fontSize: 14,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#F8F9FA',
    padding: 8,
    borderRadius: 4,
  },
  timeText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
  },
});

export default AdviceScreen; 