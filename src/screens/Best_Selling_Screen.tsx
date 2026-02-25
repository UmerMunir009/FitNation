import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import ProductCard from '../components/Home/Best_Selling_Card'; 
import { getProducts } from '../api/public';
import { getCartApi } from '../api/cart';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

const BestSellingSupplementsScreen: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]); 
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [resProducts, resCart] = await Promise.all([
        getProducts({ page: 1, perPage: 300 }),
        getCartApi()
      ]);

      setProducts(resProducts.data);
      
      const guidsInCart = resCart.data.items.map((item: any) => item.product.guid);
      setCartItems(guidsInCart);
    } catch (error) {
      console.error('Data fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshCartOnly = async () => {
    try {
      const resCart = await getCartApi();
      const guidsInCart = resCart.data.items.map((item: any) => item.product.guid);
      setCartItems(guidsInCart);
    } catch (error) {
      console.error("Cart sync error:", error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAllData(false);
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

      {loading && !refreshing ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#ADE406" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh} 
              tintColor="#ADE406" 
            />
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item} 
              inCart={cartItems.includes(item.guid)} 
              refreshCart={refreshCartOnly}          
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
    marginBottom: verticalScale(15),
  },
  backBtn: {
    marginRight: moderateScale(10),
  },
  header: {
    color: '#FFFFFF',
    fontSize: moderateScale(20),
    fontWeight: '800',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  loadingBox: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});