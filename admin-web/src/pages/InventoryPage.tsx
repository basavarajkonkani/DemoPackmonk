import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { useAppSelector, RootState } from '../store';

const InventoryPage: React.FC = () => {
  const inventory = useAppSelector((state: RootState) => state.inventory.items);

  return (
    <Layout>
      <PageContainer>
        <PageTitle>Inventory Management</PageTitle>
        <TableCard>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Product</TableHeader>
                <TableHeader>Quantity</TableHeader>
                <TableHeader>Reorder Level</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Location</TableHeader>
                <TableHeader>Last Restock</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.reorderLevel}</TableCell>
                  <StatusCell status={item.status}>{item.status.replace('_', ' ')}</StatusCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{new Date(item.lastRestockDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableCard>
      </PageContainer>
    </Layout>
  );
};

export default InventoryPage;

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 24px;
`;

const TableCard = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
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

const StatusCell = styled(TableCell)<{ status: string }>`
  font-weight: 600;
  color: ${({ status }) => {
    if (status === 'in_stock') return '#0F8A3C';
    if (status === 'low_stock') return '#D97706';
    return '#EF4444';
  }};
`;
