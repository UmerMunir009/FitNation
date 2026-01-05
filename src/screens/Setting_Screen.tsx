import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';


const SettingsScreen = () => {
  const navigation = useNavigation<any>();
    const { logout } = useContext(AuthContext);
  

  const menuItems = [
    {
      id: 1,
      label: 'Edit Profile',
      icon: require('../assets/images/editprofile_icon.png'),
      route: 'editProfile',
    },
    {
      id: 2,
      label: 'My Orders',
      icon: require('../assets/images/orders_icon.png'),
      route: 'myOrders',
    },
    {
      id: 3,
      label: 'Update Payment Detail',
      icon: require('../assets/images/updatepayment_icon.png'),
      route: 'updatePayment',
    },
    {
      id: 4,
      label: 'My Membership',
      icon: require('../assets/images/membership_icon.png'),
      route: 'MembershipScreen',
    },
    {
      id: 5,
      label: 'Subscription',
      icon: require('../assets/images/subscription_icon.png'),
      route: 'subscriptions',
    },
    {
      id: 6,
      label: 'Meal Plan',
      icon: require('../assets/images/mealplan_icon.png'),
      route: 'mealPlans',
    },
    {
      id: 7,
      label: 'Workout Plans',
      icon: require('../assets/images/workout_icon.png'),
      route: 'WorkoutPlansScreen',
    },
  ];

  const handleLogout = async() => {
    await logout()
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: verticalScale(20) }}
      >
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={styles.menuLeft}>
                <Image source={item.icon} style={styles.menuIcon} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.menuItem2} onPress={handleLogout}>
            <View style={styles.menuLeft}>
              <LogOut size={22} color="#bbb" />
              <Text style={styles.menuLabel}>Logout</Text>
            </View>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    paddingHorizontal: moderateScale(14),
    paddingTop: verticalScale(45),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },
  headerTitle: {
    color: '#FFF',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  menuContainer: {
    backgroundColor: '#282828',
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(6),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e3e',
  },
  menuItem2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  menuIcon: {
    width: scale(22),
    height: scale(22),
    resizeMode: 'contain',
    tintColor: '#bbb',
  },
  menuLabel: {
    color: '#a0a0a0ff',
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  logoutContainer: {
    marginTop: verticalScale(20),
    backgroundColor: '#282828',
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: '#2B2B2B',
  },
});
