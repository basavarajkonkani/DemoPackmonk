import React, { useState } from 'react';
import { ScrollView, Alert, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  customer: string;
  email: string;
  subject: string;
  description: string;
  category: 'product' | 'order' | 'technical' | 'complaint' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  createdAt: string;
  lastUpdated: string;
  assignee?: string;
}

const AdminSupportScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: '1',
      ticketNumber: 'SUP-2024-001',
      customer: 'Rahul Sharma',
      email: 'rahul@abctraders.com',
      subject: 'Delivery delay on order ORD-1001',
      description: 'Order was supposed to arrive 3 days ago. Please provide update.',
      category: 'order',
      priority: 'high',
      status: 'in_progress',
      createdAt: '2024-01-18',
      lastUpdated: '2024-01-20',
      assignee: 'Support Team A',
    },
    {
      id: '2',
      ticketNumber: 'SUP-2024-002',
      customer: 'Priya Patel',
      email: 'priya@patelentp.com',
      subject: 'Quality issue with gold pouch',
      description: 'Gold coating is peeling off from some pouches.',
      category: 'product',
      priority: 'urgent',
      status: 'open',
      createdAt: '2024-01-20',
      lastUpdated: '2024-01-20',
    },
    {
      id: '3',
      ticketNumber: 'SUP-2024-003',
      customer: 'Amit Kumar',
      email: 'amit@kumarfoods.com',
      subject: 'Can we get bulk customization?',
      description: 'Need to customize 5000 units with our branding.',
      category: 'technical',
      priority: 'medium',
      status: 'waiting_customer',
      createdAt: '2024-01-15',
      lastUpdated: '2024-01-19',
      assignee: 'Support Team B',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<'all' | SupportTicket['status']>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | SupportTicket['priority']>('all');

  const statusConfig = {
    open: { label: 'Open', color: '#3B82F6', bg: '#DBEAFE' },
    in_progress: { label: 'In Progress', color: '#F59E0B', bg: '#FEF3C7' },
    waiting_customer: { label: 'Waiting', color: '#8B5CF6', bg: '#EDE9FE' },
    resolved: { label: 'Resolved', color: '#10B981', bg: '#D1FAE5' },
    closed: { label: 'Closed', color: '#6B7280', bg: '#F3F4F6' },
  };

  const priorityConfig = {
    low: { label: 'Low', color: '#3B82F6', bg: '#DBEAFE' },
    medium: { label: 'Medium', color: '#F59E0B', bg: '#FEF3C7' },
    high: { label: 'High', color: '#EC4899', bg: '#FCE7F3' },
    urgent: { label: 'Urgent', color: '#EF4444', bg: '#FEE2E2' },
  };

  const categoryConfig: Record<SupportTicket['category'], { label: string; icon: string }> = {
    product: { label: 'Product', icon: 'box' },
    order: { label: 'Order', icon: 'clipboard-list' },
    technical: { label: 'Technical', icon: 'cog' },
    complaint: { label: 'Complaint', icon: 'exclamation-circle' },
    other: { label: 'Other', icon: 'question-circle' },
  };

  const filteredTickets = tickets.filter((ticket) => {
    const statusMatch = filterStatus === 'all' || ticket.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || ticket.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const handleUpdateStatus = (ticket: SupportTicket) => {
    const statuses: SupportTicket['status'][] = ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'];
    Alert.alert('Update Status', `Current: ${statusConfig[ticket.status].label}`, [
      ...statuses.map((status) => ({
        text: statusConfig[status].label,
        onPress: () => {
          setTickets(
            tickets.map((t) => (t.id === ticket.id ? { ...t, status } : t))
          );
        },
      })),
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleAssignTicket = (ticket: SupportTicket) => {
    Alert.alert('Assign Ticket', 'Assign to support team member', [
      {
        text: 'Assign to Support A',
        onPress: () => {
          setTickets(
            tickets.map((t) => (t.id === ticket.id ? { ...t, assignee: 'Support Team A' } : t))
          );
        },
      },
      {
        text: 'Assign to Support B',
        onPress: () => {
          setTickets(
            tickets.map((t) => (t.id === ticket.id ? { ...t, assignee: 'Support Team B' } : t))
          );
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in_progress').length,
    urgent: tickets.filter((t) => t.priority === 'urgent').length,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#1F2937" />
        </BackButton>
        <HeaderTitle>Support Tickets</HeaderTitle>
        <RefreshButton onPress={() => Alert.alert('Refreshed', 'Latest tickets loaded')}>
          <FontAwesome5 name="sync" size={18} color="#0F8A3C" />
        </RefreshButton>
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <StatsRow>
          <StatCard>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total</StatLabel>
          </StatCard>
          <StatCard style={{ backgroundColor: '#DBEAFE', borderColor: '#3B82F6' }}>
            <StatValue style={{ color: '#3B82F6' }}>{stats.open}</StatValue>
            <StatLabel>Open</StatLabel>
          </StatCard>
          <StatCard style={{ backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }}>
            <StatValue style={{ color: '#F59E0B' }}>{stats.inProgress}</StatValue>
            <StatLabel>In Progress</StatLabel>
          </StatCard>
          <StatCard style={{ backgroundColor: '#FEE2E2', borderColor: '#EF4444' }}>
            <StatValue style={{ color: '#EF4444' }}>{stats.urgent}</StatValue>
            <StatLabel>Urgent</StatLabel>
          </StatCard>
        </StatsRow>

        {/* Filters */}
        <FilterSection>
          <FilterLabel>Filter by Status:</FilterLabel>
          <FilterRow>
            {(['all', 'open', 'in_progress', 'waiting_customer', 'resolved', 'closed'] as const).map((status) => (
              <FilterChip
                key={status}
                active={filterStatus === status}
                onPress={() => setFilterStatus(status)}
              >
                <FilterChipText active={filterStatus === status}>
                  {status === 'all' ? 'All' : statusConfig[status]?.label || status}
                </FilterChipText>
              </FilterChip>
            ))}
          </FilterRow>
        </FilterSection>

        <FilterSection>
          <FilterLabel>Filter by Priority:</FilterLabel>
          <FilterRow>
            {(['all', 'low', 'medium', 'high', 'urgent'] as const).map((priority) => (
              <FilterChip
                key={priority}
                active={filterPriority === priority}
                onPress={() => setFilterPriority(priority)}
              >
                <FilterChipText active={filterPriority === priority}>
                  {priority === 'all' ? 'All' : priorityConfig[priority]?.label}
                </FilterChipText>
              </FilterChip>
            ))}
          </FilterRow>
        </FilterSection>

        {/* Tickets */}
        <TicketsContainer>
          {filteredTickets.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <FontAwesome5 name="inbox" size={36} color="#D1D5DB" />
              </EmptyIcon>
              <EmptyText>No tickets found</EmptyText>
            </EmptyState>
          ) : (
            filteredTickets.map((ticket) => {
              const statusInfo = statusConfig[ticket.status];
              const priorityInfo = priorityConfig[ticket.priority];
              const categoryInfo = categoryConfig[ticket.category];

              return (
                <TicketCard key={ticket.id}>
                  <TicketHeader>
                    <TicketNumber>{ticket.ticketNumber}</TicketNumber>
                    <PriorityBadge style={{ backgroundColor: priorityInfo.bg }}>
                      <PriorityText style={{ color: priorityInfo.color }}>
                        {priorityInfo.label}
                      </PriorityText>
                    </PriorityBadge>
                  </TicketHeader>

                  <Subject>{ticket.subject}</Subject>

                  <CustomerInfo>
                    <CustomerName>{ticket.customer}</CustomerName>
                    <CustomerEmail>{ticket.email}</CustomerEmail>
                  </CustomerInfo>

                  <DescriptionBox>
                    <DescriptionText>{ticket.description}</DescriptionText>
                  </DescriptionBox>

                  <MetaRow>
                    <MetaItem>
                      <MetaLabel>Category:</MetaLabel>
                      <MetaValue>{categoryInfo.label}</MetaValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaLabel>Status:</MetaLabel>
                      <StatusBadge style={{ backgroundColor: statusInfo.bg }}>
                        <StatusText style={{ color: statusInfo.color }}>
                          {statusInfo.label}
                        </StatusText>
                      </StatusBadge>
                    </MetaItem>
                  </MetaRow>

                  {ticket.assignee && (
                    <AssigneeBox>
                      <AssigneeIcon>
                        <FontAwesome5 name="user-tie" size={12} color="#0F8A3C" />
                      </AssigneeIcon>
                      <AssigneeText>Assigned to: {ticket.assignee}</AssigneeText>
                    </AssigneeBox>
                  )}

                  <TimestampRow>
                    <TimestampText>Created: {ticket.createdAt}</TimestampText>
                    <TimestampText>Updated: {ticket.lastUpdated}</TimestampText>
                  </TimestampRow>

                  <Actions>
                    <ActionBtn onPress={() => handleUpdateStatus(ticket)}>
                      <FontAwesome5 name="sync" size={14} color="#0F8A3C" />
                      <ActionText>Update</ActionText>
                    </ActionBtn>
                    <ActionBtn onPress={() => handleAssignTicket(ticket)}>
                      <FontAwesome5 name="user-plus" size={14} color="#3B82F6" />
                      <ActionText style={{ color: '#3B82F6' }}>Assign</ActionText>
                    </ActionBtn>
                    <ActionBtn onPress={() => Alert.alert('View', 'View full ticket details')}>
                      <FontAwesome5 name="eye" size={14} color="#6B7280" />
                      <ActionText style={{ color: '#6B7280' }}>View</ActionText>
                    </ActionBtn>
                  </Actions>
                </TicketCard>
              );
            })
          )}
        </TicketsContainer>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminSupportScreen;

const Header = styled.View`
  flex-direction: row; align-items: center; justify-content: space-between;
  padding: 16px 20px; background-color: #FFFFFF;
  border-bottom-width: 1px; border-bottom-color: #E5E7EB;
`;
const BackButton = styled.TouchableOpacity`width: 40px; height: 40px; align-items: center; justify-content: center;`;
const HeaderTitle = styled.Text`font-size: 18px; font-weight: 700; color: #1F2937;`;
const RefreshButton = styled.TouchableOpacity`
  width: 40px; height: 40px; border-radius: 12px;
  background-color: #DCFCE7; align-items: center; justify-content: center;
`;

const StatsRow = styled.View`
  flex-direction: row; padding: 0 8px; margin-bottom: 16px;
`;
const StatCard = styled.View`
  flex: 1; background-color: #FFFFFF; border-radius: 10px;
  padding: 12px 8px; margin: 8px 4px; border-width: 1px; border-color: #E5E7EB; align-items: center;
`;
const StatValue = styled.Text`font-size: 20px; font-weight: 800; color: #111827;`;
const StatLabel = styled.Text`font-size: 10px; color: #9CA3AF; margin-top: 2px;`;

const FilterSection = styled.View`padding: 12px 16px;`;
const FilterLabel = styled.Text`font-size: 12px; font-weight: 700; color: #6B7280; margin-bottom: 8px;`;
const FilterRow = styled.View`
  flex-direction: row; flex-wrap: wrap; gap: 8px;
`;
const FilterChip = styled.TouchableOpacity<{ active: boolean }>`
  padding: 6px 12px; border-radius: 12px;
  background-color: ${({ active }) => active ? '#0F8A3C' : '#FFFFFF'};
  border-width: 1px;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
`;
const FilterChipText = styled.Text<{ active: boolean }>`
  font-size: 12px; font-weight: 600;
  color: ${({ active }) => active ? '#FFFFFF' : '#6B7280'};
`;

const TicketsContainer = styled.View`padding: 0 16px 20px;`;

const EmptyState = styled.View`
  align-items: center; justify-content: center; padding: 60px 20px;
`;
const EmptyIcon = styled.View`margin-bottom: 16px;`;
const EmptyText = styled.Text`font-size: 16px; color: #9CA3AF;`;

const TicketCard = styled.View`
  background-color: #FFFFFF; border-radius: 12px; padding: 16px;
  margin-bottom: 12px; border-width: 1px; border-color: #E5E7EB;
`;
const TicketHeader = styled.View`
  flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 8px;
`;
const TicketNumber = styled.Text`font-size: 14px; font-weight: 700; color: #111827;`;
const PriorityBadge = styled.View`padding: 4px 10px; border-radius: 8px;`;
const PriorityText = styled.Text`font-size: 11px; font-weight: 700;`;

const Subject = styled.Text`font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 8px;`;

const CustomerInfo = styled.View`margin-bottom: 8px;`;
const CustomerName = styled.Text`font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 2px;`;
const CustomerEmail = styled.Text`font-size: 12px; color: #9CA3AF;`;

const DescriptionBox = styled.View`
  background-color: #F9FAFB; border-radius: 8px; padding: 10px; margin-bottom: 10px;
`;
const DescriptionText = styled.Text`font-size: 12px; color: #6B7280; line-height: 18px;`;

const MetaRow = styled.View`
  flex-direction: row; justify-content: space-between; margin-bottom: 10px;
`;
const MetaItem = styled.View`flex: 1; margin-right: 8px;`;
const MetaLabel = styled.Text`font-size: 11px; color: #9CA3AF; margin-bottom: 2px;`;
const MetaValue = styled.Text`font-size: 12px; font-weight: 600; color: #111827;`;
const StatusBadge = styled.View`padding: 4px 8px; border-radius: 6px;`;
const StatusText = styled.Text`font-size: 11px; font-weight: 700;`;

const AssigneeBox = styled.View`
  flex-direction: row; align-items: center;
  background-color: #DCFCE7; border-radius: 6px; padding: 8px; margin-bottom: 10px;
`;
const AssigneeIcon = styled.View`margin-right: 8px;`;
const AssigneeText = styled.Text`font-size: 12px; color: #0F8A3C; font-weight: 600;`;

const TimestampRow = styled.View`
  flex-direction: row; justify-content: space-between; margin-bottom: 10px;
`;
const TimestampText = styled.Text`font-size: 10px; color: #9CA3AF;`;

const Actions = styled.View`
  flex-direction: row; gap: 8px;
`;
const ActionBtn = styled.TouchableOpacity`
  flex: 1; flex-direction: row; align-items: center; justify-content: center;
  background-color: #F9FAFB; border-radius: 8px; padding: 8px;
`;
const ActionText = styled.Text`font-size: 11px; font-weight: 600; color: #0F8A3C; margin-left: 4px;`;
