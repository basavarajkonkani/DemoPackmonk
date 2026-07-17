import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation: any;
}

const AdminOrdersScreen: React.FC<Props> = ({ navigation }) => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-1001',
      customerName: 'Rahul Sharma',
      companyName: 'Sharma Industries',
      productName: 'Stand-Up Pouch',
      quantity: 5000,
      amount: 62500,
      status: 'pending' as const,
      productionStage: 'Awaiting Approval',
      orderDate: '2024-01-20',
    },
    {
      id: 'ORD-1002',
      customerName: 'Priya Patel',
      companyName: 'Patel Enterprises',
      productName: 'Kraft Paper Box',
      quantity: 2000,
      amount: 50000,
      status: 'in_production' as const,
      productionStage: 'Printing Stage',
      orderDate: '2024-01-18',
    },
    {
      id: 'ORD-1003',
      customerName: 'Amit Kumar',
      companyName: 'Kumar Foods',
      productName: 'Window Pouch',
      quantity: 3000,
      amount: 45000,
      status: 'shipped' as const,
      productionStage: 'Dispatched',
      orderDate: '2024-01-15',
    },
  ]);

  const statusConfig = {
    pending: { label: 'Pending', color: '#F59E0B', bg: '#FEF3C7' },
    in_production: { label: 'In Production', color: '#3B82F6', bg: '#DBEAFE' },
    shipped: { label: 'Shipped', color: '#10B981', bg: '#D1FAE5' },
    delivered: { label: 'Delivered', color: '#059669', bg: '#A7F3D0' },
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus as any } : o
      )
    );
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
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

              <OrderActions>
                <ActionBtn
                  onPress={() =>
                    Alert.alert(
                      'Update Status',
                      `Current: ${config.label}\n\nUpdate to:`,
                      [
                        {
                          text: 'In Production',
                          onPress: () => updateOrderStatus(order.id, 'in_production'),
                        },
                        {
                          text: 'Shipped',
                          onPress: () => updateOrderStatus(order.id, 'shipped'),
                        },
                        {
                          text: 'Delivered',
                          onPress: () => updateOrderStatus(order.id, 'delivered'),
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
                  onPress={() => Alert.alert('Generate Invoice', 'Feature coming soon')}
                >
                  <FontAwesome5 name="file-invoice" size={14} color="#10B981" />
                  <ActionText style={{ color: '#10B981' }}>Invoice</ActionText>
                </ActionBtn>
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
  background-color: #f9fafb;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const BackBtn = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f9fafb;
  align-items: center;
  justify-content: center;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
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
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const OrderHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const OrderId = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;

const StatusBadge = styled.View`
  padding: 6px 12px;
  border-radius: 12px;
`;

const StatusText = styled.Text`
  font-size: 12px;
  font-weight: 600;
`;

const CustomerInfo = styled.View`
  flex-direction: row;
  margin-bottom: 6px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #e5e7eb;
  margin: 12px 0;
`;

const ProductInfo = styled.View``;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
`;

const InfoLabel = styled.Text`
  font-size: 13px;
  color: #6b7280;
  width: 90px;
`;

const InfoValue = styled.Text`
  font-size: 13px;
  color: #111827;
  flex: 1;
`;

const OrderActions = styled.View`
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: #e5e7eb;
  padding-top: 12px;
  margin-top: 8px;
  justify-content: space-around;
`;

const ActionBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #f9fafb;
`;

const ActionText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  margin-left: 6px;
`;
