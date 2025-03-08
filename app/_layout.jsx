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
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: 'Transactions',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="receipt" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="learning"
          options={{
            title: 'Learning',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="school" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </FinancialContextProvider>
  );
}