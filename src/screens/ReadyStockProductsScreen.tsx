import React, { useState } from 'react';
import { ScrollView, Alert, Platform } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch } from '../store';
import { addToCart } from '../store/cartSlice';
import StockIndicator from '../components/StockIndicator';
import MOQBadge from '../components/MOQBadge';
import PincodeChecker from '../components/PincodeChecker';
import { IMAGES } from '../constants/images';

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
  image: any; // Changed from images array to single image
  ecoRating: number;
}

const READY_STOCK_PRODUCTS: ReadyStockProduct[] = [
  {
    id: 'rs001',
    name: 'Clear Stand-Up Pouch with Zipper',
    description: 'Crystal clear BOPP pouch with resealable zipper, perfect for dry fruits, snacks, and tea.',
    category: 'pouch',
    material: 'BOPP',
    finish: 'Clear',
    size: 'Medium',
    dimensions: { length: 150, width: 100, height: 50 },
    hasZipper: true,
    hasWindow: false,
    thickness: '100μ',
    price: 2.05,
    moq: 500,
    stockCount: 5000,
    inStock: true,
    image: IMAGES.plainPouch,
    ecoRating: 3,
  },
  {
    id: 'rs002',
    name: 'Kraft Stand-Up Pouch (Brown)',
    description: 'Eco-friendly kraft paper pouch with window, ideal for organic products.',
    category: 'pouch',
    material: 'Kraft',
    finish: 'Brown',
    size: 'Medium',
    dimensions: { length: 160, width: 110, height: 60 },
    hasZipper: true,
    hasWindow: true,
    thickness: '120μ',
    price: 4.75,
    moq: 500,
    stockCount: 85,
    inStock: true,
    image: IMAGES.kraftWindowPouch,
    ecoRating: 5,
  },
  {
    id: 'rs003',
    name: 'Silver Metalized Pouch',
    description: 'Premium metalized finish with excellent barrier properties for long shelf life.',
    category: 'pouch',
    material: 'Metalized',
    finish: 'Silver',
    size: 'Large',
    dimensions: { length: 200, width: 130, height: 70 },
    hasZipper: true,
    hasWindow: false,
    thickness: '150μ',
    price: 6.20,
    moq: 1000,
    stockCount: 2500,
    inStock: true,
    image: IMAGES.metalised,
    ecoRating: 3,
  },
  {
    id: 'rs004',
    name: 'Small Clear Pouch (No Zipper)',
    description: 'Economical clear pouch without zipper for one-time use products.',
    category: 'pouch',
    material: 'BOPP',
    finish: 'Clear',
    size: 'Small',
    dimensions: { length: 100, width: 80, height: 40 },
    hasZipper: false,
    hasWindow: false,
    thickness: '80μ',
    price: 1.30,
    moq: 1000,
    stockCount: 10000,
    inStock: true,
    image: IMAGES.plainPouch,
    ecoRating: 2,
  },
  {
    id: 'rs005',
    name: 'Kraft Window Pouch with Zipper',
    description: 'Brown kraft with transparent window, perfect for showcasing products.',
    category: 'pouch',
    material: 'Kraft',
    finish: 'Brown',
    size: 'Small',
    dimensions: { length: 120, width: 90, height: 50 },
    hasZipper: true,
    hasWindow: true,
    thickness: '100μ',
    price: 3.50,
    moq: 500,
    stockCount: 45,
    inStock: true,
    image: IMAGES.kraftPouch,
    ecoRating: 5,
  },
  {
    id: 'rs006',
    name: 'X-Large Silver Metalized Pouch',
    description: 'Heavy-duty pouch for bulk packaging with superior protection.',
    category: 'pouch',
    material: 'Metalized',
    finish: 'Silver',
    size: 'X-Large',
    dimensions: { length: 250, width: 150, height: 90 },
    hasZipper: true,
    hasWindow: false,
    thickness: '150μ',
    price: 8.90,
    moq: 1000,
    stockCount: 0,
    inStock: false,
    image: IMAGES.metalised,
    ecoRating: 2,
  },
];

interface Props {
  navigation: any;
}

const ReadyStockProductsScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [selectedProduct, setSelectedProduct] = useState<ReadyStockProduct | null>(null);
  const [quantity, setQuantity] = useState(500);
  const [showPincodeChecker, setShowPincodeChecker] = useState(false);

  const handleSelectProduct = (product: ReadyStockProduct) => {
    setSelectedProduct(product);
    setQuantity(product.moq);
    setShowPincodeChecker(false);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    if (quantity < selectedProduct.moq) {
      Alert.alert(
        'Below MOQ',
        `Minimum order quantity is ${selectedProduct.moq} units. Please increase quantity.`
      );
      return;
    }

    if (!selectedProduct.inStock) {
      Alert.alert('Out of Stock', 'This product is currently out of stock.');
      return;
    }

    const cartItem = {
      cartId: `${selectedProduct.id}-${Date.now()}`,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      category: 'pouch' as const,
      design: {
        length: selectedProduct.dimensions.length,
        width: selectedProduct.dimensions.width,
        height: selectedProduct.dimensions.height,
        materialId: selectedProduct.material.toLowerCase(),
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
        finish: selectedProduct.finish,
        zip: selectedProduct.hasZipper ? 'With Zipper' : 'No Zipper',
        thickness: selectedProduct.thickness,
        size: selectedProduct.size,
        material: selectedProduct.material,
        hasWindow: selectedProduct.hasWindow,
      },
      quantity,
      unitPrice: selectedProduct.price,
      totalPrice: selectedProduct.price * quantity,
      setupFee: 0,
      isReadyStock: true,
    };

    dispatch(addToCart(cartItem));
    Alert.alert('Added to Cart', `${quantity} units added to your cart`, [
      { text: 'Continue Shopping', style: 'cancel' },
      { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
    ]);
  };

  const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0;

  return (
    <Container>
      {/* Header */}
      <NavBar>
        <NavBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={16} color="#111827" />
        </NavBtn>
        <NavTitle>Ready Stock Products</NavTitle>
        <NavBtn onPress={() => navigation.navigate('Cart')}>
          <FontAwesome5 name="shopping-cart" size={16} color="#111827" />
        </NavBtn>
      </NavBar>

      <ContentWrapper>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: selectedProduct ? 200 : 20 }}
        >
          {/* Info Banner */}
          <InfoBanner>
            <FontAwesome5 name="shipping-fast" size={16} color="#0F8A3C" />
            <InfoBannerText>
              Ready to ship! Plain pouches without custom printing. Ships within 24 hours.
            </InfoBannerText>
          </InfoBanner>

          {/* Product List */}
          <SectionTitle>Available Products</SectionTitle>
          {READY_STOCK_PRODUCTS.map(product => {
            const isSelected = selectedProduct?.id === product.id;
            return (
              <ProductCard
                key={product.id}
                selected={isSelected}
                onPress={() => handleSelectProduct(product)}
                activeOpacity={0.8}
              >
                <ProductHeader>
                  <ProductName>{product.name}</ProductName>
                  <ProductPrice>₹{product.price.toFixed(2)}/pc</ProductPrice>
                </ProductHeader>

                <ProductDescription>{product.description}</ProductDescription>

                <SpecsRow>
                  <SpecItem>
                    <FontAwesome5 name="ruler-combined" size={10} color="#6B7280" />
                    <SpecText>{product.size}</SpecText>
                  </SpecItem>
                  <SpecItem>
                    <FontAwesome5 name="layer-group" size={10} color="#6B7280" />
                    <SpecText>{product.thickness}</SpecText>
                  </SpecItem>
                  <SpecItem>
                    <FontAwesome5 name="box" size={10} color="#6B7280" />
                    <SpecText>{product.material}</SpecText>
                  </SpecItem>
                </SpecsRow>

                <FeaturesRow>
                  {product.hasZipper && (
                    <FeatureBadge>
                      <FontAwesome5 name="check" size={8} color="#0F8A3C" />
                      <FeatureBadgeText>Zipper</FeatureBadgeText>
                    </FeatureBadge>
                  )}
                  {product.hasWindow && (
                    <FeatureBadge>
                      <FontAwesome5 name="check" size={8} color="#0F8A3C" />
                      <FeatureBadgeText>Window</FeatureBadgeText>
                    </FeatureBadge>
                  )}
                  {product.ecoRating >= 4 && (
                    <FeatureBadge eco>
                      <FontAwesome5 name="leaf" size={8} color="#059669" />
                      <FeatureBadgeText eco>Eco-Friendly</FeatureBadgeText>
                    </FeatureBadge>
                  )}
                </FeaturesRow>

                <BadgeRow>
                  <MOQBadge moq={product.moq} size="small" />
                  <StockIndicator 
                    inStock={product.inStock} 
                    stockCount={product.stockCount}
                    size="small"
                  />
                </BadgeRow>
              </ProductCard>
            );
          })}
        </ScrollView>

        {/* Selected Product Details */}
        {selectedProduct && (
          <BottomSheet>
            <SheetHandle />
            
            <SelectedProductName>{selectedProduct.name}</SelectedProductName>
            <SelectedProductPrice>₹{selectedProduct.price.toFixed(2)} per unit</SelectedProductPrice>

            <Divider />

            {/* Quantity Selector */}
            <QuantitySection>
              <QuantityLabel>Quantity (MOQ: {selectedProduct.moq})</QuantityLabel>
              <QuantityControls>
                <QuantityBtn 
                  onPress={() => setQuantity(Math.max(selectedProduct.moq, quantity - 100))}
                  activeOpacity={0.8}
                >
                  <FontAwesome5 name="minus" size={14} color="#FFFFFF" />
                </QuantityBtn>
                <QuantityInput
                  value={quantity.toString()}
                  onChangeText={(text: string) => {
                    const num = parseInt(text) || 0;
                    setQuantity(num);
                  }}
                  keyboardType="number-pad"
                />
                <QuantityBtn 
                  onPress={() => setQuantity(quantity + 100)}
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
                    onPress={() => setQuantity(qty)}
                    active={quantity === qty}
                    activeOpacity={0.8}
                  >
                    <QuickSelectText active={quantity === qty}>{qty}</QuickSelectText>
                  </QuickSelectBtn>
                ))}
              </QuickSelectRow>

              <MOQBadge moq={selectedProduct.moq} currentQuantity={quantity} />
            </QuantitySection>

            {/* Pincode Checker Toggle */}
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

            {/* Total & CTA */}
            <TotalRow>
              <TotalLabel>Total Amount</TotalLabel>
              <TotalPrice>₹{totalPrice.toFixed(2)}</TotalPrice>
            </TotalRow>

            <AddToCartBtn onPress={handleAddToCart} activeOpacity={0.9}>
              <FontAwesome5 name="shopping-cart" size={14} color="#FFFFFF" style={{ marginRight: 8 }} />
              <AddToCartText>Add to Cart</AddToCartText>
            </AddToCartBtn>
          </BottomSheet>
        )}
      </ContentWrapper>
    </Container>
  );
};

export default ReadyStockProductsScreen;

const Container = styled.View`
  flex: 1;
  background-color: #F8F9FA;
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

const ContentWrapper = styled.View`
  flex: 1;
`;

const InfoBanner = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #DCFCE7;
  padding: 14px 16px;
  margin: 16px 16px 8px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #BBF7D0;
`;

const InfoBannerText = styled.Text`
  flex: 1;
  font-size: 13px;
  color: #0A6B2E;
  line-height: 19px;
  margin-left: 10px;
  font-weight: 500;
`;

const SectionTitle = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 12px 16px 8px;
`;

const ProductCard = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  margin: 8px 16px;
  border-width: 2px;
  border-color: ${({ selected }) => selected ? '#0F8A3C' : '#F3F4F6'};
`;

const ProductHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const ProductName = styled.Text`
  flex: 1;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-right: 10px;
`;

const ProductPrice = styled.Text`
  font-size: 15px;
  font-weight: 800;
  color: #0F8A3C;
`;

const ProductDescription = styled.Text`
  font-size: 13px;
  color: #6B7280;
  line-height: 19px;
  margin-bottom: 12px;
`;

const SpecsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
`;

const SpecItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const SpecText = styled.Text`
  font-size: 11px;
  color: #6B7280;
  font-weight: 500;
`;

const FeaturesRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
`;

const FeatureBadge = styled.View<{ eco?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
  background-color: ${({ eco }) => eco ? '#D1FAE5' : '#F3F4F6'};
  gap: 4px;
`;

const FeatureBadgeText = styled.Text<{ eco?: boolean }>`
  font-size: 10px;
  font-weight: 600;
  color: ${({ eco }) => eco ? '#059669' : '#6B7280'};
`;

const BadgeRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

const BottomSheet = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #FFFFFF;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px 16px ${Platform.OS === 'ios' ? '32px' : '20px'};
  shadow-color: #000;
  shadow-offset: 0px -4px;
  shadow-opacity: 0.1;
  shadow-radius: 12px;
  elevation: 20;
  max-height: 70%;
`;

const SheetHandle = styled.View`
  width: 40px;
  height: 4px;
  background-color: #E5E7EB;
  border-radius: 2px;
  align-self: center;
  margin-bottom: 16px;
`;

const SelectedProductName = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
`;

const SelectedProductPrice = styled.Text`
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 12px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #F3F4F6;
  margin-vertical: 12px;
`;

const QuantitySection = styled.View``;

const QuantityLabel = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 10px;
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
  border-color: #E5E7EB;
  background-color: #F9FAFB;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;

const QuickSelectRow = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-bottom: 12px;
`;

const QuickSelectBtn = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  background-color: ${({ active }) => active ? '#0F8A3C' : '#F9FAFB'};
  border-width: 1px;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
  align-items: center;
`;

const QuickSelectText = styled.Text<{ active: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ active }) => active ? '#FFFFFF' : '#6B7280'};
`;

const PincodeToggle = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: #F9FAFB;
  border-radius: 10px;
  margin-vertical: 8px;
`;

const PincodeToggleText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #0F8A3C;
`;

const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const TotalLabel = styled.Text`
  font-size: 15px;
  color: #6B7280;
  font-weight: 500;
`;

const TotalPrice = styled.Text`
  font-size: 22px;
  font-weight: 800;
  color: #111827;
`;

const AddToCartBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 50px;
  background-color: #0F8A3C;
  border-radius: 14px;
`;

const AddToCartText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
`;
