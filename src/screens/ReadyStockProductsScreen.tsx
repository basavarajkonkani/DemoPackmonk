import React from 'react';
import { ScrollView, Platform } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import StockIndicator from '../components/StockIndicator';
import MOQBadge from '../components/MOQBadge';
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
    price: 5.50,
    moq: 500,
    stockCount: 3500,
    inStock: true,
    image: IMAGES.goldStandyPouch,
    ecoRating: 3,
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
    price: 6.75,
    moq: 500,
    stockCount: 2800,
    inStock: true,
    image: IMAGES.goldStandyZipperPouch,
    ecoRating: 3,
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
    price: 4.80,
    moq: 500,
    stockCount: 4200,
    inStock: true,
    image: IMAGES.silverStandyPouch,
    ecoRating: 3,
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
    price: 5.95,
    moq: 500,
    stockCount: 3700,
    inStock: true,
    image: IMAGES.silverStandyZipperPouch,
    ecoRating: 3,
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
    price: 4.20,
    moq: 500,
    stockCount: 3200,
    inStock: true,
    image: IMAGES.milkyStandyPouch,
    ecoRating: 4,
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
    price: 5.40,
    moq: 500,
    stockCount: 2900,
    inStock: true,
    image: IMAGES.milkyStandyZipperPouch,
    ecoRating: 4,
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
    price: 4.50,
    moq: 500,
    stockCount: 4500,
    inStock: true,
    image: IMAGES.kraftStandyPouchBrown,
    ecoRating: 5,
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
    price: 5.80,
    moq: 500,
    stockCount: 3100,
    inStock: true,
    image: IMAGES.kraftWindowStandyPouchBrown,
    ecoRating: 5,
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
    price: 6.20,
    moq: 500,
    stockCount: 2500,
    inStock: true,
    image: IMAGES.kraftWindowStandyPouchWhite,
    ecoRating: 5,
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
          contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 110 : 90 }}
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
