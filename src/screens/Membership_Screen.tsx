import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { screenTopPadding } from '../theme/layout';
import {
  cancelMembershipApi,
  checkMembershipAccessApi,
  getMyMembershipsApi,
  reactivateMembershipApi,
  renewMembershipApi,
  toggleAutoRenewApi,
} from '../api/memberships';
import { showErrorToast, showSuccessToast } from '../utils/toast';

const unwrapList = (payload: any) => {
  const data = payload?.data?.data || payload?.data?.memberships || payload?.data || payload;
  return Array.isArray(data) ? data : [];
};

const MembershipScreen = () => {
  const navigation = useNavigation<any>();
  const [memberships, setMemberships] = useState<any[]>([]);
  const [access, setAccess] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | number | null>(null);

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const [accessResponse, membershipsResponse] = await Promise.all([
        checkMembershipAccessApi(),
        getMyMembershipsApi({ page: 1 }),
      ]);
      setAccess(accessResponse?.data || accessResponse);
      setMemberships(unwrapList(membershipsResponse));
    } catch (error) {
      showErrorToast('Could not load memberships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const runAction = async (
    id: string | number,
    action: () => Promise<any>,
    message: string,
  ) => {
    setActingId(id);
    try {
      await action();
      showSuccessToast(message);
      fetchMemberships();
    } catch (error: any) {
      showErrorToast(error.response?.data?.message || 'Action failed');
    } finally {
      setActingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Membership</Text>
        <View style={{ width: 24 }} />
      </View>

      {access && (
        <View style={styles.accessBox}>
          <Text style={styles.accessTitle}>Access</Text>
          <Text style={styles.accessText}>
            {access.has_access || access.allowed ? 'Active' : 'Limited'}
          </Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ADE406" />
        </View>
      ) : (
        <FlatList
          data={memberships}
          keyExtractor={item => String(item.id || item.guid)}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No memberships found.</Text>
          }
          renderItem={({ item }) => {
            const id = item.id || item.guid;
            const busy = actingId === id;
            const status = String(item.status || item.status_label || '').toLowerCase();
            const isCancelled = status.includes('cancel');
            return (
              <View style={styles.card}>
                <Text style={styles.name}>
                  {item.membership_type || item.type || 'Membership'}
                </Text>
                <Text style={styles.meta}>Status: {item.status_label || item.status || 'N/A'}</Text>
                <Text style={styles.meta}>
                  Ends: {item.ends_at || item.end_date || item.expires_at || 'N/A'}
                </Text>

                <View style={styles.switchRow}>
                  <Text style={styles.meta}>Auto renew</Text>
                  <Switch
                    value={!!item.is_auto_renew}
                    onValueChange={value =>
                      runAction(
                        id,
                        () => toggleAutoRenewApi(id, value),
                        'Auto renew updated',
                      )
                    }
                    thumbColor="#ADE406"
                  />
                </View>

                {busy ? (
                  <ActivityIndicator size="small" color="#ADE406" />
                ) : (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() =>
                        runAction(id, () => renewMembershipApi(id, 30), 'Membership renewed')
                      }
                    >
                      <Text style={styles.actionText}>Renew</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() =>
                        isCancelled
                          ? runAction(
                              id,
                              () => reactivateMembershipApi(id),
                              'Membership reactivated',
                            )
                          : runAction(
                              id,
                              () => cancelMembershipApi(id, 'Cancelled from mobile app'),
                              'Membership cancelled',
                            )
                      }
                    >
                      <Text style={styles.actionText}>
                        {isCancelled ? 'Reactivate' : 'Cancel'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default MembershipScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    paddingHorizontal: moderateScale(14),
    paddingTop: screenTopPadding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  headerTitle: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  accessBox: {
    backgroundColor: '#1c1c1c',
    borderRadius: moderateScale(10),
    padding: moderateScale(14),
    marginBottom: verticalScale(14),
  },
  accessTitle: {
    color: '#999',
  },
  accessText: {
    color: '#ADE406',
    fontSize: moderateScale(20),
    fontWeight: '800',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: verticalScale(80),
  },
  card: {
    backgroundColor: '#1c1c1c',
    borderRadius: moderateScale(12),
    padding: moderateScale(14),
    marginBottom: verticalScale(12),
  },
  name: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  meta: {
    color: '#aaa',
    marginTop: verticalScale(5),
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: verticalScale(10),
  },
  actions: {
    flexDirection: 'row',
    gap: scale(10),
    marginTop: verticalScale(12),
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#ADE406',
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(8),
    alignItems: 'center',
  },
  actionText: {
    color: '#000',
    fontWeight: '800',
  },
});
