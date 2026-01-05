import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { verticalScale, moderateScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";

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


type MealCardProps = {
  meal: Meal;
};

const Meal_Card: React.FC<MealCardProps> = ({ meal }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("mealDetail", { meal })}
    >
      <Image source={{ uri: meal.image_url }} style={styles.image} />

      <Text style={styles.title} numberOfLines={1}>
        {meal.name}
      </Text>

      {meal.type_label && (
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>{meal.type_label}</Text>
        </View>
      )}

      <Text style={styles.description} numberOfLines={3}>
        {meal.description}
      </Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>Rs. {meal.current_price}</Text>
        <Image
          source={require("../../assets/images/green_cart.png")}
          style={styles.cartIcon}
        />
      </View>
    </TouchableOpacity>
  );
};

export default Meal_Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111111",
    borderRadius: moderateScale(12),
    width: "48%",
    padding: moderateScale(8),
    marginBottom: verticalScale(14),
  },
  image: {
    width: "100%",
    height: verticalScale(120),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(6),
  },
  title: {
    fontSize: moderateScale(13),
    fontWeight: "700",
    color: "#FFFFFF",
  },
  tagContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(12),
    alignSelf: "flex-start",
    marginTop: verticalScale(4),
    marginBottom: verticalScale(4),
  },
  tagText: {
    fontSize: moderateScale(10),
    color: "#000000",
    fontWeight: "600",
  },
  description: {
    fontSize: moderateScale(11),
    color: "#AAAAAA",
    marginBottom: verticalScale(4),
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(2),
  },
  price: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    color: "#ADE406",
  },
  cartIcon: {
    width: moderateScale(22),
    height: moderateScale(22),
  },
});
