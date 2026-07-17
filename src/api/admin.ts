import api from './axiosInstance';

const toFormData = (data: Record<string, any>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, value);
    }
  });
  return formData;
};

const multipartConfig = { headers: { 'Content-Type': 'multipart/form-data' } };

export const getUserPlansApi = async (params = {}) => {
  const response = await api.get('/api/v1/auth/user-plans', { params });
  return response.data;
};

export const getUserPlanDetailApi = async (planId: string | number) => {
  const response = await api.get(`/api/v1/auth/user-plans/${planId}`);
  return response.data;
};

export const createUserPlanApi = async (payload: Record<string, any>) => {
  const response = await api.post(
    '/api/v1/auth/user-plans',
    toFormData(payload),
    multipartConfig,
  );
  return response.data;
};

export const updateUserPlanApi = async (
  planId: string | number,
  payload: Record<string, any>,
) => {
  const response = await api.post(
    `/api/v1/auth/user-plans/${planId}`,
    toFormData({ _method: 'PUT', ...payload }),
    multipartConfig,
  );
  return response.data;
};

export const deleteUserPlanApi = async (planId: string | number) => {
  const response = await api.delete(`/api/v1/auth/user-plans/${planId}`);
  return response.data;
};

export const getTraineeUsersApi = async () => {
  const response = await api.get('/api/v1/auth/trainee-users');
  return response.data;
};

export const getNutritionistUsersApi = async () => {
  const response = await api.get('/api/v1/auth/nutritionist-users');
  return response.data;
};

export const assignCoachApi = async (payload: Record<string, any>) => {
  const response = await api.post(
    '/api/v1/user/assign-coach',
    toFormData(payload),
    multipartConfig,
  );
  return response.data;
};

export const updateUserTypeApi = async (payload: Record<string, any>) => {
  const response = await api.post(
    '/api/v1/user/type',
    toFormData(payload),
    multipartConfig,
  );
  return response.data;
};

export const getUsersByTypeApi = async (userType: string) => {
  const response = await api.get('/api/v1/get_users', {
    params: { user_type: userType },
  });
  return response.data;
};

export const getAdminCategoriesApi = async (params = {}) => {
  const response = await api.get('/api/v1/auth/categories', { params });
  return response.data;
};

export const createAdminCategoryApi = async (payload: Record<string, any>) => {
  const response = await api.post(
    '/api/v1/auth/categories',
    toFormData(payload),
    multipartConfig,
  );
  return response.data;
};

export const updateAdminCategoryApi = async (
  categoryId: string | number,
  payload: Record<string, any>,
) => {
  const response = await api.post(
    `/api/v1/auth/categories/${categoryId}`,
    toFormData({ _method: 'PUT', ...payload }),
    multipartConfig,
  );
  return response.data;
};

export const deleteAdminCategoryApi = async (categoryId: string | number) => {
  const response = await api.delete(`/api/v1/auth/categories/${categoryId}`);
  return response.data;
};

export const getAdminProductsApi = async (params = {}) => {
  const response = await api.get('/api/v1/auth/products', { params });
  return response.data;
};

export const createAdminProductApi = async (payload: Record<string, any>) => {
  const response = await api.post(
    '/api/v1/auth/products',
    toFormData(payload),
    multipartConfig,
  );
  return response.data;
};

export const updateAdminProductApi = async (
  productId: string | number,
  payload: Record<string, any>,
) => {
  const response = await api.post(
    `/api/v1/auth/products/${productId}`,
    toFormData({ _method: 'PUT', ...payload }),
    multipartConfig,
  );
  return response.data;
};

export const deleteAdminProductApi = async (productId: string | number) => {
  const response = await api.delete(`/api/v1/auth/products/${productId}`);
  return response.data;
};
