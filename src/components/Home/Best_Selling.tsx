import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import ProductCard from "./Best_Selling_Card"; 
import { getProducts } from "../../api/public"; 
import { useNavigation } from "@react-navigation/native";

interface GalleryImage {
  id: number;
  guid: string;
  file_name: string;
  image_url: string;
}

interface Product {
  id: number;
  guid: string;
  name: string;
  description: string;
  price: number;
  discount_price: number;
  final_price: number;
  has_discount: boolean;
  discount_percentage: number;
  benefits: string;
  suggested_use: string;
  nutritional_information: string;
  flavor: string;
  image: string;
  image_url: string;
  status: string;
  is_featured: boolean;
  category_id: string;
  category?: any;
  ratings: any[];
  gallery_images: GalleryImage[];
  average_rating: number;
  ratings_count: number;
  created_at: string;
  updated_at: string;
}

const BestSelling: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts({ page: 1, perPage: 6 });
      setProducts(response.data); 
    } catch (error) {
      console.error("Products error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Best Selling Supplements</Text>
        <TouchableOpacity onPress={() => navigation.navigate("bestSelling")}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="green" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <ProductCard
             product={item} 
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default BestSelling;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    backgroundColor: "#282828",
    marginBottom: verticalScale(10),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(10),
    marginTop: verticalScale(10),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "white",
  },
  seeAll: {
    fontSize: moderateScale(14),
    color: "grey",
    fontWeight: "700",
  },
  row: {
    justifyContent: "space-between",
  },
  loadingBox: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
});
