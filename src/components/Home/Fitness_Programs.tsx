import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import FitnessProgramCard from './Fitness_Program_Card';
import { getFitnessPrograms } from '../../api/public'; 
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
  average: number;
  total: string;
}

interface Badge {
  type: string;
  label: string;
  color: string;
}

interface FitnessProgram {
  id: number;
  guid: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  benefits: string | null;
  category_id: number | null;
  plan_type: string;
  plan_type_label: string;
  plan_category: string;
  plan_category_label: string;
  fitness_goal: string;
  fitness_goal_label: string;
  intensity_level: string;
  intensity_level_label: string;
  price: number;
  sale_price: number;
  original_price: number;
  current_price: number;
  has_discount: boolean;
  discount_percentage: number;
  discount_amount: number;
  currency: string;
  billing_cycle: string | null;
  duration_days: string;
  duration_label: string | null;
  duration_weeks: number;
  duration_formatted: string;
  workouts_per_week: string;
  training_days_per_week: number | null;
  session_duration_minutes: number | null;
  workout_frequency: string | null;
  total_workouts: number;
  equipment_required: string;
  target_muscles: any[];
  included_features: any[];
  rating: number;
  rating_count: string;
  rating_stars: RatingStars;
  purchase_count: string;
  view_count: string;
  completion_rate: string;
  popularity_score: number;
  image: string;
  image_url: string;
  image_thumbnail: string;
  video_url: string | null;
  gallery_images: GalleryImage[];
  gallery_count: number;
  documentation: any[];
  trainer_id: number | null;
  trainer_notes: string | null;
  weekly_schedule: any[];
  meal_plan_structure: any[];
  workout_structure: any[];
  progress_tracking: any[];
  prerequisites: any[];
  contraindications: any[];
  age_group: string | null;
  gender_specific: string;
  gender_specific_label: string;
  target_audience: string;
  features: any[];
  available_features: any[];
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[];
  is_active: boolean;
  is_featured: boolean;
  is_popular: boolean;
  is_customizable: boolean;
  has_trainer_support: boolean;
  has_community_access: boolean;
  has_mobile_app: boolean;
  badges: Badge[];
  status_label: string;
  created_at: string;
  updated_at: string;
  created_at_formatted: string;
  updated_at_formatted: string;
  category: any | null;
  trainer: any | null;
  active_subscriptions_count: number;
  url: string;
  api_url: string;
  subscribe_url: string;
}
const Fitness_Programs = () => {
  const [programs, setPrograms] = useState<FitnessProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  const fetchFitnessPrograms = async () => {
    try {
      const response = await getFitnessPrograms({
        page: 1,
        perPage: 6,
        featured: true,
      });
      setPrograms(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Fitness Programs error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFitnessPrograms();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Fitness Programs</Text>
        
        <View style={styles.rightHeader}>
          <TouchableOpacity onPress={() => navigation.navigate('FitnessProgram')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#b2fd62ff" />
        </View>
      ) : (
        <FlatList
          data={programs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <FitnessProgramCard
               program={item}
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No programs available.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    flex: 1,
    backgroundColor: '#000000',
    minHeight:250
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: scale(18),
    fontWeight: '700',
    color: 'white',
  },
  seeAll: {
    fontSize: scale(13),
    color: '#b2fd62ff',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: verticalScale(30),
  },
  cardWrapper: {
    marginBottom: verticalScale(15),
    width: '100%',
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default Fitness_Programs;
