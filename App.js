import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FinancialProvider } from "./app/context/FinancialContext";
import { View } from "react-native";

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <FinancialProvider>
          {/* Expo Router will handle navigation */}
        </FinancialProvider>
      </GestureHandlerRootView>
    </View>
  );
}
