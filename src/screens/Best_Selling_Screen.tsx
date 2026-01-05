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
import ProductCard from '../components/Home/Best_Selling_Card';
import { getProducts } from '../api/public';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

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

const BestSellingSupplementsScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts({ page: 1, perPage: 300 });
      setProducts(response.data); // store all info
    } catch (error) {
      console.error('Products error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.header}>All Supplements</Text>
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

export default BestSellingSupplementsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(35),
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
