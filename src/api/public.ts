import api from './axiosInstance';

interface GetMealsParams {
  page: number;
  perPage: number;
  type?: string;
  sortBy?: string;
  featured?: boolean;
  limit?: number;
  [key: string]: any;
}
interface GetProductsParams {
  page: number;
  perPage: number;
  featured?: boolean;
  sortBy?: string;
  [key: string]: any;
}

interface GetFitnessProgramParams {
  page: number;
  perPage: number;
  plan_category?: string;
  fitness_goal?: string;
  [key: string]: any;
}

const normalizeParams = ({ perPage, sortBy, ...params }: any = {}) => ({
  ...params,
  ...(perPage ? { per_page: perPage } : {}),
  ...(sortBy ? { sort_by: sortBy } : {}),
});

export const getCategories = async (params = {}) => {
  const response = await api.get('/api/v1/categories', {
    params: normalizeParams(params),
  });
  return response.data;
};

export const getActiveCategories = async () => {
  const response = await api.get('/api/v1/categories/active');
  return response.data;
};

export const getCategoryDetail = async (categoryId: string | number) => {
  const response = await api.get(`/api/v1/categories/${categoryId}`);
  return response.data;
};

export const getMeals = async (params: GetMealsParams) => {
  try {
    const response = await api.get('/api/v1/meals', {
      params: normalizeParams(params),
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }
};

export const getActiveMeals = async (params = {}) => {
  const response = await api.get('/api/v1/meals/active', {
    params: normalizeParams(params),
  });
  return response.data;
};

export const getMealsByCategory = async (category: string | number) => {
  const response = await api.get(`/api/v1/meals/category/${category}`);
  return response.data;
};

export const getFeaturedMeals = async (limit = 10) => {
  const response = await api.get('/api/v1/meals/featured', {
    params: { limit },
  });
  return response.data;
};

export const getMealDetail = async (mealId: string | number) => {
  const response = await api.get(`/api/v1/meals/${mealId}`);
  return response.data;
};


export const getProducts = async (params: GetProductsParams) => {
  try {
    const response = await api.get('/api/v1/products', {
      params: normalizeParams(params),
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }
};

export const getProductsByCategory = async (
  categoryId: string | number,
  params = {},
) => {
  const response = await api.get(`/api/v1/products/category/${categoryId}`, {
    params: normalizeParams(params),
  });
  return response.data;
};

export const getActiveProducts = async (params = {}) => {
  const response = await api.get('/api/v1/products/active', {
    params: normalizeParams(params),
  });
  return response.data;
};

export const getFeaturedProducts = async (limit = 10) => {
  const response = await api.get('/api/v1/products/featured', {
    params: { limit },
  });
  return response.data;
};

export const getProductDetail = async (productId: string | number) => {
  const response = await api.get(`/api/v1/products/${productId}`);
  return response.data;
};

export const getSupplements = async (params = {}) => {
  const response = await api.get('/api/v1/supplements', {
    params: normalizeParams(params),
  });
  return response.data;
};

export const getFeaturedSupplements = async (limit = 10) => {
  const response = await api.get('/api/v1/supplements/featured', {
    params: { limit },
  });
  return response.data;
};

export const getSupplementsByType = async (type: string) => {
  const response = await api.get(`/api/v1/supplements/type/${type}`);
  return response.data;
};

export const getSupplementDetail = async (supplementId: string | number) => {
  const response = await api.get(`/api/v1/supplements/${supplementId}`);
  return response.data;
};

export const getFitnessPrograms = async (params: GetFitnessProgramParams) => {
  try {
    const response = await api.get('/api/v1/plans', {
      params: normalizeParams(params),
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }
};

export const getPlansByType = async (type: string) => {
  const response = await api.get(`/api/v1/plans/type/${type}`);
  return response.data;
};

export const getFeaturedPlans = async (limit = 10) => {
  const response = await api.get('/api/v1/plans/featured', {
    params: { limit },
  });
  return response.data;
};

export const getPlansByGoal = async (goal: string) => {
  const response = await api.get(`/api/v1/plans/goal/${goal}`);
  return response.data;
};

export const getPlanDetail = async (planId: string | number) => {
  const response = await api.get(`/api/v1/plans/${planId}`);
  return response.data;
};

export const getWorkouts = async (params = {}) => {
  const response = await api.get('/api/v1/workouts', {
    params: normalizeParams(params),
  });
  return response.data;
};

export const getWorkoutsByCategory = async (categoryId: string | number) => {
  const response = await api.get(`/api/v1/workouts/category/${categoryId}`);
  return response.data;
};

export const getWorkoutDetail = async (workoutId: string | number) => {
  const response = await api.get(`/api/v1/workouts/${workoutId}`);
  return response.data;
};
    
     
