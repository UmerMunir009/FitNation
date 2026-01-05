import React, { useContext, useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext'; 

import SplashScreen from '../screens/Splash_Screen';
import SignUpScreen from "../screens/auth/SignUp_Screen";
import LoginScreen from "../screens/auth/Login_Screen";
import ForgotPasswordScreen from "../screens/auth/Forgot_Password_Screen";
import OTPScreen from "../screens/auth/OTP_Screen";
import SetNewPasswordScreen from "../screens/auth/SetNew_Password_Screen";

import BottomTabs from "./BottomTabs";

import CartScreen from '../screens/Cart_Screen'

import OrderScreen from '../screens/Orders_Screen'
import EditProfileScreen from '../screens/EditProfile_Screen'
import SubscriptionScreen from '../screens/Subscription_Screen'
import UpdatePaymentScreen from '../screens/UpdatePayment_Screen'
import MealPlanScreen from '../screens/MealPlan_Screen'
import MealPlanDetailsScreen from '../screens/MealPlan_Details_Screen'
import MealsScreen from '../screens/Meals_Screen'
import MealsDetailScreen from '../screens/Meal_Detail_Screen'
import BestSelllingScreen from '../screens/Best_Selling_Screen'
import BestSelllingDetailsScreen from '../screens/Supplement_Details_Screen'
import FitnessProgramDetailScreen from '../screens/Fitness_Program_Detail_Screen'

import ShippingScreen from '../screens/Shipping_Screen'
import { View, ActivityIndicator, StyleSheet } from 'react-native';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { user, token, loading } = useContext(AuthContext);
    console.log(token)

   if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ADE406" /> 
      </View>
    );
  }
  return (
     <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user && token ? (
          <>
            <Stack.Screen name="MainTabs" component={BottomTabs} />
            <Stack.Screen name="cart" component={CartScreen} />
            <Stack.Screen name="myOrders" component={OrderScreen} />
            <Stack.Screen name="editProfile" component={EditProfileScreen} />
            <Stack.Screen name="subscriptions" component={SubscriptionScreen} />
            <Stack.Screen name="updatePayment" component={UpdatePaymentScreen} />
            <Stack.Screen name="mealPlans" component={MealPlanScreen} />
            <Stack.Screen name="mealPlanDetails" component={MealPlanDetailsScreen} />
            <Stack.Screen name="meals" component={MealsScreen} />
            <Stack.Screen name="mealDetail" component={MealsDetailScreen} />
            <Stack.Screen name="shipping" component={ShippingScreen} />
            <Stack.Screen name="bestSelling" component={BestSelllingScreen} />
            <Stack.Screen name="supplementDetails" component={BestSelllingDetailsScreen} />
            <Stack.Screen name="fitnessProgramDetails" component={FitnessProgramDetailScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="OTPScreen" component={OTPScreen} />
            <Stack.Screen name="SetNewPassword" component={SetNewPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000', // Black background
    justifyContent: 'center',
    alignItems: 'center',
  },
});