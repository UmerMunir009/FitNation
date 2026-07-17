import api from './axiosInstance';

interface AddToCartPayload {
  item_type: 'product' | 'meal' | 'plan';
  product_id?: string;
  meal_id?: string;
  plan_id?: string;
  quantity: number;
  options?: Record<string, unknown>;
}

export const addItemToCartApi = async (payload: AddToCartPayload) => {
  try {
    const response = await api.post('/api/v1/cart/add', payload);
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

export const addItemToCartFormApi = async (payload: AddToCartPayload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(
        key,
        typeof value === 'object' ? JSON.stringify(value) : String(value),
      );
    }
  });
  const response = await api.post('/api/v1/cart/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const addSupplementToCart = async (
  itemType: 'product',
  productId: string,
  quantity: number,
) => addItemToCartApi({ item_type: itemType, product_id: productId, quantity });

export const addMealToCartApi = async (mealId: string | number, quantity = 1) =>
  addItemToCartFormApi({
    item_type: 'meal',
    meal_id: mealId.toString(),
    quantity,
  });


export const getCartApi = async () => {
  const res = await api.get('/api/v1/cart');
  return res.data;
};

export const clearCartApi = async () => {
  try {
    console.log('DELETING CART')
    const response = await api.delete('/api/v1/cart/clear');
    console.log(response.data)
    return response.data;

  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};


export const getCartSummaryApi = async () => {
  try {
    const response = await api.get('/api/v1/cart/summary');
    return response.data; 
  } catch (error) {
    console.error("Error fetching cart summary:", error);
    throw error;
  }
};


export const updateCartItemApi = async (itemId: number, quantity: number) => {
  return api.put(`/api/v1/cart/update/${itemId}`, { quantity });
};


export const addPlanToCartApi = async (planId: string | number, quantity = 1) =>
  addItemToCartApi({
    item_type: 'plan',
    plan_id: planId.toString(),
    quantity,
  });

export const removeCartItemApi = async (itemId: number) => {
  try {
    const response = await api.delete(`/api/v1/cart/remove/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};

export const applyCouponApi = async (couponCode: string) => {
  const response = await api.post('/api/v1/cart/apply-coupon', {
    coupon_code: couponCode,
  });
  return response.data;
};

export const removeCouponApi = async () => {
  const response = await api.delete('/api/v1/cart/remove-coupon');
  return response.data;
};
