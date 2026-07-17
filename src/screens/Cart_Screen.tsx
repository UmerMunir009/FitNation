import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Trash2, AlertTriangle, Plus, Minus, ShoppingBag } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import NavBar from '../components/Navbar';
import { 
  getCartApi, 
  clearCartApi, 
  getCartSummaryApi, 
  updateCartItemApi,
  removeCartItemApi,
  applyCouponApi,
  removeCouponApi,
} from '../api/cart';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import RemoteImage from '../components/RemoteImage';

type CartItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  total_price: number;
  image_url: string;
};

const CartScreen = () => {
  const navigation = useNavigation<any>();

  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [clearModalVisible, setClearModalVisible] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null); 
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  
  const fetchCartData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [cartRes, summaryRes] = await Promise.all([
        getCartApi(),
        getCartSummaryApi()
      ]);

      const mappedItems: CartItem[] = cartRes.data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price),
        total_price: Number(item.total_price),
        image_url: item.product?.image_url,
      }));

      setItems(mappedItems);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error('Cart fetch error:', err);
      showErrorToast("Failed to sync cart data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

 
  const handleUpdateQuantity = async (itemId: number, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    if (deletingId === itemId) return; 

    setUpdatingId(itemId);
    try {
      await updateCartItemApi(itemId, newQty);
      await fetchCartData(false); 
    } catch (err) {
      showErrorToast("Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  
  const handleRemoveItem = async (itemId: number) => {
    if (updatingId === itemId) return; 

    setDeletingId(itemId); 
    try {
      await removeCartItemApi(itemId);
      showSuccessToast("Item removed from cart");
      await fetchCartData(false); 
    } catch (err) {
      showErrorToast("Could not remove item");
    } finally {
      setDeletingId(null);
    }
  };

  
  const handleConfirmClear = async () => {
    setIsClearing(true);
    try {
      await clearCartApi();
      setItems([]);
      setSummary(null);
      setClearModalVisible(false);
      showSuccessToast("Cart cleared");
    } catch (err) {
      showErrorToast("Could not clear cart");
    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCartData(false);
  }, []);

  const handleToPay = () => {
    navigation.navigate('shipping', { total: summary?.grand_total });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      await applyCouponApi(couponCode.trim());
      showSuccessToast('Coupon applied');
      await fetchCartData(false);
    } catch (err) {
      showErrorToast('Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponLoading(true);
    try {
      await removeCouponApi();
      setCouponCode('');
      showSuccessToast('Coupon removed');
      await fetchCartData(false);
    } catch (err) {
      showErrorToast('Could not remove coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <NavBar />

      <Modal
        visible={clearModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setClearModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => !isClearing && setClearModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.alertIconWrapper}>
              <AlertTriangle size={32} color="#FF4444" />
            </View>
            <Text style={styles.modalTitle}>Clear your cart?</Text>
            <Text style={styles.modalSubtitle}>
              This will remove all items from your cart. This action cannot be undone.
            </Text>
            <View style={styles.modalActionRow}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setClearModalVisible(false)}
                disabled={isClearing}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmClearBtn} 
                onPress={handleConfirmClear}
                disabled={isClearing}
              >
                {isClearing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.confirmClearText}>Yes, Clear All</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      <View style={{ paddingHorizontal: moderateScale(14), flex: 1 }}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>My Cart</Text>
          {items.length > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity onPress={() => setClearModalVisible(true)} style={styles.clearBtn}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleToPay} style={styles.payBtn}>
                <Text style={styles.payText}>To Pay</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {loading && !refreshing ? (
          <View style={styles.innerLoader}>
            <ActivityIndicator size="large" color="#ADE406" />
          </View>
        ) : !items.length ? (
          <View style={styles.emptyBox}>
            <ShoppingBag size={60} color="#333" />
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <TouchableOpacity 
              style={styles.shopNowBtn}
              onPress={() => navigation.navigate('MainTabs')}
            >
              <Text style={styles.shopNowText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ADE406" />
            }
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <View style={styles.card}>
                  <View style={styles.imageBox}>
                    <RemoteImage sourceUri={item.image_url} style={styles.image} />
                  </View>

                  <View style={styles.details}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.price}>Rs. {item.price}</Text>

                    <View style={styles.quantityContainer}>
                      <TouchableOpacity 
                        onPress={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                        style={styles.qtyBtn}
                        disabled={updatingId === item.id || deletingId === item.id || item.quantity <= 1}
                      >
                        <Minus size={16} color={item.quantity <= 1 ? "#444" : "#ADE406"} />
                      </TouchableOpacity>

                      <View style={styles.qtyValueBox}>
                        {/* Checked specifically against updatingId so the deletion spinner won't show here */}
                        {updatingId === item.id ? (
                          <ActivityIndicator size="small" color="#ADE406" />
                        ) : (
                          <Text style={styles.qtyValueText}>{item.quantity}</Text>
                        )}
                      </View>

                      <TouchableOpacity 
                        onPress={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                        style={styles.qtyBtn}
                        disabled={updatingId === item.id || deletingId === item.id}
                      >
                        <Plus size={16} color="#ADE406" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={styles.trashBtn}
                    onPress={() => handleRemoveItem(item.id)}
                    disabled={updatingId === item.id || deletingId === item.id}
                  >
                    {/* Checked specifically against deletingId here */}
                    {deletingId === item.id ? (
                      <ActivityIndicator size="small" color="#FF4444" />
                    ) : (
                      <Trash2 size={20} color="#666" />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.underline} />
              </View>
            )}
            ListFooterComponent={
              summary && (
                <View style={styles.summaryBox}>
                  <View style={styles.couponRow}>
                    <TextInput
                      value={couponCode}
                      onChangeText={setCouponCode}
                      placeholder="Coupon code"
                      placeholderTextColor="#777"
                      autoCapitalize="characters"
                      style={styles.couponInput}
                    />
                    <TouchableOpacity
                      style={styles.couponBtn}
                      onPress={handleApplyCoupon}
                      disabled={couponLoading}
                    >
                      <Text style={styles.couponBtnText}>
                        {couponLoading ? '...' : 'Apply'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {!!summary.discount && (
                    <TouchableOpacity onPress={handleRemoveCoupon}>
                      <Text style={styles.removeCouponText}>Remove coupon</Text>
                    </TouchableOpacity>
                  )}
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Sub Total</Text>
                    <Text style={styles.summaryValue}>Rs. {summary.subtotal}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tax</Text>
                    <Text style={styles.summaryValue}>Rs. {summary.tax}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Delivery</Text>
                    <Text style={styles.summaryValue}>Rs. {summary.shipping}</Text>
                  </View>
                  {!!summary.discount && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Discount</Text>
                      <Text style={styles.summaryValue}>- Rs. {summary.discount}</Text>
                    </View>
                  )}
                  <View style={styles.totalRow}>
                    <Text style={styles.totalText}>Total</Text>
                    <Text style={styles.totalText}>Rs. {summary.grand_total}</Text>
                  </View>
                </View>
              )
            }
          />
        )}
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0F0F0F', 
    paddingTop: 0,
  },
  innerLoader: { 
    flex: 0.8, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: verticalScale(15), 
    minHeight: verticalScale(40) 
  },
  headerText: { 
    fontSize: moderateScale(22), 
    fontWeight: '800', 
    color: 'white' 
  },
  payBtn: { 
    backgroundColor: '#ADE406', 
    borderRadius: moderateScale(20), 
    paddingVertical: verticalScale(6), 
    paddingHorizontal: scale(16) 
  },
  payText: { 
    color: '#000', 
    fontWeight: '700', 
    fontSize: moderateScale(13) 
  },
  clearBtn: { 
    paddingVertical: verticalScale(5), 
    paddingHorizontal: scale(5) 
  },
  clearText: { 
    color: '#FF4444', 
    fontSize: moderateScale(13), 
    fontWeight: '600' 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.85)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: scale(20) 
  },
  modalContent: { 
    width: '100%', 
    backgroundColor: '#1A1A1A', 
    borderRadius: moderateScale(16), 
    padding: moderateScale(20), 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#333' 
  },
  alertIconWrapper: { 
    width: scale(60), 
    height: scale(60), 
    borderRadius: scale(30), 
    backgroundColor: 'rgba(255, 68, 68, 0.1)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: verticalScale(15) 
  },
  modalTitle: { 
    color: 'white', 
    fontSize: moderateScale(18), 
    fontWeight: '700', 
    marginBottom: verticalScale(8) 
  },
  modalSubtitle: { 
    color: '#AAA', 
    fontSize: moderateScale(14), 
    textAlign: 'center', 
    lineHeight: verticalScale(18), 
    marginBottom: verticalScale(20) 
  },
  modalActionRow: { 
    flexDirection: 'row', 
    gap: scale(12) 
  },
  cancelBtn: { 
    flex: 1, 
    backgroundColor: '#333', 
    paddingVertical: verticalScale(12), 
    borderRadius: moderateScale(10), 
    alignItems: 'center' 
  },
  cancelBtnText: { 
    color: 'white', 
    fontWeight: '600' 
  },
  confirmClearBtn: { 
    flex: 2, 
    backgroundColor: '#FF4444', 
    paddingVertical: verticalScale(12), 
    borderRadius: moderateScale(10), 
    alignItems: 'center' 
  },
  confirmClearText: { 
    color: 'white', 
    fontWeight: '700' 
  },
  cardWrapper: { 
    marginBottom: verticalScale(0) 
  },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: moderateScale(12) 
  },
  underline: { 
    height: 1, 
    backgroundColor: '#222' 
  },
  imageBox: { 
    width: scale(65), 
    height: scale(65), 
    borderRadius: moderateScale(10), 
    backgroundColor: '#1A1A1A', 
    marginRight: scale(12), 
    overflow: 'hidden' 
  },
  image: { 
    width: '100%', 
    height: '100%' 
  },
  details: { 
    flex: 1 
  },
  itemName: { 
    fontSize: moderateScale(15), 
    fontWeight: '600', 
    color: '#E9C351', 
    marginBottom: 2 
  },
  price: { 
    color: 'white', 
    fontSize: moderateScale(16), 
    fontWeight: '700' 
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(8),
    backgroundColor: '#1A1A1A',
    alignSelf: 'flex-start',
    borderRadius: moderateScale(6),
    borderWidth: 1,
    borderColor: '#333',
  },
  qtyBtn: { 
    padding: moderateScale(6), 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  qtyValueBox: { 
    paddingHorizontal: scale(10), 
    minWidth: scale(30), 
    alignItems: 'center' 
  },
  qtyValueText: { 
    color: 'white', 
    fontSize: moderateScale(14), 
    fontWeight: '700' 
  },
  trashBtn: {
    padding: moderateScale(8)
  },
  summaryBox: { 
    backgroundColor: '#161616', 
    padding: moderateScale(16), 
    marginTop: verticalScale(20), 
    borderRadius: moderateScale(12), 
    marginBottom: verticalScale(30) 
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: verticalScale(12),
  },
  couponInput: {
    flex: 1,
    backgroundColor: '#222',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: moderateScale(8),
    color: '#fff',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(8),
  },
  couponBtn: {
    backgroundColor: '#ADE406',
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(9),
  },
  couponBtnText: {
    color: '#000',
    fontWeight: '800',
  },
  removeCouponText: {
    color: '#FFB84D',
    marginBottom: verticalScale(8),
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: verticalScale(8) 
  },
  summaryLabel: { 
    color: '#888', 
    fontSize: moderateScale(13) 
  },
  summaryValue: { 
    color: 'white', 
    fontSize: moderateScale(13), 
    fontWeight: '500' 
  },
  totalRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderTopWidth: 1, 
    borderTopColor: '#333', 
    marginTop: verticalScale(10), 
    paddingTop: verticalScale(12) 
  },
  totalText: { 
    color: 'white', 
    fontSize: moderateScale(18), 
    fontWeight: '800' 
  },
  emptyBox: { 
    flex: 0.8, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emptyText: { 
    color: '#AAA', 
    fontSize: moderateScale(16), 
    fontWeight: '600',
    marginTop: verticalScale(10)
  },
  shopNowBtn: {
    marginTop: verticalScale(20),
    backgroundColor: '#ADE406',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(30),
    borderRadius: moderateScale(25)
  },
  shopNowText: {
    color: '#000',
    fontWeight: '700',
    fontSize: moderateScale(14)
  }
});
