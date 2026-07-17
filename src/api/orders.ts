import api from './axiosInstance';

export const checkoutApi = async (payload: Record<string, unknown>) => {
  const response = await api.post('/api/v1/orders/checkout', payload);
  return response.data;
};

export const getMyOrdersApi = async (params = {}) => {
  const response = await api.get('/api/v1/orders/my-orders', { params });
  return response.data;
};

export const getOrderStatisticsApi = async (period = 'month') => {
  const response = await api.get('/api/v1/orders/statistics', {
    params: { period },
  });
  return response.data;
};

export const getOrderDetailApi = async (orderId: string | number) => {
  const response = await api.get(`/api/v1/orders/${orderId}`);
  return response.data;
};

export const cancelOrderApi = async (orderId: string | number, reason: string) => {
  const response = await api.post(`/api/v1/orders/${orderId}/cancel`, {
    reason,
  });
  return response.data;
};

export const trackOrderApi = async (orderNumber: string) => {
  const response = await api.get(`/api/v1/orders/track/${orderNumber}`);
  return response.data;
};

export const verifyPaymentApi = async (
  orderNumber: string,
  transactionId: string,
) => {
  const response = await api.post('/api/v1/orders/verify', {
    order_number: orderNumber,
    transaction_id: transactionId,
  });
  return response.data;
};
