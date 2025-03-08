import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FinancialContextProvider } from '../context/FinancialContext';

export default function AppLayout() {
  return (
    <FinancialContextProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#8A2BE2',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#8A2BE2',
          },
          headerTintColor: '#fff',
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: 'Transactions',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="swap-vertical" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="budget"
          options={{
            title: 'Budget',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="wallet" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="learning"
          options={{
            title: 'Learn',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="advice"
          options={{
            title: 'AI Advisor',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="sparkles" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="AddTransaction"
          options={{
            title: 'Add',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </FinancialContextProvider>
  );
}