import React from 'react';
import { ScrollView, Platform } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import StockIndicator from '../components/StockIndicator';
import MOQBadge from '../components/MOQBadge';
import { IMAGES } from '../constants/images';
import { getScrollViewBottomPaddingWithTabBar } from '../utils/layoutUtils';

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
  image: any; // Changed from images array to single image
  ecoRating: number;
  sizeOptions?: SizeOption[];
}

const READY_STOCK_PRODUCTS: ReadyStockProduct[] = [
  {
    id: 'rs001',
    name: 'Gold Standy Pouch',
    description: 'Premium gold standy pouch with excellent barrier properties, perfect for premium products and long shelf life.',
    category: 'pouch',
    material: 'Metalized',
    finish: 'Gold',
    size: 'Medium',
    dimensions: { length: 150, width: 100, height: 50 },
    hasZipper: false,
    hasWindow: false,
    thickness: '120μ',
    price: 6.15,
    moq: 100,
    stockCount: 3500,
    inStock: true,
    image: IMAGES.goldStandyPouch,
    ecoRating: 3,
    sizeOptions: [
      { id: 'size1', dimensions: '10 × 13.5 × 2.5 cm', capacity: 'GSP1 - 100 g', price: 2.45 },
      { id: 'size2', dimensions: '10.5 × 21 × 3.5 cm', capacity: 'GSP2 - 250 g', price: 3.85 },
      { id: 'size3', dimensions: '13.5 × 22 × 3.5 cm', capacity: 'GSP3 - 500 g', price: 4.25 },
      { id: 'size4', dimensions: '16 × 23 × 3.5 cm', capacity: 'GSP4 - 1000 g', price: 6.15 },
    ],
  },
  {
    id: 'rs002',
    name: 'Gold Standy Zipper Pouch',
    description: 'Premium gold standy pouch with resealable zipper, ideal for high-value products requiring freshness.',
    category: 'pouch',
    material: 'Metalized',
    finish: 'Gold',
    size: 'Medium',
    dimensions: { length: 160, width: 110, height: 60 },
    hasZipper: true,
    hasWindow: false,
    thickness: '130μ',
    price: 7.60,
    moq: 100,
    stockCount: 2800,
    inStock: true,
    image: IMAGES.goldStandyZipperPouch,
    ecoRating: 3,
    sizeOptions: [
      { id: 'size1', dimensions: '10 × 13.5 × 2.5 cm', capacity: 'GSZP1 - 100 g', price: 3.15 },
      { id: 'size2', dimensions: '10.5 × 21 × 3.5 cm', capacity: 'GSZP2 - 250 g', price: 5.15 },
      { id: 'size3', dimensions: '13.5 × 22 × 3.5 cm', capacity: 'GSZP3 - 500 g', price: 6.25 },
      { id: 'size4', dimensions: '16 × 23 × 3.5 cm', capacity: 'GSZP4 - 1000 g', price: 7.60 },
    ],
  },
  {
    id: 'rs003',
    name: 'Silver Standy Pouch',
    description: 'Classic silver metalized standy pouch with superior barrier protection for extended shelf life.',
    category: 'pouch',
    material: 'Metalized',
    finish: 'Silver',
    size: 'Medium',
    dimensions: { length: 150, width: 100, height: 50 },
    hasZipper: false,
    hasWindow: false,
    thickness: '120μ',
    price: 5.25,
    moq: 100,
    stockCount: 4200,
    inStock: true,
    image: IMAGES.silverStandyPouch,
    ecoRating: 3,
    sizeOptions: [
      { id: 'size1', dimensions: '9.5 × 13.5 × 2.5 cm', capacity: 'SSP1 - 50 g', price: 1.35 },
      { id: 'size2', dimensions: '10 × 17 × 3.5 cm', capacity: 'SSP2 - 100 g', price: 2.10 },
      { id: 'size3', dimensions: '10.5 × 21 × 3.5 cm', capacity: 'SSP3 - 200 g', price: 2.50 },
      { id: 'size4', dimensions: '13.5 × 22 × 3.5 cm', capacity: 'SSP4 - 250 g', price: 3.20 },
      { id: 'size5', dimensions: '16 × 23 × 3.5 cm', capacity: 'SSP5 - 500 g', price: 3.60 },
      { id: 'size6', dimensions: '17 × 26.5 × 4 cm', capacity: 'SSP6 - 1000 g', price: 5.25 },
      { id: 'size7', dimensions: '20 × 30 × 5 cm', capacity: 'SSP7 - 2000 g', price: 6.96 },
    ],
  },
  {
    id: 'rs004',
    name: 'Silver Standy Zipper Pouch',
    description: 'Silver metalized pouch with zipper closure, perfect for snacks, dry fruits, and coffee.',
    category: 'pouch',
    material: 'Metalized',
    finish: 'Silver',
    size: 'Medium',
    dimensions: { length: 160, width: 110, height: 60 },
    hasZipper: true,
    hasWindow: false,
    thickness: '130μ',
    price: 6.05,
    moq: 100,
    stockCount: 3700,
    inStock: true,
    image: IMAGES.silverStandyZipperPouch,
    ecoRating: 3,
    sizeOptions: [
      { id: 'size1', dimensions: '9.5 × 13.5 × 2.5 cm', capacity: 'SSZ1 - 50 g', price: 2.10 },
      { id: 'size2', dimensions: '10 × 17 × 3.5 cm', capacity: 'SSZ2 - 100 g', price: 2.55 },
      { id: 'size3', dimensions: '10.5 × 21 × 3.5 cm', capacity: 'SSZ3 - 200 g', price: 3.05 },
      { id: 'size4', dimensions: '13.5 × 22 × 3.5 cm', capacity: 'SSZ4 - 250 g', price: 4.15 },
      { id: 'size5', dimensions: '16 × 23 × 3.5 cm', capacity: 'SSZ5 - 500 g', price: 5.00 },
      { id: 'size6', dimensions: '17 × 26.5 × 4 cm', capacity: 'SSZ6 - 1000 g', price: 6.05 },
      { id: 'size7', dimensions: '20 × 30 × 5 cm', capacity: 'SSZ7 - 2000 g', price: 8.10 },
    ],
  },
  {
    id: 'rs005',
    name: 'Milky Standy Pouch',
    description: 'Elegant milky white standy pouch, perfect for premium food products and cosmetics.',
    category: 'pouch',
    material: 'BOPP',
    finish: 'Milky White',
    size: 'Medium',
    dimensions: { length: 150, width: 100, height: 50 },
    hasZipper: false,
    hasWindow: false,
    thickness: '100μ',
    price: 5.25,
    moq: 100,
    stockCount: 3200,
    inStock: true,
    image: IMAGES.milkyStandyPouch,
    ecoRating: 4,
    sizeOptions: [
      { id: 'size1', dimensions: '10 × 13.5 × 2.5 cm', capacity: 'MSP1 - 100 g', price: 2.10 },
      { id: 'size2', dimensions: '10.5 × 21 × 3.5 cm', capacity: 'MSP2 - 250 g', price: 3.25 },
      { id: 'size3', dimensions: '13.5 × 22 × 3.5 cm', capacity: 'MSP3 - 500 g', price: 3.60 },
      { id: 'size4', dimensions: '16 × 23 × 3.5 cm', capacity: 'MSP4 - 1000 g', price: 5.25 },
    ],
  },
  {
    id: 'rs006',
    name: 'Milky Standy Zipper Pouch',
    description: 'Milky white standy pouch with resealable zipper, ideal for tea, spices, and wellness products.',
    category: 'pouch',
    material: 'BOPP',
    finish: 'Milky White',
    size: 'Medium',
    dimensions: { length: 160, width: 110, height: 60 },
    hasZipper: true,
    hasWindow: false,
    thickness: '110μ',
    price: 6.05,
    moq: 100,
    stockCount: 2900,
    inStock: true,
    image: IMAGES.milkyStandyZipperPouch,
    ecoRating: 4,
    sizeOptions: [
      { id: 'size1', dimensions: '10 × 13.5 × 2.5 cm', capacity: 'MSZ1 - 100 g', price: 2.55 },
      { id: 'size2', dimensions: '10.5 × 21 × 3.5 cm', capacity: 'MSZ2 - 250 g', price: 4.15 },
      { id: 'size3', dimensions: '13.5 × 22 × 3.5 cm', capacity: 'MSZ3 - 500 g', price: 5.00 },
      { id: 'size4', dimensions: '16 × 23 × 3.5 cm', capacity: 'MSZ4 - 1000 g', price: 6.05 },
    ],
  },
  {
    id: 'rs007',
    name: 'Kraft Standy Pouch (Brown)',
    description: 'Eco-friendly kraft paper standy pouch, perfect for organic and natural products.',
    category: 'pouch',
    material: 'Kraft',
    finish: 'Brown',
    size: 'Medium',
    dimensions: { length: 150, width: 100, height: 50 },
    hasZipper: false,
    hasWindow: false,
    thickness: '120μ',
    price: 9.50,
    moq: 100,
    stockCount: 4500,
    inStock: true,
    image: IMAGES.kraftStandyPouchBrown,
    ecoRating: 5,
    sizeOptions: [
      { id: 'size1', dimensions: '11 × 18.5 × 3 cm', capacity: 'KSP1 - 100 g', price: 4.75 },
      { id: 'size2', dimensions: '13 × 21 × 4 cm', capacity: 'KSP2 - 200 g', price: 6.16 },
      { id: 'size3', dimensions: '15 × 21 × 4 cm', capacity: 'KSP3 - 250 g', price: 6.83 },
      { id: 'size4', dimensions: '15 × 24 × 4 cm', capacity: 'KSP4 - 500 g', price: 7.50 },
      { id: 'size5', dimensions: '18 × 26 × 4 cm', capacity: 'KSP5 - 1000 g', price: 9.50 },
    ],
  },
  {
    id: 'rs008',
    name: 'Kraft Window Standy Pouch (Brown)',
    description: 'Brown kraft standy pouch with transparent window, ideal for showcasing organic products.',
    category: 'pouch',
    material: 'Kraft',
    finish: 'Brown',
    size: 'Medium',
    dimensions: { length: 160, width: 110, height: 60 },
    hasZipper: true,
    hasWindow: true,
    thickness: '120μ',
    price: 8.83,
    moq: 100,
    stockCount: 3100,
    inStock: true,
    image: IMAGES.kraftWindowStandyPouchBrown,
    ecoRating: 5,
    sizeOptions: [
      { id: 'size1', dimensions: '10 × 16 × 3 cm', capacity: 'KWBP1 - 50 g', price: 4.25 },
      { id: 'size2', dimensions: '10.5 × 19 × 3 cm', capacity: 'KWBP2 - 100 g', price: 5.42 },
      { id: 'size3', dimensions: '15 × 21 × 4 cm', capacity: 'KWBP3 - 250 g', price: 5.75 },
      { id: 'size4', dimensions: '15 × 24 × 4 cm', capacity: 'KWBP4 - 500 g', price: 7.16 },
      { id: 'size5', dimensions: '18 × 26 × 4 cm', capacity: 'KWBP5 - 1000 g', price: 8.83 },
      { id: 'size6', dimensions: '20 × 32 × 4 cm', capacity: 'KWBP6 - 2000 g', price: 11.58 },
      { id: 'size7', dimensions: '22 × 40 × 4 cm', capacity: 'KWBP7 - 3000 g', price: 22.66 },
    ],
  },
  {
    id: 'rs009',
    name: 'Kraft Window Standy Pouch (White)',
    description: 'White kraft standy pouch with window, perfect for premium organic and artisanal products.',
    category: 'pouch',
    material: 'Kraft',
    finish: 'White',
    size: 'Medium',
    dimensions: { length: 160, width: 110, height: 60 },
    hasZipper: true,
    hasWindow: true,
    thickness: '120μ',
    price: 10.80,
    moq: 100,
    stockCount: 2500,
    inStock: true,
    image: IMAGES.kraftWindowStandyPouchWhite,
    ecoRating: 5,
    sizeOptions: [
      { id: 'size1', dimensions: '10.5 × 19 × 3 cm', capacity: 'KWWP1 - 100 g', price: 6.41 },
      { id: 'size2', dimensions: '15 × 21 × 4 cm', capacity: 'KWWP2 - 250 g', price: 7.50 },
      { id: 'size3', dimensions: '15 × 24 × 4 cm', capacity: 'KWWP3 - 500 g', price: 8.50 },
      { id: 'size4', dimensions: '18 × 26 × 4 cm', capacity: 'KWWP4 - 1000 g', price: 10.80 },
    ],
  },
];

interface Props {
  navigation: any;
}

const ReadyStockProductsScreen: React.FC<Props> = ({ navigation }) => {
  const handleSelectProduct = (product: ReadyStockProduct) => {
    navigation.navigate('ReadyStockProductDetail', { product });
  };



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
          contentContainerStyle={{ paddingBottom: getScrollViewBottomPaddingWithTabBar() }}
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
            // Calculate lowest price from size options
            const lowestPrice = product.sizeOptions && product.sizeOptions.length > 0
              ? Math.min(...product.sizeOptions.map(s => s.price))
              : product.price;
            
            return (
              <ProductCard
                key={product.id}
                onPress={() => handleSelectProduct(product)}
                activeOpacity={0.8}
              >
                <ProductImageContainer>
                  <ProductImage source={product.image} resizeMode="cover" />
                </ProductImageContainer>

                <ProductHeader>
                  <ProductName>{product.name}</ProductName>
                  <ProductPrice>₹{lowestPrice.toFixed(2)}/pc</ProductPrice>
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

const ProductCard = styled.TouchableOpacity`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  margin: 8px 16px;
  border-width: 1px;
  border-color: #F3F4F6;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 2;
`;

const ProductImageContainer = styled.View`
  width: 100%;
  height: 180px;
  background-color: #F9FAFB;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
`;

const ProductImage = styled.Image`
  width: 100%;
  height: 100%;
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
