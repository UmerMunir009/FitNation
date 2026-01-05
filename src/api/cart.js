import api from './axiosInstance';


export const addSupplementToCart = async (item_type, product_id,quantity) => {
  const response = await api.post('/api/v1/cart/add', {item_type,product_id,quantity});

  return response.data;
};