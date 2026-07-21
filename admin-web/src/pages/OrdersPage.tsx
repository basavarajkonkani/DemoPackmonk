import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { useAppSelector, RootState } from '../store';

const STATUS_OPTIONS = ['all', 'pending_review', 'artwork_approved', 'in_production', 'quality_check', 'shipped', 'delivered', 'cancelled'];

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const orders = useAppSelector((state: RootState) => state.orders.items);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleViewOrder = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order: any) => {
      const matchesSearch =
        !search.trim() ||
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitle>Orders Management</PageTitle>
        </PageHeader>

        <FilterBar>
          <SearchInput
            placeholder="Search by order ID or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <StatusSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Statuses' : s.replace('_', ' ')}
              </option>
            ))}
          </StatusSelect>
        </FilterBar>

        <TableCard>
          {filteredOrders.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📋</EmptyIcon>
              <EmptyText>
                {orders.length === 0 ? 'No orders yet.' : 'No orders match your search or filter.'}
              </EmptyText>
            </EmptyState>
          ) : (
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
                {filteredOrders.map((order: any) => (
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
          )}
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

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  max-width: 360px;
  padding: 10px 14px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #0F8A3C;
    box-shadow: 0 0 0 3px rgba(15, 138, 60, 0.1);
  }
`;

const StatusSelect = styled.select`
  padding: 10px 14px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  text-transform: capitalize;

  &:focus {
    outline: none;
    border-color: #0F8A3C;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  font-size: 15px;
  color: #6B7280;
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
