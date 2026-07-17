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

export const updateUserStatusApi = async (status: string) => {
  const response = await api.post(
    '/api/v1/update-status',
    toFormData({ status }),
    multipartConfig,
  );
  return response.data;
};

export const getConversationsApi = async (params = {}) => {
  const response = await api.get('/api/v1/chat/conversations', { params });
  return response.data;
};

export const getConversationDetailApi = async (
  conversationId: string | number,
) => {
  const response = await api.get(
    `/api/v1/chat/conversations/${conversationId}`,
  );
  return response.data;
};

export const deleteConversationApi = async (
  conversationId: string | number,
) => {
  const response = await api.delete(
    `/api/v1/chat/conversations/${conversationId}`,
  );
  return response.data;
};

export const createPrivateConversationApi = async (
  userId: string | number,
) => {
  const response = await api.post(
    '/api/v1/chat/conversations',
    toFormData({ user_id: userId }),
    multipartConfig,
  );
  return response.data;
};

export const sendMessageApi = async (payload: Record<string, any>) => {
  const response = await api.post(
    '/api/v1/chat/send-message',
    toFormData(payload),
    multipartConfig,
  );
  return response.data;
};

export const setTypingIndicatorApi = async (
  conversationId: string | number,
  isTyping: boolean,
) => {
  const response = await api.post(
    `/api/v1/chat/conversations/${conversationId}/typing`,
    toFormData({ is_typing: isTyping ? 1 : 0 }),
    multipartConfig,
  );
  return response.data;
};

export const searchChatUsersApi = async (search: string) => {
  const response = await api.get('/api/v1/chat/search-users', {
    params: { search },
  });
  return response.data;
};

export const uploadChatFileApi = async (file: any) => {
  const response = await api.post(
    '/api/v1/chat/upload-file',
    toFormData({ file }),
    multipartConfig,
  );
  return response.data;
};

export const uploadChatImageApi = async (image: any) => {
  const response = await api.post(
    '/api/v1/chat/upload-image',
    toFormData({ image }),
    multipartConfig,
  );
  return response.data;
};
