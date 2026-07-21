import React, { useEffect } from 'react';
import { ScrollView, Alert, ActivityIndicator, View } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchOrders,
  changeOrderStatus,
  cancelOrderThunk,
  selectOrdersList,
  selectOrdersLoading,
} from '../../store/ordersSlice';
import type { OrderStatus } from '../../store/ordersSlice';

interface Props {
  navigation: any;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending_review: { label: 'Pending Review', color: '#F59E0B', bg: '#FEF3C7' },
  artwork_approved: { label: 'Artwork Approved', color: '#0F8A3C', bg: '#DCFCE7' },
  in_production: { label: 'In Production', color: '#3B82F6', bg: '#DBEAFE' },
  quality_check: { label: 'Quality Check', color: '#8B5CF6', bg: '#EDE9FE' },
  shipped: { label: 'Shipped', color: '#0284C7', bg: '#E0F2FE' },
  delivered: { label: 'Delivered', color: '#059669', bg: '#A7F3D0' },
  cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEE2E2' },
};

const NEXT_STATUS_OPTIONS: OrderStatus[] = [
  'pending_review',
  'artwork_approved',
  'in_production',
  'quality_check',
  'shipped',
  'delivered',
];

const AdminOrdersScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrdersList);
  const loading = useAppSelector(selectOrdersLoading);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    dispatch(changeOrderStatus({ id: orderId, status: newStatus }));
    Alert.alert('Success', `Order status updated to ${STATUS_CONFIG[newStatus].label}`);
  };

  const handleCancelOrder = (orderId: string) => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          dispatch(cancelOrderThunk(orderId));
          Alert.alert('Success', 'Order cancelled');
        },
      },
    ]);
  };

  const totalQuantity = (order: (typeof orders)[number]) =>
    order.items.reduce((sum, item) => sum + item.quantity, 0);

  const productSummary = (order: (typeof orders)[number]) =>
    order.items.map((item) => item.name).join(', ') || 'No items';

  return (
    <Wrapper>
      <Header>
        <BackBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color="#111827" />
        </BackBtn>
        <HeaderTitle>Order Management</HeaderTitle>
        <PlaceholderBtn />
      </Header>

      {loading && orders.length === 0 ? (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <ActivityIndicator color="#0F8A3C" size="large" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 8, paddingBottom: 80 }}>
          {orders.length === 0 ? (
            <EmptyState>
              <FontAwesome5 name="clipboard-list" size={32} color="#D1D5DB" />
              <EmptyStateText>No orders yet</EmptyStateText>
            </EmptyState>
          ) : (
            orders.map((order) => {
              const config = STATUS_CONFIG[order.status];
              return (
                <OrderCard key={order.id}>
                  <OrderHeader>
                    <OrderId>{order.id}</OrderId>
                    <StatusBadge style={{ backgroundColor: config.bg }}>
                      <StatusText style={{ color: config.color }}>{config.label}</StatusText>
                    </StatusBadge>
                  </OrderHeader>

                  <CustomerInfo>
                    <InfoLabel>Customer:</InfoLabel>
                    <InfoValue>{order.customerName}</InfoValue>
                  </CustomerInfo>
                  <CustomerInfo>
                    <InfoLabel>Company:</InfoLabel>
                    <InfoValue>{order.companyName}</InfoValue>
                  </CustomerInfo>

                  <Divider />

                  <ProductInfo>
                    <InfoRow>
                      <InfoLabel>Product:</InfoLabel>
                      <InfoValue numberOfLines={1}>{productSummary(order)}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>Quantity:</InfoLabel>
                      <InfoValue>{totalQuantity(order).toLocaleString()} units</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>Amount:</InfoLabel>
                      <InfoValue style={{ fontWeight: '700' }}>₹{order.total.toLocaleString()}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>Order Date:</InfoLabel>
                      <InfoValue>{new Date(order.date).toLocaleDateString()}</InfoValue>
                    </InfoRow>
                  </ProductInfo>

                  <Divider />
                  <TimelineSection>
                    <TimelineTitle>Production Timeline</TimelineTitle>
                    {order.milestones.map((m) => (
                      <TimelineItem key={m.status}>
                        <TimelineItemLeft>
                          <TimelineIcon
                            style={{ backgroundColor: m.isCompleted ? '#10B981' : '#D1D5DB' }}
                          >
                            <FontAwesome5
                              name={m.isCompleted ? 'check' : 'hourglass-half'}
                              size={12}
                              color="#ffffff"
                            />
                          </TimelineIcon>
                          <TimelineInfo>
                            <TimelineStageName>{m.label}</TimelineStageName>
                            <TimelinePercentage>{m.timestamp ?? 'Pending'}</TimelinePercentage>
                          </TimelineInfo>
                        </TimelineItemLeft>
                      </TimelineItem>
                    ))}
                  </TimelineSection>

                  <OrderActions>
                    <ActionBtn
                      onPress={() =>
                        Alert.alert(
                          'Update Status',
                          `Current: ${config.label}\n\nUpdate to:`,
                          [
                            ...NEXT_STATUS_OPTIONS.map((status) => ({
                              text: STATUS_CONFIG[status].label,
                              onPress: () => handleUpdateStatus(order.id, status),
                            })),
                            { text: 'Dismiss', style: 'cancel' as const },
                          ]
                        )
                      }
                    >
                      <FontAwesome5 name="sync" size={14} color="#3B82F6" />
                      <ActionText style={{ color: '#3B82F6' }}>Update Status</ActionText>
                    </ActionBtn>
                    <ActionBtn
                      onPress={() => Alert.alert('Generate Invoice', 'Invoice PDF generated and ready to download')}
                    >
                      <FontAwesome5 name="file-invoice" size={14} color="#10B981" />
                      <ActionText style={{ color: '#10B981' }}>Invoice</ActionText>
                    </ActionBtn>
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <ActionBtn onPress={() => handleCancelOrder(order.id)}>
                        <FontAwesome5 name="ban" size={14} color="#EF4444" />
                        <ActionText style={{ color: '#EF4444' }}>Cancel</ActionText>
                      </ActionBtn>
                    )}
                  </OrderActions>
                </OrderCard>
              );
            })
          )}
        </ScrollView>
      )}
    </Wrapper>
  );
};

export default AdminOrdersScreen;

const Wrapper = styled.View`
  flex: 1;
  background-color: #f8f9fa;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const BackBtn = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f3f4f6;
  align-items: center;
  justify-content: center;
`;

const HeaderTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  flex: 1;
  text-align: center;
`;

const PlaceholderBtn = styled.View`
  width: 40px;
`;

const EmptyState = styled.View`
  align-items: center;
  padding-vertical: 60px;
`;
const EmptyStateText = styled.Text`
  font-size: 14px;
  color: #9CA3AF;
  margin-top: 12px;
  font-weight: 600;
`;

const OrderCard = styled.View`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 7px;
  border-width: 1px;
  border-color: #e5e7eb;
  shadow-color: rgba(0, 0, 0, 0.04);
  shadow-offset: 0px 1px;
  shadow-opacity: 1;
  shadow-radius: 2;
  elevation: 1;
`;

const OrderHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const OrderId = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #111827;
`;

const StatusBadge = styled.View`
  padding: 4px 8px;
  border-radius: 6px;
`;

const StatusText = styled.Text`
  font-size: 10px;
  font-weight: 700;
`;

const CustomerInfo = styled.View`
  flex-direction: row;
  margin-bottom: 4px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #e5e7eb;
  margin: 8px 0;
`;

const ProductInfo = styled.View``;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

const InfoLabel = styled.Text`
  font-size: 11px;
  color: #6b7280;
  width: 70px;
  font-weight: 600;
`;

const InfoValue = styled.Text`
  font-size: 11px;
  color: #111827;
  flex: 1;
  font-weight: 500;
`;

const TimelineSection = styled.View`
  margin-vertical: 8px;
`;

const TimelineTitle = styled.Text`
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 8px;
`;

const TimelineItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding-left: 4px;
`;

const TimelineItemLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const TimelineIcon = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

const TimelineInfo = styled.View``;

const TimelineStageName = styled.Text`
  font-size: 10px;
  font-weight: 600;
  color: #111827;
`;

const TimelinePercentage = styled.Text`
  font-size: 9px;
  color: #9CA3AF;
`;

const OrderActions = styled.View`
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: #e5e7eb;
  padding-top: 8px;
  margin-top: 6px;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 4px;
`;

const ActionBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 6px 10px;
  border-radius: 6px;
  background-color: #f3f4f6;
  flex: 1;
  min-width: 45%;
`;

const ActionText = styled.Text`
  font-size: 10px;
  font-weight: 600;
  margin-left: 4px;
`;
