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
import {
  getActiveCategories,
  getActiveProducts,
  getCategories,
  getCategoryDetail,
  getFeaturedProducts,
  getProductsByCategory,
  getSupplements,
  getSupplementsByType,
} from '../api/public';
import { getCartApi } from '../api/cart';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { screenTopPadding } from '../theme/layout';

const getCartProductGuids = (items: any[] = []) =>
  items
    .map(item => item?.product?.guid || item?.product_guid || item?.product_id)
    .filter(Boolean)
    .map(String);

const BestSellingSupplementsScreen: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]); 
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [catalogMode, setCatalogMode] = useState<'products' | 'supplements'>('supplements');
  const [productFilter, setProductFilter] = useState<'active' | 'featured'>('active');
  const [supplementType, setSupplementType] = useState<string | null>(null);
  const [categoryDetail, setCategoryDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, catalogMode, productFilter, supplementType]);

  const fetchAllData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [resProducts, resCategories, resActiveCategories, resCart] =
        await Promise.all([
        catalogMode === 'supplements'
          ? supplementType
            ? getSupplementsByType(supplementType)
            : getSupplements({ page: 1, perPage: 300 })
          : productFilter === 'featured'
          ? getFeaturedProducts(300)
          : selectedCategory
          ? getProductsByCategory(selectedCategory.guid || selectedCategory.id, {
              page: 1,
              perPage: 300,
            })
          : getActiveProducts({ page: 1, perPage: 300 }),
        getCategories({ page: 1, perPage: 100 }),
        getActiveCategories(),
          getCartApi(),
        ]);

      setProducts(resProducts.data?.data || resProducts.data || []);
      const allCategories =
        resCategories.data?.data || resCategories.data || resCategories || [];
      const activeCategories =
        resActiveCategories.data?.data ||
        resActiveCategories.data ||
        resActiveCategories ||
        [];
      setCategories((allCategories.length ? allCategories : activeCategories) || []);
      
      const guidsInCart = getCartProductGuids(resCart.data?.items);
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
      const guidsInCart = getCartProductGuids(resCart.data?.items);
      setCartItems(guidsInCart);
    } catch (error) {
      console.error("Cart sync error:", error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAllData(false);
  };

  const handleSelectCategory = async (category: any | null) => {
    setSelectedCategory(category);
    if (!category) {
      setCategoryDetail(null);
      return;
    }
    try {
      const response = await getCategoryDetail(category.guid || category.id);
      setCategoryDetail(response.data || response);
    } catch (error) {
      setCategoryDetail(category);
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
        <Text style={styles.header}>
          {catalogMode === 'supplements' ? 'All Supplements' : 'All Products'}
        </Text>
      </View>

      <View style={styles.modeRow}>
        {(['supplements', 'products'] as const).map(mode => (
          <TouchableOpacity
            key={mode}
            style={[styles.modeBtn, catalogMode === mode && styles.modeBtnActive]}
            onPress={() => {
              setCatalogMode(mode);
              setSelectedCategory(null);
              setProductFilter('active');
              setSupplementType(null);
            }}
          >
            <Text
              style={[
                styles.modeText,
                catalogMode === mode && styles.modeTextActive,
              ]}
            >
              {mode === 'supplements' ? 'Supplements' : 'Products'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {catalogMode === 'products' ? (
        <>
          <View style={styles.typeRow}>
            {(['active', 'featured'] as const).map(filter => {
              const active = productFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[styles.categoryChip, active && styles.categoryChipActive]}
                  onPress={() => {
                    setProductFilter(filter);
                    if (filter === 'featured') setSelectedCategory(null);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      active && styles.categoryTextActive,
                    ]}
                  >
                    {filter === 'active' ? 'Active Products' : 'Featured Products'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <FlatList
            horizontal
            data={[{ id: 'all', name: 'All' }, ...categories]}
            keyExtractor={item => String(item.guid || item.id)}
            showsHorizontalScrollIndicator={false}
            style={styles.categoryList}
            renderItem={({ item }) => {
              const active =
                (!selectedCategory && item.id === 'all') ||
                selectedCategory?.id === item.id ||
                selectedCategory?.guid === item.guid;
              return (
                <TouchableOpacity
                  style={[styles.categoryChip, active && styles.categoryChipActive]}
                  onPress={() => handleSelectCategory(item.id === 'all' ? null : item)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      active && styles.categoryTextActive,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          {!!categoryDetail?.description && (
            <Text style={styles.categoryDescription} numberOfLines={2}>
              {categoryDetail.description}
            </Text>
          )}
        </>
      ) : (
        <View style={styles.typeRow}>
          {['All', 'PROTEIN', 'CREATINE', 'PRE_WORKOUT'].map(type => {
            const active = (!supplementType && type === 'All') || supplementType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.categoryChip, active && styles.categoryChipActive]}
                onPress={() => setSupplementType(type === 'All' ? null : type)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    active && styles.categoryTextActive,
                  ]}
                >
                  {type.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

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
              inCart={cartItems.includes(String(item.guid || item.id))} 
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
    paddingTop: screenTopPadding,
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
  categoryList: {
    marginBottom: verticalScale(12),
    maxHeight: verticalScale(38),
  },
  modeRow: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: verticalScale(10),
  },
  modeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(8),
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: '#ADE406',
    borderColor: '#ADE406',
  },
  modeText: {
    color: '#aaa',
    fontWeight: '800',
  },
  modeTextActive: {
    color: '#000',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: verticalScale(12),
  },
  categoryDescription: {
    color: '#999',
    marginBottom: verticalScale(8),
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: moderateScale(18),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(7),
    marginRight: scale(8),
  },
  categoryChipActive: {
    backgroundColor: '#ADE406',
    borderColor: '#ADE406',
  },
  categoryText: {
    color: '#aaa',
    fontWeight: '700',
  },
  categoryTextActive: {
    color: '#000',
  },
});
