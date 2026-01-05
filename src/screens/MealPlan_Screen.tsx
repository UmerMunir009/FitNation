import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Calendar } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import DateTimePicker from '@react-native-community/datetimepicker';

const meals = [
  {
    id: '1',
    name: 'Protein Pancakes',
    description:
      'Fluffy pancakes with protein powder and fresh berries, perfect for a high-protein breakfast.',
    image: require('../assets/images/meal_1.jpg'),
    time: '7:00 AM',
    mealType: 'Breakfast',
    prep_time: '10 mins',
    cook_time: '15 mins',
    health_score: 85,
    carbs: 35,
    fats: 8,
    protein: 25,
    calories:3100,
    ingredients: ['Oats', 'Protein powder', 'Eggs', 'Berries', 'Milk', 'Honey'],
    steps: [
      {
        step_name: 'Mix Ingredients',
        description:
          'Combine oats, protein powder, eggs, milk, and honey in a bowl until smooth.',
      },
      {
        step_name: 'Heat Pan',
        description: 'Preheat a non-stick pan over medium heat.',
      },
      {
        step_name: 'Cook Pancakes',
        description:
          'Pour batter into the pan, cook each side for 2-3 minutes until golden brown.',
      },
      {
        step_name: 'Serve',
        description: 'Top pancakes with fresh berries and enjoy.',
      },
    ],
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    description:
      'Fresh greens with grilled chicken, cherry tomatoes, and olive oil dressing.',
    image: require('../assets/images/meal_2.jpg'),
    time: '12:30 PM',
    mealType: 'Lunch',
    prep_time: '15 mins',
    cook_time: '20 mins',
    health_score: 90,
    carbs: 12,
    fats: 18,
    protein: 45,
    calories:2500,
    ingredients: ['Chicken breast', 'Lettuce', 'Tomatoes', 'Cucumber', 'Olive oil', 'Lemon juice'],
    steps: [
      {
        step_name: 'Prepare Chicken',
        description: 'Season chicken breast with salt, pepper, and herbs.',
      },
      {
        step_name: 'Grill Chicken',
        description: 'Grill chicken for 6-8 minutes on each side until fully cooked.',
      },
      {
        step_name: 'Prepare Salad',
        description:
          'Chop lettuce, tomatoes, cucumber and mix with olive oil and lemon juice.',
      },
      {
        step_name: 'Assemble',
        description: 'Slice grilled chicken and place on top of salad. Serve.',
      },
    ],
  },
  {
    id: '3',
    name: 'Salmon with Vegetables',
    description:
      'Baked salmon fillet with roasted broccoli and sweet potato, a healthy dinner choice.',
    image: require('../assets/images/meal_3.jpg'),
    time: '6:00 PM',
    mealType: 'Dinner',
    prep_time: '10 mins',
    cook_time: '25 mins',
    health_score: 92,
    carbs: 25,
    fats: 20,
    protein: 40,
    calories:4546,
    ingredients: ['Salmon fillet', 'Broccoli', 'Sweet potato', 'Olive oil', 'Garlic', 'Lemon'],
    steps: [
      {
        step_name: 'Preheat Oven',
        description: 'Preheat oven to 200°C (390°F).',
      },
      {
        step_name: 'Prepare Vegetables',
        description: 'Chop broccoli and sweet potato, toss with olive oil and garlic.',
      },
      {
        step_name: 'Bake',
        description:
          'Place salmon and vegetables on a baking tray and bake for 20-25 minutes until salmon is cooked through.',
      },
      {
        step_name: 'Serve',
        description: 'Squeeze fresh lemon over salmon and vegetables. Serve hot.',
      },
    ],
  },
];


const MealPlanScreen = () => {
  const navigation = useNavigation<any>();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const onChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: verticalScale(50) }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal Plans</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.dateRow}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <TouchableOpacity>
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

      {meals.map(meal => (
        <View key={meal.id} style={styles.card}>
          <View
            style={[
              styles.mealTypeButton,
              {
                backgroundColor:
                  meal.mealType === 'Breakfast'
                    ? '#ADE406'
                    : meal.mealType === 'Lunch'
                    ? '#E4D106'
                    : meal.mealType === 'Dinner'
                    ? '#E99F9D'
                    : '#ADE406',
              },
            ]}
          >
            <Text style={styles.mealTypeButtonText}>{meal.mealType}</Text>
          </View>

          <View style={styles.cardContent}>
            <Image source={meal.image} style={styles.mealImage} />
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealTime}>{meal.time}</Text>
              <Text numberOfLines={3} style={styles.mealDescription}>{meal.description}</Text>
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
      ))}
    </ScrollView>
  );
};

export default MealPlanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: moderateScale(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: verticalScale(30),
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
