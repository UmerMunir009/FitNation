import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { ChevronLeft, Check } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { screenTopPadding } from '../theme/layout';
import { getFitnessPrograms } from '../api/public';
import {
  cancelPlanSubscriptionApi,
  getUserSubscriptionsApi,
  subscribeToPlanApi,
} from '../api/user';
import { showErrorToast, showSuccessToast } from '../utils/toast';

const unwrapList = (payload: any) => {
  const data = payload?.data?.data || payload?.data || payload;
  return Array.isArray(data) ? data : [];
};

const SubscriptionScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useContext(AuthContext);
  const [plans, setPlans] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | number | null>(null);

  const userId = user?.id || user?.user?.id || user?.guid;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [plansResponse, subscriptionsResponse] = await Promise.all([
        getFitnessPrograms({ page: 1, perPage: 20, featured: true }),
        userId ? getUserSubscriptionsApi(userId) : Promise.resolve([]),
      ]);
      setPlans(unwrapList(plansResponse));
      setSubscriptions(unwrapList(subscriptionsResponse));
    } catch (error) {
      showErrorToast('Could not load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const isSubscribed = (plan: any) =>
    subscriptions.find((sub: any) => {
      const subPlanId = sub.plan_id || sub.plan?.id || sub.plan?.guid;
      return String(subPlanId) === String(plan.guid || plan.id);
    });

  const handleSubscribe = async (plan: any) => {
    if (!userId) {
      showErrorToast('User profile not loaded');
      return;
    }
    const planId = plan.guid || plan.id;
    setActingId(planId);
    try {
      await subscribeToPlanApi({
        user_id: userId,
        plan_id: planId,
        start_date: new Date().toISOString().slice(0, 10),
        amount_paid: Number(plan.current_price || plan.price || 0),
        payment_method: 'mobile_app',
        status: 'active',
        current_week: 1,
        progress_data: {},
      });
      showSuccessToast('Subscribed successfully');
      fetchData();
    } catch (error: any) {
      showErrorToast(error.response?.data?.message || 'Subscription failed');
    } finally {
      setActingId(null);
    }
  };

  const handleCancel = async (subscription: any) => {
    const id = subscription.id || subscription.guid;
    setActingId(id);
    try {
      await cancelPlanSubscriptionApi(id);
      showSuccessToast('Subscription cancelled');
      fetchData();
    } catch (error: any) {
      showErrorToast(error.response?.data?.message || 'Could not cancel');
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
        <Text style={styles.headerTitle}>Plans & Pricing</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#83AD03" />
        </View>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={item => String(item.guid || item.id)}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No plans found.</Text>}
          contentContainerStyle={{ paddingBottom: verticalScale(30) }}
          renderItem={({ item: plan }) => {
            const subscription = isSubscribed(plan);
            const actionId = subscription?.id || subscription?.guid || plan.guid || plan.id;
            const busy = actingId === actionId;
            return (
              <View style={[styles.planCard, plan.is_popular && styles.popularPlanCard]}>
                {plan.is_popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                  </View>
                )}

                <View style={{ marginBottom: verticalScale(10) }}>
                  <Text style={[styles.priceText, plan.is_popular && { color: '#000' }]}>
                    {plan.currency || 'Rs.'} {plan.current_price || plan.price}
                    <Text style={[styles.perMonthText, plan.is_popular && { color: '#666' }]}>
                      {plan.billing_cycle ? ` /${plan.billing_cycle}` : ''}
                    </Text>
                  </Text>
                  <Text style={[styles.planName, plan.is_popular && { color: '#000' }]}>
                    {plan.title}
                  </Text>
                  <Text style={[styles.planDesc, plan.is_popular && { color: '#555' }]}>
                    {plan.short_description || plan.description}
                  </Text>
                </View>

                {(plan.available_features || plan.features || []).slice(0, 6).map((feature: any, i: number) => (
                  <View key={i} style={styles.featureRow}>
                    <Check size={16} color={plan.is_popular ? '#83AD03' : '#c0f000'} />
                    <Text style={[styles.featureText, plan.is_popular && { color: '#333' }]}>
                      {typeof feature === 'string' ? feature : feature.label || feature.name}
                    </Text>
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.chooseButton}
                  disabled={busy}
                  onPress={() =>
                    subscription ? handleCancel(subscription) : handleSubscribe(plan)
                  }
                >
                  {busy ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <Text style={styles.chooseButtonText}>
                      {subscription ? 'Cancel Subscription' : 'Choose Plan'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: moderateScale(14),
    paddingTop: screenTopPadding,
    paddingBottom: verticalScale(45),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  headerTitle: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: '700',
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
  planCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: verticalScale(14),
  },
  popularPlanCard: {
    backgroundColor: '#fff',
    borderColor: '#83AD03',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    backgroundColor: '#83AD03',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(3),
    borderRadius: 20,
  },
  popularBadgeText: {
    color: '#000',
    fontSize: moderateScale(10),
    fontWeight: '700',
  },
  priceText: {
    color: '#83AD03',
    fontSize: moderateScale(28),
    fontWeight: '900',
  },
  perMonthText: {
    color: '#aaa',
    fontSize: moderateScale(12),
    fontWeight: '400',
  },
  planName: {
    color: '#83AD03',
    fontSize: moderateScale(22),
    fontWeight: '700',
    marginBottom: verticalScale(4),
    marginTop: verticalScale(12),
  },
  planDesc: {
    color: '#aaa',
    fontSize: moderateScale(12),
    lineHeight: 18,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    marginBottom: verticalScale(6),
  },
  featureText: {
    color: '#ccc',
    fontSize: moderateScale(13),
  },
  chooseButton: {
    backgroundColor: '#83AD03',
    paddingVertical: verticalScale(10),
    borderRadius: 50,
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  chooseButtonText: {
    color: '#000',
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
});
