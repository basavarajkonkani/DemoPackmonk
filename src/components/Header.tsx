import React from 'react';
import { Image, Platform, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useAppSelector } from '../store';
import { FontAwesome5 } from '@expo/vector-icons';
import { selectActiveOrdersCount } from '../store/ordersSlice';
import { IMAGES } from '../constants/images';

interface HeaderProps {
  /** @deprecated Cart lives in the tab bar — kept for rare stack-only flows */
  showCart?: boolean;
  onCartPress?: () => void;
  navigation?: any;
}

const Header: React.FC<HeaderProps> = ({
  showCart = false,
  onCartPress,
  navigation,
}) => {
  const cartItemCount = useAppSelector((state) => state.cart.items.length);
  const activeOrdersCount = useAppSelector(selectActiveOrdersCount);

  const handleLogoPress = () => {
    navigation?.navigate('MainTabs', { screen: 'Home' });
  };

  const handleNotifications = () => {
    navigation?.navigate('Notifications');
  };

  const handleAvatar = () => {
    navigation?.navigate('MainTabs', { screen: 'Account' });
  };

  return (
    <Container>
      <LogoBtn onPress={handleLogoPress} activeOpacity={0.85} disabled={!navigation}>
        <LogoImage source={IMAGES.logo} resizeMode="contain" />
      </LogoBtn>

      <RightSection>
        <IconBtn onPress={handleNotifications} activeOpacity={0.8}>
          <FontAwesome5 name="bell" size={17} color="#374151" />
          {activeOrdersCount > 0 && <NotifDot />}
        </IconBtn>
        {showCart && (
          <IconBtn onPress={onCartPress} activeOpacity={0.8}>
            <FontAwesome5 name="shopping-cart" size={17} color="#374151" />
            {cartItemCount > 0 && (
              <CartBadge>
                <CartBadgeText>{cartItemCount > 9 ? '9+' : cartItemCount}</CartBadgeText>
              </CartBadge>
            )}
          </IconBtn>
        )}
        <AvatarBtn activeOpacity={0.9} onPress={handleAvatar}>
          <AvatarText>RS</AvatarText>
        </AvatarBtn>
      </RightSection>
    </Container>
  );
};

export default Header;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${Platform.OS === 'ios' ? '52px' : '14px'} 16px 12px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #f3f4f6;
`;

const LogoBtn = styled(TouchableOpacity)`
  height: 36px;
  justify-content: center;
`;

const LogoImage = styled(Image)`
  width: 120px;
  height: 36px;
`;

const RightSection = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconBtn = styled.TouchableOpacity`
  width: 38px;
  height: 38px;
  border-radius: 19px;
  background-color: #f9fafb;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  position: relative;
`;

const NotifDot = styled.View`
  position: absolute;
  top: 9px;
  right: 9px;
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: #ef4444;
  border-width: 1.5px;
  border-color: #ffffff;
`;

const CartBadge = styled.View`
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: #ef4444;
  border-radius: 8px;
  min-width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 3px;
  border-width: 1.5px;
  border-color: #ffffff;
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
  background-color: #0f8a3c;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
`;

const AvatarText = styled.Text`
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
`;
