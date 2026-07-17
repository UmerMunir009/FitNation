import api from './axiosInstance';

export const getUserSubscriptionsApi = async (userId: string | number) => {
  const response = await api.get(`/api/v1/plan-subscriptions/user/${userId}`);
  return response.data;
};

export const subscribeToPlanApi = async (payload: Record<string, unknown>) => {
  const response = await api.post('/api/v1/plan-subscriptions', payload);
  return response.data;
};

export const cancelPlanSubscriptionApi = async (
  subscriptionId: string | number,
) => {
  const response = await api.patch(
    `/api/v1/plan-subscriptions/${subscriptionId}/cancel`,
  );
  return response.data;
};

export const getWorkoutProgressApi = async () => {
  const response = await api.get('/api/v1/user/workout-progress');
  return response.data;
};

export const logWorkoutApi = async (payload: Record<string, unknown>) => {
  const response = await api.post('/api/v1/user/workout-progress', payload);
  return response.data;
};

export const getUserMealPlansApi = async () => {
  const response = await api.get('/api/v1/user/meal-plans');
  return response.data;
};

export const getTodayMealsApi = async () => {
  const response = await api.get('/api/v1/user/today-meals');
  return response.data;
};

export const getWishlistApi = async () => {
  const response = await api.get('/api/v1/user/wishlist');
  return response.data;
};

export const addToWishlistApi = async (
  itemId: string | number,
  type = 'product',
) => {
  const response = await api.post('/api/v1/user/wishlist', {
    [`${type}_id`]: itemId,
    type,
  });
  return response.data;
};

export const removeFromWishlistApi = async (itemId: string | number) => {
  const response = await api.delete(`/api/v1/user/wishlist/${itemId}`);
  return response.data;
};
