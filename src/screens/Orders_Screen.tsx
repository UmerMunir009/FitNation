import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

type OrderItem = {
  id: number;
  name: string;
  price: number;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING';
  image: any;
  actionLabel: string;
};

type Order = {
  id: string;
  orderNumber: string;
  total: number;
  date: string;
  items: OrderItem[];
};

const OrdersScreen = () => {
  const navigation = useNavigation<any>();

  const orders: Order[] = [
    {
      id: '1',
      orderNumber: '10234',
      total: 50000,
      date: '13:10 pm, Sept 12, 2025',
      items: [
        {
          id: 1,
          name: 'Supplement',
          price: 8999,
          status: 'ACTIVE',
          image: require('../assets/images/meal_1.jpg'),
          actionLabel: 'Buy Again',
        },
        {
          id: 2,
          name: 'Meal Plan 01',
          price: 8999,
          status: 'COMPLETED',
          image: require('../assets/images/meal_1.jpg'),
          actionLabel: 'View Plan',
        },
        {
          id: 3,
          name: 'Total War Pre Workout',
          price: 8999,
          status: 'COMPLETED',
          image: require('../assets/images/meal_1.jpg'),
          actionLabel: 'Download Plan',
        },
      ],
    },
    {
      id: '2',
      orderNumber: '10235',
      total: 35000,
      date: '10:30 am, Sept 10, 2025',
      items: [
        {
          id: 4,
          name: 'Supplement',
          price: 8999,
          status: 'COMPLETED',
          image: require('../assets/images/meal_1.jpg'),
          actionLabel: 'Buy Again',
        },
        {
          id: 5,
          name: 'Meal Plan 01',
          price: 8999,
          status: 'ACTIVE',
          image: require('../assets/images/meal_2.jpg'),
          actionLabel: 'View Plan',
        },
      ],
    },
    {
      id: '3',
      orderNumber: '78795',
      total: 5000,
      date: '10:30 am, Sept 10, 2025',
      items: [
        {
          id: 4,
          name: 'Supplement',
          price: 8999,
          status: 'COMPLETED',
          image: require('../assets/images/meal_1.jpg'),
          actionLabel: 'Buy Again',
        },
        {
          id: 5,
          name: 'Meal Plan 01',
          price: 8999,
          status: 'ACTIVE',
          image: require('../assets/images/meal_2.jpg'),
          actionLabel: 'View Plan',
        },
        {
          id: 6,
          name: 'Meal Plan 02',
          price: 8999,
          status: 'ACTIVE',
          image: require('../assets/images/meal_2.jpg'),
          actionLabel: 'View Plan',
        },
      ],
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { backgroundColor: '#ADE406', color: '#000' };
      case 'COMPLETED':
        return { backgroundColor: '#198754', color: '#FFF' };
      case 'PENDING':
        return { backgroundColor: '#FFC107', color: '#000' };
      default:
        return { backgroundColor: '#666', color: '#FFF' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Orders</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: verticalScale(20) }}
      >
        {orders.map(order => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderNumber}>
                  Order # {order.orderNumber}
                </Text>
                <Text
                  style={styles.orderDate}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Date of Purchase: {order.date}
                </Text>
              </View>
              <View>
                <Text style={styles.orderTotal}>
                  Total: Rs. {order.total.toLocaleString()}
                </Text>
                <Text style={styles.buyAfter}>By Ali Ahmad</Text>
              </View>
            </View>

            {order.items.map(item => {
              const statusStyle = getStatusStyle(item.status);
              return (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.itemRow}>
                    <Image source={item.image} style={styles.itemImage} />

                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <View style={styles.statusPriceRow}>
                        <Text style={{ color: 'grey', fontWeight: '600' }}>
                          Status:
                        </Text>
                        <Text
                          style={[
                            styles.statusText,
                            {
                              backgroundColor: statusStyle.backgroundColor,
                              color: statusStyle.color,
                            },
                          ]}
                        >
                          {item.status}
                        </Text>
                      </View>
                      <Text style={styles.itemPrice}>
                        Rs. {item.price.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionText}>{item.actionLabel}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    paddingHorizontal: moderateScale(14),
    paddingTop: verticalScale(30),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: scale(100),
    marginBottom: verticalScale(12),
  },
  headerText: {
    color: 'white',
    fontSize: moderateScale(20),
    fontWeight: '700',
  },
  orderCard: {
    borderRadius: moderateScale(14),
    padding: moderateScale(12),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: '#464444ff',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#2B2B2B',
    paddingBottom: verticalScale(8),
    marginBottom: verticalScale(10),
  },
  orderNumber: {
    color: '#FFF',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  orderDate: {
    color: '#999',
    fontSize: moderateScale(12),
    maxWidth: scale(150),
  },

  orderTotal: {
    color: 'white',
    fontSize: moderateScale(14),
    fontWeight: '700',
    textAlign: 'right',
  },
  buyAfter: {
    color: '#888',
    fontSize: moderateScale(12),
    textAlign: 'right',
  },
  itemCard: {
    backgroundColor: '#222',
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
    marginBottom: verticalScale(10),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(10),
    marginBottom: verticalScale(6),
  },
  itemImage: {
    width: scale(60),
    height: scale(65),
    borderRadius: moderateScale(10),
    backgroundColor: '#333',
  },
  itemName: {
    color: '#FFF',
    fontSize: moderateScale(14),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  statusPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  statusText: {
    paddingVertical: verticalScale(2),
    paddingHorizontal: scale(6),
    borderRadius: moderateScale(16),
    fontSize: moderateScale(10),
    fontWeight: '700',
  },
  itemPrice: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginTop: verticalScale(4),
  },
  actionBtn: {
    backgroundColor: '#ADE406',
    borderRadius: 50,
    paddingVertical: verticalScale(6),
    marginTop: verticalScale(4),
  },
  actionText: {
    textAlign: 'center',
    color: '#000',
    fontWeight: '700',
  },
});
