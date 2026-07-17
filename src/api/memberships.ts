import api from './axiosInstance';

export const checkMembershipAccessApi = async () => {
  const response = await api.get('/api/v1/memberships/check-access');
  return response.data;
};

export const getMyMembershipsApi = async (params = {}) => {
  const response = await api.get('/api/v1/memberships/my-memberships', {
    params,
  });
  return response.data;
};

export const getMembershipStatisticsApi = async () => {
  const response = await api.get('/api/v1/memberships/statistics');
  return response.data;
};

export const subscribeToMembershipApi = async (
  payload: Record<string, unknown>,
) => {
  const response = await api.post('/api/v1/memberships/subscribe', payload);
  return response.data;
};

export const getMembershipDetailApi = async (membershipId: string | number) => {
  const response = await api.get(`/api/v1/memberships/${membershipId}`);
  return response.data;
};

export const cancelMembershipApi = async (
  membershipId: string | number,
  reason: string,
) => {
  const response = await api.post(`/api/v1/memberships/${membershipId}/cancel`, {
    reason,
  });
  return response.data;
};

export const reactivateMembershipApi = async (membershipId: string | number) => {
  const response = await api.post(
    `/api/v1/memberships/${membershipId}/reactivate`,
  );
  return response.data;
};

export const renewMembershipApi = async (
  membershipId: string | number,
  durationDays = 30,
) => {
  const response = await api.post(`/api/v1/memberships/${membershipId}/renew`, {
    duration_days: durationDays,
  });
  return response.data;
};

export const suspendMembershipApi = async (
  membershipId: string | number,
  reason: string,
) => {
  const response = await api.post(
    `/api/v1/memberships/${membershipId}/suspend`,
    { reason },
  );
  return response.data;
};

export const toggleAutoRenewApi = async (
  membershipId: string | number,
  status: boolean,
) => {
  const response = await api.post(
    `/api/v1/memberships/${membershipId}/toggle-auto-renew`,
    { status },
  );
  return response.data;
};
