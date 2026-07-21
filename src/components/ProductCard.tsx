import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import { PackagingProduct } from '../store/configurableCatalogSlice';
import { FontAwesome5 } from '@expo/vector-icons';
import { IMAGES, PRODUCT_IMAGES, CATEGORY_IMAGES } from '../constants/images';
import { getLowestPackagingPrice } from '../utils/priceUtils';

interface ProductCardProps {
  product: PackagingProduct;
  onPress: () => void;
}

const getCategoryConfig = (product: PackagingProduct) => {
  // First try to get product-specific image, then fall back to category image
  const img = PRODUCT_IMAGES[product.id] || CATEGORY_IMAGES[product.category] || IMAGES.printedStandupPouch;
  
  switch (product.category) {
    case 'box': return { bg: '#DCFCE7', iconColor: '#0F8A3C', icon: 'box-open', img };
    case 'mailer': return { bg: '#DCFCE7', iconColor: '#0F8A3C', icon: 'mail-bulk', img };
    case 'bag': return { bg: '#FEF3C7', iconColor: '#D97706', icon: 'shopping-bag', img };
    case 'tape': return { bg: '#F3E8FF', iconColor: '#7C3AED', icon: 'tape', img };
    default: return { bg: '#F3F4F6', iconColor: '#6B7280', icon: 'box', img };
  }
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const cfg = getCategoryConfig(product);
  const isEco = product.ecoFriendlyRating >= 4;
  const lowestPrice = getLowestPackagingPrice(product);

  return (
    <Card style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 }}>
      <ImageWrap bgColor={cfg.bg}>
        <ProductImage source={cfg.img} resizeMode="cover" />
        {isEco && (
          <EcoBadge>
            <FontAwesome5 name="leaf" size={8} color="#FFFFFF" style={{ marginRight: 3 }} />
            <EcoBadgeText>Eco</EcoBadgeText>
          </EcoBadge>
        )}
        <MOQBadgeTop>
          <MOQBadgeTopText>MOQ {product.minQuantity}</MOQBadgeTopText>
        </MOQBadgeTop>
      </ImageWrap>

      <Body>
        <CatTag>{product.category.toUpperCase()}</CatTag>
        <ProductName numberOfLines={2}>{product.name}</ProductName>
        <ProductDesc numberOfLines={2}>{product.description}</ProductDesc>

        <EcoRow>
          {[1, 2, 3, 4, 5].map((i) => (
            <FontAwesome5
              key={i}
              name="leaf"
              size={10}
              color={i <= product.ecoFriendlyRating ? '#0F8A3C' : '#E5E7EB'}
              style={{ marginRight: 2 }}
            />
          ))}
          <EcoLabel>{product.ecoFriendlyRating}/5 Eco</EcoLabel>
        </EcoRow>

        <DeliveryRow>
          <FontAwesome5 name="clock" size={10} color="#6B7280" style={{ marginRight: 4 }} />
          <DeliveryText>Delivery in 5–7 business days</DeliveryText>
        </DeliveryRow>

        <Footer>
          <PriceSection>
            <PriceFrom>Starting at</PriceFrom>
            <PriceVal>₹{lowestPrice.toFixed(2)}<PriceUnit>/unit</PriceUnit></PriceVal>
          </PriceSection>
          <ConfigBtn onPress={onPress} activeOpacity={0.85}>
            <ConfigBtnText>Configure</ConfigBtnText>
            <FontAwesome5 name="arrow-right" size={10} color="#FFFFFF" style={{ marginLeft: 5 }} />
          </ConfigBtn>
        </Footer>
      </Body>
    </Card>
  );
};

export default ProductCard;

const Card = styled.View`
  background-color: #FFFFFF;
  border-radius: 20px;
  border-width: 1px;
  border-color: #F3F4F6;
  overflow: hidden;
  margin-bottom: 14px;
`;

const ImageWrap = styled.View<{ bgColor: string }>`
  height: 160px;
  background-color: ${({ bgColor }: { bgColor: string }) => bgColor};
  position: relative;
  overflow: hidden;
`;

const ProductImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const EcoBadge = styled.View`
  position: absolute;
  top: 12px;
  left: 12px;
  flex-direction: row;
  align-items: center;
  background-color: #0F8A3C;
  padding: 4px 8px;
  border-radius: 20px;
`;

const EcoBadgeText = styled.Text`
  font-size: 9px;
  font-weight: 700;
  color: #FFFFFF;
`;

const MOQBadgeTop = styled.View`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(255,255,255,0.9);
  padding: 4px 8px;
  border-radius: 8px;
  border-width: 1px;
  border-color: rgba(0,0,0,0.06);
`;

const MOQBadgeTopText = styled.Text`
  font-size: 9px;
  font-weight: 700;
  color: #374151;
`;

const Body = styled.View`
  padding: 16px;
`;

const CatTag = styled.Text`
  font-size: 9px;
  font-weight: 700;
  color: #6B7280;
  letter-spacing: 1px;
  margin-bottom: 6px;
`;

const ProductName = styled.Text`
  font-size: 16px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 6px;
  line-height: 22px;
  letter-spacing: -0.2px;
`;

const ProductDesc = styled.Text`
  font-size: 12px;
  color: #6B7280;
  line-height: 17px;
  margin-bottom: 12px;
`;

const EcoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const EcoLabel = styled.Text`
  font-size: 10px;
  font-weight: 600;
  color: #0F8A3C;
  margin-left: 4px;
`;

const DeliveryRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 14px;
`;

const DeliveryText = styled.Text`
  font-size: 11px;
  color: #9CA3AF;
`;

const Footer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: #F3F4F6;
`;

const PriceSection = styled.View``;

const PriceFrom = styled.Text`
  font-size: 10px;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
`;

const PriceVal = styled.Text`
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.3px;
`;

const PriceUnit = styled.Text`
  font-size: 12px;
  font-weight: 500;
  color: #9CA3AF;
`;

const ConfigBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #0F8A3C;
  padding: 10px 18px;
  border-radius: 12px;
  shadow-color: #0F8A3C;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 4;
`;

const ConfigBtnText = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #FFFFFF;
`;
