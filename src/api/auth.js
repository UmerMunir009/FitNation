import api from './axiosInstance';

const toFormData = data => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, value);
    }
  });
  return formData;
};

const multipartConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

export const loginApi = async (email, password) => {
  const response = await api.post('/api/v1/auth/login', { email, password });

  return response.data;
};

export const registerApi = async (name, email, password, confirmPassword) => {
  const response = await api.post('/api/v1/auth/register', {
    name,
    email,
    password,
    password_confirmation: confirmPassword,
    terms_accepted: true,
  });

  return response.data;
};

export const forgotPasswordApi = async email => {
  const response = await api.post('/api/v1/auth/forgot-password', { email });

  return response.data;
};

export const verifyOTPApi = async (email, otp) => {
  const response = await api.post('/api/v1/auth/verify-otp', { email, otp });
  return response.data;
};

export const resendOTPApi = async email => {
  const response = await api.post('/api/v1/auth/resend-otp', { email });
  return response.data;
};

export const resetPasswordApi = async (email, otp, password, newPassword) => {
  const response = await api.post('/api/v1/auth/reset-password', {
    email,
    otp,
    password,
    password_confirmation: newPassword,
  });
  return response.data;
};

export const getProfileApi = async () => {
  const response = await api.get('/api/v1/auth/profile');
  return response.data;
};

export const updateProfileApi = async profile => {
  const response = await api.post(
    '/api/v1/auth/profile/update',
    toFormData({
      ...profile,
      is_profile: profile?.is_profile ?? 1,
    }),
    multipartConfig,
  );
  return response.data;
};

export const changePasswordApi = async (
  currentPassword,
  newPassword,
  confirmPassword,
) => {
  const response = await api.post('/api/v1/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
    new_password_confirmation: confirmPassword,
  });
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post('/api/v1/auth/logout');
  return response.data;
};
