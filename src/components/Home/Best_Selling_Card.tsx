import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { addSupplementToCart } from "../../api/cart";
import { Check } from "lucide-react-native";

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

type BestSellingCardProps = {
  product: Product;
};


const BestSellingCard: React.FC<BestSellingCardProps> = ({ product }) => {
  const navigation = useNavigation<any>();
  console.log

  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const goToDetail = () => {
    navigation.navigate("supplementDetails", { product });
  };


  const handleAddToCart = async () => {
    if (added || loading) return;

    setLoading(true);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.5,
          duration: 120,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    try {
      await addSupplementToCart("product", product.guid, 2);
      setAdded(true);
    } catch (error) {
      console.error("Add to cart failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={goToDetail}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: product.image_url }}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.title} numberOfLines={1}>
        {product.name}
      </Text>

      <Text style={styles.description} numberOfLines={3}>
        {product.description}
      </Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>Rs. {product.final_price}</Text>

        <TouchableOpacity onPress={handleAddToCart} activeOpacity={0.8}>
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            }}
          >
            {added ? (
              <Check
                size={moderateScale(22)}
                color="#ADE406"
                strokeWidth={3}
              />
            ) : (
              <Image
                source={require("../../assets/images/green_cart.png")}
                style={styles.cartIcon}
                resizeMode="contain"
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
  },
  image: {
    width: "100%",
    height: verticalScale(140),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(6),
  },
  title: {
    fontSize: moderateScale(14),
    fontWeight: "700",
    color: "white",
  },
  description: {
    fontSize: moderateScale(12),
    color: "#aaa7a7ff",
    marginVertical: verticalScale(4),
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(2),
  },
  price: {
    fontSize: moderateScale(14),
    fontWeight: "bold",
    color: "#ADE406",
  },
  cartIcon: {
    width: moderateScale(22),
    height: moderateScale(22),
  },
});
