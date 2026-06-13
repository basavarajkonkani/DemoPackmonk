/**
 * OrderPlacedScreen — shown after successful checkout
 * Matches the image: green checkmark, "Order Placed Successfully!", order ID, email/WhatsApp note,
 * "View My Orders" (green) and "Continue Shopping" (outline) buttons.
 */
import React from 'react';
import { View, Platform } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

const OrderPlacedScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const orderId = route?.params?.orderId ?? 'PCH4589';

  return (
    <Container>
      <Inner>
        {/* Green circle checkmark */}
        <CheckCircle>
          <FontAwesome5 name="check" size={40} color="#FFFFFF" />
        </CheckCircle>

        <Title>Order Placed Successfully!</Title>
        <OrderIdText>Order ID: {orderId}</OrderIdText>
        <SubText>
          We will send the order details to{'\n'}your email & WhatsApp.
        </SubText>

        <ViewOrdersBtn
          onPress={() =>
            navigation.reset({ index: 0, routes: [{ name: 'MainTabs', params: { screen: 'Orders' } }] })
          }
          activeOpacity={0.9}
        >
          <ViewOrdersBtnText>View My Orders</ViewOrdersBtnText>
        </ViewOrdersBtn>

        <ContinueBtn
          onPress={() =>
            navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })
          }
          activeOpacity={0.85}
        >
          <ContinueBtnText>Continue Shopping</ContinueBtnText>
        </ContinueBtn>
      </Inner>
    </Container>
  );
};

export default OrderPlacedScreen;

const Container = styled.View`
  flex: 1; background-color: #FFFFFF; align-items: center; justify-content: center;
  padding: 32px;
`;
const Inner = styled.View`align-items: center; width: 100%;`;

const CheckCircle = styled.View`
  width: 100px; height: 100px; border-radius: 50px;
  background-color: #22C55E; align-items: center; justify-content: center;
  margin-bottom: 28px;
  shadow-color: #22C55E; shadow-offset: 0px 8px; shadow-opacity: 0.35; shadow-radius: 20px; elevation: 10;
`;

const Title = styled.Text`
  font-size: 22px; font-weight: 800; color: #111827; text-align: center; margin-bottom: 8px;
`;
const OrderIdText = styled.Text`
  font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px;
`;
const SubText = styled.Text`
  font-size: 14px; color: #9CA3AF; text-align: center; line-height: 22px; margin-bottom: 36px;
`;

const ViewOrdersBtn = styled.TouchableOpacity`
  width: 100%; height: 52px; background-color: #22C55E; border-radius: 14px;
  align-items: center; justify-content: center; margin-bottom: 12px;
`;
const ViewOrdersBtnText = styled.Text`font-size: 16px; font-weight: 700; color: #FFFFFF;`;

const ContinueBtn = styled.TouchableOpacity`
  width: 100%; height: 52px; border-radius: 14px;
  align-items: center; justify-content: center;
  border-width: 1.5px; border-color: #E5E7EB; background-color: #FFFFFF;
`;
const ContinueBtnText = styled.Text`font-size: 16px; font-weight: 600; color: #374151;`;
