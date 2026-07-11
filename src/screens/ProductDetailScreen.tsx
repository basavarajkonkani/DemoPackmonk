import React, { useState } from 'react';
import { ScrollView, View, Alert, Platform, Image } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store';
import { selectProduct } from '../store/productsSlice';
import { addToCart, calculateItemPrice } from '../store/cartSlice';
import { QUANTITY_OPTIONS } from '../constants';
import {
  quantityValidator,
  DEFAULT_QUANTITY_OPTIONS,
  applyQuantityValidationResult,
} from '../utils/quantityValidator';
import MOQBadge from '../components/MOQBadge';
import PincodeChecker from '../components/PincodeChecker';
import { IMAGES, PRODUCT_IMAGES, CATEGORY_IMAGES } from '../constants/images';

const SIZE_OPTIONS = [
  { key: 'S', label: 'Small', factor: 0.7 },
  { key: 'M', label: 'Medium', factor: 1.0 },
  { key: 'L', label: 'Large', factor: 1.4 },
];

const REVIEWS = [
  { reviewer: 'NexGen Apparel', stars: 5, text: 'Incredible print quality. Unboxing videos went viral!', date: '2 weeks ago', initials: 'NA' },
  { reviewer: 'FreshBrew Co.', stars: 5, text: 'Fast turnaround, perfect kraft finish. Reordering 3× a year.', date: '1 month ago', initials: 'FB' },
  { reviewer: 'MedSupply Ltd.', stars: 4, text: 'Very sturdy. Minor delay resolved quickly by support.', date: '2 months ago', initials: 'MS' },
];

interface Props {
  route: any;
  navigation: any;
}

const ProductDetailScreen: React.FC<Props> = ({ route, navigation: navProp }) => {
  const navigation = useNavigation<any>(); // Use the hook for better navigation handling
  const dispatch = useAppDispatch();
  const { productId } = route.params;
  const products = useAppSelector((s) => s.products.items);
  const product = products.find((p) => p.id === productId);

  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(100);
  const [favorited, setFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');

  const handleQuantitySelect = (qty: number) => {
    const result = quantityValidator.validateQuantityInput(qty, DEFAULT_QUANTITY_OPTIONS);
    applyQuantityValidationResult(result, setQuantity);
  };

  if (!product) {
    return (
      <Container>
        <NavBar>
          <NavBtn onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={16} color="#111827" />
          </NavBtn>
        </NavBar>
        <EmptyCenter>
          <EmptyText>Product not found</EmptyText>
        </EmptyCenter>
      </Container>
    );
  }

  const getCategoryConfig = () => {
    // Get product-specific image or fall back to category image
    const productImage = PRODUCT_IMAGES[product.id] || CATEGORY_IMAGES[product.category] || IMAGES.printedStandupPouch;
    
    switch (product.category) {
      case 'box': return { bg: '#DCFCE7', iconColor: '#0F8A3C', icon: 'box-open', image: productImage };
      case 'mailer': return { bg: '#DCFCE7', iconColor: '#0F8A3C', icon: 'mail-bulk', image: productImage };
      case 'bag': return { bg: '#FEF3C7', iconColor: '#D97706', icon: 'shopping-bag', image: productImage };
      case 'tape': return { bg: '#F3E8FF', iconColor: '#7C3AED', icon: 'tape', image: productImage };
      default: return { bg: '#F3F4F6', iconColor: '#6B7280', icon: 'box', image: productImage };
    }
  };

  const cfg = getCategoryConfig();
  const sizeFactor = SIZE_OPTIONS.find((s) => s.key === selectedSize)?.factor ?? 1;
  const defaultDesign = {
    length: Math.round(product.dimensions.length * sizeFactor),
    width: Math.round(product.dimensions.width * sizeFactor),
    height: Math.round(product.dimensions.height * sizeFactor),
    materialId: product.materials[0]?.id ?? 'kraft',
    inkColor: '#000000',
    logoUri: null,
    logoScale: 1,
    logoPosX: 0,
    logoPosY: 0,
    customText: '',
    textColor: '#000000',
    textSize: 12,
  };
  const { totalPrice } = calculateItemPrice(product, defaultDesign, quantity);

  const handleRequestSample = () =>
    Alert.alert('Sample Requested', 'A sample kit will be sent to your address within 3–5 business days.');

  const handleGetQuote = () => navigation.navigate('RequestQuote', { productId: product.id });
  const handleCustomize = () => {
    dispatch(selectProduct(product.id));
    navigation.navigate('DesignStudio');
  };

  const handleAddToCart = () => {
    const cartItem = {
      cartId: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      category: product.category,
      design: defaultDesign,
      quantity,
      baseUnitPrice: product.basePrice,
      unitPrice: totalPrice / quantity,
      totalPrice,
      setupFee: 0,
    };
    
    dispatch(addToCart(cartItem));
    
    try {
      const parent = navigation.getParent();
      if (parent) {
        parent.navigate('MainTabs', { screen: 'Cart' });
      } else {
        navigation.navigate('MainTabs', { screen: 'Cart' });
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Item Added', 'Item has been added to your cart!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  };

  return (
    <Container>
      <NavBar>
        <NavBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={16} color="#111827" />
        </NavBtn>
        <NavTitle>Product Details</NavTitle>
        <NavBtn onPress={() => setFavorited(!favorited)}>
          <FontAwesome5 name="heart" size={18} color={favorited ? '#EF4444' : '#D1D5DB'} solid={favorited} />
        </NavBtn>
      </NavBar>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Gallery */}
        <Gallery bgColor={cfg.bg}>
          <ProductImageFull source={cfg.image} resizeMode="cover" />
          <GalleryOverlay bgColor={cfg.bg} />
          <GalleryDecor size={200} top={-50} right={-60} color={cfg.iconColor} />
          <GalleryDecor size={100} bottom={-20} left={20} color={cfg.iconColor} />
          {product.ecoFriendlyRating >= 4 && (
            <EcoBadge>
              <FontAwesome5 name="leaf" size={9} color="#FFF" style={{ marginRight: 4 }} />
              <EcoBadgeText>Eco Choice</EcoBadgeText>
            </EcoBadge>
          )}
          <GalleryDots>
            {[0, 1, 2].map((i) => (
              <GalleryDot key={i} active={i === 0} />
            ))}
          </GalleryDots>
        </Gallery>

        <InfoSection>
          {/* Header */}
          <CatChip>
            <CatChipText>{product.category.toUpperCase()}</CatChipText>
          </CatChip>
          <ProductName>{product.name}</ProductName>

          <StarsRow>
            {[1, 2, 3, 4, 5].map((i) => (
              <FontAwesome5 key={i} name="star" size={14} color={i <= 4 ? '#F59E0B' : '#E5E7EB'} solid style={{ marginRight: 2 }} />
            ))}
            <RatingText>4.8 · 128 reviews</RatingText>
          </StarsRow>

          {/* Key Metrics */}
          <MetricsRow>
            <MetricBlock>
              <MetricLabel>Unit Price</MetricLabel>
              <MetricValue>₹{product.basePrice.toFixed(2)}<MetricUnit>/unit</MetricUnit></MetricValue>
            </MetricBlock>
            <MetricDivider />
            <MetricBlock>
              <MetricLabel>Min Order</MetricLabel>
              <MetricValue>{product.minQuantity}<MetricUnit> units</MetricUnit></MetricValue>
            </MetricBlock>
            <MetricDivider />
            <MetricBlock>
              <MetricLabel>Delivery</MetricLabel>
              <MetricValue>5–7<MetricUnit> days</MetricUnit></MetricValue>
            </MetricBlock>
          </MetricsRow>

          {/* MOQ Badge */}
          <MOQBadgeWrapper>
            <MOQBadge moq={product.minQuantity} currentQuantity={quantity} size="medium" />
          </MOQBadgeWrapper>

          {/* Description */}
          <DescText>{product.longDescription}</DescText>

          {/* Size */}
          <SectionLabel>Select Size</SectionLabel>
          <SizeRow>
            {SIZE_OPTIONS.map((s) => (
              <SizeBtn key={s.key} active={selectedSize === s.key} onPress={() => setSelectedSize(s.key)} activeOpacity={0.8}>
                <SizeLetter active={selectedSize === s.key}>{s.key}</SizeLetter>
                <SizeSubLabel active={selectedSize === s.key}>{s.label}</SizeSubLabel>
              </SizeBtn>
            ))}
          </SizeRow>

          {/* Quantity */}
          <SectionLabel>Quantity</SectionLabel>
          <QtyRow>
            {QUANTITY_OPTIONS.map((qty) => (
              <QtyOption
                key={qty}
                active={quantity === qty}
                onPress={() => handleQuantitySelect(qty)}
                activeOpacity={0.8}
              >
                <QtyOptionText active={quantity === qty}>{qty}</QtyOptionText>
              </QtyOption>
            ))}
          </QtyRow>
          <QtyTotal>Total: ₹{totalPrice.toFixed(2)}</QtyTotal>

          {/* Pincode Checker */}
          <PincodeChecker />

          {/* Tabs */}
          <TabContainer>
            <TabBtn active={activeTab === 'specs'} onPress={() => setActiveTab('specs')}>
              <TabBtnText active={activeTab === 'specs'}>Specifications</TabBtnText>
            </TabBtn>
            <TabBtn active={activeTab === 'reviews'} onPress={() => setActiveTab('reviews')}>
              <TabBtnText active={activeTab === 'reviews'}>Reviews (128)</TabBtnText>
            </TabBtn>
          </TabContainer>

          {activeTab === 'specs' ? (
            <SpecsCard>
              <SpecRow>
                <SpecKey>Materials</SpecKey>
                <SpecVal>{product.materials.map((m) => m.name).join(', ')}</SpecVal>
              </SpecRow>
              <SpecRow>
                <SpecKey>Dimensions</SpecKey>
                <SpecVal>{product.dimensions.length}"×{product.dimensions.width}"×{product.dimensions.height}" ({product.dimensions.unit})</SpecVal>
              </SpecRow>
              <SpecRow>
                <SpecKey>Printing</SpecKey>
                <SpecVal>CMYK + Pantone · Spot UV available</SpecVal>
              </SpecRow>
              <SpecRow>
                <SpecKey>Eco Rating</SpecKey>
                <SpecVal>{'🌿'.repeat(product.ecoFriendlyRating)} ({product.ecoFriendlyRating}/5)</SpecVal>
              </SpecRow>
              <SpecRow>
                <SpecKey>Strength</SpecKey>
                <SpecVal>{'⭐'.repeat(product.strengthRating)} ({product.strengthRating}/5)</SpecVal>
              </SpecRow>
              <SpecRow noBorder>
                <SpecKey>Bulk Discounts</SpecKey>
                <SpecVal>{product.bulkDiscounts.map((d) => `${d.minQuantity}+ (${d.discountPercent}% off)`).join(' · ')}</SpecVal>
              </SpecRow>
            </SpecsCard>
          ) : (
            <View>
              {REVIEWS.map((r, i) => (
                <ReviewCard key={i}>
                  <ReviewHeader>
                    <ReviewAvatar>
                      <ReviewAvatarText>{r.initials}</ReviewAvatarText>
                    </ReviewAvatar>
                    <ReviewMeta>
                      <ReviewerName>{r.reviewer}</ReviewerName>
                      <ReviewDate>{r.date}</ReviewDate>
                    </ReviewMeta>
                    <ReviewStars>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <FontAwesome5 key={s} name="star" size={11} color={s <= r.stars ? '#F59E0B' : '#E5E7EB'} solid style={{ marginLeft: 1 }} />
                      ))}
                    </ReviewStars>
                  </ReviewHeader>
                  <ReviewText>{r.text}</ReviewText>
                </ReviewCard>
              ))}
            </View>
          )}

          {/* Customization CTA */}
          <CustomizeCard>
            <FontAwesome5 name="pencil-ruler" size={20} color="#7C3AED" style={{ marginBottom: 10 }} />
            <CustomizeTitle>Want a custom design?</CustomizeTitle>
            <CustomizeDesc>Open the Design Studio to add your logo, brand colors & text.</CustomizeDesc>
            <CustomizeBtn onPress={handleCustomize} activeOpacity={0.85}>
              <CustomizeBtnText>Open Design Studio</CustomizeBtnText>
              <FontAwesome5 name="arrow-right" size={12} color="#7C3AED" style={{ marginLeft: 6 }} />
            </CustomizeBtn>
          </CustomizeCard>
        </InfoSection>
      </ScrollView>

      {/* Bottom CTA */}
      <BottomBar>
        <BottomLeft>
          <BottomPrice>₹{totalPrice.toLocaleString()}</BottomPrice>
          <BottomQty>{quantity} units</BottomQty>
        </BottomLeft>
        <BottomRight>
          <SampleBtnSmall onPress={handleRequestSample} activeOpacity={0.8}>
            <FontAwesome5 name="gift" size={13} color="#0F8A3C" />
          </SampleBtnSmall>
          <View style={{ width: 10 }} />
          <AddToCartBtn onPress={handleAddToCart} activeOpacity={0.9}>
            <FontAwesome5 name="shopping-cart" size={14} color="#FFF" style={{ marginRight: 8 }} />
            <AddToCartBtnText>Add to Cart</AddToCartBtnText>
          </AddToCartBtn>
        </BottomRight>
      </BottomBar>
    </Container>
  );
};

export default ProductDetailScreen;

const Container = styled.View`flex: 1; background-color: #FFFFFF;`;

const NavBar = styled.View`
  height: 56px; flex-direction: row; align-items: center; justify-content: space-between;
  padding-horizontal: 16px; border-bottom-width: 1px; border-bottom-color: #F3F4F6;
  background-color: #FFFFFF;
`;
const NavBtn = styled.TouchableOpacity`
  width: 38px; height: 38px; border-radius: 12px;
  background-color: #F9FAFB; align-items: center; justify-content: center;
  border-width: 1px; border-color: #F3F4F6;
`;
const NavTitle = styled.Text`font-size: 16px; font-weight: 700; color: #111827;`;

const Gallery = styled.View<{ bgColor: string }>`
  height: 260px; background-color: ${({ bgColor }) => bgColor};
  align-items: center; justify-content: center; position: relative; overflow: hidden;
`;

const ProductImageFull = styled.Image`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

const GalleryOverlay = styled.View<{ bgColor: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ bgColor }) => bgColor};
  opacity: 0.15;
`;

const GalleryDecor = styled.View<{ size: number; top?: number; bottom?: number; right?: number; left?: number; color: string }>`
  position: absolute;
  width: ${({ size }) => size}px; height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  background-color: ${({ color }) => color};
  opacity: 0.08;
  ${({ top }) => top !== undefined ? `top: ${top}px;` : ''}
  ${({ bottom }) => bottom !== undefined ? `bottom: ${bottom}px;` : ''}
  ${({ right }) => right !== undefined ? `right: ${right}px;` : ''}
  ${({ left }) => left !== undefined ? `left: ${left}px;` : ''}
`;
const GalleryIconCircle = styled.View`
  width: 170px; height: 170px; border-radius: 85px;
  background-color: #FFFFFF; align-items: center; justify-content: center;
  shadow-color: #000; shadow-offset: 0px 8px; shadow-opacity: 0.1; shadow-radius: 24px; elevation: 10;
`;
const EcoBadge = styled.View`
  position: absolute; top: 16px; right: 16px;
  background-color: #0F8A3C; flex-direction: row; align-items: center;
  padding: 5px 10px; border-radius: 20px;
`;
const EcoBadgeText = styled.Text`font-size: 10px; font-weight: 700; color: #FFFFFF;`;
const GalleryDots = styled.View`
  position: absolute; bottom: 14px; flex-direction: row;
`;
const GalleryDot = styled.View<{ active: boolean }>`
  width: ${({ active }) => active ? 18 : 6}px; height: 6px; border-radius: 3px;
  background-color: ${({ active }) => active ? '#0F8A3C' : 'rgba(255,255,255,0.6)'};
  margin-horizontal: 3px;
`;

const InfoSection = styled.View`padding: 20px 16px;`;
const CatChip = styled.View`
  background-color: #DCFCE7; padding: 4px 10px; border-radius: 6px;
  align-self: flex-start; margin-bottom: 8px;
`;
const CatChipText = styled.Text`font-size: 10px; font-weight: 700; color: #0F8A3C; letter-spacing: 1px;`;
const ProductName = styled.Text`
  font-size: 26px; font-weight: 800; color: #111827;
  margin-bottom: 8px; letter-spacing: -0.4px; line-height: 32px;
`;
const StarsRow = styled.View`flex-direction: row; align-items: center; margin-bottom: 18px;`;
const RatingText = styled.Text`font-size: 12px; color: #6B7280; margin-left: 8px;`;

const MetricsRow = styled.View`
  flex-direction: row; background-color: #F9FAFB; border-radius: 16px;
  padding: 16px; margin-bottom: 18px; border-width: 1px; border-color: #F3F4F6;
`;
const MetricBlock = styled.View`flex: 1; align-items: center;`;
const MetricLabel = styled.Text`
  font-size: 10px; color: #9CA3AF; text-transform: uppercase;
  letter-spacing: 0.5px; margin-bottom: 4px;
`;
const MetricValue = styled.Text`font-size: 18px; font-weight: 800; color: #111827;`;
const MetricUnit = styled.Text`font-size: 11px; font-weight: 400; color: #9CA3AF;`;
const MetricDivider = styled.View`width: 1px; background-color: #E5E7EB;`;

const DescText = styled.Text`
  font-size: 14px; color: #6B7280; line-height: 22px; margin-bottom: 22px;
`;

const SectionLabel = styled.Text`
  font-size: 13px; font-weight: 700; color: #111827;
  margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;
`;

const SizeRow = styled.View`flex-direction: row; margin-bottom: 20px;`;
const SizeBtn = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1; border-radius: 14px; padding: 12px 6px; align-items: center; margin-right: 10px;
  border-width: 1.5px;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
  background-color: ${({ active }) => active ? '#DCFCE7' : '#FFFFFF'};
`;
const SizeLetter = styled.Text<{ active: boolean }>`
  font-size: 18px; font-weight: 800;
  color: ${({ active }) => active ? '#0A6B2E' : '#9CA3AF'};
`;
const SizeSubLabel = styled.Text<{ active: boolean }>`
  font-size: 10px; font-weight: 500;
  color: ${({ active }) => active ? '#0F8A3C' : '#D1D5DB'};
  margin-top: 2px;
`;

const QtyRow = styled.View`
  flex-direction: row; align-items: center; flex-wrap: wrap; gap: 8px;
  margin-bottom: 12px;
`;
const QtyOption = styled.TouchableOpacity<{ active: boolean }>`
  padding: 10px 16px; border-radius: 10px;
  background-color: ${({ active }) => active ? '#0F8A3C' : '#FFFFFF'};
  border-width: 1px;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
`;
const QtyOptionText = styled.Text<{ active: boolean }>`
  font-size: 14px; font-weight: 600;
  color: ${({ active }) => active ? '#FFFFFF' : '#374151'};
`;
const QtyTotal = styled.Text`
  font-size: 14px; font-weight: 700; color: #0F8A3C; margin-bottom: 22px;
`;

const MOQBadgeWrapper = styled.View`
  margin-bottom: 18px;
`;

const TabContainer = styled.View`
  flex-direction: row; background-color: #F3F4F6; border-radius: 14px;
  padding: 4px; margin-bottom: 16px;
`;
const TabBtn = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1; height: 40px; border-radius: 11px; align-items: center; justify-content: center;
  background-color: ${({ active }) => active ? '#FFFFFF' : 'transparent'};
  shadow-color: #000; shadow-offset: 0px 1px;
  shadow-opacity: ${({ active }) => active ? 0.06 : 0}; shadow-radius: 3px;
  elevation: ${({ active }) => active ? 2 : 0};
`;
const TabBtnText = styled.Text<{ active: boolean }>`
  font-size: 13px; font-weight: ${({ active }) => active ? '700' : '500'};
  color: ${({ active }) => active ? '#111827' : '#9CA3AF'};
`;

const SpecsCard = styled.View`
  border-width: 1px; border-color: #F3F4F6; border-radius: 16px; overflow: hidden;
`;
const SpecRow = styled.View<{ noBorder?: boolean }>`
  flex-direction: row; padding: 12px 16px;
  border-bottom-width: ${({ noBorder }) => noBorder ? 0 : 1}px; border-bottom-color: #F9FAFB;
`;
const SpecKey = styled.Text`width: 110px; font-size: 12px; font-weight: 600; color: #9CA3AF;`;
const SpecVal = styled.Text`flex: 1; font-size: 12px; color: #374151; font-weight: 500; line-height: 18px;`;

const ReviewCard = styled.View`
  border-width: 1px; border-color: #F3F4F6; border-radius: 14px; padding: 14px; margin-bottom: 10px;
`;
const ReviewHeader = styled.View`flex-direction: row; align-items: center; margin-bottom: 8px;`;
const ReviewAvatar = styled.View`
  width: 34px; height: 34px; border-radius: 17px;
  background-color: #DCFCE7; align-items: center; justify-content: center; margin-right: 10px;
`;
const ReviewAvatarText = styled.Text`font-size: 12px; font-weight: 800; color: #0F8A3C;`;
const ReviewMeta = styled.View`flex: 1;`;
const ReviewerName = styled.Text`font-size: 13px; font-weight: 700; color: #111827;`;
const ReviewDate = styled.Text`font-size: 10px; color: #9CA3AF; margin-top: 1px;`;
const ReviewStars = styled.View`flex-direction: row;`;
const ReviewText = styled.Text`font-size: 13px; color: #6B7280; line-height: 19px;`;

const CustomizeCard = styled.View`
  margin-top: 20px; background-color: #F5F3FF; border-radius: 16px;
  padding: 20px; align-items: center; border-width: 1px; border-color: #DDD6FE;
`;
const CustomizeTitle = styled.Text`font-size: 15px; font-weight: 700; color: #5B21B6; margin-bottom: 6px;`;
const CustomizeDesc = styled.Text`font-size: 13px; color: #7C3AED; text-align: center; margin-bottom: 14px; line-height: 19px;`;
const CustomizeBtn = styled.TouchableOpacity`
  flex-direction: row; align-items: center;
  border-width: 1.5px; border-color: #7C3AED;
  padding: 10px 20px; border-radius: 12px;
  background-color: #FFFFFF;
`;
const CustomizeBtnText = styled.Text`font-size: 13px; font-weight: 700; color: #7C3AED;`;

const EmptyCenter = styled.View`flex: 1; align-items: center; justify-content: center;`;
const EmptyText = styled.Text`font-size: 16px; color: #9CA3AF;`;

const BottomBar = styled.View`
  position: absolute; 
  bottom: 0; 
  left: 0; 
  right: 0;
  flex-direction: row; 
  padding: 12px 16px ${Platform.OS === 'ios' ? 32 : 20}px;
  background-color: #FFFFFF; 
  border-top-width: 1px; 
  border-top-color: #F3F4F6;
  align-items: center; 
  justify-content: space-between;
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 10;
  z-index: 1000;
`;

const BottomLeft = styled.View`
  flex-direction: column;
`;

const BottomPrice = styled.Text`
  font-size: 20px;
  font-weight: 800;
  color: #0F8A3C;
`;

const BottomQty = styled.Text`
  font-size: 12px;
  color: #6B7280;
  margin-top: 2px;
`;

const BottomRight = styled.View`
  flex-direction: row;
  align-items: center;
`;

const SampleBtnSmall = styled.TouchableOpacity`
  width: 44px;
  height: 50px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  border-width: 1.5px;
  border-color: #0F8A3C;
  background-color: #FFFFFF;
`;

const AddToCartBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 50px;
  background-color: #0F8A3C;
  border-radius: 14px;
  padding-horizontal: 24px;
  box-shadow: 0px 4px 10px rgba(15, 138, 60, 0.3);
  z-index: 10;
`;

const AddToCartBtnText = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #FFFFFF;
`;
