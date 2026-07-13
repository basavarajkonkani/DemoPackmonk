import React, { useState } from 'react';
import { ScrollView, Alert, Platform } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch } from '../store';
import { addToCart } from '../store/cartSlice';
import StockIndicator from '../components/StockIndicator';
import MOQBadge from '../components/MOQBadge';
import PincodeChecker from '../components/PincodeChecker';
import { useBottomLayoutCalculations } from '../utils/layoutUtils';

interface SizeOption {
  id: string;
  dimensions: string;
  capacity: string;
  price: number;
}

interface ReadyStockProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  material: string;
  finish: string;
  size: string;
  dimensions: { length: number; width: number; height: number };
  hasZipper: boolean;
  hasWindow: boolean;
  thickness: string;
  price: number;
  moq: number;
  stockCount: number;
  inStock: boolean;
  image: any;
  ecoRating: number;
  sizeOptions?: SizeOption[];
}

interface Props {
  route: any;
  navigation: any;
}

const ReadyStockProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const layoutCalcs = useBottomLayoutCalculations();
  const { product } = route.params as { product: ReadyStockProduct };
  const quantityInputRef = React.useRef<any>(null);

  const [quantity, setQuantity] = useState(product.moq);
  const [showPincodeChecker, setShowPincodeChecker] = useState(false);
  const [selectedSizeId, setSelectedSizeId] = useState<string>(
    product.sizeOptions?.[0]?.id || 'default'
  );

  // Get the current selected size option and its price
  const selectedSize = product.sizeOptions?.find(s => s.id === selectedSizeId) || 
    { id: 'default', dimensions: '', capacity: product.size, price: product.price };
  const currentPrice = selectedSize.price;

  const handleQuantityChange = (newQty: number) => {
    // Allow any value to be set while typing, but validate on final submission
    if (isNaN(newQty) || newQty <= 0) {
      return; // Don't update if invalid
    }
    setQuantity(newQty);
  };

  const handleQuantityBlur = () => {
    // Validate when user leaves the field
    if (quantity < product.moq) {
      Alert.alert('Below MOQ', `Minimum order quantity is ${product.moq} units.`);
      setQuantity(product.moq);
      return;
    }
    if (quantity > product.stockCount) {
      Alert.alert('Stock Limit', `Only ${product.stockCount} units available in stock.`);
      setQuantity(product.stockCount);
      return;
    }
  };

  const handleAddToCart = () => {
    if (quantity < product.moq) {
      Alert.alert(
        'Below MOQ',
        `Minimum order quantity is ${product.moq} units. Please increase quantity.`
      );
      return;
    }

    if (!product.inStock) {
      Alert.alert('Out of Stock', 'This product is currently out of stock.');
      return;
    }

    // Determine pouchType and materialType from product properties
    let pouchType: 'plain' | 'printed' | 'kraft' = 'plain';
    if (product.material.toLowerCase().includes('kraft')) {
      pouchType = 'kraft';
    } else if (product.material.toLowerCase().includes('printed')) {
      pouchType = 'printed';
    }

    let materialType: 'metalised' | 'non_metalised' = 'non_metalised';
    if (product.material.toLowerCase().includes('metalised')) {
      materialType = 'metalised';
    }

    const windowOption: 'with_window' | 'without_window' = product.hasWindow ? 'with_window' : 'without_window';

    const cartItem = {
      cartId: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      category: 'pouch' as const,
      design: {
        length: product.dimensions.length,
        width: product.dimensions.width,
        height: product.dimensions.height,
        materialId: product.material.toLowerCase(),
        inkColor: '#000000',
        logoUri: null,
        logoScale: 1,
        logoPosX: 0,
        logoPosY: 0,
        customText: '',
        textColor: '#000000',
        textSize: 12,
      },
      pouchConfig: {
        pouchType,
        windowOption,
        materialType,
        capacity: selectedSize.capacity as '50g' | '100g' | '200g' | '250g' | '500g' | '1kg' | '2kg',
        artworkUri: null,
        needsDesignAssistance: false,
        dimensions: { width: product.dimensions.width, height: product.dimensions.height, unit: 'mm' },
        finish: product.finish,
        zip: product.hasZipper ? 'With Zipper' : 'No Zipper',
        thickness: parseFloat(product.thickness),
      },
      quantity,
      unitPrice: currentPrice,
      baseUnitPrice: currentPrice,
      totalPrice: currentPrice * quantity,
      setupFee: 0,
    };

    dispatch(addToCart(cartItem));
    navigation.navigate('MainTabs', { screen: 'Cart' });
  };

  const totalPrice = currentPrice * quantity;

  return (
    <ScreenContainer>
      <InnerContainer>
        {/* Header */}
        <NavBar>
          <NavBtn onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={16} color="#111827" />
          </NavBtn>
          <NavTitle>Product Details</NavTitle>
          <NavBtn onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' })}>
            <FontAwesome5 name="shopping-cart" size={16} color="#111827" />
          </NavBtn>
        </NavBar>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: layoutCalcs.scrollViewPaddingWithTabBarAndFooter }}
          keyboardShouldPersistTaps="handled"
        >
        {/* Product Image */}
        <ProductImageContainer>
          <ProductImage source={product.image} resizeMode="cover" />
          {product.ecoRating >= 4 && (
            <EcoBadge>
              <FontAwesome5 name="leaf" size={9} color="#FFF" style={{ marginRight: 4 }} />
              <EcoBadgeText>Eco-Friendly</EcoBadgeText>
            </EcoBadge>
          )}
        </ProductImageContainer>

        <ContentSection>
          {/* Product Info */}
          <ProductHeader>
            <ProductName>{product.name}</ProductName>
            <PriceRow>
              <PriceLabel>Price Per Piece</PriceLabel>
              <PriceValue>₹{product.price.toFixed(2)}</PriceValue>
            </PriceRow>
          </ProductHeader>

          <ProductDescription>{product.description}</ProductDescription>

          {/* Stock & MOQ Info */}
          <InfoRow>
            <StockIndicator 
              inStock={product.inStock} 
              stockCount={product.stockCount}
              size="medium"
            />
            <MOQBadge moq={product.moq} currentQuantity={quantity} size="medium" />
          </InfoRow>

          <Divider />

          {/* Size Selection */}
          {product.sizeOptions && product.sizeOptions.length > 0 && (
            <>
              <SectionTitle>Select Size</SectionTitle>
              <SizeOptionsContainer>
                {product.sizeOptions.map((sizeOption) => (
                  <SizeOptionCard
                    key={sizeOption.id}
                    active={selectedSizeId === sizeOption.id}
                    onPress={() => setSelectedSizeId(sizeOption.id)}
                    activeOpacity={0.7}
                  >
                    <SizeOptionLeft>
                      <SizeOptionDimensions>{sizeOption.dimensions}</SizeOptionDimensions>
                      <SizeOptionCapacity>{sizeOption.capacity}</SizeOptionCapacity>
                    </SizeOptionLeft>
                    <SizeOptionPrice>₹{sizeOption.price.toFixed(2)}</SizeOptionPrice>
                    <SizeOptionRadio>
                      <SizeOptionRadioOuter active={selectedSizeId === sizeOption.id}>
                        {selectedSizeId === sizeOption.id && (
                          <SizeOptionRadioInner />
                        )}
                      </SizeOptionRadioOuter>
                    </SizeOptionRadio>
                  </SizeOptionCard>
                ))}
              </SizeOptionsContainer>
              <Divider />
            </>
          )}

          {/* Specifications */}
          <SectionTitle>Specifications</SectionTitle>
          <SpecsCard>
            <SpecRow>
              <SpecLabel>Micron</SpecLabel>
              <SpecValue>112</SpecValue>
            </SpecRow>
            <SpecRow>
              <SpecLabel>Material</SpecLabel>
              <SpecValue>{product.material}</SpecValue>
            </SpecRow>
            <SpecRow>
              <SpecLabel>Sealing</SpecLabel>
              <SpecValue>Heat sealable</SpecValue>
            </SpecRow>
            <SpecRow noBorder>
              <SpecLabel>Heat Resistance</SpecLabel>
              <SpecValue>100°C</SpecValue>
            </SpecRow>
          </SpecsCard>

          <Divider />

          {/* Delivery Info */}
          <SectionTitle>Delivery Information</SectionTitle>
          <DeliveryCard>
            <DeliveryRow>
              <FontAwesome5 name="shipping-fast" size={16} color="#0F8A3C" />
              <DeliveryText>Ships within 24 hours</DeliveryText>
            </DeliveryRow>
            <DeliveryRow>
              <FontAwesome5 name="box-open" size={16} color="#0F8A3C" />
              <DeliveryText>Plain pouches without custom printing</DeliveryText>
            </DeliveryRow>
          </DeliveryCard>

          {/* Pincode Checker */}
          <PincodeToggle 
            onPress={() => setShowPincodeChecker(!showPincodeChecker)}
            activeOpacity={0.8}
          >
            <PincodeToggleText>Check delivery at your location</PincodeToggleText>
            <FontAwesome5 
              name={showPincodeChecker ? 'chevron-up' : 'chevron-down'} 
              size={12} 
              color="#0F8A3C" 
            />
          </PincodeToggle>

          {showPincodeChecker && <PincodeChecker />}

          <Divider />

          {/* Quantity Selection */}
          <SectionTitle>Quantity (pieces)</SectionTitle>

          <QuantityControls>
            <QuantityBtn 
              onPress={() => {
                const newQty = Math.max(product.moq, quantity - 100);
                if (newQty >= product.moq && newQty <= product.stockCount) {
                  setQuantity(newQty);
                } else if (newQty < product.moq) {
                  Alert.alert('Below MOQ', `Minimum order quantity is ${product.moq} units.`);
                } else {
                  Alert.alert('Stock Limit', `Only ${product.stockCount} units available in stock.`);
                }
              }}
              activeOpacity={0.8}
            >
              <FontAwesome5 name="minus" size={14} color="#FFFFFF" />
            </QuantityBtn>
            <QuantityInput
              ref={quantityInputRef}
              value={quantity.toString()}
              onChangeText={(text: string) => {
                const num = parseInt(text);
                handleQuantityChange(num);
              }}
              onBlur={handleQuantityBlur}
              keyboardType="number-pad"
              placeholder={product.moq.toString()}
              placeholderTextColor="#9CA3AF"
              editable={true}
              selectTextOnFocus={true}
            />
            <QuantityBtn 
              onPress={() => {
                const newQty = quantity + 100;
                if (newQty >= product.moq && newQty <= product.stockCount) {
                  setQuantity(newQty);
                } else if (newQty > product.stockCount) {
                  Alert.alert('Stock Limit', `Only ${product.stockCount} units available in stock.`);
                }
              }}
              activeOpacity={0.8}
            >
              <FontAwesome5 name="plus" size={14} color="#FFFFFF" />
            </QuantityBtn>
          </QuantityControls>

          {/* Quick Select */}
          <QuickSelectRow>
            {[500, 1000, 2000, 5000].map(qty => (
              <QuickSelectBtn
                key={qty}
                onPress={() => {
                  if (qty >= product.moq && qty <= product.stockCount) {
                    setQuantity(qty);
                  } else if (qty < product.moq) {
                    Alert.alert('Below MOQ', `Minimum order quantity is ${product.moq} units.`);
                  } else {
                    Alert.alert('Stock Limit', `Only ${product.stockCount} units available in stock.`);
                  }
                }}
                active={quantity === qty}
                activeOpacity={0.8}
              >
                <QuickSelectText active={quantity === qty}>{qty}</QuickSelectText>
              </QuickSelectBtn>
            ))}
          </QuickSelectRow>

          {/* Price Summary */}
          <PriceSummaryCard>
            <PriceSummaryRow>
              <PriceSummaryLabel>Subtotal</PriceSummaryLabel>
              <PriceSummaryValue>₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</PriceSummaryValue>
            </PriceSummaryRow>
          </PriceSummaryCard>
        </ContentSection>
      </ScrollView>

      {/* Bottom Action Bar - Positioned above bottom nav, outside main flex */}
      <BottomActionBar safeAreaBottom={insets.bottom} bottomTabBarHeight={layoutCalcs.tabBarHeight}>
        <BottomTotalSection>
          <BottomTotalLabel>Total</BottomTotalLabel>
          <BottomTotalPrice>₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</BottomTotalPrice>
          <BottomTotalQty>{quantity} units</BottomTotalQty>
        </BottomTotalSection>
        <AddToCartButton onPress={handleAddToCart} activeOpacity={0.9}>
          <FontAwesome5 name="shopping-cart" size={14} color="#FFFFFF" style={{ marginRight: 8 }} />
          <AddToCartButtonText>Add to Cart</AddToCartButtonText>
        </AddToCartButton>
      </BottomActionBar>
    </InnerContainer>
    </ScreenContainer>
  );
};

export default ReadyStockProductDetailScreen;

const ScreenContainer = styled.View`
  flex: 1;
  background-color: #F8F9FA;
`;

const InnerContainer = styled.View`
  flex: 1;
  background-color: #F8F9FA;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const NavBar = styled.View`
  height: ${Platform.OS === 'ios' ? '88px' : '56px'};
  padding-top: ${Platform.OS === 'ios' ? '44px' : '0px'};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #F3F4F6;
  background-color: #FFFFFF;
`;

const NavBtn = styled.TouchableOpacity`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background-color: #F9FAFB;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #F3F4F6;
`;

const NavTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;

const ProductImageContainer = styled.View`
  width: 100%;
  height: 300px;
  background-color: #FFFFFF;
  position: relative;
`;

const ProductImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const EcoBadge = styled.View`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: #059669;
  flex-direction: row;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
`;

const EcoBadgeText = styled.Text`
  font-size: 11px;
  font-weight: 700;
  color: #FFFFFF;
`;

const ContentSection = styled.View`
  padding: 20px 16px;
`;

const ProductHeader = styled.View`
  margin-bottom: 12px;
`;

const ProductName = styled.Text`
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 12px;
  line-height: 32px;
`;

const PriceRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`;

const PriceLabel = styled.Text`
  font-size: 13px;
  color: #6B7280;
  font-weight: 500;
`;

const PriceValue = styled.Text`
  font-size: 22px;
  font-weight: 800;
  color: #0F8A3C;
`;

const SizeOptionsContainer = styled.View`
  gap: 10px;
  margin-bottom: 12px;
`;

const SizeOptionCard = styled.TouchableOpacity<{ active: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 14px 16px;
  background-color: ${({ active }: { active: boolean }) => (active ? '#F0F9FF' : '#FFFFFF')};
  border-radius: 12px;
  border-width: 1.5px;
  border-color: ${({ active }: { active: boolean }) => (active ? '#0F8A3C' : '#E5E7EB')};
`;

const SizeOptionLeft = styled.View`
  flex: 1;
`;

const SizeOptionDimensions = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2px;
`;

const SizeOptionCapacity = styled.Text`
  font-size: 12px;
  color: #6B7280;
`;

const SizeOptionPrice = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #0F8A3C;
  margin-right: 12px;
`;

const SizeOptionRadio = styled.View`
  align-items: center;
  justify-content: center;
`;

const SizeOptionRadioOuter = styled.View<{ active: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-width: 2px;
  border-color: ${({ active }: { active: boolean }) => (active ? '#0F8A3C' : '#D1D5DB')};
  align-items: center;
  justify-content: center;
`;

const SizeOptionRadioInner = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #0F8A3C;
`;

const ProductDescription = styled.Text`
  font-size: 14px;
  color: #6B7280;
  line-height: 22px;
  margin-bottom: 16px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #E5E7EB;
  margin-vertical: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
`;

const SpecsCard = styled.View`
  background-color: #FFFFFF;
  border-radius: 12px;
  border-width: 1px;
  border-color: #E5E7EB;
  overflow: hidden;
`;

const SpecRow = styled.View<{ noBorder?: boolean }>`
  flex-direction: row;
  padding: 14px 16px;
  border-bottom-width: ${({ noBorder }: { noBorder?: boolean }) => (noBorder ? '0' : '1')}px;
  border-bottom-color: #F3F4F6;
`;

const SpecLabel = styled.Text`
  width: 100px;
  font-size: 13px;
  font-weight: 600;
  color: #6B7280;
`;

const SpecValue = styled.Text`
  flex: 1;
  font-size: 13px;
  color: #111827;
  font-weight: 500;
`;

const FeaturesColumn = styled.View`
  flex: 1;
  gap: 8px;
`;

const FeatureItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const FeatureText = styled.Text`
  font-size: 13px;
  color: #111827;
  font-weight: 500;
`;

const DeliveryCard = styled.View`
  background-color: #DCFCE7;
  border-radius: 12px;
  padding: 14px 16px;
  border-width: 1px;
  border-color: #BBF7D0;
  gap: 10px;
`;

const DeliveryRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const DeliveryText = styled.Text`
  flex: 1;
  font-size: 13px;
  color: #0A6B2E;
  font-weight: 500;
  line-height: 19px;
`;

const PincodeToggle = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  background-color: #F9FAFB;
  border-radius: 10px;
  margin-top: 12px;
  border-width: 1px;
  border-color: #E5E7EB;
`;

const PincodeToggleText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #0F8A3C;
`;

const QuantityHint = styled.Text`
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 12px;
`;

const QuantityControls = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const QuantityBtn = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: #0F8A3C;
  align-items: center;
  justify-content: center;
`;

const QuantityInput = styled.TextInput`
  width: 120px;
  height: 44px;
  border-radius: 12px;
  border-width: 1.5px;
  border-color: #0F8A3C;
  background-color: #FFFFFF;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  padding: 0px;
`;

const QuickSelectRow = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-bottom: 16px;
`;

const QuickSelectBtn = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  background-color: ${({ active }: { active: boolean }) => (active ? '#0F8A3C' : '#FFFFFF')};
  border-width: 1.5px;
  border-color: ${({ active }: { active: boolean }) => (active ? '#0F8A3C' : '#E5E7EB')};
  align-items: center;
`;

const QuickSelectText = styled.Text<{ active: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ active }: { active: boolean }) => (active ? '#FFFFFF' : '#6B7280')};
`;

const PriceSummaryCard = styled.View`
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  border-width: 1px;
  border-color: #E5E7EB;
`;

const PriceSummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const PriceSummaryLabel = styled.Text`
  font-size: 13px;
  color: #6B7280;
`;

const PriceSummaryValue = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
`;

const PriceSummaryDivider = styled.View`
  height: 1px;
  background-color: #F3F4F6;
  margin-vertical: 10px;
`;

const PriceSummaryTotalLabel = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #111827;
`;

const PriceSummaryTotal = styled.Text`
  font-size: 20px;
  font-weight: 800;
  color: #0F8A3C;
`;

const BottomActionBar = styled.View<{ safeAreaBottom: number; bottomTabBarHeight: number | string }>`
  position: absolute;
  bottom: ${({ bottomTabBarHeight }) => `${bottomTabBarHeight}px`};
  left: 0;
  right: 0;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #FFFFFF;
  padding: 12px 16px;
  padding-bottom: 16px;
  border-top-width: 1px;
  border-top-color: #E5E7EB;
  shadow-color: #000;
  shadow-offset: 0px -4px;
  shadow-opacity: 0.15;
  shadow-radius: 12px;
  elevation: 50;
  z-index: 10000;
  gap: 12px;
`;

const BottomTotalSection = styled.View`
  flex: 0 0 auto;
  min-width: 90px;
  padding-right: 8px;
  justify-content: flex-end;
`;

const BottomTotalLabel = styled.Text`
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 3px;
  line-height: 14px;
`;

const BottomTotalPrice = styled.Text`
  font-size: 18px;
  font-weight: 800;
  color: #0F8A3C;
  line-height: 20px;
`;

const BottomTotalQty = styled.Text`
  font-size: 10px;
  color: #9CA3AF;
  margin-top: 1px;
  line-height: 12px;
`;

const AddToCartButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #0F8A3C;
  padding-horizontal: 20px;
  flex: 1 1 auto;
  min-width: 140px;
  height: 48px;
  border-radius: 12px;
  shadow-color: #0F8A3C;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 5;
`;

const AddToCartButtonText = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #FFFFFF;
`;
