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

export const getActivePartnersApi = async (params = {}) => {
  const response = await api.get('/api/v1/partners/active', { params });
  return response.data;
};

export const getFeaturedPartnersApi = async (limit = 6) => {
  const response = await api.get('/api/v1/partners/featured', {
    params: { limit },
  });
  return response.data;
};

export const getNearbyPartnersApi = async (params: Record<string, unknown>) => {
  const response = await api.get('/api/v1/partners/nearby', { params });
  return response.data;
};

export const getPartnerDetailApi = async (partnerId: string | number) => {
  const response = await api.get(`/api/v1/partners/${partnerId}`, {
    params: { with: 'galleryImages' },
  });
  return response.data;
};

export const getPartnersAdminApi = async (params = {}) => {
  const response = await api.get('/api/v1/partners', { params });
  return response.data;
};

export const createPartnerApi = async (payload: Record<string, any>) => {
  const response = await api.post(
    '/api/v1/partners',
    toFormData(payload),
    multipartConfig,
  );
  return response.data;
};

export const updatePartnerApi = async (
  partnerId: string | number,
  payload: Record<string, any>,
) => {
  const response = await api.post(
    `/api/v1/partners/${partnerId}`,
    toFormData({ _method: 'PUT', ...payload }),
    multipartConfig,
  );
  return response.data;
};

export const deletePartnerApi = async (partnerId: string | number) => {
  const response = await api.delete(`/api/v1/partners/${partnerId}`);
  return response.data;
};

export const getPartnerGalleryApi = async (partnerId: string | number) => {
  const response = await api.get(`/api/v1/partners/${partnerId}/gallery`);
  return response.data;
};

export const addPartnerGalleryImagesApi = async (
  partnerId: string | number,
  galleryImages: any[],
) => {
  const formData = new FormData();
  galleryImages.forEach(image => formData.append('gallery_images[]', image));
  const response = await api.post(
    `/api/v1/partners/${partnerId}/gallery`,
    formData,
    multipartConfig,
  );
  return response.data;
};

export const deletePartnerGalleryImageApi = async (
  partnerId: string | number,
  imageId: string | number,
) => {
  const response = await api.delete(
    `/api/v1/partners/${partnerId}/gallery/${imageId}`,
  );
  return response.data;
};

export const setPartnerFeaturedImageApi = async (
  partnerId: string | number,
  imageId: string | number,
) => {
  const response = await api.patch(
    `/api/v1/partners/${partnerId}/gallery/${imageId}/featured`,
  );
  return response.data;
};

export const togglePartnerStatusApi = async (partnerId: string | number) => {
  const response = await api.patch(`/api/v1/partners/${partnerId}/toggle-status`);
  return response.data;
};

export const togglePartnerFeaturedApi = async (partnerId: string | number) => {
  const response = await api.patch(
    `/api/v1/partners/${partnerId}/toggle-featured`,
  );
  return response.data;
};

export const togglePartnerVerifiedApi = async (partnerId: string | number) => {
  const response = await api.patch(
    `/api/v1/partners/${partnerId}/toggle-verified`,
  );
  return response.data;
};

export const updatePartnerRatingApi = async (
  partnerId: string | number,
  rating: number,
) => {
  const response = await api.post(`/api/v1/partners/${partnerId}/rating`, {
    rating,
  });
  return response.data;
};

export const getPartnersStatisticsApi = async () => {
  const response = await api.get('/api/v1/partners/statistics');
  return response.data;
};

export const exportPartnersApi = async (status = 'active') => {
  const response = await api.get('/api/v1/partners/export', {
    params: { status },
  });
  return response.data;
};

export const bulkUpdatePartnerStatusApi = async (
  ids: Array<string | number>,
  status: boolean,
) => {
  const response = await api.post('/api/v1/partners/bulk-status-update', {
    ids,
    status,
  });
  return response.data;
};

export const bulkDeletePartnersApi = async (ids: Array<string | number>) => {
  const response = await api.post('/api/v1/partners/bulk-delete', { ids });
  return response.data;
};

export const restorePartnerApi = async (partnerId: string | number) => {
  const response = await api.post(`/api/v1/partners/${partnerId}/restore`);
  return response.data;
};

export const forceDeletePartnerApi = async (partnerId: string | number) => {
  const response = await api.delete(`/api/v1/partners/${partnerId}/force`);
  return response.data;
};
