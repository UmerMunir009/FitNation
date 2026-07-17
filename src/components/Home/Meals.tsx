import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { verticalScale, moderateScale } from 'react-native-size-matters';
import Meal_Card from './Meal_Card';
import { getMeals } from '../../api/public';
import { useNavigation } from '@react-navigation/native';


interface GalleryImage {
  id: number;
  guid: string;
  file_name: string;
  image_url: string;
}

interface RatingStars {
  full: number;
  half: number;
  empty: number;
  average: string;
  total: string;
}

interface Badge {
  type: string;
  label: string;
  color: string;
}

interface AvailabilityStatus {
  status: string;
  message: string;
  color: string;
}

interface NutritionSummary {
  calories: string;
  protein?: string | null;
  carbs?: string | null;
  fat?: string | null;
  calories_label?: string;
}

interface Meal {
  id: number;
  guid: string;
  slug: string;
  name: string;
  description: string;
  type: string;
  type_label: string;
  price: number;
  sale_price: number;
  current_price: number;
  has_discount: boolean;
  discount_percentage: number;
  discount_amount: number;
  stock_quantity: string;
  in_stock: boolean;
  is_available: boolean;
  low_stock: boolean;
  category?: any;
  subcategory?: any;
  is_featured: boolean;
  is_best_selling: boolean;
  status: boolean;
  status_label: string;
  ingredients: string;
  nutrition_facts: string;
  calories: string;
  serving_size: string;
  preparation_time: string;
  preparation_time_formatted: string;
  image: string;
  image_url: string;
  image_thumbnail: string;
  image_alt: string;
  gallery_images: GalleryImage[];
  gallery_count: number;
  featured_gallery_image: GalleryImage;
  rating: number;
  rating_stars: RatingStars;
  review_count: string;
  sold_count: string;
  view_count: string;
  popularity_score: number;
  seo_title?: string | null;
  seo_description?: string | null;
  meta_title: string;
  meta_description: string;
  country_of_origin?: string | null;
  manufacturer?: string | null;
  created_at: string;
  updated_at: string;
  created_at_formatted: string;
  updated_at_formatted: string;
  badges: Badge[];
  availability_status: AvailabilityStatus;
  nutrition_summary: NutritionSummary;
  url: string;
  api_url: string;
}


const Meals: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();


  useEffect(() => {
    fetchHomeMeals();
  }, []);

  const fetchHomeMeals = async () => {
    try {
      const response = await getMeals({ page: 1, perPage: 6, featured: true });
      setMeals(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Meals error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Meals</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity   onPress={() => navigation.navigate('meals')} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>See All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>Membership</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="green" />
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <Meal_Card meal={item} /> 
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default Meals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: moderateScale(12),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  header: {
    color: '#FFFFFF',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: moderateScale(8),
  },
  headerBtn: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(4),
    paddingHorizontal: moderateScale(10),
  },
  headerBtnText: {
    color: '#888',
    fontSize: moderateScale(11),
    fontWeight: '600',
  },
  row: {
    justifyContent: 'space-between',
  },
  loadingBox: {
    height: 500,             
    justifyContent: 'center',
    alignItems: 'center',    
    backgroundColor: 'black', 
    marginBottom: 16,
    borderRadius: 8,
  },
});
