import React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import Header from '../../components/Header';

interface DashboardScreenProps {
  navigation: any;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const quickActions = [
    { id: '1', label: 'Orders', icon: 'clipboard-list', route: 'Orders', badge: 3, color: '#DCFCE7', iconColor: '#0F8A3C' },
    { id: '2', label: 'Invoices', icon: 'file-invoice', route: 'Invoices', badge: 2, color: '#FEF3C7', iconColor: '#D97706' },
    { id: '3', label: 'Wallet', icon: 'wallet', route: 'Wallet', badge: null, color: '#DBEAFE', iconColor: '#3B82F6' },
    { id: '4', label: 'Support', icon: 'headset', route: 'SupportTickets', badge: 1, color: '#FEE2E2', iconColor: '#EF4444' },
    { id: '5', label: 'Designs', icon: 'paint-brush', route: 'SavedDesigns', badge: null, color: '#F5F3FF', iconColor: '#7C3AED' },
    { id: '6', label: 'Wishlist', icon: 'heart', route: 'Wishlist', badge: 5, color: '#FCE7F3', iconColor: '#EC4899' },
  ];

  return (
    <Container>
      <Header navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Banner */}
        <WelcomeBanner>
          <WelcomeTitle>Welcome Back! 👋</WelcomeTitle>
          <WelcomeText>ZenTech Logistics</WelcomeText>
        </WelcomeBanner>

        {/* Stats Summary */}
        <SectionTitle>Overview</SectionTitle>
        <StatsGrid>
          <StatCard>
            <StatIcon bgColor="#DCFCE7">
              <FontAwesome5 name="box" size={18} color="#0F8A3C" />
            </StatIcon>
            <StatValue>12</StatValue>
            <StatLabel>Total Orders</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon bgColor="#FEF3C7">
              <FontAwesome5 name="clock" size={18} color="#D97706" />
            </StatIcon>
            <StatValue>3</StatValue>
            <StatLabel>Pending</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon bgColor="#DBEAFE">
              <FontAwesome5 name="check-circle" size={18} color="#3B82F6" />
            </StatIcon>
            <StatValue>9</StatValue>
            <StatLabel>Delivered</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon bgColor="#FEE2E2">
              <FontAwesome5 name="dollar-sign" size={18} color="#EF4444" />
            </StatIcon>
            <StatValue>₹8.4k</StatValue>
            <StatLabel>Total Value</StatLabel>
          </StatCard>
        </StatsGrid>

        {/* Quick Actions */}
        <SectionTitle>Quick Actions</SectionTitle>
        <QuickActionsGrid>
          {quickActions.map((action) => (
            <QuickActionCard key={action.id} onPress={() => navigation.navigate(action.route)}>
              <QuickActionIcon bgColor={action.color}>
                <FontAwesome5 name={action.icon as any} size={20} color={action.iconColor} />
              </QuickActionIcon>
              {action.badge && (
                <QuickActionBadge>
                  <QuickActionBadgeText>{action.badge}</QuickActionBadgeText>
                </QuickActionBadge>
              )}
              <QuickActionLabel>{action.label}</QuickActionLabel>
            </QuickActionCard>
          ))}
        </QuickActionsGrid>

        {/* Recent Orders */}
        <SectionTitle>Recent Orders</SectionTitle>
        <OrdersList>
          {[1, 2, 3].map((item) => (
            <OrderCard key={item}>
              <OrderHeader>
                <OrderID>Order #{`10${item}234`}</OrderID>
                <OrderStatus status="in_production">In Production</OrderStatus>
              </OrderHeader>
              <OrderDetail>
                <OrderDetailText>Kraft Standup Pouch • 5000 units</OrderDetailText>
                <OrderDate>Dec {20 + item}, 2024</OrderDate>
              </OrderDetail>
              <OrderFooter>
                <OrderPrice>₹1,250</OrderPrice>
                <TrackButton onPress={() => navigation.navigate('ProductionTimeline', { orderId: `10${item}234` })}>
                  <TrackButtonText>Track</TrackButtonText>
                </TrackButton>
              </OrderFooter>
            </OrderCard>
          ))}
        </OrdersList>

        {/* Wallet Balance */}
        <WalletCard>
          <WalletHeader>
            <WalletTitle>Wallet Balance</WalletTitle>
            <FontAwesome5 name="wallet" size={20} color="#0F8A3C" />
          </WalletHeader>
          <WalletBalance>₹2,450.00</WalletBalance>
          <WalletActions>
            <WalletButton onPress={() => navigation.navigate('Wallet')}>
              <FontAwesome5 name="plus" size={12} color="#FFF" style={{ marginRight: 6 }} />
              <WalletButtonText>Add Funds</WalletButtonText>
            </WalletButton>
            <WalletButton secondary onPress={() => navigation.navigate('Wallet')}>
              <WalletButtonText secondary>View History</WalletButtonText>
            </WalletButton>
          </WalletActions>
        </WalletCard>
      </ScrollView>
    </Container>
  );
};

export default DashboardScreen;

const Container = styled.View`flex: 1; background-color: #F8F9FA;`;
const WelcomeBanner = styled.View`
  background: linear-gradient(135deg, #0F8A3C 0%, #22C55E 100%);
  padding: 24px 20px; margin: 12px 16px; border-radius: 16px;
  background-color: #0F8A3C;
`;
const WelcomeTitle = styled.Text`font-size: 24px; font-weight: 800; color: #FFFFFF; margin-bottom: 4px;`;
const WelcomeText = styled.Text`font-size: 14px; color: #DCFCE7;`;
const SectionTitle = styled.Text`
  font-size: 16px; font-weight: 700; color: #111827; 
  padding: 16px 16px 12px; text-transform: uppercase; letter-spacing: 0.5px;
`;
const StatsGrid = styled.View`flex-direction: row; flex-wrap: wrap; padding: 0 12px;`;
const StatCard = styled.View`
  width: 47%; background-color: #FFFFFF; border-radius: 12px;
  padding: 16px; margin: 4px; align-items: center;
  border-width: 1px; border-color: #F3F4F6;
`;
const StatIcon = styled.View<{ bgColor: string }>`
  width: 40px; height: 40px; border-radius: 12px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center; justify-content: center; margin-bottom: 10px;
`;
const StatValue = styled.Text`font-size: 22px; font-weight: 800; color: #111827;`;
const StatLabel = styled.Text`font-size: 11px; color: #9CA3AF; margin-top: 4px;`;
const QuickActionsGrid = styled.View`flex-direction: row; flex-wrap: wrap; padding: 0 12px;`;
const QuickActionCard = styled.TouchableOpacity`
  width: 31%; background-color: #FFFFFF; border-radius: 12px;
  padding: 14px 8px; margin: 4px; align-items: center; position: relative;
  border-width: 1px; border-color: #F3F4F6;
`;
const QuickActionIcon = styled.View<{ bgColor: string }>`
  width: 44px; height: 44px; border-radius: 12px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center; justify-content: center; margin-bottom: 8px;
`;
const QuickActionBadge = styled.View`
  position: absolute; top: 8px; right: 8px;
  background-color: #EF4444; border-radius: 10px;
  min-width: 18px; height: 18px; padding: 0 5px;
  align-items: center; justify-content: center;
`;
const QuickActionBadgeText = styled.Text`font-size: 10px; font-weight: 800; color: #FFF;`;
const QuickActionLabel = styled.Text`font-size: 11px; font-weight: 600; color: #111827; text-align: center;`;
const OrdersList = styled.View`padding: 0 16px;`;
const OrderCard = styled.View`
  background-color: #FFFFFF; border-radius: 12px;
  padding: 16px; margin-bottom: 12px;
  border-width: 1px; border-color: #F3F4F6;
`;
const OrderHeader = styled.View`flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 8px;`;
const OrderID = styled.Text`font-size: 14px; font-weight: 700; color: #111827;`;
const OrderStatus = styled.View<{ status: string }>`
  background-color: ${({ status }) => status === 'in_production' ? '#FEF3C7' : '#DCFCE7'};
  padding: 4px 10px; border-radius: 6px;
`;
const OrderDetail = styled.View`margin-bottom: 12px;`;
const OrderDetailText = styled.Text`font-size: 13px; color: #6B7280; margin-bottom: 4px;`;
const OrderDate = styled.Text`font-size: 11px; color: #9CA3AF;`;
const OrderFooter = styled.View`flex-direction: row; justify-content: space-between; align-items: center;`;
const OrderPrice = styled.Text`font-size: 16px; font-weight: 700; color: #0F8A3C;`;
const TrackButton = styled.TouchableOpacity`
  background-color: #0F8A3C; padding: 8px 16px; border-radius: 8px;
`;
const TrackButtonText = styled.Text`font-size: 12px; font-weight: 700; color: #FFF;`;
const WalletCard = styled.View`
  background-color: #FFFFFF; border-radius: 12px;
  padding: 20px; margin: 16px;
  border-width: 1px; border-color: #F3F4F6;
`;
const WalletHeader = styled.View`flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 12px;`;
const WalletTitle = styled.Text`font-size: 14px; font-weight: 600; color: #6B7280;`;
const WalletBalance = styled.Text`font-size: 32px; font-weight: 800; color: #111827; margin-bottom: 16px;`;
const WalletActions = styled.View`flex-direction: row; gap: 12px;`;
const WalletButton = styled.TouchableOpacity<{ secondary?: boolean }>`
  flex: 1; flex-direction: row; align-items: center; justify-content: center;
  background-color: ${({ secondary }) => secondary ? '#F3F4F6' : '#0F8A3C'};
  padding: 12px; border-radius: 10px;
`;
const WalletButtonText = styled.Text<{ secondary?: boolean }>`
  font-size: 13px; font-weight: 700;
  color: ${({ secondary }) => secondary ? '#111827' : '#FFF'};
`;
