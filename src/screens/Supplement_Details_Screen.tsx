import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const SupplementDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { product } = route.params;

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
        <View style={{ width: 24 }} />
      </View>

      <Image source={{ uri: product.image_url }} style={styles.image} />

      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>
        Rs. {product.final_price}
        {product.has_discount && (
          <Text style={styles.originalPrice}> Rs. {product.price}</Text>
        )}
      </Text>

      <Text style={styles.description}>{product.description}</Text>

      {product.benefits && (
        <>
          <Text style={styles.sectionTitle}>Benefits</Text>
          <Text style={styles.textContent}>{product.benefits}</Text>
        </>
      )}

      {product.suggested_use && (
        <>
          <Text style={styles.sectionTitle}>Suggested Use</Text>
          <Text style={styles.textContent}>{product.suggested_use}</Text>
        </>
      )}

      {product.nutritional_information && (
        <>
          <Text style={styles.sectionTitle}>Nutritional Information</Text>
          <Text style={styles.textContent}>{product.nutritional_information}</Text>
        </>
      )}

      {product.flavor && (
        <>
          <Text style={styles.sectionTitle}>Flavor</Text>
          <Text style={styles.textContent}>{product.flavor}</Text>
        </>
      )}

      {product.gallery_images?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <FlatList
            data={product.gallery_images}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.image_url }}
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
    paddingTop: verticalScale(30),
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
