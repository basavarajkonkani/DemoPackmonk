import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { mockSalesData } from '../data/mockData';

const AnalyticsPage: React.FC = () => {
  const totalSales = mockSalesData.reduce((sum, data) => sum + data.sales, 0);
  const totalOrders = mockSalesData.reduce((sum, data) => sum + data.orders, 0);
  const totalRevenue = mockSalesData.reduce((sum, data) => sum + data.revenue, 0);

  return (
    <Layout>
      <PageContainer>
        <PageTitle>Analytics & Reports</PageTitle>

        <MetricsGrid>
          <MetricCard>
            <Label>Total Sales (10 days)</Label>
            <Value>{totalSales}</Value>
          </MetricCard>
          <MetricCard>
            <Label>Total Orders (10 days)</Label>
            <Value>{totalOrders.toLocaleString()}</Value>
          </MetricCard>
          <MetricCard>
            <Label>Total Revenue (10 days)</Label>
            <Value>₹{(totalRevenue / 100000).toFixed(2)}L</Value>
          </MetricCard>
        </MetricsGrid>

        <ChartCard>
          <ChartTitle>Sales Trend (Last 10 Days)</ChartTitle>
          <ChartContainer>
            {mockSalesData.map((data, idx) => (
              <ChartColumn key={idx}>
                <Bar height={(data.revenue / 405000) * 100}>
                  <BarLabel>{data.sales}</BarLabel>
                </Bar>
                <BarDate>{data.date.split('-')[2]}</BarDate>
              </ChartColumn>
            ))}
          </ChartContainer>
        </ChartCard>

        <DataTable>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Date</TableHeader>
                <TableHeader>Sales</TableHeader>
                <TableHeader>Orders</TableHeader>
                <TableHeader>Revenue</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockSalesData.map((data) => (
                <TableRow key={data.date}>
                  <TableCell>{data.date}</TableCell>
                  <TableCell>{data.sales}</TableCell>
                  <TableCell>₹{(data.orders / 1000).toFixed(1)}K</TableCell>
                  <TableCell>₹{(data.revenue / 100000).toFixed(2)}L</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTable>
      </PageContainer>
    </Layout>
  );
};

export default AnalyticsPage;

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 32px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const MetricCard = styled.div`
  background: linear-gradient(135deg, #DCFCE7 0%, #E0F2FE 100%);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #D1E7DD;
`;

const Label = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #6B7280;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const Value = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: #0F8A3C;
`;

const ChartCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const ChartTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px;
`;

const ChartContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 250px;
  gap: 12px;
`;

const ChartColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

const Bar = styled.div<{ height: number }>`
  width: 100%;
  height: ${({ height }) => height}%;
  background: linear-gradient(180deg, #0F8A3C 0%, #0D7A35 100%);
  border-radius: 4px 4px 0 0;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const BarLabel = styled.span`
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 700;
  position: absolute;
  top: -20px;
`;

const BarDate = styled.div`
  font-size: 12px;
  color: #6B7280;
  font-weight: 600;
`;

const DataTable = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #F9FAFB;
  border-bottom: 2px solid #E5E7EB;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #E5E7EB;

  &:hover {
    background-color: #F9FAFB;
  }

  &:last-child {
    border-bottom: none;
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
