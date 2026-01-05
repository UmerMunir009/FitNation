import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Trash2, Plus, Minus } from 'lucide-react-native';
import NavBar from '../components/Navbar';
import { useNavigation } from '@react-navigation/native';

type CartItem = {
  id: number;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  image: any;
};

const CartScreen = () => {
  const navigation = useNavigation<any>();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Protein 01',
      originalPrice: 2500,
      discountedPrice: 1000,
      quantity: 1,
      image: require('../assets/images/meal_1.jpg'),
    },
    {
      id: 2,
      name: 'Protein 02',
      originalPrice: 2500,
      discountedPrice: 1000,
      quantity: 1,
      image: require('../assets/images/meal_2.jpg'),
    },
    {
      id: 3,
      name: 'Protein 03',
      originalPrice: 2500,
      discountedPrice: 1000,
      quantity: 1,
      image: require('../assets/images/meal_3.jpg'),
    },
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0,
  );
  const deliveryCharges = 100;
  const total = subTotal + deliveryCharges;

  const handleToPay = () => {
    navigation.navigate('shipping',{ total });
  };

  return (
    <View style={styles.container}>
      <NavBar />
      <View style={{ paddingHorizontal: moderateScale(14) }}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>My Cart</Text>
          <TouchableOpacity onPress={handleToPay} style={styles.payBtn}>
            <Text style={styles.payText}>To Pay</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={cartItems}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <View style={styles.card}>
                <View style={styles.imageBox}>
                  <Image
                    source={item.image}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>

                <View style={styles.details}>
                  <Text style={styles.itemName}>{item.name}</Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.strikePrice}>
                      Rs. {item.originalPrice}
                    </Text>
                    <Text style={styles.discountedPrice}>
                      Rs. {item.discountedPrice}
                    </Text>
                  </View>

                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, -1)}
                      style={styles.qtyBtn}
                    >
                      <Minus size={18} color="#bbb" />
                    </TouchableOpacity>

                    <Text style={styles.qtyValue}>
                      {String(item.quantity).padStart(2, '0')}
                    </Text>

                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, 1)}
                      style={styles.qtyBtn}
                    >
                      <Plus size={18} color="#bbb" />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Trash2 size={20} color="#bbb" />
                </TouchableOpacity>
              </View>

              <View style={styles.underline} />
            </View>
          )}
          ListFooterComponent={
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sub Total</Text>
                <Text style={styles.summaryValue}>Rs. {subTotal}.00</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Charges</Text>
                <Text style={styles.summaryValue}>
                  Rs. {deliveryCharges}.00
                </Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalText}>Rs. {total}.00</Text>
              </View>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default CartScreen;

// ────────────────────────────── Styles ──────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    paddingTop: verticalScale(10),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  headerText: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: 'white',
  },
  payBtn: {
    backgroundColor: '#ADE406',
    borderRadius: 50,
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(18),
  },
  payText: {
    color: '#000',
    fontWeight: '600',
  },
  cardWrapper: {
    marginBottom: verticalScale(0),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(8),
  },
  underline: {
    height: 1,
    backgroundColor: '#2B2B2B',
    marginTop: verticalScale(6),
  },
  imageBox: {
    width: scale(70),
    height: scale(70),
    borderRadius: moderateScale(10),
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(10),
  },
  details: {
    flex: 1,
  },
  itemName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#E9C351',
  },
  priceRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: verticalScale(4),
    gap: scale(2),
  },
  strikePrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: moderateScale(12),
  },
  discountedPrice: {
    color: 'white',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: verticalScale(6),
    borderWidth: 1,
    borderColor: '#2B2B2B',
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
    maxWidth: 110,
  },
  qtyBtn: {
    padding: scale(4),
  },
  qtyValue: {
    color: '#E9C351',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    width: scale(24),
    textAlign: 'center',
  },
  summaryBox: {
    backgroundColor: '#1C1C1C',
    padding: moderateScale(14),
    marginTop: verticalScale(20),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(6),
  },
  summaryLabel: {
    color: '#aaa',
  },
  summaryValue: {
    color: 'white',
    fontSize: moderateScale(13),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#333',
    marginTop: verticalScale(8),
    paddingTop: verticalScale(6),
  },
  totalText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
});
