import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { useAppSelector } from '../store';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const orders = useAppSelector((state) => state.orders.items);

  const handleViewOrder = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitle>Orders Management</PageTitle>
        </PageHeader>

        <TableCard>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Order ID</TableHeader>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>₹{(order.totalAmount / 1000).toFixed(1)}K</TableCell>
                  <StatusCell status={order.status}>{order.status.replace('_', ' ')}</StatusCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <ActionCell>
                    <ActionButtonWrapper>
                      <ActionBtn onClick={() => handleViewOrder(order.id)}>
                        View
                      </ActionBtn>
                    </ActionButtonWrapper>
                  </ActionCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableCard>
      </PageContainer>
    </Layout>
  );
};

export default OrdersPage;

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  margin: 0;
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
    const colors: Record<string, string> = {
      pending_review: '#D97706',
      artwork_approved: '#0F8A3C',
      in_production: '#D97706',
      quality_check: '#7C3AED',
      shipped: '#0284C7',
      delivered: '#0F8A3C',
    };
    return colors[status] || '#6B7280';
  }};
`;

const ActionCell = styled.td`
  padding: 12px 16px;
  text-align: center;
`;

const ActionButtonWrapper = styled.div`
  display: inline-block;
`;

const ActionBtn = styled.button`
  padding: 6px 12px;
  background-color: #DBEAFE;
  color: #0F8A3C;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #BAE6FD;
  }

  &:active {
    transform: scale(0.98);
  }
`;
