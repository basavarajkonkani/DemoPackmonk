import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../store';
import { addToCart } from '../store/cartSlice';
import { IMAGES } from '../constants/images';

interface WishlistItem {
  id: string;
  name: string;
  image: any;
  price: number;
  category: string;
  inStock: boolean;
  discount?: number;
}

const WishlistScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: '1',
      name: 'Kraft Stand-Up Pouch',
      image: IMAGES.kraftPouch,
      price: 12000,
      category: 'Stand-Up Pouches',
      inStock: true,
      discount: 10,
    },
    {
      id: '2',
      name: 'Plain Pouch with Window',
      image: IMAGES.plainPouchWindow,
      price: 15000,
      category: 'Window Pouches',
      inStock: true,
    },
    {
      id: '3',
      name: 'Printed Standup Pouch',
      image: IMAGES.standupPouch,
      price: 18000,
      category: 'Printed Pouches',
      inStock: true,
      discount: 15,
    },
    {
      id: '4',
      name: 'Center Seal Pouch',
      image: IMAGES.centerSealPouch,
      price: 14000,
      category: 'Center Seal Pouches',
      inStock: false,
    },
  ]);

  const removeFromWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddToCart = (item: WishlistItem) => {
    // Create a proper CartItem structure
    dispatch(
      addToCart({
        cartId: `cart-${item.id}-${Date.now()}`,
        productId: item.id,
        name: item.name,
        category: 'pouch',
        design: {
          length: 300,
          width: 200,
          height: 100,
          materialId: 'kraft',
          inkColor: '#000000',
          logoUri: null,
          logoScale: 1,
          logoPosX: 0,
          logoPosY: 0,
          customText: '',
          textColor: '#000000',
          textSize: 16,
        },
        quantity: 1,
        baseUnitPrice: item.price / 1000, // Convert to per-unit price
        unitPrice: item.price / 1000,
        totalPrice: item.price / 1000,
        setupFee: 0,
      })
    );
    // Optionally remove from wishlist after adding to cart
    removeFromWishlist(item.id);
  };

  const handleViewProduct = (item: WishlistItem) => {
    navigation.navigate('ProductDetail' as never, { productId: item.id } as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={20} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {wishlistItems.length > 0 ? (
          <View style={styles.wishlistGrid}>
            {wishlistItems.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromWishlist(item.id)}
                >
                  <FontAwesome5 name="times" size={16} color="#EF4444" />
                </TouchableOpacity>

                {item.discount && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{item.discount}% OFF</Text>
                  </View>
                )}

                <TouchableOpacity onPress={() => handleViewProduct(item)}>
                  <View style={styles.imageContainer}>
                    <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
                  </View>
                </TouchableOpacity>

                <View style={styles.itemInfo}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>

                  <View style={styles.priceRow}>
                    <View>
                      {item.discount ? (
                        <>
                          <Text style={styles.originalPrice}>₹{item.price.toLocaleString()}</Text>
                          <Text style={styles.discountedPrice}>
                            ₹{(item.price * (1 - item.discount / 100)).toLocaleString()}
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.price}>₹{item.price.toLocaleString()}</Text>
                      )}
                    </View>
                    <View
                      style={[
                        styles.stockBadge,
                        { backgroundColor: item.inStock ? '#DCFCE7' : '#FEE2E2' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.stockText,
                          { color: item.inStock ? '#0F8A3C' : '#EF4444' },
                        ]}
                      >
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.addToCartButton, !item.inStock && styles.disabledButton]}
                    onPress={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                  >
                    <FontAwesome5 name="cart-plus" size={14} color="#FFFFFF" />
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <FontAwesome5 name="heart" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>Your Wishlist is Empty</Text>
            <Text style={styles.emptyStateText}>
              Save items you love to your wishlist
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('Products' as never)}
            >
              <Text style={styles.browseButtonText}>Browse Products</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  wishlistGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  itemCard: {
    width: (Platform.OS === 'web' ? 'calc(33.333% - 11px)' : '48%') as any,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F3F4F6',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    padding: 12,
  },
  categoryText: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    minHeight: 36,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F8A3C',
  },
  originalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stockText: {
    fontSize: 10,
    fontWeight: '700',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F8A3C',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  addToCartText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#0F8A3C',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  browseButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default WishlistScreen;
