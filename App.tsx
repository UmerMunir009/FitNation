import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/App_Navigator';
import { AuthProvider } from './src/context/AuthContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/utils/toastConfig';


export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar
          backgroundColor="#000000"
          barStyle="light-content"
          translucent={false}
        />
        <AppNavigator />
        <Toast config={toastConfig} />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
