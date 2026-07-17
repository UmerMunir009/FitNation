import api from './axiosInstance';

interface AddToCartPayload {
  item_type: 'product';
  product_id: string;
  quantity: number;
}

export const addSupplementToCart = async (itemType: 'product',productId: string,quantity: number) => {
  try {
    const payload: AddToCartPayload = {
      item_type: itemType,
      product_id: productId,
      quantity,
    };

    const response = await api.post('/api/v1/cart/add', payload);
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};


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


export const addPlanToCartApi = async (planId: string | number) => {
  try {
    const payload = {
      item_type: "plan",
      plan_id: planId.toString(), 
      quantity: 1
    };

    const response = await api.post('/api/v1/cart/add', payload);
    return response.data;
  } catch (error) {
    console.error('Error adding plan to cart:', error);
    throw error;
  }
};

export const removeCartItemApi = async (itemId: number) => {
  try {
    const response = await api.delete(`/api/v1/cart/remove/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};