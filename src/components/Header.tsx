import React from 'react';
import { Image, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useAppSelector } from '../store';
import { FontAwesome5 } from '@expo/vector-icons';
import { selectActiveOrdersCount } from '../store/ordersSlice';

const LOGO = require('../../assets/logo (1).png');

interface HeaderProps {
  title?: string;
  showCart?: boolean;
  onCartPress?: () => void;
  navigation?: any;
}

const Header: React.FC<HeaderProps> = ({
  title = 'PacMonk',
  showCart = true,
  onCartPress,
  navigation,
}) => {
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemCount = cartItems.length;
  const activeOrdersCount = useAppSelector(selectActiveOrdersCount);

  const handleNotifications = () => {
    if (navigation) {
      navigation.navigate('Notifications');
    }
  };

  const handleAvatar = () => {
    if (navigation) {
      navigation.navigate('MainTabs', { screen: 'Account' });
    }
  };

  return (
    <Container style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
      <LeftSection>
        <LogoBox>
          <Image
            source={LOGO}
            style={{ width: 28, height: 28 }}
            resizeMode="contain"
          />
        </LogoBox>
        <BrandWrap>
          <BrandName>{title}</BrandName>
          <BrandSub>B2B Packaging Platform</BrandSub>
        </BrandWrap>
      </LeftSection>

      <RightSection>
        <IconBtn onPress={handleNotifications} activeOpacity={0.8}>
          <FontAwesome5 name="bell" size={18} color="#374151" />
          {activeOrdersCount > 0 && <NotifDot />}
        </IconBtn>
        {showCart && (
          <IconBtn onPress={onCartPress} activeOpacity={0.8}>
            <FontAwesome5 name="shopping-bag" size={18} color="#374151" />
            {cartItemCount > 0 && (
              <CartBadge>
                <CartBadgeText>{cartItemCount > 9 ? '9+' : cartItemCount}</CartBadgeText>
              </CartBadge>
            )}
          </IconBtn>
        )}
        <AvatarBtn activeOpacity={0.9} onPress={handleAvatar}>
          <AvatarText>ZT</AvatarText>
        </AvatarBtn>
      </RightSection>
    </Container>
  );
};

export default Header;

const Container = styled.View`
  height: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  background-color: #FFFFFF;
  border-bottom-width: 1px;
  border-bottom-color: #F3F4F6;
`;

const LeftSection = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LogoBox = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background-color: #0F8A3C;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  overflow: hidden;
`;

const BrandWrap = styled.View``;

const BrandName = styled.Text`
  font-size: 17px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.3px;
`;

const BrandSub = styled.Text`
  font-size: 10px;
  color: #9CA3AF;
  font-weight: 500;
  letter-spacing: 0.2px;
`;

const RightSection = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconBtn = styled.TouchableOpacity`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background-color: #F9FAFB;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  position: relative;
  border-width: 1px;
  border-color: #F3F4F6;
`;

const NotifDot = styled.View`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: #EF4444;
  border-width: 1.5px;
  border-color: #FFFFFF;
`;

const CartBadge = styled.View`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #0F8A3C;
  border-radius: 8px;
  min-width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 3px;
  border-width: 1.5px;
  border-color: #FFFFFF;
`;

const CartBadgeText = styled.Text`
  color: #ffffff;
  font-size: 9px;
  font-weight: 800;
`;

const AvatarBtn = styled.TouchableOpacity`
  width: 38px;
  height: 38px;
  border-radius: 19px;
  background-color: #0F8A3C;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
`;

const AvatarText = styled.Text`
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.5px;
`;
