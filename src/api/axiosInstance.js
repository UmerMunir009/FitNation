import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://fitnessapp.alrazitutors.com', 
  timeout: 10000,
});

const serializePayload = payload => {
  if (!payload) return payload;

  if (payload._parts) {
    return payload._parts.reduce((acc, [key, value]) => {
      acc[key] =
        value && typeof value === 'object' && value.uri
          ? {
              name: value.name,
              type: value.type,
              uri: value.uri,
            }
          : value;
      return acc;
    }, {});
  }

  return payload;
};

const sanitizeHeaders = headers => {
  const normalized = { ...headers };
  if (normalized.Authorization) {
    normalized.Authorization = 'Bearer ***';
  }
  if (normalized.authorization) {
    normalized.authorization = 'Bearer ***';
  }
  return normalized;
};

const getFullUrl = config => {
  const baseURL = config.baseURL || '';
  const url = config.url || '';
  const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

  if (!config.params || !Object.keys(config.params).length) {
    return fullUrl;
  }

  const query = Object.entries(config.params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join('&');

  return query ? `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}${query}` : fullUrl;
};

// Automatically add token to headers before every request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('API REQUEST', {
      method: config.method?.toUpperCase(),
      url: getFullUrl(config),
      headers: sanitizeHeaders(config.headers),
      params: config.params || null,
      body: serializePayload(config.data),
    });

    return config;
  },
  error => {
    console.log('API REQUEST ERROR', {
      message: error.message,
      config: error.config
        ? {
            method: error.config.method?.toUpperCase(),
            url: getFullUrl(error.config),
            body: serializePayload(error.config.data),
          }
        : null,
    });
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    console.log('API RESPONSE', {
      method: response.config?.method?.toUpperCase(),
      url: getFullUrl(response.config || {}),
      status: response.status,
      statusText: response.statusText,
      body: response.data,
    });
    return response;
  },
  error => {
    console.log('API RESPONSE ERROR', {
      method: error.config?.method?.toUpperCase(),
      url: error.config ? getFullUrl(error.config) : undefined,
      status: error.response?.status,
      statusText: error.response?.statusText,
      requestBody: serializePayload(error.config?.data),
      responseBody: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  },
);

export default api;
