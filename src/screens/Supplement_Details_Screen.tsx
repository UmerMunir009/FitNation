import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Heart } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { getProductDetail, getSupplementDetail } from '../api/public';
import { addToWishlistApi, getWishlistApi, removeFromWishlistApi } from '../api/user';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import { screenTopPadding } from '../theme/layout';
import RemoteImage from '../components/RemoteImage';

const SupplementDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { product } = route.params;
  const [detail, setDetail] = useState(product);
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      const id = product?.guid || product?.id;
      if (!id) return;
      setLoading(true);
      try {
        const response = product?.type
          ? await getSupplementDetail(id)
          : await getProductDetail(id);
        setDetail(response?.data || response);
      } catch (error) {
        setDetail(product);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [product]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await getWishlistApi();
        const list = response?.data?.data || response?.data || response || [];
        const id = product?.guid || product?.id;
        setWishlisted(
          Array.isArray(list) &&
            list.some((item: any) =>
              [item.product_id, item.item_id, item.product?.guid, item.guid, item.id]
                .map(String)
                .includes(String(id)),
            ),
        );
      } catch (error) {
        setWishlisted(false);
      }
    };
    fetchWishlist();
  }, [product]);

  const handleWishlist = async () => {
    const id = detail.guid || detail.id;
    setWishlistLoading(true);
    try {
      if (wishlisted) {
        await removeFromWishlistApi(id);
        setWishlisted(false);
        showSuccessToast('Removed from wishlist');
      } else {
        await addToWishlistApi(id, 'product');
        setWishlisted(true);
        showSuccessToast('Added to wishlist');
      }
    } catch (error: any) {
      showErrorToast(error.response?.data?.message || 'Wishlist update failed');
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading && !detail) {
    return (
      <View style={[styles.container, styles.loader]}>
        <ActivityIndicator size="large" color="#ADE406" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: verticalScale(40) }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Supplement Details</Text>
        <TouchableOpacity onPress={handleWishlist} disabled={wishlistLoading}>
          {wishlistLoading ? (
            <ActivityIndicator size="small" color="#ADE406" />
          ) : (
            <Heart
              size={22}
              color="#ADE406"
              fill={wishlisted ? '#ADE406' : 'transparent'}
            />
          )}
        </TouchableOpacity>
      </View>

      <RemoteImage sourceUri={detail.image_url} style={styles.image} />

      <Text style={styles.name}>{detail.name}</Text>
      <Text style={styles.price}>
        Rs. {detail.final_price || detail.current_price || detail.price}
        {detail.has_discount && (
          <Text style={styles.originalPrice}> Rs. {detail.price}</Text>
        )}
      </Text>

      <Text style={styles.description}>{detail.description}</Text>

      {detail.benefits && (
        <>
          <Text style={styles.sectionTitle}>Benefits</Text>
          <Text style={styles.textContent}>{detail.benefits}</Text>
        </>
      )}

      {detail.suggested_use && (
        <>
          <Text style={styles.sectionTitle}>Suggested Use</Text>
          <Text style={styles.textContent}>{detail.suggested_use}</Text>
        </>
      )}

      {detail.nutritional_information && (
        <>
          <Text style={styles.sectionTitle}>Nutritional Information</Text>
          <Text style={styles.textContent}>{detail.nutritional_information}</Text>
        </>
      )}

      {detail.flavor && (
        <>
          <Text style={styles.sectionTitle}>Flavor</Text>
          <Text style={styles.textContent}>{detail.flavor}</Text>
        </>
      )}

      {detail.gallery_images?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <FlatList
            data={detail.gallery_images}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <RemoteImage
                sourceUri={item.image_url}
                style={styles.galleryImage}
                resizeMode="cover"
              />
            )}
            contentContainerStyle={{ paddingVertical: verticalScale(10) }}
          />
        </>
      )}
    </ScrollView>
  );
};

export default SupplementDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: moderateScale(16),
    paddingTop: screenTopPadding,
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(15),
  },
  headerTitle: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  image: {
    width: '100%',
    height: verticalScale(200),
    borderRadius: 10,
    marginBottom: verticalScale(12),
  },
  name: {
    color: '#fff',
    fontSize: moderateScale(20),
    fontWeight: '800',
    marginBottom: verticalScale(6),
  },
  price: {
    color: '#ADE406',
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(12),
  },
  originalPrice: {
    color: '#aaa',
    textDecorationLine: 'line-through',
    marginLeft: moderateScale(8),
    fontWeight: '400',
    fontSize: moderateScale(14),
  },
  description: {
    color: '#ccc',
    fontSize: moderateScale(14),
    marginBottom: verticalScale(12),
  },
  sectionTitle: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: '700',
    marginBottom: verticalScale(6),
    marginTop: verticalScale(12),
  },
  textContent: {
    color: '#ccc',
    fontSize: moderateScale(14),
    marginBottom: verticalScale(8),
  },
  galleryImage: {
    width: scale(120),
    height: verticalScale(120),
    borderRadius: 8,
    marginRight: scale(10),
  },
});
