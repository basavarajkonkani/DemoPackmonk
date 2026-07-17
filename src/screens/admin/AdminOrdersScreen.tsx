import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateOrderStatus, updateOrderTimeline, cancelOrder } from '../../store/adminSlice';

interface Props {
  navigation: any;
}

const AdminOrdersScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.admin.orders);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const statusConfig = {
    pending: { label: 'Pending', color: '#F59E0B', bg: '#FEF3C7' },
    in_production: { label: 'In Production', color: '#3B82F6', bg: '#DBEAFE' },
    packed: { label: 'Packed', color: '#8B5CF6', bg: '#EDE9FE' },
    shipped: { label: 'Shipped', color: '#10B981', bg: '#D1FAE5' },
    delivered: { label: 'Delivered', color: '#059669', bg: '#A7F3D0' },
    cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEE2E2' },
  };

  const handleUpdateStatus = (orderId: string, newStatus: any) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
    Alert.alert('Success', `Order status updated to ${statusConfig[newStatus].label}`);
  };

  const handleUpdateProgress = (orderId: string, stage: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order && order.timeline) {
      const timelineItem = order.timeline.find((t) => t.stage === stage);
      if (timelineItem && timelineItem.percentage < 100) {
        const newPercentage = Math.min(100, timelineItem.percentage + 25);
        dispatch(
          updateOrderTimeline({
            orderId,
            stage,
            percentage: newPercentage,
          })
        );
        Alert.alert(
          'Progress Updated',
          `${stage} progress: ${newPercentage}%`
        );
      }
    }
  };

  const handleCancelOrder = (orderId: string) => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          dispatch(cancelOrder(orderId));
          Alert.alert('Success', 'Order cancelled');
        },
      },
    ]);
  };

  return (
    <Wrapper>
      <Header>
        <BackBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color="#111827" />
        </BackBtn>
        <HeaderTitle>Order Management</HeaderTitle>
        <PlaceholderBtn />
      </Header>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 8, paddingBottom: 80 }}>
        {orders.map((order) => {
          const config = statusConfig[order.status];
          return (
            <OrderCard key={order.id}>
              <OrderHeader>
                <OrderId>{order.id}</OrderId>
                <StatusBadge style={{ backgroundColor: config.bg }}>
                  <StatusText style={{ color: config.color }}>
                    {config.label}
                  </StatusText>
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
                  <InfoValue>{order.productName}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Quantity:</InfoLabel>
                  <InfoValue>{order.quantity.toLocaleString()} units</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Amount:</InfoLabel>
                  <InfoValue style={{ fontWeight: '700' }}>
                    ₹{order.amount.toLocaleString()}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Order Date:</InfoLabel>
                  <InfoValue>{order.orderDate}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Production:</InfoLabel>
                  <InfoValue style={{ color: '#3B82F6' }}>
                    {order.productionStage}
                  </InfoValue>
                </InfoRow>
              </ProductInfo>

              {order.timeline && (
                <>
                  <Divider />
                  <TimelineSection>
                    <TimelineTitle>Production Timeline</TimelineTitle>
                    {order.timeline.map((item, idx) => (
                      <TimelineItem key={idx}>
                        <TimelineItemLeft>
                          <TimelineIcon
                            style={{
                              backgroundColor:
                                item.status === 'completed'
                                  ? '#10B981'
                                  : item.status === 'in_progress'
                                  ? '#3B82F6'
                                  : '#D1D5DB',
                            }}
                          >
                            <FontAwesome5
                              name={
                                item.status === 'completed'
                                  ? 'check'
                                  : 'hourglass-half'
                              }
                              size={12}
                              color="#ffffff"
                            />
                          </TimelineIcon>
                          <TimelineInfo>
                            <TimelineStageName>{item.stage}</TimelineStageName>
                            <TimelinePercentage>{item.percentage}%</TimelinePercentage>
                          </TimelineInfo>
                        </TimelineItemLeft>
                        {item.status !== 'completed' && (
                          <UpdateBtn
                            onPress={() => handleUpdateProgress(order.id, item.stage)}
                          >
                            <FontAwesome5 name="plus" size={10} color="#0F8A3C" />
                          </UpdateBtn>
                        )}
                      </TimelineItem>
                    ))}
                  </TimelineSection>
                </>
              )}

              <OrderActions>
                <ActionBtn
                  onPress={() =>
                    Alert.alert(
                      'Update Status',
                      `Current: ${config.label}\n\nUpdate to:`,
                      [
                        {
                          text: 'In Production',
                          onPress: () => handleUpdateStatus(order.id, 'in_production'),
                        },
                        {
                          text: 'Packed',
                          onPress: () => handleUpdateStatus(order.id, 'packed'),
                        },
                        {
                          text: 'Shipped',
                          onPress: () => handleUpdateStatus(order.id, 'shipped'),
                        },
                        {
                          text: 'Delivered',
                          onPress: () => handleUpdateStatus(order.id, 'delivered'),
                        },
                        { text: 'Cancel', style: 'cancel' },
                      ]
                    )
                  }
                >
                  <FontAwesome5 name="sync" size={14} color="#3B82F6" />
                  <ActionText style={{ color: '#3B82F6' }}>Update Status</ActionText>
                </ActionBtn>
                <ActionBtn
                  onPress={() =>
                    Alert.alert('Generate Invoice', 'Invoice PDF generated and ready to download')
                  }
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
        })}
      </ScrollView>
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

const UpdateBtn = styled.TouchableOpacity`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: #DCFCE7;
  align-items: center;
  justify-content: center;
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
