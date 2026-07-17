import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { verticalScale, moderateScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { addSupplementToCart } from "../../api/cart";
import { Check } from "lucide-react-native";
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import RemoteImage from "../RemoteImage";


interface Product {
  id: number;
  guid: string;
  name: string;
  description: string;
  final_price: number;
  image_url: string;
}

type Props = {
  product: Product;
  inCart?: boolean;
  refreshCart?: () => void;
};

const BestSellingCard: React.FC<Props> = ({ product, inCart = false, refreshCart }) => {
  const navigation = useNavigation<any>();
  const [added, setAdded] = useState(inCart);
  const [loading, setLoading] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const goToDetail = () => {
    navigation.navigate("supplementDetails", { product });
  };

  const handleAddToCart = async () => {
    if (added || loading) return;

    setLoading(true);
    setAdded(true); 

    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 0.8, duration: 120, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0.5, duration: 120, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]),
    ]).start();

    try {
      await addSupplementToCart("product", product.guid, 1);
      showSuccessToast(`${product.name} added to cart!`);
      if (refreshCart) refreshCart(); 
    } catch (error:any) {
      setAdded(false);
      showErrorToast(error?.message || "Failed to add item to cart");
      console.error("Add to cart failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAdded(inCart);
  }, [inCart]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={goToDetail}
      activeOpacity={0.85}
    >
      <RemoteImage sourceUri={product.image_url} style={styles.image} />

      <Text style={styles.title} numberOfLines={1}>
        {product.name}
      </Text>

      <View style={styles.descriptionBox}>
        <Text style={styles.description} numberOfLines={3}>
          {product.description}
        </Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.price}>Rs. {product.final_price}</Text>

        <TouchableOpacity onPress={handleAddToCart} activeOpacity={0.8} disabled={loading || added}>
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            }}
          >
            {added ? (
              <Check size={22} color="#ADE406" strokeWidth={3} />
            ) : (
              <Image
                source={require("../../assets/images/green_cart.png")}
                style={styles.cartIcon}
              />
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default BestSellingCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: moderateScale(12),
    width: "48%",
    marginBottom: verticalScale(12),
    backgroundColor: "#1C1C1C",
    padding: moderateScale(8),
    minHeight: verticalScale(230),
  },
  image: {
    width: "100%",
    height: verticalScale(120),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(6),
  },
  title: {
    fontSize: moderateScale(14),
    fontWeight: "700",
    color: "white",
  },
  descriptionBox: {
    minHeight: verticalScale(40),
    marginVertical: verticalScale(4),
  },
  description: {
    fontSize: moderateScale(12),
    color: "#aaa",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(4),
  },
  price: {
    fontSize: moderateScale(14),
    fontWeight: "bold",
    color: "#ADE406",
  },
  cartIcon: {
    width: 22,
    height: 22,
  },
});
