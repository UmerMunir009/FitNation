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
import Meal_Card from '../components/Home/Meal_Card';
import { getActiveCategories, getActiveMeals, getMeals, getMealsByCategory } from '../api/public';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { screenTopPadding } from '../theme/layout';

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

type FilterType = 'ALL' | 'VEG' | 'NON_VEG' | 'VEGAN';

const MealsScreen: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchMeals(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getActiveCategories();
        setCategories(response.data?.data || response.data || response || []);
      } catch (error) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const fetchMeals = async (selectedFilter: FilterType) => {
    setLoading(true);
    try {
      const response =
        selectedCategory
          ? await getMealsByCategory(selectedCategory.slug || selectedCategory.name || selectedCategory.id)
          : selectedFilter === 'ALL'
          ? await getActiveMeals({ page: 1, perPage: 300 })
          : await getMeals({ page: 1, perPage: 300, type: selectedFilter });
      setMeals(response.data?.data || response.data || []); // Keep all info in state
    } catch (error) {
      console.error('Meals error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filters: { label: string; type: FilterType }[] = [
    { label: 'All Meals', type: 'ALL' },
    { label: 'Vegetarian', type: 'VEG' },
    { label: 'Non-Vegetarian', type: 'NON_VEG' },
    { label: 'Vegan', type: 'VEGAN' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.header}>Meals</Text>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.type}
            style={[
              styles.filterBtn,
              filter === f.type && styles.filterBtnActive,
            ]}
            onPress={() => setFilter(f.type)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f.type && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        horizontal
        data={[{ id: 'all', name: 'All' }, ...categories]}
        keyExtractor={item => String(item.guid || item.id)}
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}
        renderItem={({ item }) => {
          const active =
            (!selectedCategory && item.id === 'all') ||
            selectedCategory?.id === item.id ||
            selectedCategory?.guid === item.guid;
          return (
            <TouchableOpacity
              style={[styles.categoryChip, active && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(item.id === 'all' ? null : item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  active && styles.categoryTextActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Meals List */}
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
            <Meal_Card meal={item} /> // Pass full meal object
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default MealsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: screenTopPadding,
    backgroundColor: '#000000',
    paddingHorizontal: moderateScale(12),
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
    color: '#FFFFFF',
    fontSize: moderateScale(18),
    fontWeight: '700',
    textAlign: 'left',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  categoryList: {
    marginBottom: verticalScale(12),
    maxHeight: verticalScale(38),
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: moderateScale(18),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    marginRight: moderateScale(8),
  },
  categoryChipActive: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  categoryText: {
    color: '#aaa',
    fontWeight: '700',
  },
  categoryTextActive: {
    color: '#fff',
  },
  filterBtn: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: moderateScale(10),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: '#555',
  },
  filterBtnActive: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  filterText: {
    color: '#aaa',
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
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
