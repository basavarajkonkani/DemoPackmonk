import React, { useState } from 'react';
import { ScrollView, View, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useAppSelector } from '../store';
import { selectOrdersList } from '../store/ordersSlice';
import Header from '../components/Header';
import { FontAwesome5 } from '@expo/vector-icons';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending_review: { label: 'Artwork Review', color: '#D97706', bg: '#FEF3C7' },
  artwork_approved: { label: 'Ready for Press', color: '#0F8A3C', bg: '#DCFCE7' },
  in_production: { label: 'In Production', color: '#D97706', bg: '#FEF3C7' },
  quality_check: { label: 'Quality Check', color: '#7C3AED', bg: '#F3E8FF' },
  shipped: { label: 'Shipped', color: '#0284C7', bg: '#E0F2FE' },
  delivered: { label: 'Delivered', color: '#0F8A3C', bg: '#DCFCE7' },
};

const OrdersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const orders = useAppSelector(selectOrdersList);
  const [expandedId, setExpandedId] = useState<string | null>(orders[0]?.id ?? null);

  const toggle = (id: string) => setExpandedId(expandedId === id ? null : id);

  return (
    <Container>
      <Header navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: Platform.OS === 'web' ? 120 : 100, alignItems: 'center' }}>
        <ContentWrapper>
        {/* Header Row */}
        <TitleRow>
          <TitleIcon>
            <FontAwesome5 name="route" size={18} color="#0F8A3C" />
          </TitleIcon>
          <TitleText>Production Tracking</TitleText>
          <TrackShipBtn onPress={() => navigation.navigate('ShipmentTracking', { orderId: orders[0]?.id })} activeOpacity={0.8}>
            <FontAwesome5 name="truck" size={11} color="#0F8A3C" style={{ marginRight: 4 }} />
            <TrackShipText>Track Shipment</TrackShipText>
          </TrackShipBtn>
        </TitleRow>
        {/* Stats */}
        <OrderStats>
          <OrderStat bgColor="#DCFCE7">
            <OrderStatNum>{orders.length}</OrderStatNum>
            <OrderStatLabel>Total Orders</OrderStatLabel>
          </OrderStat>
          <OrderStat bgColor="#DCFCE7">
            <OrderStatNum>{orders.filter((o) => o.status !== 'delivered').length}</OrderStatNum>
            <OrderStatLabel>In Progress</OrderStatLabel>
          </OrderStat>
          <OrderStat bgColor="#FEF3C7">
            <OrderStatNum>₹{orders.reduce((s, o) => s + o.total, 0).toFixed(0)}</OrderStatNum>
            <OrderStatLabel>Total Value</OrderStatLabel>
          </OrderStat>
        </OrderStats>

        {orders.length === 0 ? (
          <EmptyWrap>
            <EmptyIcon>
              <FontAwesome5 name="clipboard" size={36} color="#9CA3AF" />
            </EmptyIcon>
            <EmptyTitle>No Orders Found</EmptyTitle>
            <EmptyDesc>You haven't submitted any production orders yet.</EmptyDesc>
          </EmptyWrap>
        ) : (
          orders.map((order) => {
            const expanded = expandedId === order.id;
            const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending_review;

            return (
              <OrderCard key={order.id} expanded={expanded}
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}>

                {/* Card Header */}
                <CardHeader onPress={() => toggle(order.id)} activeOpacity={0.9}>
                  <CardHeaderLeft>
                    <OrderIconWrap bgColor={cfg.bg}>
                      <FontAwesome5 name="box" size={16} color={cfg.color} />
                    </OrderIconWrap>
                    <CardMeta>
                      <CardOrderId>{order.id}</CardOrderId>
                      <CardDate>{new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</CardDate>
                    </CardMeta>
                  </CardHeaderLeft>
                  <CardHeaderRight>
                    <CardTotal>₹{order.total.toFixed(0)}</CardTotal>
                    <StatusBadge bgColor={cfg.bg}>
                      <StatusBadgeText color={cfg.color}>{cfg.label}</StatusBadgeText>
                    </StatusBadge>
                    <FontAwesome5
                      name={expanded ? 'chevron-up' : 'chevron-down'}
                      size={12}
                      color="#9CA3AF"
                      style={{ marginLeft: 8 }}
                    />
                  </CardHeaderRight>
                </CardHeader>

                {expanded && (
                  <ExpandedBody>
                    <SectionDivider />

                    {/* Delivery Banner */}
                    <DeliveryBanner>
                      <FontAwesome5 name="truck" size={13} color="#0F8A3C" style={{ marginRight: 8 }} />
                      <DeliveryText>
                        {order.status === 'delivered' ? 'Delivered on: ' : 'Estimated delivery: '}
                        <DeliveryDate>{order.estimatedDelivery}</DeliveryDate>
                      </DeliveryText>
                    </DeliveryBanner>

                    {/* Timeline */}
                    <SubLabel>Production Pipeline</SubLabel>
                    <Timeline>
                      {order.milestones.map((m, idx) => {
                        const isLast = idx === order.milestones.length - 1;
                        const isCurrent = order.status === m.status;
                        return (
                          <TimelineStep key={m.status}>
                            <TimelineLeft>
                              <TimelineCircle done={m.isCompleted} current={isCurrent}>
                                {m.isCompleted ? (
                                  <FontAwesome5 name="check" size={8} color="#FFFFFF" />
                                ) : (
                                  <TimelineInner current={isCurrent} />
                                )}
                              </TimelineCircle>
                              {!isLast && <TimelineLine done={m.isCompleted} />}
                            </TimelineLeft>
                            <TimelineRight last={isLast}>
                              <TimelineTopRow>
                                <TimelineLabel done={m.isCompleted} current={isCurrent}>{m.label}</TimelineLabel>
                                {m.timestamp && <TimelineTime>{m.timestamp}</TimelineTime>}
                              </TimelineTopRow>
                              <TimelineDesc>{m.description}</TimelineDesc>
                            </TimelineRight>
                          </TimelineStep>
                        );
                      })}
                    </Timeline>

                    {/* Items */}
                    <SubLabel>Items ({order.items.length})</SubLabel>
                    {order.items.map((item) => {
                      const isPouch = item.category === 'pouch';
                      const specText = isPouch && item.pouchConfig
                        ? `${item.pouchConfig.capacity} • ${item.pouchConfig.dimensions.width}×${item.pouchConfig.dimensions.height}mm`
                        : `${item.design.length}" × ${item.design.width}" · ${item.design.materialId.replace(/-/g, ' ')}`;
                      const currency = '₹';
                      return (
                        <ItemRow key={item.cartId}>
                          <ItemIconWrap>
                            <FontAwesome5
                              name={item.category === 'bag' || item.category === 'pouch' ? 'shopping-bag' : 'box'}
                              size={14}
                              color="#6B7280"
                            />
                          </ItemIconWrap>
                          <ItemMeta>
                            <ItemName>{item.name}</ItemName>
                            <ItemSpec>{specText}</ItemSpec>
                          </ItemMeta>
                          <ItemRight>
                            <ItemQty>{item.quantity.toLocaleString()} units</ItemQty>
                            <ItemPrice>{currency}{item.totalPrice.toFixed(2)}</ItemPrice>
                          </ItemRight>
                        </ItemRow>
                      );
                    })}

                    {/* Cost Breakdown */}
                    <SectionDivider />
                    <CostBlock>
                      <CostRow><CostKey>Subtotal</CostKey><CostVal>₹{order.subtotal.toFixed(2)}</CostVal></CostRow>
                      {order.setupFees > 0 && <CostRow><CostKey>Artwork Setup</CostKey><CostVal>₹{order.setupFees.toFixed(2)}</CostVal></CostRow>}
                      <CostRow><CostKey>Shipping</CostKey><CostVal>₹{order.shipping.toFixed(2)}</CostVal></CostRow>
                      <CostRow><CostKey>Tax</CostKey><CostVal>₹{order.tax.toFixed(2)}</CostVal></CostRow>
                      <CostTotalRow>
                        <CostTotalLabel>Order Total</CostTotalLabel>
                        <CostTotalVal>₹{order.total.toFixed(2)}</CostTotalVal>
                      </CostTotalRow>
                    </CostBlock>

                    {order.trackingNumber && (
                      <TrackingRow>
                        <FontAwesome5 name="barcode" size={14} color="#6B7280" style={{ marginRight: 10 }} />
                        <View>
                          <TrackingLabel>Tracking Number</TrackingLabel>
                          <TrackingNum>{order.trackingNumber}</TrackingNum>
                        </View>
                      </TrackingRow>
                    )}
                  </ExpandedBody>
                )}
              </OrderCard>
            );
          })
        )}
        </ContentWrapper>
      </ScrollView>

    </Container>
  );
};

export default OrdersScreen;

const Container = styled.View`flex: 1; background-color: #F8F9FA;`;

const ContentWrapper = styled.View`
  width: 100%;
  max-width: 900px;
  align-self: center;
`;

const TitleRow = styled.View`flex-direction: row; align-items: center; margin-bottom: 16px;`;
const TitleIcon = styled.View`
  width: 36px; height: 36px; border-radius: 10px;
  background-color: #DCFCE7; align-items: center; justify-content: center; margin-right: 10px;
`;
const TitleText = styled.Text`font-size: 17px; font-weight: 800; color: #111827; flex: 1;`;
const TrackShipBtn = styled.TouchableOpacity`
  flex-direction: row; align-items: center;
  background-color: #DCFCE7; padding: 7px 12px; border-radius: 20px;
  border-width: 1px; border-color: #BBF7D0;
`;
const TrackShipText = styled.Text`font-size: 11px; font-weight: 700; color: #0F8A3C;`;

const OrderStats = styled.View`flex-direction: row; margin-bottom: 18px;`;
const OrderStat = styled.View<{ bgColor: string }>`
  flex: 1; background-color: ${({ bgColor }) => bgColor}; border-radius: 16px;
  padding: 14px; align-items: center; margin-right: 8px;
`;
const OrderStatNum = styled.Text`font-size: 22px; font-weight: 800; color: #111827; letter-spacing: -0.5px;`;
const OrderStatLabel = styled.Text`font-size: 11px; color: #6B7280; font-weight: 500; margin-top: 3px; text-align: center;`;

const EmptyWrap = styled.View`align-items: center; padding-vertical: 60px;`;
const EmptyIcon = styled.View`
  width: 72px; height: 72px; border-radius: 20px;
  background-color: #F3F4F6; align-items: center; justify-content: center; margin-bottom: 16px;
`;
const EmptyTitle = styled.Text`font-size: 17px; font-weight: 700; color: #374151; margin-bottom: 6px;`;
const EmptyDesc = styled.Text`font-size: 14px; color: #9CA3AF; text-align: center;`;

const OrderCard = styled.View<{ expanded: boolean }>`
  background-color: #FFFFFF; border-radius: 18px; margin-bottom: 14px; overflow: hidden;
  border-width: 1.5px;
  border-color: ${({ expanded }) => expanded ? '#0F8A3C' : '#F3F4F6'};
`;const CardHeader = styled.TouchableOpacity`
  flex-direction: row; align-items: center; justify-content: space-between; padding: 14px 16px;
`;
const CardHeaderLeft = styled.View`flex-direction: row; align-items: center;`;
const OrderIconWrap = styled.View<{ bgColor: string }>`
  width: 40px; height: 40px; border-radius: 12px;
  background-color: ${({ bgColor }) => bgColor}; align-items: center; justify-content: center; margin-right: 12px;
`;
const CardMeta = styled.View``;
const CardOrderId = styled.Text`font-size: 15px; font-weight: 800; color: #111827; margin-bottom: 2px;`;
const CardDate = styled.Text`font-size: 11px; color: #9CA3AF;`;
const CardHeaderRight = styled.View`flex-direction: row; align-items: center;`;
const CardTotal = styled.Text`font-size: 16px; font-weight: 800; color: #111827; margin-right: 8px;`;
const StatusBadge = styled.View<{ bgColor: string }>`
  padding: 4px 8px; border-radius: 8px; background-color: ${({ bgColor }) => bgColor};
`;
const StatusBadgeText = styled.Text<{ color: string }>`
  font-size: 9px; font-weight: 700; color: ${({ color }) => color};
`;

const ExpandedBody = styled.View`
  padding: 0 16px 16px; background-color: #FAFAFA;
`;
const SectionDivider = styled.View`height: 1px; background-color: #F3F4F6; margin-bottom: 14px;`;

const DeliveryBanner = styled.View`
  flex-direction: row; align-items: center; background-color: #DCFCE7;
  border-radius: 12px; padding: 10px 14px; margin-bottom: 16px;
`;
const DeliveryText = styled.Text`font-size: 13px; color: #374151; flex: 1;`;
const DeliveryDate = styled.Text`font-weight: 800; color: #0F8A3C;`;

const SubLabel = styled.Text`
  font-size: 11px; font-weight: 700; color: #9CA3AF;
  text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 12px;
`;

const Timeline = styled.View`padding-left: 4px; margin-bottom: 20px;`;
const TimelineStep = styled.View`flex-direction: row;`;
const TimelineLeft = styled.View`width: 24px; align-items: center;`;
const TimelineCircle = styled.View<{ done: boolean; current: boolean }>`
  width: 20px; height: 20px; border-radius: 10px; align-items: center; justify-content: center; z-index: 2;
  background-color: ${({ done }) => done ? '#0F8A3C' : 'transparent'};
  border-width: ${({ done }) => done ? 0 : 2}px;
  border-color: ${({ current }) => current ? '#0F8A3C' : '#E5E7EB'};
`;
const TimelineInner = styled.View<{ current: boolean }>`
  width: 7px; height: 7px; border-radius: 3.5px;
  background-color: ${({ current }) => current ? '#0F8A3C' : 'transparent'};
`;
const TimelineLine = styled.View<{ done: boolean }>`
  width: 2px; flex: 1; min-height: 24px;
  background-color: ${({ done }) => done ? '#0F8A3C' : '#E5E7EB'};
  margin-vertical: 1px; z-index: 1;
`;
const TimelineRight = styled.View<{ last: boolean }>`
  flex: 1; padding-left: 12px; padding-bottom: ${({ last }) => last ? 0 : 18}px;
`;
const TimelineTopRow = styled.View`flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 2px;`;
const TimelineLabel = styled.Text<{ done: boolean; current: boolean }>`
  font-size: 12px; font-weight: 700;
  color: ${({ done, current }) => done || current ? '#111827' : '#9CA3AF'};
`;
const TimelineTime = styled.Text`font-size: 10px; color: #9CA3AF;`;
const TimelineDesc = styled.Text`font-size: 11px; color: #9CA3AF; line-height: 15px;`;

const ItemRow = styled.View`
  flex-direction: row; align-items: center; background-color: #FFFFFF;
  border-radius: 12px; padding: 10px 12px; border-width: 1px; border-color: #F3F4F6; margin-bottom: 8px;
`;
const ItemIconWrap = styled.View`
  width: 30px; height: 30px; border-radius: 8px;
  background-color: #F9FAFB; align-items: center; justify-content: center; margin-right: 10px;
`;
const ItemMeta = styled.View`flex: 1;`;
const ItemName = styled.Text`font-size: 13px; font-weight: 700; color: #111827;`;
const ItemSpec = styled.Text`font-size: 10px; color: #9CA3AF; margin-top: 1px;`;
const ItemRight = styled.View`align-items: flex-end;`;
const ItemQty = styled.Text`font-size: 11px; font-weight: 600; color: #6B7280;`;
const ItemPrice = styled.Text`font-size: 13px; font-weight: 700; color: #111827;`;

const CostBlock = styled.View`margin-bottom: 12px;`;
const CostRow = styled.View`flex-direction: row; justify-content: space-between; margin-bottom: 6px;`;
const CostKey = styled.Text`font-size: 12px; color: #9CA3AF;`;
const CostVal = styled.Text`font-size: 12px; color: #374151;`;
const CostTotalRow = styled.View`flex-direction: row; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top-width: 1px; border-top-color: #F3F4F6;`;
const CostTotalLabel = styled.Text`font-size: 14px; font-weight: 700; color: #111827;`;
const CostTotalVal = styled.Text`font-size: 17px; font-weight: 800; color: #0F8A3C;`;

const TrackingRow = styled.View`
  flex-direction: row; align-items: center; background-color: #FFFFFF;
  border-radius: 12px; padding: 12px; border-width: 1px; border-color: #F3F4F6; margin-top: 4px;
`;
const TrackingLabel = styled.Text`font-size: 9px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.5px;`;
const TrackingNum = styled.Text`font-size: 13px; font-weight: 700; color: #111827;`;
