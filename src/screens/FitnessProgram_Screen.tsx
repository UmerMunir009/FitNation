import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import NavBar from '../components/Navbar';
import { getPlansByGoal, getPlansByType } from '../api/public';
import { addPlanToCartApi } from '../api/cart';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import RemoteImage from '../components/RemoteImage';

type PlanType = 'ONE_TIME' | 'MEMBERSHIP';
type CategoryType = 'DIET' | 'WORKOUT';
type GoalType = 'WEIGHT_GAIN' | 'WEIGHT_LOSS' | 'MUSCLE_BUILDING';

const unwrapPlans = (payload: any) => {
  const data = payload?.data?.data || payload?.data || payload;
  return Array.isArray(data) ? data : [];
};

const FitnessProgramsScreen = ({ navigation }: any) => {
  const [selectedTab, setSelectedTab] = useState<PlanType>('ONE_TIME');
  const [selectedType, setSelectedType] = useState<CategoryType>('DIET');
  const [selectedGoal, setSelectedGoal] = useState<GoalType>('MUSCLE_BUILDING');
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | number | null>(null);

  const goalOptions = useMemo(
    () => [
      { label: 'gain', value: 'WEIGHT_GAIN' },
      { label: 'loss', value: 'WEIGHT_LOSS' },
      { label: 'muscle', value: 'MUSCLE_BUILDING' },
    ],
    [],
  );

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const [typeResponse, goalResponse] = await Promise.all([
        getPlansByType(selectedTab),
        getPlansByGoal(selectedGoal),
      ]);
      const typePlans = unwrapPlans(typeResponse);
      const goalPlans = unwrapPlans(goalResponse);
      const goalIds = new Set(goalPlans.map((plan: any) => String(plan.guid || plan.id)));
      const list = typePlans.filter((plan: any) => {
        const categoryMatches =
          !plan.plan_category ||
          String(plan.plan_category).toUpperCase() === selectedType;
        const goalMatches =
          !goalIds.size || goalIds.has(String(plan.guid || plan.id));
        return categoryMatches && goalMatches;
      });
      setPlans(list);
    } catch (error) {
      showErrorToast('Could not load fitness programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab, selectedType, selectedGoal]);

  const handleAddPlan = async (plan: any) => {
    const planId = plan.guid || plan.id;
    setAddingId(planId);
    try {
      await addPlanToCartApi(planId);
      showSuccessToast('Plan added to cart');
    } catch (error: any) {
      showErrorToast(error.response?.data?.message || 'Could not add plan');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <NavBar />

      <View style={styles.content}>
        <Text style={styles.categoriesTitle}>Categories</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setSelectedTab('ONE_TIME')}
            style={[
              styles.tabButton,
              selectedTab === 'ONE_TIME' && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'ONE_TIME' && styles.tabTextActive,
              ]}
            >
              One-Time Plans
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedTab('MEMBERSHIP')}
            style={[
              styles.tabButton,
              selectedTab === 'MEMBERSHIP' && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'MEMBERSHIP' && styles.tabTextActive,
              ]}
            >
              Membership Plans
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          {(['DIET', 'WORKOUT'] as CategoryType[]).map(type => (
            <TouchableOpacity
              key={type}
              onPress={() => setSelectedType(type)}
              style={[
                styles.filterButton,
                selectedType === type && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedType === type && styles.filterTextActive,
                ]}
              >
                {type === 'DIET' ? 'Diet Plans' : 'Workout Plans'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.goalRow}>
          {goalOptions.map(goal => (
            <TouchableOpacity
              key={goal.value}
              style={styles.goalOption}
              onPress={() => setSelectedGoal(goal.value as GoalType)}
            >
              <View
                style={[
                  styles.radioOuter,
                  selectedGoal === goal.value && styles.radioOuterActive,
                ]}
              >
                {selectedGoal === goal.value && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.goalText}>{goal.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>
          {selectedTab === 'ONE_TIME' ? 'One-Time Plans' : 'Membership Plans'} (
          {plans.length})
        </Text>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#ADFF2F" />
          </View>
        ) : (
          <FlatList
            data={plans}
            keyExtractor={item => String(item.guid || item.id)}
            numColumns={2}
            columnWrapperStyle={styles.grid}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No plans found.</Text>
            }
            renderItem={({ item }) => {
              const planId = item.guid || item.id;
              return (
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate('fitnessProgramDetails', {
                      program: item,
                    })
                  }
                >
                  <RemoteImage sourceUri={item.image_url} style={styles.cardImage} />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text numberOfLines={3} style={styles.cardDesc}>
                      {item.short_description || item.description}
                    </Text>

                    <View style={styles.cardBottom}>
                      <Text style={styles.priceText}>
                        {item.currency || 'Rs.'} {item.current_price || item.price}
                      </Text>
                      <TouchableOpacity onPress={() => handleAddPlan(item)}>
                        {addingId === planId ? (
                          <ActivityIndicator size="small" color="#ADE406" />
                        ) : (
                          <Image
                            source={require('../assets/images/green_cart.png')}
                            style={styles.cartIcon}
                            resizeMode="contain"
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: verticalScale(90) }}
          />
        )}
      </View>
    </View>
  );
};

export default FitnessProgramsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 0,
  },
  content: {
    padding: scale(20),
    paddingTop: scale(0),
    flex: 1,
  },
  categoriesTitle: {
    fontSize: moderateScale(22),
    color: '#fff',
    marginBottom: verticalScale(12),
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    marginBottom: verticalScale(16),
  },
  tabButton: {
    marginRight: scale(30),
    paddingBottom: verticalScale(8),
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#ADFF2F',
  },
  tabText: {
    fontSize: moderateScale(13),
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#ADFF2F',
  },
  filterRow: {
    flexDirection: 'row',
    gap: scale(12),
    marginBottom: verticalScale(16),
  },
  filterButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(20),
  },
  filterButtonActive: {
    backgroundColor: '#ADFF2F',
  },
  filterText: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#000',
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },
  goalOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#999',
    marginRight: scale(6),
  },
  radioOuterActive: {
    borderColor: '#ADFF2F',
  },
  radioInner: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#ADFF2F',
    alignSelf: 'center',
    marginTop: scale(3),
  },
  goalText: {
    color: '#fff',
    fontSize: moderateScale(12),
    textTransform: 'capitalize',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '600',
    marginBottom: verticalScale(10),
  },
  grid: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#111',
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(14),
    width: '47%',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: verticalScale(110),
  },
  cardContent: {
    padding: scale(10),
  },
  cardTitle: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  cardDesc: {
    color: '#999',
    fontSize: moderateScale(10),
    lineHeight: verticalScale(12),
    marginTop: verticalScale(4),
    marginBottom: verticalScale(8),
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    color: '#ADFF2F',
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  cartIcon: {
    width: moderateScale(22),
    height: moderateScale(22),
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: verticalScale(60),
  },
});
