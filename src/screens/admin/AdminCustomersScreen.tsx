import React, { useState } from 'react';
import { ScrollView, TextInput, Alert } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateCustomerCredit } from '../../store/adminSlice';

const AdminCustomersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const customers = useAppSelector((state) => state.admin.customers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.creditStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApproveCredit = (customer: any) => {
    Alert.prompt(
      'Approve Credit',
      `Set credit limit for ${customer.name}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: (limit?: string) => {
            if (limit && !isNaN(parseFloat(limit))) {
              dispatch(
                updateCustomerCredit({
                  id: customer.id,
                  creditLimit: parseFloat(limit),
                  creditStatus: 'approved',
                })
              );
              Alert.alert('Success', `Credit limit of ₹${limit} approved`);
            }
          },
        },
      ],
      'plain-text',
      '50000',
      'numeric'
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#1F2937" />
        </BackButton>
        <HeaderTitle>Customer Management</HeaderTitle>
        <ExportButton onPress={() => Alert.alert('Export', 'Export customer list')}>
          <FontAwesome5 name="download" size={16} color="#0F8A3C" />
        </ExportButton>
      </Header>

      <SearchContainer>
        <FontAwesome5 name="search" size={16} color="#9CA3AF" style={{ marginRight: 12 }} />
        <SearchInput
          placeholder="Search customers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </SearchContainer>

      <FilterContainer>
        {(['all', 'approved', 'pending'] as const).map((status) => (
          <FilterButton
            key={status}
            active={filterStatus === status}
            onPress={() => setFilterStatus(status)}
          >
            <FilterButtonText active={filterStatus === status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </FilterButtonText>
          </FilterButton>
        ))}
      </FilterContainer>

      <ScrollView showsVerticalScrollIndicator={false}>
        <StatsRow>
          <StatCard>
            <StatValue>{customers.length}</StatValue>
            <StatLabel>Total Customers</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{customers.filter(c => c.creditStatus === 'approved').length}</StatValue>
            <StatLabel>Credit Approved</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>${(customers.reduce((sum, c) => sum + c.lifetimeValue, 0) / 1000).toFixed(0)}k</StatValue>
            <StatLabel>Total Revenue</StatLabel>
          </StatCard>
        </StatsRow>

        <CustomersList>
          {filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id}>
              <CustomerHeader>
                <CustomerAvatar>
                  <CustomerAvatarText>
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </CustomerAvatarText>
                </CustomerAvatar>
                <CustomerInfo>
                  <CustomerName>{customer.name}</CustomerName>
                  <CustomerBusiness>{customer.businessName}</CustomerBusiness>
                </CustomerInfo>
                <CreditBadge status={customer.creditStatus}>
                  <CreditBadgeText status={customer.creditStatus}>
                    {customer.creditStatus.toUpperCase()}
                  </CreditBadgeText>
                </CreditBadge>
              </CustomerHeader>

              <CustomerDetails>
                <DetailRow>
                  <DetailIcon>
                    <FontAwesome5 name="envelope" size={11} color="#9CA3AF" />
                  </DetailIcon>
                  <DetailText>{customer.email}</DetailText>
                </DetailRow>
                <DetailRow>
                  <DetailIcon>
                    <FontAwesome5 name="phone" size={11} color="#9CA3AF" />
                  </DetailIcon>
                  <DetailText>{customer.phone}</DetailText>
                </DetailRow>
                {customer.gst && (
                  <DetailRow>
                    <DetailIcon>
                      <FontAwesome5 name="id-badge" size={11} color="#9CA3AF" />
                    </DetailIcon>
                    <DetailText>GST: {customer.gst}</DetailText>
                  </DetailRow>
                )}
              </CustomerDetails>

              <StatsGrid>
                <StatItem>
                  <StatItemLabel>Orders</StatItemLabel>
                  <StatItemValue>{customer.totalOrders}</StatItemValue>
                </StatItem>
                <StatItem>
                  <StatItemLabel>Lifetime Value</StatItemLabel>
                  <StatItemValue>${(customer.lifetimeValue / 1000).toFixed(1)}k</StatItemValue>
                </StatItem>
                {customer.creditStatus === 'approved' && (
                  <>
                    <StatItem>
                      <StatItemLabel>Credit Limit</StatItemLabel>
                      <StatItemValue>${(customer.creditLimit / 1000).toFixed(0)}k</StatItemValue>
                    </StatItem>
                    <StatItem>
                      <StatItemLabel>Credit Used</StatItemLabel>
                      <StatItemValue>${(customer.creditUsed / 1000).toFixed(1)}k</StatItemValue>
                    </StatItem>
                  </>
                )}
              </StatsGrid>

              {customer.creditStatus === 'approved' && (
                <CreditProgress>
                  <CreditProgressLabel>Credit Utilization</CreditProgressLabel>
                  <ProgressBar>
                    <ProgressFill 
                      percentage={(customer.creditUsed / customer.creditLimit) * 100}
                      color="#0F8A3C"
                    />
                  </ProgressBar>
                  <CreditProgressValue>
                    {((customer.creditUsed / customer.creditLimit) * 100).toFixed(1)}% used
                  </CreditProgressValue>
                </CreditProgress>
              )}

              <CustomerActions>
                {customer.creditStatus === 'pending' && (
                  <ActionButton primary onPress={() => handleApproveCredit(customer)}>
                    <FontAwesome5 name="check" size={12} color="#FFF" style={{ marginRight: 6 }} />
                    <ActionButtonText primary>Approve Credit</ActionButtonText>
                  </ActionButton>
                )}
                <ActionButton onPress={() => navigation.navigate('AdminOrders', { customerId: customer.id })}>
                  <FontAwesome5 name="clipboard-list" size={12} color="#0F8A3C" style={{ marginRight: 6 }} />
                  <ActionButtonText>View Orders</ActionButtonText>
                </ActionButton>
                <ActionButton onPress={() => Alert.alert('Edit', `Edit ${customer.name}`)}>
                  <FontAwesome5 name="edit" size={12} color="#6B7280" />
                </ActionButton>
              </CustomerActions>
            </CustomerCard>
          ))}
        </CustomersList>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminCustomersScreen;

const Header = styled.View`
  flex-direction: row; align-items: center; justify-content: space-between;
  padding: 16px 20px; background-color: #FFFFFF;
  border-bottom-width: 1px; border-bottom-color: #E5E7EB;
`;
const BackButton = styled.TouchableOpacity`width: 40px; height: 40px; align-items: center; justify-content: center;`;
const HeaderTitle = styled.Text`font-size: 18px; font-weight: 700; color: #1F2937;`;
const ExportButton = styled.TouchableOpacity`
  width: 40px; height: 40px; border-radius: 12px;
  background-color: #DCFCE7; align-items: center; justify-content: center;
`;

const SearchContainer = styled.View`
  flex-direction: row; align-items: center; background-color: #FFFFFF;
  margin: 16px; padding: 12px 16px; border-radius: 12px;
  border-width: 1px; border-color: #E5E7EB;
`;
const SearchInput = styled.TextInput`flex: 1; font-size: 14px; color: #111827;`;

const FilterContainer = styled.View`
  flex-direction: row; padding: 0 16px 16px; gap: 8px;
`;
const FilterButton = styled.TouchableOpacity<{ active: boolean }>`
  padding: 8px 16px; border-radius: 20px;
  background-color: ${({ active }) => active ? '#0F8A3C' : '#FFFFFF'};
  border-width: 1px; border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
`;
const FilterButtonText = styled.Text<{ active: boolean }>`
  font-size: 13px; font-weight: 600;
  color: ${({ active }) => active ? '#FFFFFF' : '#6B7280'};
`;

const StatsRow = styled.View`flex-direction: row; padding: 0 12px; margin-bottom: 16px;`;
const StatCard = styled.View`
  flex: 1; background-color: #FFFFFF; border-radius: 12px;
  padding: 14px; margin: 0 4px; align-items: center;
  border-width: 1px; border-color: #F3F4F6;
`;
const StatValue = styled.Text`font-size: 22px; font-weight: 800; color: #111827; margin-bottom: 4px;`;
const StatLabel = styled.Text`font-size: 11px; color: #9CA3AF; text-align: center;`;

const CustomersList = styled.View`padding: 0 16px 24px;`;
const CustomerCard = styled.View`
  background-color: #FFFFFF; border-radius: 16px; padding: 16px;
  margin-bottom: 16px; border-width: 1px; border-color: #F3F4F6;
`;

const CustomerHeader = styled.View`
  flex-direction: row; align-items: center; margin-bottom: 16px;
`;
const CustomerAvatar = styled.View`
  width: 48px; height: 48px; border-radius: 24px;
  background-color: #0F8A3C; align-items: center; justify-content: center;
  margin-right: 12px;
`;
const CustomerAvatarText = styled.Text`
  font-size: 16px; font-weight: 800; color: #FFFFFF;
`;
const CustomerInfo = styled.View`flex: 1;`;
const CustomerName = styled.Text`
  font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 4px;
`;
const CustomerBusiness = styled.Text`font-size: 12px; color: #6B7280;`;

const CreditBadge = styled.View<{ status: string }>`
  padding: 4px 10px; border-radius: 8px;
  background-color: ${({ status }) => status === 'approved' ? '#DCFCE7' : '#FEF3C7'};
`;
const CreditBadgeText = styled.Text<{ status: string }>`
  font-size: 10px; font-weight: 800;
  color: ${({ status }) => status === 'approved' ? '#0F8A3C' : '#D97706'};
`;

const CustomerDetails = styled.View`margin-bottom: 16px;`;
const DetailRow = styled.View`
  flex-direction: row; align-items: center; margin-bottom: 8px;
`;
const DetailIcon = styled.View`width: 20px;`;
const DetailText = styled.Text`font-size: 12px; color: #6B7280;`;

const StatsGrid = styled.View`
  flex-direction: row; flex-wrap: wrap; margin-bottom: 16px;
`;
const StatItem = styled.View`width: 50%; margin-bottom: 12px;`;
const StatItemLabel = styled.Text`font-size: 11px; color: #9CA3AF; margin-bottom: 4px;`;
const StatItemValue = styled.Text`font-size: 15px; font-weight: 700; color: #111827;`;

const CreditProgress = styled.View`margin-bottom: 16px;`;
const CreditProgressLabel = styled.Text`
  font-size: 11px; color: #6B7280; margin-bottom: 6px;
`;
const ProgressBar = styled.View`
  height: 6px; background-color: #F3F4F6; border-radius: 3px;
  overflow: hidden; margin-bottom: 4px;
`;
const ProgressFill = styled.View<{ percentage: number; color: string }>`
  width: ${({ percentage }) => percentage}%;
  height: 100%; background-color: ${({ color }) => color};
`;
const CreditProgressValue = styled.Text`font-size: 10px; color: #9CA3AF;`;

const CustomerActions = styled.View`
  flex-direction: row; gap: 8px; padding-top: 16px;
  border-top-width: 1px; border-top-color: #F3F4F6;
`;
const ActionButton = styled.TouchableOpacity<{ primary?: boolean }>`
  flex: ${({ primary }) => primary ? 2 : 1};
  flex-direction: row; align-items: center; justify-content: center;
  padding: 10px; border-radius: 8px;
  background-color: ${({ primary }) => primary ? '#0F8A3C' : '#F3F4F6'};
`;
const ActionButtonText = styled.Text<{ primary?: boolean }>`
  font-size: 12px; font-weight: 700;
  color: ${({ primary }) => primary ? '#FFFFFF' : '#0F8A3C'};
`;
