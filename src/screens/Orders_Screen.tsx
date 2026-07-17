import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { screenTopPadding } from '../theme/layout';
import {
  cancelOrderApi,
  getOrderDetailApi,
  getMyOrdersApi,
  getOrderStatisticsApi,
  trackOrderApi,
} from '../api/orders';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import RemoteImage from '../components/RemoteImage';

type OrderItem = {
  id: number | string;
  name: string;
  price: number;
  status: string;
  image?: string;
};

type Order = {
  id: string;
  orderNumber: string;
  total: number;
  date: string;
  status?: string;
  items: OrderItem[];
};

const unwrapList = (payload: any) => {
  const data = payload?.data?.data || payload?.data?.orders || payload?.data || payload;
  return Array.isArray(data) ? data : [];
};

const normalizeOrders = (payload: any): Order[] =>
  unwrapList(payload).map((order: any) => {
    const rawItems = order.items || order.order_items || order.cart_items || [];
    return {
      id: String(order.id || order.guid || order.order_number),
      orderNumber: String(order.order_number || order.number || order.id),
      total: Number(order.total || order.grand_total || order.amount || 0),
      date: order.created_at_formatted || order.created_at || order.date || '',
      status: order.status_label || order.status,
      items: (Array.isArray(rawItems) ? rawItems : []).map((item: any) => ({
        id: item.id || item.guid,
        name:
          item.name ||
          item.product?.name ||
          item.meal?.name ||
          item.plan?.title ||
          'Item',
        price: Number(item.price || item.total_price || item.subtotal || 0),
        status: String(item.status || order.status || 'PENDING').toUpperCase(),
        image: item.image_url || item.product?.image_url || item.meal?.image_url,
      })),
    };
  });

const OrdersScreen = () => {
  const navigation = useNavigation<any>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const [ordersResponse, statsResponse] = await Promise.all([
        getMyOrdersApi({ page: 1 }),
        getOrderStatisticsApi('month'),
      ]);
      setOrders(normalizeOrders(ordersResponse));
      setStatistics(statsResponse?.data || statsResponse);
    } catch (error) {
      showErrorToast('Could not load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrderApi(orderId, 'Cancelled from mobile app');
      showSuccessToast('Order cancelled');
      fetchOrders(false);
    } catch (error: any) {
      showErrorToast(error.response?.data?.message || 'Could not cancel order');
    }
  };

  const handleOpenDetail = async (order: Order) => {
    try {
      const response = await getOrderDetailApi(order.id);
      setSelectedDetail(response?.data || response);
    } catch (error: any) {
      setSelectedDetail(order);
      showErrorToast(error.response?.data?.message || 'Showing local order detail');
    }
  };

  const handleTrackOrder = async () => {
    if (!trackingNumber.trim()) return;
    try {
      const response = await trackOrderApi(trackingNumber.trim());
      setTrackingResult(response?.data || response);
      showSuccessToast('Tracking loaded');
    } catch (error: any) {
      showErrorToast(error.response?.data?.message || 'Could not track order');
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'DELIVERED':
      case 'COMPLETED':
        return { backgroundColor: '#198754', color: '#FFF' };
      case 'CANCELLED':
        return { backgroundColor: '#DC3545', color: '#FFF' };
      case 'PENDING':
      default:
        return { backgroundColor: '#FFC107', color: '#000' };
    }
  };

  const renderOrder = ({ item: order }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>Order # {order.orderNumber}</Text>
          <Text style={styles.orderDate} numberOfLines={1}>
            Date of Purchase: {order.date || 'N/A'}
          </Text>
        </View>
        <View>
          <Text style={styles.orderTotal}>
            Total: Rs. {order.total.toLocaleString()}
          </Text>
          <Text style={styles.buyAfter}>{order.status || 'Order'}</Text>
        </View>
      </View>

      {(order.items.length ? order.items : [{ id: order.id, name: 'Order total', price: order.total, status: order.status || 'PENDING' }]).map(item => {
        const statusStyle = getStatusStyle(item.status);
        return (
          <View key={String(item.id)} style={styles.itemCard}>
            <TouchableOpacity
              style={styles.itemRow}
              onPress={() => handleOpenDetail(order)}
            >
              <RemoteImage
                sourceUri={item.image}
                style={styles.itemImage}
              />

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
                  Rs. {Number(item.price).toLocaleString()}
                </Text>
              </View>
            </TouchableOpacity>

            {item.status !== 'CANCELLED' && item.status !== 'COMPLETED' && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleCancelOrder(order.id)}
              >
                <Text style={styles.actionText}>Cancel Order</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Orders</Text>
      </View>

      {statistics && (
        <Text style={styles.statsText}>
          Orders this month:{' '}
          {statistics.total_orders || statistics.total || orders.length}
        </Text>
      )}

      <View style={styles.trackBox}>
        <TextInput
          value={trackingNumber}
          onChangeText={setTrackingNumber}
          placeholder="Track order number"
          placeholderTextColor="#777"
          style={styles.trackInput}
        />
        <TouchableOpacity style={styles.trackBtn} onPress={handleTrackOrder}>
          <Text style={styles.trackBtnText}>Track</Text>
        </TouchableOpacity>
      </View>
      {!!trackingResult && (
        <Text style={styles.trackingText}>
          Tracking: {trackingResult.status || trackingResult.status_label || 'Loaded'}
        </Text>
      )}
      {!!selectedDetail && (
        <TouchableOpacity
          style={styles.detailBox}
          onPress={() => setSelectedDetail(null)}
        >
          <Text style={styles.detailTitle}>Order Detail</Text>
          <Text style={styles.detailText}>
            {selectedDetail.order_number || selectedDetail.orderNumber || selectedDetail.id}
          </Text>
          <Text style={styles.detailText}>
            Status: {selectedDetail.status_label || selectedDetail.status || 'N/A'}
          </Text>
          <Text style={styles.detailHint}>Tap to close</Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ADE406" />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={renderOrder}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchOrders(false);
              }}
              tintColor="#ADE406"
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No orders found.</Text>
          }
          contentContainerStyle={{ paddingBottom: verticalScale(20) }}
        />
      )}
    </View>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    paddingHorizontal: moderateScale(14),
    paddingTop: screenTopPadding,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  headerText: {
    color: 'white',
    fontSize: moderateScale(20),
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginRight: scale(24),
  },
  statsText: {
    color: '#ADE406',
    marginBottom: verticalScale(10),
    fontWeight: '700',
  },
  trackBox: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: verticalScale(10),
  },
  trackInput: {
    flex: 1,
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(10),
  },
  trackBtn: {
    backgroundColor: '#ADE406',
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(16),
    justifyContent: 'center',
  },
  trackBtnText: {
    color: '#000',
    fontWeight: '800',
  },
  trackingText: {
    color: '#ADE406',
    marginBottom: verticalScale(8),
  },
  detailBox: {
    backgroundColor: '#222',
    borderRadius: moderateScale(10),
    padding: moderateScale(12),
    marginBottom: verticalScale(10),
    borderWidth: 1,
    borderColor: '#ADE406',
  },
  detailTitle: {
    color: '#fff',
    fontWeight: '800',
  },
  detailText: {
    color: '#aaa',
    marginTop: verticalScale(4),
  },
  detailHint: {
    color: '#ADE406',
    marginTop: verticalScale(6),
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: verticalScale(80),
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
