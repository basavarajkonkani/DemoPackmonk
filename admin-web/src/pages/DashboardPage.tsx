import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { mockDashboardMetrics, mockOrders, mockSalesData } from '../data/mockData';

const DashboardPage: React.FC = () => {
  return (
    <Layout>
      <DashboardContainer>
        <PageHeader>
          <PageTitle>Dashboard</PageTitle>
          <PageSubtitle>Welcome back! Here's an overview of your business.</PageSubtitle>
        </PageHeader>

        {/* Metrics Grid */}
        <MetricsGrid>
          <MetricCard color="#0F8A3C">
            <MetricIcon>📦</MetricIcon>
            <MetricContent>
              <MetricLabel>Total Orders</MetricLabel>
              <MetricValue>{mockDashboardMetrics.totalOrders.toLocaleString()}</MetricValue>
              <MetricChange positive={mockDashboardMetrics.orderGrowth > 0}>
                ↑ {mockDashboardMetrics.orderGrowth}% vs last month
              </MetricChange>
            </MetricContent>
          </MetricCard>

          <MetricCard color="#3B82F6">
            <MetricIcon>💰</MetricIcon>
            <MetricContent>
              <MetricLabel>Total Revenue</MetricLabel>
              <MetricValue>₹{(mockDashboardMetrics.totalRevenue / 100000).toFixed(1)}L</MetricValue>
              <MetricChange positive={mockDashboardMetrics.revenueGrowth > 0}>
                ↑ {mockDashboardMetrics.revenueGrowth}% vs last month
              </MetricChange>
            </MetricContent>
          </MetricCard>

          <MetricCard color="#10B981">
            <MetricIcon>👥</MetricIcon>
            <MetricContent>
              <MetricLabel>Active Customers</MetricLabel>
              <MetricValue>{mockDashboardMetrics.activeCustomers.toLocaleString()}</MetricValue>
              <MetricChange positive={mockDashboardMetrics.customerGrowth > 0}>
                ↑ {mockDashboardMetrics.customerGrowth}% vs last month
              </MetricChange>
            </MetricContent>
          </MetricCard>

          <MetricCard color="#F59E0B">
            <MetricIcon>⚠️</MetricIcon>
            <MetricContent>
              <MetricLabel>Low Stock Items</MetricLabel>
              <MetricValue>{mockDashboardMetrics.lowStockProducts}</MetricValue>
              <MetricAction to="/inventory">Manage Inventory →</MetricAction>
            </MetricContent>
          </MetricCard>
        </MetricsGrid>

        {/* Quick Stats Row */}
        <QuickStatsGrid>
          <QuickStatCard bgColor="#FEF3C7" borderColor="#FCD34D">
            <QuickStatLabel>Pending Orders</QuickStatLabel>
            <QuickStatValue>{mockDashboardMetrics.pendingOrders}</QuickStatValue>
          </QuickStatCard>

          <QuickStatCard bgColor="#FEE2E2" borderColor="#FECACA">
            <QuickStatLabel>Support Tickets</QuickStatLabel>
            <QuickStatValue>{mockDashboardMetrics.supportTickets}</QuickStatValue>
          </QuickStatCard>
        </QuickStatsGrid>

        {/* Recent Orders */}
        <SectionCard>
          <SectionHeader>
            <SectionTitle>Recent Orders</SectionTitle>
            <SectionLink to="/orders">View All →</SectionLink>
          </SectionHeader>

          <OrderTable>
            <OrderTableHead>
              <TableRow>
                <TableHeader>Order ID</TableHeader>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Date</TableHeader>
              </TableRow>
            </OrderTableHead>
            <OrderTableBody>
              {mockOrders.slice(0, 5).map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>₹{(order.totalAmount / 1000).toFixed(1)}K</TableCell>
                  <StatusCell status={order.status}>{order.status.replace('_', ' ')}</StatusCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </OrderTableBody>
          </OrderTable>
        </SectionCard>

        {/* Sales Chart Placeholder */}
        <SectionCard>
          <SectionHeader>
            <SectionTitle>Sales Trend (Last 10 Days)</SectionTitle>
          </SectionHeader>
          <ChartPlaceholder>
            <ChartPlaceholderText>📈 Chart visualization coming soon</ChartPlaceholderText>
            <ChartData>
              {mockSalesData.map((data, idx) => (
                <ChartBar key={idx} height={(data.revenue / 405000) * 100}>
                  <BarTooltip>{data.date}</BarTooltip>
                </ChartBar>
              ))}
            </ChartData>
          </ChartPlaceholder>
        </SectionCard>
      </DashboardContainer>
    </Layout>
  );
};

export default DashboardPage;

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 8px;
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: #6B7280;
  margin: 0;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const MetricCard = styled.div<{ color: string }>`
  background: linear-gradient(135deg, ${({ color }) => color}1a 0%, ${({ color }) => color}0a 100%);
  border: 2px solid ${({ color }) => color}33;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: all 150ms ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const MetricIcon = styled.div`
  font-size: 32px;
  line-height: 1;
`;

const MetricContent = styled.div`
  flex: 1;
`;

const MetricLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const MetricValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 4px;
`;

const MetricChange = styled.div<{ positive: boolean }>`
  font-size: 12px;
  color: ${({ positive }) => (positive ? '#10B981' : '#EF4444')};
  font-weight: 600;
`;

const MetricAction = styled(Link)`
  font-size: 12px;
  color: #0F8A3C;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const QuickStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const QuickStatCard = styled.div<{ bgColor: string; borderColor: string }>`
  background-color: ${({ bgColor }) => bgColor};
  border: 2px solid ${({ borderColor }) => borderColor};
  border-radius: 12px;
  padding: 16px;
  text-align: center;
`;

const QuickStatLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
  margin-bottom: 8px;
`;

const QuickStatValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: #111827;
`;

const SectionCard = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #E5E7EB;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #E5E7EB;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const SectionLink = styled(Link)`
  font-size: 14px;
  color: #0F8A3C;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const OrderTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const OrderTableHead = styled.thead`
  background-color: #F9FAFB;
`;

const OrderTableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #E5E7EB;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #F9FAFB;
  }
`;

const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: #6B7280;
  text-transform: uppercase;
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: #111827;
`;

const StatusCell = styled(TableCell)<{ status: string }>`
  font-weight: 600;
  color: ${({ status }) => {
    const statusColors: Record<string, string> = {
      pending_review: '#D97706',
      artwork_approved: '#0F8A3C',
      in_production: '#D97706',
      quality_check: '#7C3AED',
      shipped: '#0284C7',
      delivered: '#0F8A3C',
    };
    return statusColors[status] || '#6B7280';
  }};
`;

const ChartPlaceholder = styled.div`
  background-color: #F9FAFB;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ChartPlaceholderText = styled.div`
  font-size: 16px;
  color: #6B7280;
  margin-bottom: 24px;
`;

const ChartData = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  width: 100%;
  height: 200px;
  gap: 8px;
`;

const ChartBar = styled.div<{ height: number }>`
  flex: 1;
  height: ${({ height }) => height}%;
  background: linear-gradient(180deg, #0F8A3C 0%, #0D7A35 100%);
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 20px;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    opacity: 0.8;
  }
`;

const BarTooltip = styled.div`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: #6B7280;
  white-space: nowrap;
`;
