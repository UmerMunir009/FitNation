import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Calendar } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import DateTimePicker from '@react-native-community/datetimepicker';
import { screenTopPadding } from '../theme/layout';
import { getTodayMealsApi, getUserMealPlansApi } from '../api/user';
import { showErrorToast } from '../utils/toast';
import RemoteImage from '../components/RemoteImage';

const unwrapList = (payload: any) => {
  const data = payload?.data?.data || payload?.data?.meals || payload?.data || payload;
  return Array.isArray(data) ? data : [];
};

const normalizeMeals = (payload: any) =>
  unwrapList(payload).map((meal: any) => ({
    ...meal,
    id: meal.id || meal.guid,
    name: meal.name || meal.title || meal.meal?.name,
    description: meal.description || meal.meal?.description || '',
    image_url: meal.image_url || meal.meal?.image_url,
    time: meal.time || meal.scheduled_time || meal.meal_time || '',
    mealType: meal.meal_type || meal.type_label || meal.type || 'Meal',
    prep_time: meal.prep_time || meal.preparation_time_formatted,
    cook_time: meal.cook_time || meal.cooking_time,
    health_score: meal.health_score,
    carbs: Number(meal.carbs || meal.nutrition_summary?.carbs || 0),
    fats: Number(meal.fats || meal.nutrition_summary?.fat || 0),
    protein: Number(meal.protein || meal.nutrition_summary?.protein || 0),
    calories: Number(meal.calories || meal.nutrition_summary?.calories || 0),
    ingredients: meal.ingredients || [],
    steps: meal.steps || meal.directions || [],
  }));

const MealPlanScreen = () => {
  const navigation = useNavigation<any>();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const todayResponse = await getTodayMealsApi();
      const todayMeals = normalizeMeals(todayResponse);
      if (todayMeals.length) {
        setMeals(todayMeals);
      } else {
        const planResponse = await getUserMealPlansApi();
        setMeals(normalizeMeals(planResponse));
      }
    } catch (error) {
      showErrorToast('Could not load meal plan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const onChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal Plans</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.dateRow}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Calendar size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.underline} />

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ADE406" />
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={item => String(item.id)}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No meal plan found.</Text>
          }
          renderItem={({ item: meal }) => (
            <View style={styles.card}>
              <View style={styles.mealTypeButton}>
                <Text style={styles.mealTypeButtonText}>{meal.mealType}</Text>
              </View>

              <View style={styles.cardContent}>
                <RemoteImage
                  sourceUri={meal.image_url}
                  style={styles.mealImage}
                />
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.mealTime}>{meal.time}</Text>
                  <Text numberOfLines={3} style={styles.mealDescription}>
                    {meal.description}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewButton}
                onPress={() =>
                  navigation.navigate('mealPlanDetails', { id: meal.id, meals })
                }
              >
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: verticalScale(50) }}
        />
      )}
    </View>
  );
};

export default MealPlanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: moderateScale(16),
    paddingTop: screenTopPadding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
  },
  headerTitle: {
    color: '#FFF',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  dateText: {
    color: '#A3E635',
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  underline: {
    height: 1,
    backgroundColor: '#484848ff',
    marginBottom: verticalScale(12),
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
    borderWidth: 1,
    borderColor: '#484848ff',
    borderRadius: 12,
    marginBottom: verticalScale(12),
    padding: scale(8),
    backgroundColor: 'transparent',
  },
  mealTypeButton: {
    backgroundColor: '#ADE406',
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(8),
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: verticalScale(6),
  },
  mealTypeButtonText: {
    color: 'black',
    fontSize: moderateScale(14),
    fontWeight: '400',
  },
  cardContent: {
    flexDirection: 'row',
    backgroundColor: '#282828',
    borderRadius: 10,
    padding: scale(8),
    alignItems: 'center',
  },
  mealImage: {
    width: scale(80),
    height: scale(80),
    borderRadius: 10,
    marginRight: scale(10),
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    color: '#fff',
    fontSize: moderateScale(15),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  mealTime: {
    color: '#aaa',
    fontSize: moderateScale(12),
    marginBottom: verticalScale(4),
  },
  mealDescription: {
    color: '#ccc',
    fontSize: moderateScale(12),
  },
  viewButton: {
    backgroundColor: '#A3E635',
    paddingVertical: verticalScale(8),
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(6),
    width: '100%',
  },
  viewButtonText: {
    color: '#000',
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
});
