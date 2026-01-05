import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const MealPlanDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { id, meals } = route.params;

  const meal = meals.find((m: any) => m.id === id);

  const total = meal.protein * 4 + meal.carbs * 4 + meal.fats * 9;
  const p = ((meal.protein * 4) / total) * 100;
  const c = ((meal.carbs * 4) / total) * 100;
  const f = ((meal.fats * 9) / total) * 100;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: verticalScale(40) }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <Image source={meal.image} style={styles.mealImage} />
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

      <Text style={styles.name}>{meal.name}</Text>
      <Text style={styles.desc}>{meal.description}</Text>

      <View style={styles.gridContainer}>
        <View style={styles.gridRow}>
          <View style={styles.infoCard}>
            <Image
              source={require('../assets/images/eat.png')}
              style={styles.infoCardImage}
            />
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardHead}>Time</Text>
              <Text style={styles.infoCardValue}>{meal.time}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Image
              source={require('../assets/images/prep.png')}
              style={styles.infoCardImage}
            />
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardHead}>Prep Time</Text>
              <Text style={styles.infoCardValue}>{meal.prep_time}</Text>
            </View>
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={styles.infoCard}>
            <Image
              source={require('../assets/images/cook.png')}
              style={styles.infoCardImage}
            />
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardHead}>Cook Time</Text>
              <Text style={styles.infoCardValue}>{meal.cook_time}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Image
              source={require('../assets/images/health.png')}
              style={styles.infoCardImage}
            />
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardHead}>Health Score</Text>
              <Text style={styles.infoCardValue}>{meal.health_score}/100</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { marginBottom: verticalScale(10) }]}>
        INGREDIENTS
      </Text>
      <View style={styles.ingredientsContainer}>
        {meal.ingredients.map((ing: string, index: number) => (
          <Text key={index} style={styles.ingredient}>
            {ing}
          </Text>
        ))}
      </View>

      <View style={styles.nutritionCard}>
        <Text style={styles.sectionTitle}>Nutrition Facts</Text>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionText}>Calories: {meal.calories}</Text>
          <Text style={styles.proteinTxt}>Protein: {meal.protein}g</Text>
          <Text style={styles.carbsTxt}>Carbs: {meal.carbs}g</Text>
          <Text style={styles.fatsTxt}>Fats: {meal.fats}g</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Svg width="150" height="150" viewBox="0 0 100 100">
          <Circle
            cx="50"
            cy="50"
            r="40"
            stroke="#CCFF00"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${(p / 100) * 251.2} 251.2`}
          />
          <Circle
            cx="50"
            cy="50"
            r="40"
            stroke="#FF1493"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${(c / 100) * 251.2} 251.2`}
            strokeDashoffset={-((p / 100) * 251.2)}
          />
          <Circle
            cx="50"
            cy="50"
            r="40"
            stroke="#25dbe1ff"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${(f / 100) * 251.2} 251.2`}
            strokeDashoffset={-(((p + c) / 100) * 251.2)}
          />
        </Svg>
        <Text style={styles.calText}>{meal.calories} kcal</Text>
      </View>

      <Text style={[styles.sectionTitle, { marginBottom: verticalScale(10) }]}>
        Directions
      </Text>
      <View style={styles.stepsContainer}>
        {meal.steps.map((step: any, index: number) => (
          <View key={index} style={styles.stepCard}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepName}>{step.step_name}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default MealPlanDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: moderateScale(16),
    paddingTop: verticalScale(30),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(15),
  },
  headerTitle: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  mealImage: {
    width: '100%',
    height: verticalScale(200),
    borderRadius: 10,
    marginBottom: verticalScale(10),
  },
  mealTypeButton: {
    backgroundColor: '#ADE406',
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(8),
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: verticalScale(6),
  },
  ingredientsContainer: {
    marginBottom: verticalScale(20),
  },
  ingredient: {
    color: '#a4a4a4ff',
    fontSize: moderateScale(13),
  },

  mealTypeButtonText: {
    color: 'black',
    fontSize: moderateScale(14),
    fontWeight: '400',
  },
  desc: {
    color: '#ccc',
    fontSize: moderateScale(13),
    marginBottom: verticalScale(16),
  },
  name: {
    color: 'white',
    fontSize: moderateScale(20),
    marginBottom: verticalScale(6),
    fontWeight: '800',
  },
  nutritionCard: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: scale(12),
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    color: 'white',
    fontSize: moderateScale(22),
    fontWeight: '700',
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionText: {
    color: '#fff',
    fontSize: moderateScale(14),
  },
  proteinTxt: {
    color: '#CCFF00',
    fontSize: moderateScale(14),
  },
  carbsTxt: {
    color: '#FF1493',
    fontSize: moderateScale(14),
  },
  fatsTxt: {
    color: '#25dbe1ff',
    fontSize: moderateScale(14),
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  calText: {
    color: '#fff',
    position: 'absolute',
    top: '42%',
    fontSize: moderateScale(14),
    fontWeight: '700',
  },

  gridContainer: {
    marginBottom: verticalScale(5),
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
  },
  infoCard: {
    flex: 1,
    flexDirection: 'row',

    alignItems: 'center',
  },
  infoCardImage: {
    width: scale(60),
    height: scale(60),
    marginRight: scale(8),
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardHead: {
    color: 'grey',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  infoCardValue: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  stepsContainer: {
    marginBottom: verticalScale(30),
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(18),
  },
  stepNumberContainer: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(2),
    backgroundColor: '#A3E635',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(15),
  },
  stepNumber: {
    color: '#000',
    fontWeight: '700',
    fontSize: moderateScale(14),
  },
  stepContent: {
    flex: 1,
  },
  stepName: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '700',
    marginBottom: verticalScale(2),
  },
  stepDescription: {
    color: '#ccc',
    fontSize: moderateScale(12),
  },
});
