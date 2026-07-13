import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

const AdminAnalyticsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  const topProducts = [
    { rank: 1, name: 'Kraft Standup Pouch', sold: 4500, revenue: 67500 },
    { rank: 2, name: 'Silver Metalized Pouch', sold: 3200, revenue: 57600 },
    { rank: 3, name: 'Clear Window Pouch', sold: 2800, revenue: 42000 },
  ];

  const lowSellingProducts = [
    { rank: 1, name: 'Milky White Pouch', sold: 120, revenue: 2400 },
    { rank: 2, name: 'Custom Printed Box', sold: 85, revenue: 3400 },
  ];

  const topCustomers = [
    { rank: 1, name: 'ABC Traders', orders: 45, lifetime: 125000 },
    { rank: 2, name: 'XYZ Foods Ltd', orders: 38, lifetime: 98000 },
    { rank: 3, name: 'Modern Spices', orders: 32, lifetime: 75000 },
  ];

  const citiesData = [
    { city: 'Mumbai', orders: 250, revenue: 375000 },
    { city: 'Delhi', orders: 220, revenue: 330000 },
    { city: 'Bangalore', orders: 180, revenue: 270000 },
    { city: 'Chennai', orders: 150, revenue: 225000 },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#1F2937" />
        </BackButton>
        <HeaderTitle>Analytics</HeaderTitle>
        <ExportButton onPress={() => {}}>
          <FontAwesome5 name="download" size={16} color="#0F8A3C" />
        </ExportButton>
      </Header>

      <PeriodSelector>
        {(['today', 'week', 'month', 'year'] as const).map((p) => (
          <PeriodButton key={p} active={period === p} onPress={() => setPeriod(p)}>
            <PeriodButtonText active={period === p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </PeriodButtonText>
          </PeriodButton>
        ))}
      </PeriodSelector>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Key Metrics */}
        <MetricsGrid>
          <MetricCard>
            <MetricIcon bgColor="#DCFCE7">
              <FontAwesome5 name="dollar-sign" size={18} color="#0F8A3C" />
            </MetricIcon>
            <MetricValue>₹145,250</MetricValue>
            <MetricLabel>Revenue</MetricLabel>
            <MetricChange positive>+12.5%</MetricChange>
          </MetricCard>

          <MetricCard>
            <MetricIcon bgColor="#DBEAFE">
              <FontAwesome5 name="shopping-cart" size={18} color="#3B82F6" />
            </MetricIcon>
            <MetricValue>842</MetricValue>
            <MetricLabel>Orders</MetricLabel>
            <MetricChange positive>+8.2%</MetricChange>
          </MetricCard>

          <MetricCard>
            <MetricIcon bgColor="#FEF3C7">
              <FontAwesome5 name="receipt" size={18} color="#D97706" />
            </MetricIcon>
            <MetricValue>₹172</MetricValue>
            <MetricLabel>Avg Order</MetricLabel>
            <MetricChange>+3.1%</MetricChange>
          </MetricCard>

          <MetricCard>
            <MetricIcon bgColor="#FCE7F3">
              <FontAwesome5 name="sync" size={18} color="#EC4899" />
            </MetricIcon>
            <MetricValue>68%</MetricValue>
            <MetricLabel>Repeat Rate</MetricLabel>
            <MetricChange positive>+5.4%</MetricChange>
          </MetricCard>
        </MetricsGrid>

        {/* Top Products */}
        <SectionTitle>Most Sold Products</SectionTitle>
        <DataCard>
          {topProducts.map((product) => (
            <DataRow key={product.rank}>
              <RankBadge>
                <RankText>#{product.rank}</RankText>
              </RankBadge>
              <DataInfo>
                <DataName>{product.name}</DataName>
                <DataMeta>
                  {product.sold} units • ₹{(product.revenue / 1000).toFixed(1)}k revenue
                </DataMeta>
              </DataInfo>
              <TrendIcon>
                <FontAwesome5 name="arrow-up" size={14} color="#0F8A3C" />
              </TrendIcon>
            </DataRow>
          ))}
        </DataCard>

        {/* Low Selling Products */}
        <SectionTitle>Low Selling Products</SectionTitle>
        <DataCard>
          {lowSellingProducts.map((product) => (
            <DataRow key={product.rank}>
              <RankBadge warn>
                <RankText warn>#{product.rank}</RankText>
              </RankBadge>
              <DataInfo>
                <DataName>{product.name}</DataName>
                <DataMeta>
                  {product.sold} units • ₹{(product.revenue / 1000).toFixed(1)}k revenue
                </DataMeta>
              </DataInfo>
              <TrendIcon>
                <FontAwesome5 name="arrow-down" size={14} color="#EF4444" />
              </TrendIcon>
            </DataRow>
          ))}
        </DataCard>

        {/* Top Customers */}
        <SectionTitle>Top Customers</SectionTitle>
        <DataCard>
          {topCustomers.map((customer) => (
            <DataRow key={customer.rank}>
              <RankBadge>
                <RankText>#{customer.rank}</RankText>
              </RankBadge>
              <DataInfo>
                <DataName>{customer.name}</DataName>
                <DataMeta>
                  {customer.orders} orders • ₹{(customer.lifetime / 1000).toFixed(0)}k lifetime
                </DataMeta>
              </DataInfo>
              <CustomerValue>₹{(customer.lifetime / 1000).toFixed(0)}k</CustomerValue>
            </DataRow>
          ))}
        </DataCard>

        {/* Cities Analysis */}
        <SectionTitle>Orders by City</SectionTitle>
        <DataCard>
          {citiesData.map((city, idx) => (
            <CityRow key={city.city}>
              <CityInfo>
                <CityIcon>
                  <FontAwesome5 name="map-marker-alt" size={14} color="#6B7280" />
                </CityIcon>
                <CityName>{city.city}</CityName>
              </CityInfo>
              <CityStats>
                <CityOrders>{city.orders} orders</CityOrders>
                <CityRevenue>₹{(city.revenue / 1000).toFixed(0)}k</CityRevenue>
              </CityStats>
            </CityRow>
          ))}
        </DataCard>

        {/* Additional Metrics */}
        <SectionTitle>Conversion Metrics</SectionTitle>
        <ConversionCard>
          <ConversionRow>
            <ConversionLabel>Conversion Rate</ConversionLabel>
            <ConversionValue>3.2%</ConversionValue>
          </ConversionRow>
          <ProgressBar>
            <ProgressFill width={32} color="#0F8A3C" />
          </ProgressBar>
        </ConversionCard>

        <ConversionCard>
          <ConversionRow>
            <ConversionLabel>Cart Abandonment</ConversionLabel>
            <ConversionValue>42.5%</ConversionValue>
          </ConversionRow>
          <ProgressBar>
            <ProgressFill width={42.5} color="#F59E0B" />
          </ProgressBar>
        </ConversionCard>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminAnalyticsScreen;

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

const PeriodSelector = styled.View`
  flex-direction: row; background-color: #FFFFFF;
  padding: 4px; margin: 16px; border-radius: 12px;
  border-width: 1px; border-color: #E5E7EB;
`;
const PeriodButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1; padding: 10px; border-radius: 8px;
  background-color: ${({ active }) => active ? '#0F8A3C' : 'transparent'};
`;
const PeriodButtonText = styled.Text<{ active: boolean }>`
  font-size: 13px; font-weight: 700; text-align: center;
  color: ${({ active }) => active ? '#FFFFFF' : '#6B7280'};
`;

const MetricsGrid = styled.View`
  flex-direction: row; flex-wrap: wrap; padding: 0 12px;
`;
const MetricCard = styled.View`
  width: 48%; background-color: #FFFFFF; border-radius: 12px;
  padding: 16px; margin: 4px; border-width: 1px; border-color: #F3F4F6;
`;
const MetricIcon = styled.View<{ bgColor: string }>`
  width: 40px; height: 40px; border-radius: 12px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center; justify-content: center; margin-bottom: 12px;
`;
const MetricValue = styled.Text`font-size: 22px; font-weight: 800; color: #111827; margin-bottom: 4px;`;
const MetricLabel = styled.Text`font-size: 11px; color: #9CA3AF; margin-bottom: 8px;`;
const MetricChange = styled.Text<{ positive?: boolean }>`
  font-size: 11px; font-weight: 700;
  color: ${({ positive }) => positive ? '#0F8A3C' : '#6B7280'};
`;

const SectionTitle = styled.Text`
  font-size: 16px; font-weight: 700; color: #111827;
  padding: 16px 16px 12px; text-transform: uppercase; letter-spacing: 0.5px;
`;

const DataCard = styled.View`
  background-color: #FFFFFF; border-radius: 16px; padding: 12px;
  margin: 0 16px 16px; border-width: 1px; border-color: #F3F4F6;
`;
const DataRow = styled.View`
  flex-direction: row; align-items: center; padding: 12px;
  border-bottom-width: 1px; border-bottom-color: #F9FAFB;
`;
const RankBadge = styled.View<{ warn?: boolean }>`
  width: 32px; height: 32px; border-radius: 10px; margin-right: 12px;
  background-color: ${({ warn }) => warn ? '#FEE2E2' : '#DCFCE7'};
  align-items: center; justify-content: center;
`;
const RankText = styled.Text<{ warn?: boolean }>`
  font-size: 13px; font-weight: 800;
  color: ${({ warn }) => warn ? '#EF4444' : '#0F8A3C'};
`;
const DataInfo = styled.View`flex: 1;`;
const DataName = styled.Text`font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 4px;`;
const DataMeta = styled.Text`font-size: 11px; color: #9CA3AF;`;
const TrendIcon = styled.View``;
const CustomerValue = styled.Text`font-size: 14px; font-weight: 700; color: #0F8A3C;`;

const CityRow = styled.View`
  flex-direction: row; justify-content: space-between; align-items: center;
  padding: 12px; border-bottom-width: 1px; border-bottom-color: #F9FAFB;
`;
const CityInfo = styled.View`flex-direction: row; align-items: center;`;
const CityIcon = styled.View`
  width: 32px; height: 32px; border-radius: 10px;
  background-color: #F3F4F6; align-items: center; justify-content: center; margin-right: 12px;
`;
const CityName = styled.Text`font-size: 14px; font-weight: 600; color: #111827;`;
const CityStats = styled.View`align-items: flex-end;`;
const CityOrders = styled.Text`font-size: 12px; color: #6B7280; margin-bottom: 2px;`;
const CityRevenue = styled.Text`font-size: 14px; font-weight: 700; color: #0F8A3C;`;

const ConversionCard = styled.View`
  background-color: #FFFFFF; border-radius: 16px; padding: 16px;
  margin: 0 16px 12px; border-width: 1px; border-color: #F3F4F6;
`;
const ConversionRow = styled.View`
  flex-direction: row; justify-content: space-between; margin-bottom: 8px;
`;
const ConversionLabel = styled.Text`font-size: 13px; color: #6B7280;`;
const ConversionValue = styled.Text`font-size: 15px; font-weight: 700; color: #111827;`;
const ProgressBar = styled.View`
  height: 8px; background-color: #F3F4F6; border-radius: 4px; overflow: hidden;
`;
const ProgressFill = styled.View<{ width: number; color: string }>`
  width: ${({ width }) => width}%; height: 100%;
  background-color: ${({ color }) => color};
`;
