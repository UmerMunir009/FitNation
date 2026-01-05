import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loginApi,
  getProfileApi,
  registerApi,
  forgotPasswordApi,
  verifyOTPApi,
  resetPasswordApi
} from '../api/auth';
import { showErrorToast, showSuccessToast } from '../utils/toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signingUp, setSigningUp] = useState(false);
  const [logging, setLogging] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const loadAuthData = async () => {
      const savedToken = await AsyncStorage.getItem('token');
      const savedUser = await AsyncStorage.getItem('user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };
    loadAuthData();
  }, []);

  const register = async (name, email, password, confirmPassword) => {
    try {
      setSigningUp(true);

      const res = await registerApi(name, email, password, confirmPassword);

      await AsyncStorage.setItem('token', res.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));

      setToken(res.data.token);
      setUser(JSON.stringify(res.data.user));
      setTimeout(() => {
        showSuccessToast('Sign-up Successful');
      }, 100);
    } catch (error) {
      showErrorToast(error.response?.data?.errors?.email[0])
      console.log('Registration error:', error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setSigningUp(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLogging(true);
      console.log(email,password)
      const res = await loginApi(email, password);
      console.log(res.data.token)

      await AsyncStorage.setItem('token', res.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));

      setToken(res.data.token);
      setUser(JSON.stringify(res.data.user));
      setTimeout(() => {
        showSuccessToast('Login Successful');
      }, 100);
    } catch (error) {
      showErrorToast('Invalid Credentials');
      console.log('Registration error:', error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLogging(false);
    }
  };

  const forgetPassword = async email => {
    try {
      setLogging(true);
      await forgotPasswordApi(email);
    } catch (error) {
      showErrorToast('Invalid Credentials');
      console.log('Registration error:', error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLogging(false);
    }
  };
  const verifyOTP = async (email,otp) => {
    try {
      setVerifyingOTP(true);
      await verifyOTPApi(email,otp);
      showSuccessToast('OTP verified. Please set new password.')
      return true
    } catch (error) {
      showErrorToast( error.response?.data?.message);
      console.log('Registration error:', error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setVerifyingOTP(false);
    }
  };

  const resetPassword = async (email,otp,password,newPassword) => {
    try {
      setResetting(true);
      await resetPasswordApi(email,otp,password,newPassword);
      showSuccessToast('Password reset successsfully.')
      return true
    } catch (error) {
      showErrorToast( error.response?.data?.message);
      console.log('Registration error:', error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setResetting(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const userData = await getProfileApi();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setToken(null);
    setUser(null);
    showSuccessToast('Logout Successfull');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        verifyOTP,
        setVerifyingOTP,
        forgetPassword,
        fetchProfile,
        register,
        signingUp,
        verifyingOTP,
        setSigningUp,
        logging,
        setLogging,
        resetPassword,
        resetting
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
