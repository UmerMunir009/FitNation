import api from './axiosInstance';

export const loginApi = async (email, password) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  const response = await api.post('/api/v1/auth/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log(response)

  return response.data;
};

export const registerApi = async (name, email, password, confirmPassword) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('password_confirmation', confirmPassword);
  formData.append('terms_accepted', 1);

  const response = await api.post('/api/v1/auth/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const forgotPasswordApi = async email => {
  const formData = new FormData();
  formData.append('email', email);

  const response = await api.post('/api/v1/auth/forgot-password', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const verifyOTPApi = async (email,otp) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('otp', otp);

  const response = await api.post('/api/v1/auth/verify-otp', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const resetPasswordApi = async (email,otp,password,newPassword) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('otp', otp);
  formData.append('password', password);
  formData.append('password_confirmation', newPassword);

  const response = await api.post('/api/v1/auth/reset-password', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getProfileApi = async () => {
  const response = await api.get('/profile');
  return response.data;
};
