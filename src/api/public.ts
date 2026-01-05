import api from './axiosInstance';

interface GetMealsParams {
  page: number;
  perPage: number;
}
interface GetProductsParams {
  page: number;
  perPage: number;
}

interface GetFitnessProgramParams {
  page: number;
  perPage: number;
}

export const getMeals = async ({ page, perPage }: GetMealsParams) => {
  try {
    const response = await api.get('/api/v1/meals', {
      params: {
        page,
        per_page: perPage,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }
};


export const getProducts = async ({ page, perPage }: GetProductsParams) => {
  try {
    const response = await api.get('/api/v1/products', {
      params: {
        page,
        per_page: perPage,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }
};

export const getFitnessPrograms = async ({ page, perPage }: GetFitnessProgramParams) => {
  try {
    const response = await api.get('/api/v1/plans', {
      params: {
        page,
        per_page: perPage,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }
};
    
     