import React from 'react';
import { ScrollView, View } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation: any;
}

const AdminDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const stats = [
    { label: 'Total Orders', value: '2,847', icon: 'shopping-bag', color: '#10B981', bg: '#D1FAE5' },
    { label: 'Revenue', value: '₹45.2L', icon: 'rupee-sign', color: '#3B82F6', bg: '#DBEAFE' },
    { label: 'Active Users', value: '1,234', icon: 'users', color: '#F59E0B', bg: '#FEF3C7' },
    { label: 'Low Stock', value: '12', icon: 'exclamation-triangle', color: '#EF4444', bg: '#FEE2E2' },
  ];

  const quickActions = [
    { label: 'Manage Products', screen: 'AdminProducts', icon: 'box', color: '#8B5CF6' },
    { label: 'User Management', screen: 'AdminUsers', icon: 'users-cog', color: '#EC4899' },
    { label: 'Orders', screen: 'AdminOrders', icon: 'clipboard-list', color: '#10B981' },
    { label: 'Artwork Review', screen: 'AdminArtwork', icon: 'image', color: '#F59E0B' },
    { label: 'Promotions', screen: 'AdminPromotions', icon: 'tags', color: '#EF4444' },
    { label: 'Support Tickets', screen: 'AdminSupport', icon: 'headset', color: '#3B82F6' },
  ];

  return (
    <Wrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <HeaderTitle>Admin Dashboard</HeaderTitle>
          <HeaderSubtitle>Manage your packaging platform</HeaderSubtitle>
        </Header>

        <Section>
          <SectionTitle>Overview</SectionTitle>
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
              </ActionCard>
            ))}
          </ActionsGrid>
        </Section>
      </ScrollView>
    </Wrapper>
  );
};

export default AdminDashboardScreen;

const Wrapper = styled.View`
  flex: 1;
  background-color: #f9fafb;
`;

const Header = styled.View`
  padding: 24px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
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

const Section = styled.View`
  padding: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
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
`;
