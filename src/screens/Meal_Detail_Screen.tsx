import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

type GalleryImage = {
  id: number;
  image_url: string;
};

type Badge = {
  type: string;
  label: string;
  color: string;
};

type NutritionSummary = {
  calories?: string | null;
  protein?: string | null;
  carbs?: string | null;
  fat?: string | null;
  calories_label?: string;
};

type Meal = {
  name: string;
  description: string;
  current_price: number;
  sale_price: number;
  has_discount: boolean;
  discount_percentage: number;
  type_label?: string;
  badges?: Badge[];
  gallery_images?: GalleryImage[];
  nutrition_summary?: NutritionSummary;
  serving_size?: string;
  preparation_time_formatted?: string;
  in_stock?: boolean;
  image_url?: string;
};

const MealDetails: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { meal } = (route.params as { meal: Meal }) || {};

  if (!meal) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
        }}
      >
        <Text style={{ color: '#fff' }}>No meal data found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.header}>{meal.name}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {meal.image_url && (
          <Image
            source={{ uri: meal.image_url }}
            style={styles.featuredImage}
          />
        )}

    
        <View style={styles.badgesRow}>
          {meal.type_label && (
            <View style={[styles.badge, { backgroundColor: '#28a745' }]}>
              <Text style={styles.badgeText}>{meal.type_label}</Text>
            </View>
          )}

          {(meal.badges?.length ?? 0) > 0 &&
            meal.badges!.map((b, idx) => (
              <View
                key={idx}
                style={[
                  styles.badge,
                  { backgroundColor: getBadgeColor(b.color) },
                ]}
              >
                <Text style={styles.badgeText}>{b.label}</Text>
              </View>
            ))}
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>Rs. {meal.current_price}</Text>
          {meal.has_discount && (
            <Text style={styles.salePrice}>Rs. {meal.sale_price}</Text>
          )}
        </View>

        {meal.description && (
          <>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{meal.description}</Text>
          </>
        )}

        {meal.nutrition_summary && (
          <>
            <Text style={styles.sectionTitle}>Nutrition</Text>
            <View style={styles.nutritionRow}>
              {meal.nutrition_summary.calories && (
                <Text style={styles.nutritionItem}>
                  Calories: {meal.nutrition_summary.calories}
                </Text>
              )}
              {meal.nutrition_summary.protein && (
                <Text style={styles.nutritionItem}>
                  Protein: {meal.nutrition_summary.protein}
                </Text>
              )}
              {meal.nutrition_summary.carbs && (
                <Text style={styles.nutritionItem}>
                  Carbs: {meal.nutrition_summary.carbs}
                </Text>
              )}
              {meal.nutrition_summary.fat && (
                <Text style={styles.nutritionItem}>
                  Fat: {meal.nutrition_summary.fat}
                </Text>
              )}
            </View>
          </>
        )}

        {(meal.serving_size || meal.preparation_time_formatted) && (
          <>
            <Text style={styles.sectionTitle}>Details</Text>
            {meal.serving_size && (
              <Text style={styles.detailText}>
                Serving Size: {meal.serving_size}
              </Text>
            )}
            {meal.preparation_time_formatted && (
              <Text style={styles.detailText}>
                Preparation Time: {meal.preparation_time_formatted}
              </Text>
            )}
          </>
        )}

        {typeof meal.in_stock === 'boolean' && (
          <>
            <Text style={styles.sectionTitle}>Availability</Text>
            <Text style={styles.detailText}>
              {meal.in_stock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </>
        )}

        {(meal.gallery_images?.length ?? 0) > 0 && (
          <>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <FlatList
              data={meal.gallery_images}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.galleryImage}
                />
              )}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
};

const getBadgeColor = (color: string) => {
  switch (color) {
    case 'success':
      return '#28a745';
    case 'danger':
      return '#dc3545';
    case 'info':
      return '#17a2b8';
    case 'secondary':
      return '#6c757d';
    default:
      return '#888';
  }
};

export default MealDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: moderateScale(12),
    paddingTop: verticalScale(30),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  backBtn: {
    marginRight: moderateScale(10),
  },
  header: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: '700',
    flexShrink: 1,
  },
  featuredImage: {
    width: '100%',
    height: verticalScale(300),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: verticalScale(8),
  },
  badge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(12),
    marginRight: moderateScale(6),
    marginBottom: verticalScale(6),
  },
  badgeText: {
    color: '#fff',
    fontSize: moderateScale(10),
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
    gap: moderateScale(8),
  },
  price: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#ADE406',
  },
  salePrice: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#AAA',
    textDecorationLine: 'line-through',
  },
  sectionTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#fff',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(4),
  },
  description: {
    fontSize: moderateScale(12),
    color: '#AAA',
  },
  nutritionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: verticalScale(6),
  },
  nutritionItem: {
    color: '#AAA',
    fontSize: moderateScale(12),
    marginRight: moderateScale(12),
    marginBottom: verticalScale(4),
  },
  detailText: {
    fontSize: moderateScale(12),
    color: '#AAA',
    marginBottom: verticalScale(4),
  },
  galleryImage: {
    width: moderateScale(120),
    height: verticalScale(80),
    borderRadius: moderateScale(8),
    marginRight: moderateScale(8),
    marginBottom:verticalScale(30)
  },
});
