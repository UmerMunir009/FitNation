import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bottomNavOffset } from '../theme/layout';

// Screens
import HomeScreen from '../screens/Home_Screen';
import FitnessProgramScreen from '../screens/FitnessProgram_Screen';
import SettingScreen from '../screens/Setting_Screen';
import ChatScreen from '../screens/Chat_Screen';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const getTabLabel = (routeName: string) => {
    const labels: { [key: string]: string } = {
      Home: 'Home',
      // Shop: 'Shop',
      FitnessProgram: 'Fitness Program',
      Chat: 'Chat',
      // MyOrders: 'My Orders',
      Settings: 'Settings',
    };
    return labels[routeName] || routeName;
  };

  const getTabIcon = (routeName: string, isFocused: boolean) => {
    switch (routeName) {
      case 'Home':
        return isFocused
          ? require('../assets/images/home_icon.png')
          : require('../assets/images/home_icon.png');
      // case 'Shop':
      //   return isFocused
      //     ? require('../assets/images/shop_icon.png')
      //     : require('../assets/images/shop_icon.png');
      case 'FitnessProgram':
        return isFocused
          ? require('../assets/images/fitness-program_icon.png')
          : require('../assets/images/fitness-program_icon.png');
      case 'Chat':
        return isFocused
          ? require('../assets/images/message_box.png')
          : require('../assets/images/message_box.png');
      // case 'MyOrders':
      //   return isFocused
      //     ? require('../assets/images/order_icon.png')
      //     : require('../assets/images/order_icon.png');
      case 'Settings':
        return isFocused
          ? require('../assets/images/setting_icon.png')
          : require('../assets/images/setting_icon.png');
      default:
        return require('../assets/images/home_icon.png');
    }
  };

  return (
    <View
      style={[
        styles.tabBarContainer,
        { bottom: Math.max(insets.bottom, bottomNavOffset) },
      ]}
    >
      <View style={[styles.tabBar, { backgroundColor: '#282828' }]}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const iconSource = getTabIcon(route.name, isFocused);
          const iconScale =
            route.name === 'Chat' && !isFocused ? [{ scale: 1.9 }] : [];

          return (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(route.name)}
              style={[styles.tabItem, isFocused && styles.activeTabBackground]}
            >
              <Image
                source={iconSource}
                style={{
                  width: moderateScale(22),
                  height: moderateScale(22),
                  tintColor: isFocused ? '#1f2937' : '#ffffff',
                  transform: iconScale,
                }}
                resizeMode="contain"
              />
              {isFocused && (
                <Text style={styles.activeTabText}>
                  {getTabLabel(route.name)}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        lazy: false,
        animation: 'none',
      }}
      detachInactiveScreens={false}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      {/* <Tab.Screen name="Shop" component={ShopScreen} /> */}
      <Tab.Screen name="FitnessProgram" component={FitnessProgramScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      {/* <Tab.Screen name="MyOrders" component={MyOrdersScreen} /> */}
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    left: scale(16),
    right: scale(16),
    borderRadius: scale(30),
    backgroundColor: 'transparent',
  },

  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: verticalScale(50),
    elevation: 8,
    borderRadius: scale(30),
    paddingHorizontal: scale(8),
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: scale(20),
    flexDirection: 'row',
    gap: scale(6),
  },
  activeTabBackground: {
    backgroundColor: '#a3e635',
  },
  activeTabText: {
    color: '#1f2937',
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
});
