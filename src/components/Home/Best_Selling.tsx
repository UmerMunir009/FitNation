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
import BestSellingCard from "./Best_Selling_Card";
import { getSupplements } from "../../api/public";
import { getCartApi } from "../../api/cart"; 
import { useNavigation } from "@react-navigation/native";
import { RefreshCw } from "lucide-react-native";

interface Product {
  id: number;
  guid: string;
  name: string;
  description: string;
  final_price: number;
  image_url: string;
}

const getCartProductGuids = (items: any[] = []) =>
  items
    .map(item => item?.product?.guid || item?.product_guid || item?.product_id)
    .filter(Boolean)
    .map(String);

const BestSelling: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const resProducts = await getSupplements({
        page: 1,
        perPage: 6,
        featured: true,
      });
      const resCart = await getCartApi();
      
      setProducts(resProducts.data?.data || resProducts.data || []);
      const guidsInCart = getCartProductGuids(resCart.data?.items);
      setCartItems(guidsInCart);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use this for "silent" updates when adding items to cart
  const refreshCartOnly = async () => {
    try {
      const resCart = await getCartApi();
      const guidsInCart = getCartProductGuids(resCart.data?.items);
      setCartItems(guidsInCart);
    } catch (error) {
      console.error("Error refreshing cart silently:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInitialData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Best Selling Supplements</Text>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity onPress={handleRefresh}>
            <RefreshCw size={18} color="#ADE406" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("bestSelling")}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#ADE406" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <BestSellingCard
              product={item}
              inCart={cartItems.includes(String(item.guid || item.id))}
              refreshCart={refreshCartOnly} 
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshing={refreshing}
          onRefresh={handleRefresh}
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
