/**
 * Order Tracking Screen — uses real order data from Redux store.
 */
import React from 'react';
import { ScrollView, View, Alert, Linking, Platform } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppSelector } from '../store';
import { selectOrdersList } from '../store/ordersSlice';
import { SUPPORT_PHONE, SUPPORT_EMAIL } from '../constants';

const ShipmentTrackingScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation, route }) => {
  const orderId = route?.params?.orderId ?? null;
  const orders = useAppSelector(selectOrdersList);

  // Find the order — prefer the one passed by route, else use the most recent
  const order = orderId
    ? orders.find((o) => o.id === orderId) ?? orders[0]
    : orders[0];

  const handleSupport = () => {
    Alert.alert(
      'Contact Support',
      `We're here to help!\n\nPhone: ${SUPPORT_PHONE}\nEmail: ${SUPPORT_EMAIL}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          onPress: () => Linking.openURL(`tel:${SUPPORT_PHONE}`).catch(() => {}),
        },
        {
          text: 'Email',
          onPress: () => Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() => {}),
        },
      ]
    );
  };

  if (!order) {
    return (
      <Container>
        <NavBar>
          <NavBtn onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={16} color="#111827" />
          </NavBtn>
          <NavTitle>Order Tracking</NavTitle>
          <View style={{ width: 36 }} />
        </NavBar>
        <EmptyWrap>
          <FontAwesome5 name="clipboard" size={40} color="#D1D5DB" style={{ marginBottom: 14 }} />
          <EmptyTitle>No Orders Yet</EmptyTitle>
          <EmptyDesc>Place an order first to track its status here.</EmptyDesc>
        </EmptyWrap>
      </Container>
    );
  }

  const orderDate = new Date(order.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <Container>
      <NavBar>
        <NavBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={16} color="#111827" />
        </NavBtn>
        <NavTitle>Order Tracking</NavTitle>
        <View style={{ width: 36 }} />
      </NavBar>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

        {/* Order Info */}
        <OrderInfoCard>
          <OrderInfoRow>
            <View>
              <OILabel>Order ID</OILabel>
              <OIValue>{order.id}</OIValue>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <OILabel>Order Date</OILabel>
              <OIValue>{orderDate}</OIValue>
            </View>
          </OrderInfoRow>
          {order.trackingNumber && (
            <TrackingRow>
              <FontAwesome5 name="barcode" size={12} color="#6B7280" style={{ marginRight: 6 }} />
              <OILabel>Tracking: </OILabel>
              <OIValue style={{ fontSize: 12 }}>{order.trackingNumber}</OIValue>
            </TrackingRow>
          )}
          <DeliveryRow>
            <FontAwesome5 name="truck" size={12} color="#0F8A3C" style={{ marginRight: 6 }} />
            <OILabel>
              {order.status === 'delivered' ? 'Delivered: ' : 'Est. Delivery: '}
            </OILabel>
            <OIValue style={{ fontSize: 12, color: '#0F8A3C' }}>{order.estimatedDelivery}</OIValue>
          </DeliveryRow>
        </OrderInfoCard>

        {/* Timeline built from real milestones */}
        <TimelineCard>
          {order.milestones.map((item, idx) => {
            const isLast = idx === order.milestones.length - 1;
            const completedMilestones = order.milestones.filter(m => m.isCompleted);
            const isActive = item.isCompleted && idx === completedMilestones.length - 1;
            return (
              <TimelineStep key={item.status}>
                <TLeft>
                  <TDot done={item.isCompleted} active={isActive}>
                    {item.isCompleted
                      ? <FontAwesome5 name="check" size={9} color="#FFF" />
                      : null
                    }
                  </TDot>
                  {!isLast && <TLine done={item.isCompleted} />}
                </TLeft>
                <TRight last={isLast}>
                  <TLabel done={item.isCompleted}>{item.label}</TLabel>
                  <TDate done={item.isCompleted}>
                    {item.timestamp
                      ? item.timestamp
                      : item.isCompleted
                      ? 'Completed'
                      : `Expected: ${order.estimatedDelivery}`}
                  </TDate>
                </TRight>
              </TimelineStep>
            );
          })}
        </TimelineCard>

        {/* Support Button */}
        <SupportBtn onPress={handleSupport} activeOpacity={0.85}>
          <FontAwesome5 name="headset" size={14} color="#374151" style={{ marginRight: 8 }} />
          <SupportBtnText>Need Help? Contact Support</SupportBtnText>
        </SupportBtn>

      </ScrollView>
    </Container>
  );
};

export default ShipmentTrackingScreen;

const Container = styled.View`flex: 1; background-color: #F8F9FA;`;

const EmptyWrap = styled.View`flex: 1; align-items: center; justify-content: center; padding: 40px;`;
const EmptyTitle = styled.Text`font-size: 18px; font-weight: 700; color: #374151; margin-bottom: 8px;`;
const EmptyDesc = styled.Text`font-size: 14px; color: #9CA3AF; text-align: center;`;

const NavBar = styled.View`
  height: ${Platform.OS === 'ios' ? '94px' : '56px'};
  padding-top: ${Platform.OS === 'ios' ? '48px' : '0px'};
  flex-direction: row; align-items: center; justify-content: space-between;
  padding-horizontal: 16px; background-color: #FFFFFF;
  border-bottom-width: 1px; border-bottom-color: #E5E7EB;
`;
const NavBtn = styled.TouchableOpacity`
  width: 36px; height: 36px; border-radius: 10px;
  background-color: #F9FAFB; align-items: center; justify-content: center;
  border-width: 1px; border-color: #E5E7EB;
`;
const NavTitle = styled.Text`font-size: 17px; font-weight: 700; color: #111827;`;

const OrderInfoCard = styled.View`
  background-color: #FFFFFF; border-radius: 14px; padding: 16px;
  border-width: 1px; border-color: #E5E7EB; margin-bottom: 16px;
`;
const OrderInfoRow = styled.View`flex-direction: row; justify-content: space-between;`;
const OILabel = styled.Text`font-size: 11px; color: #9CA3AF; margin-bottom: 3px;`;
const OIValue = styled.Text`font-size: 14px; font-weight: 700; color: #111827;`;
const TrackingRow = styled.View`flex-direction: row; align-items: center; margin-top: 10px; padding-top: 10px; border-top-width: 1px; border-top-color: #F3F4F6;`;
const DeliveryRow = styled.View`flex-direction: row; align-items: center; margin-top: 8px;`;

const TimelineCard = styled.View`
  background-color: #FFFFFF; border-radius: 14px; padding: 20px;
  border-width: 1px; border-color: #E5E7EB; margin-bottom: 16px;
`;
const TimelineStep = styled.View`flex-direction: row;`;
const TLeft = styled.View`width: 28px; align-items: center;`;
const TDot = styled.View<{ done: boolean; active?: boolean }>`
  width: 22px; height: 22px; border-radius: 11px;
  background-color: ${({ done }) => done ? '#22C55E' : '#E5E7EB'};
  align-items: center; justify-content: center; z-index: 2;
`;
const TLine = styled.View<{ done: boolean }>`
  width: 2px; flex: 1; min-height: 24px;
  background-color: ${({ done }) => done ? '#22C55E' : '#E5E7EB'};
  margin-vertical: 3px;
`;
const TRight = styled.View<{ last: boolean }>`
  flex: 1; padding-left: 14px; padding-bottom: ${({ last }) => last ? '0px' : '22px'};
`;
const TLabel = styled.Text<{ done: boolean }>`
  font-size: 14px; font-weight: 700;
  color: ${({ done }) => done ? '#111827' : '#9CA3AF'};
  margin-bottom: 2px;
`;
const TDate = styled.Text<{ done: boolean }>`
  font-size: 11px;
  color: ${({ done }) => done ? '#6B7280' : '#D1D5DB'};
`;

const SupportBtn = styled.TouchableOpacity`
  flex-direction: row; align-items: center; justify-content: center;
  background-color: #FFFFFF; border-radius: 14px; padding: 16px;
  border-width: 1px; border-color: #E5E7EB;
`;
const SupportBtnText = styled.Text`font-size: 14px; font-weight: 600; color: #374151;`;
