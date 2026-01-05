import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/App_Navigator';
import { AuthProvider } from './src/context/AuthContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/utils/toastConfig';


export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
      <Toast config={toastConfig} />
    </AuthProvider>
  );
}
