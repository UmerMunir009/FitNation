import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loginApi,
  getProfileApi,
  registerApi,
  forgotPasswordApi,
  verifyOTPApi,
  resetPasswordApi,
  resendOTPApi,
  updateProfileApi,
  changePasswordApi,
  logoutApi,
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
      setTimeout(() => {
        showSuccessToast('Sign-up Successful. Please login.');
      }, 100);
      return res;
    } catch (error) {
      showErrorToast(
        error.response?.data?.errors?.email?.[0] ||
          error.response?.data?.message ||
          'Registration failed',
      );
      console.log('Registration error:', error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setSigningUp(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLogging(true);
      const res = await loginApi(email, password);

      await AsyncStorage.setItem('token', res.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));

      setToken(res.data.token);
      setUser(res.data.user);
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

  const resendOTP = async email => {
    try {
      setVerifyingOTP(true);
      await resendOTPApi(email);
      showSuccessToast('OTP resent successfully.');
      return true;
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Could not resend OTP');
      throw new Error(error.response?.data?.message || 'Could not resend OTP');
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
      const profile = userData?.data?.user || userData?.data || userData;
      setUser(profile);
      await AsyncStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const updateProfile = async profile => {
    const data = await updateProfileApi(profile);
    const updatedUser = data?.data?.user || data?.data || data;
    setUser(updatedUser);
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    showSuccessToast('Profile updated successfully');
    return updatedUser;
  };

  const changePassword = async (
    currentPassword,
    newPassword,
    confirmPassword,
  ) => {
    const data = await changePasswordApi(
      currentPassword,
      newPassword,
      confirmPassword,
    );
    showSuccessToast('Password changed successfully');
    return data;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.log('Logout API failed:', error.response?.data?.message);
    }
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
        resendOTP,
        setVerifyingOTP,
        forgetPassword,
        fetchProfile,
        updateProfile,
        changePassword,
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
