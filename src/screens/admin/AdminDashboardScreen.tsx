import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchOrders, selectOrdersList } from '../../store/ordersSlice';
import { fetchCatalog, selectCatalogItems } from '../../store/catalogSlice';
import { fetchCustomers, selectCustomers } from '../../store/customersSlice';
import { fetchTickets, selectTickets } from '../../store/supportSlice';

interface Props {
  navigation: any;
}

const AdminDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('month');

  const orders = useAppSelector(selectOrdersList);
  const products = useAppSelector(selectCatalogItems);
  const customers = useAppSelector(selectCustomers);
  const tickets = useAppSelector(selectTickets);

  const loadAll = () => {
    dispatch(fetchOrders());
    dispatch(fetchCatalog());
    dispatch(fetchCustomers());
    dispatch(fetchTickets());
  };

  useEffect(() => {
    loadAll();
  }, [dispatch]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAll();
    setTimeout(() => setRefreshing(false), 800);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending_review').length;
  const lowStockCount = products.filter((p) => p.stock < p.lowStockThreshold).length;
  const openTickets = tickets.filter((t) => t.status === 'open').length;

  const stats = [
    { label: 'Total Orders', value: orders.length.toLocaleString(), icon: 'shopping-bag', color: '#10B981', bg: '#D1FAE5' },
    { label: 'Revenue', value: `₹${(totalRevenue / 1000).toFixed(1)}k`, icon: 'rupee-sign', color: '#3B82F6', bg: '#DBEAFE' },
    { label: 'Customers', value: customers.length.toLocaleString(), icon: 'users', color: '#F59E0B', bg: '#FEF3C7' },
    { label: 'Low Stock', value: lowStockCount.toString(), icon: 'exclamation-triangle', color: '#EF4444', bg: '#FEE2E2' },
    { label: 'Pending Orders', value: pendingOrders.toString(), icon: 'clock', color: '#8B5CF6', bg: '#EDE9FE' },
    { label: 'Open Tickets', value: openTickets.toString(), icon: 'headset', color: '#EC4899', bg: '#FCE7F3' },
  ];

  const quickActions = [
    { label: 'Manage Products', screen: 'AdminProducts', icon: 'box', color: '#8B5CF6', description: 'Add, edit products' },
    { label: 'User Management', screen: 'AdminUsers', icon: 'users-cog', color: '#EC4899', description: 'Manage user accounts' },
    { label: 'View Orders', screen: 'AdminOrders', icon: 'clipboard-list', color: '#10B981', description: 'Track all orders' },
    { label: 'Artwork Review', screen: 'AdminArtwork', icon: 'image', color: '#F59E0B', description: 'Review submissions' },
    { label: 'Promotions', screen: 'AdminPromotions', icon: 'tags', color: '#EF4444', description: 'Manage coupons' },
    { label: 'Support Tickets', screen: 'AdminSupport', icon: 'headset', color: '#3B82F6', description: 'Customer support' },
    { label: 'Inventory', screen: 'AdminInventory', icon: 'warehouse', color: '#0F8A3C', description: 'Stock management' },
    { label: 'Price Management', screen: 'AdminPricing', icon: 'dollar-sign', color: '#F59E0B', description: 'Set pricing' },
    { label: 'Analytics', screen: 'AdminAnalytics', icon: 'chart-line', color: '#3B82F6', description: 'View reports' },
    { label: 'Customers', screen: 'AdminCustomers', icon: 'user-check', color: '#10B981', description: 'Customer management' },
    { label: 'Banners', screen: 'AdminBanners', icon: 'images', color: '#EC4899', description: 'Manage banners' },
    { label: 'Settings', screen: 'AdminSettings', icon: 'cog', color: '#6B7280', description: 'System settings' },
  ];

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const statusColors: Record<string, { color: string; bg: string; label: string }> = {
    pending_review: { color: '#F59E0B', bg: '#FEF3C7', label: 'Pending Review' },
    artwork_approved: { color: '#0F8A3C', bg: '#DCFCE7', label: 'Artwork Approved' },
    in_production: { color: '#3B82F6', bg: '#DBEAFE', label: 'In Production' },
    quality_check: { color: '#8B5CF6', bg: '#EDE9FE', label: 'Quality Check' },
    shipped: { color: '#0284C7', bg: '#E0F2FE', label: 'Shipped' },
    delivered: { color: '#10B981', bg: '#D1FAE5', label: 'Delivered' },
    cancelled: { color: '#EF4444', bg: '#FEE2E2', label: 'Cancelled' },
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0F8A3C']} />
        }
      >
        <Header>
          <HeaderTop>
            <HeaderLeft>
              <HeaderTitle>Admin Dashboard</HeaderTitle>
              <HeaderSubtitle>Welcome back, Admin!</HeaderSubtitle>
            </HeaderLeft>
            <NotificationButton onPress={() => navigation.navigate('Notifications')}>
              <FontAwesome5 name="bell" size={20} color="#111827" />
              <NotificationBadge>
                <NotificationBadgeText>5</NotificationBadgeText>
              </NotificationBadge>
            </NotificationButton>
          </HeaderTop>
        </Header>

        <PeriodSelector>
          {(['today', 'week', 'month'] as const).map((period) => (
            <PeriodButton
              key={period}
              active={selectedPeriod === period}
              onPress={() => setSelectedPeriod(period)}
            >
              <PeriodButtonText active={selectedPeriod === period}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </PeriodButtonText>
            </PeriodButton>
          ))}
        </PeriodSelector>

        <Section>
          <SectionTitle>Key Metrics</SectionTitle>
          <StatsGrid>
            {stats.map((stat, idx) => (
              <StatCard key={idx}>
                <StatIconWrap style={{ backgroundColor: stat.bg }}>
                  <FontAwesome5 name={stat.icon} size={20} color={stat.color} />
                </StatIconWrap>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>
        </Section>

        <Section>
          <SectionTitleRow>
            <SectionTitle>Recent Orders</SectionTitle>
            <ViewAllButton onPress={() => navigation.navigate('AdminOrders')}>
              <ViewAllText>View All</ViewAllText>
              <FontAwesome5 name="arrow-right" size={12} color="#0F8A3C" />
            </ViewAllButton>
          </SectionTitleRow>
          {recentOrders.length === 0 ? (
            <EmptyText>No orders yet</EmptyText>
          ) : (
            recentOrders.map((order) => {
              const cfg = statusColors[order.status];
              return (
                <OrderCard key={order.id}>
                  <OrderLeft>
                    <OrderId>{order.id}</OrderId>
                    <OrderCustomer>{order.customerName}</OrderCustomer>
                    <OrderTime>{new Date(order.date).toLocaleDateString()}</OrderTime>
                  </OrderLeft>
                  <OrderRight>
                    <OrderAmount>₹{order.total.toLocaleString()}</OrderAmount>
                    <OrderStatusBadge style={{ backgroundColor: cfg.bg }}>
                      <OrderStatusText style={{ color: cfg.color }}>{cfg.label}</OrderStatusText>
                    </OrderStatusBadge>
                  </OrderRight>
                </OrderCard>
              );
            })
          )}
        </Section>

        <Section>
          <SectionTitle>Quick Actions</SectionTitle>
          <ActionsGrid>
            {quickActions.map((action, idx) => (
              <ActionCard
                key={idx}
                onPress={() => navigation.navigate(action.screen)}
                activeOpacity={0.8}
              >
                <ActionIconWrap style={{ backgroundColor: action.color + '15' }}>
                  <FontAwesome5 name={action.icon} size={22} color={action.color} />
                </ActionIconWrap>
                <ActionLabel>{action.label}</ActionLabel>
                <ActionDescription>{action.description}</ActionDescription>
              </ActionCard>
            ))}
          </ActionsGrid>
        </Section>

        <Section>
          <SectionTitleRow>
            <SectionTitle>Open Support Tickets</SectionTitle>
            <ViewAllButton onPress={() => navigation.navigate('AdminSupport')}>
              <ViewAllText>View All</ViewAllText>
              <FontAwesome5 name="arrow-right" size={12} color="#0F8A3C" />
            </ViewAllButton>
          </SectionTitleRow>
          <ActivityList>
            {tickets.filter((t) => t.status === 'open').length === 0 ? (
              <EmptyText>No open tickets</EmptyText>
            ) : (
              tickets
                .filter((t) => t.status === 'open')
                .slice(0, 5)
                .map((ticket) => (
                  <ActivityItem key={ticket.id}>
                    <ActivityIconWrap style={{ backgroundColor: '#FEF3C715' }}>
                      <FontAwesome5 name="headset" size={14} color="#D97706" />
                    </ActivityIconWrap>
                    <ActivityContent>
                      <ActivityText>{ticket.subject}</ActivityText>
                      <ActivityTime>{ticket.id} · {ticket.createdAt}</ActivityTime>
                    </ActivityContent>
                  </ActivityItem>
                ))
            )}
          </ActivityList>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboardScreen;

const Header = styled.View`
  padding: 24px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const HeaderTop = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.View`
  flex: 1;
`;

const HeaderTitle = styled.Text`
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 4px;
`;

const HeaderSubtitle = styled.Text`
  font-size: 14px;
  color: #6b7280;
`;

const NotificationButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #f9fafb;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const NotificationBadge = styled.View`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background-color: #ef4444;
  align-items: center;
  justify-content: center;
`;

const NotificationBadgeText = styled.Text`
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
`;

const PeriodSelector = styled.View`
  flex-direction: row;
  background-color: #ffffff;
  padding: 4px;
  margin: 16px 20px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const PeriodButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  background-color: ${(props) => (props.active ? '#0f8a3c' : 'transparent')};
`;

const PeriodButtonText = styled.Text<{ active: boolean }>`
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  color: ${(props) => (props.active ? '#ffffff' : '#6b7280')};
`;

const Section = styled.View`
  padding: 20px;
`;

const SectionTitleRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
`;

const ViewAllButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const ViewAllText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #0f8a3c;
  margin-right: 6px;
`;

const StatsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin: -6px;
`;

const StatCard = styled.View`
  width: 48%;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
  margin: 6px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const StatIconWrap = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

const StatValue = styled.Text`
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 4px;
`;

const StatLabel = styled.Text`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
`;

const StatChange = styled.View<{ up: boolean }>`
  flex-direction: row;
  align-items: center;
`;

const StatChangeText = styled.Text<{ up: boolean }>`
  font-size: 11px;
  font-weight: 700;
  color: ${(props) => (props.up ? '#10B981' : '#EF4444')};
`;

const OrderCard = styled.View`
  flex-direction: row;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const OrderLeft = styled.View`
  flex: 1;
`;

const OrderId = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
`;

const OrderCustomer = styled.Text`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const OrderTime = styled.Text`
  font-size: 11px;
  color: #9ca3af;
`;

const OrderRight = styled.View`
  align-items: flex-end;
`;

const OrderAmount = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
`;

const OrderStatusBadge = styled.View`
  padding: 4px 10px;
  border-radius: 8px;
`;

const OrderStatusText = styled.Text`
  font-size: 11px;
  font-weight: 700;
`;

const ActionsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin: -6px;
`;

const ActionCard = styled.TouchableOpacity`
  width: 48%;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
  margin: 6px;
  border-width: 1px;
  border-color: #e5e7eb;
  align-items: center;
`;

const ActionIconWrap = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

const ActionLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  text-align: center;
  margin-bottom: 4px;
`;

const ActionDescription = styled.Text`
  font-size: 11px;
  color: #9ca3af;
  text-align: center;
`;

const ActivityList = styled.View``;

const ActivityItem = styled.View`
  flex-direction: row;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const ActivityIconWrap = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const ActivityContent = styled.View`
  flex: 1;
`;

const ActivityText = styled.Text`
  font-size: 13px;
  color: #111827;
  margin-bottom: 4px;
  font-weight: 500;
`;

const ActivityTime = styled.Text`
  font-size: 11px;
  color: #9ca3af;
`;

const EmptyText = styled.Text`
  font-size: 13px;
  color: #9ca3af;
  text-align: center;
  padding: 24px 0;
`;
