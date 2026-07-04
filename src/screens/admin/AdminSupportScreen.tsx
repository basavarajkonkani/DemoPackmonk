import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation: any;
}

const AdminSupportScreen: React.FC<Props> = ({ navigation }) => {
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-001',
      customerName: 'Rahul Sharma',
      email: 'rahul@company.com',
      subject: 'Issue with order delivery',
      message: 'My order ORD-1001 has not arrived yet. Expected delivery was 3 days ago.',
      status: 'open' as const,
      priority: 'high' as const,
      createdAt: '2024-01-22',
    },
    {
      id: 'TKT-002',
      customerName: 'Priya Patel',
      email: 'priya@business.com',
      subject: 'Question about bulk discounts',
      message: 'Do you offer volume discounts for orders above 10,000 units?',
      status: 'in_progress' as const,
      priority: 'medium' as const,
      createdAt: '2024-01-21',
    },
    {
      id: 'TKT-003',
      customerName: 'Amit Kumar',
      email: 'amit@foods.com',
      subject: 'Invoice not received',
      message: 'I completed payment but have not received the invoice yet.',
      status: 'resolved' as const,
      priority: 'low' as const,
      createdAt: '2024-01-20',
    },
  ]);

  const statusConfig = {
    open: { label: 'Open', color: '#EF4444', bg: '#FEE2E2' },
    in_progress: { label: 'In Progress', color: '#3B82F6', bg: '#DBEAFE' },
    resolved: { label: 'Resolved', color: '#10B981', bg: '#D1FAE5' },
    closed: { label: 'Closed', color: '#6B7280', bg: '#F3F4F6' },
  };

  const priorityConfig = {
    low: { label: 'Low', color: '#6B7280' },
    medium: { label: 'Medium', color: '#F59E0B' },
    high: { label: 'High', color: '#EF4444' },
  };

  const updateTicketStatus = (id: string, newStatus: any) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    Alert.alert('Success', 'Ticket status updated');
  };

  return (
    <Wrapper>
      <Header>
        <BackBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color="#111827" />
        </BackBtn>
        <HeaderTitle>Support Tickets</HeaderTitle>
        <PlaceholderBtn />
      </Header>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {tickets.map((ticket) => {
          const statusConf = statusConfig[ticket.status];
          const priorityConf = priorityConfig[ticket.priority];
          return (
            <TicketCard key={ticket.id}>
              <TicketHeader>
                <TicketId>{ticket.id}</TicketId>
                <BadgeRow>
                  <PriorityBadge style={{ borderColor: priorityConf.color }}>
                    <PriorityText style={{ color: priorityConf.color }}>
                      {priorityConf.label}
                    </PriorityText>
                  </PriorityBadge>
                  <StatusBadge style={{ backgroundColor: statusConf.bg }}>
                    <StatusText style={{ color: statusConf.color }}>
                      {statusConf.label}
                    </StatusText>
                  </StatusBadge>
                </BadgeRow>
              </TicketHeader>

              <CustomerRow>
                <FontAwesome5 name="user" size={12} color="#6b7280" />
                <CustomerText>{ticket.customerName}</CustomerText>
              </CustomerRow>
              <CustomerRow>
                <FontAwesome5 name="envelope" size={12} color="#6b7280" />
                <CustomerText>{ticket.email}</CustomerText>
              </CustomerRow>

              <Subject>{ticket.subject}</Subject>
              <Message numberOfLines={3}>{ticket.message}</Message>

              <DateText>Created: {ticket.createdAt}</DateText>

              <ActionRow>
                <ActionBtn
                  onPress={() =>
                    Alert.alert(
                      'Update Status',
                      `Current: ${statusConf.label}`,
                      [
                        {
                          text: 'In Progress',
                          onPress: () => updateTicketStatus(ticket.id, 'in_progress'),
                        },
                        {
                          text: 'Resolved',
                          onPress: () => updateTicketStatus(ticket.id, 'resolved'),
                        },
                        {
                          text: 'Closed',
                          onPress: () => updateTicketStatus(ticket.id, 'closed'),
                        },
                        { text: 'Cancel', style: 'cancel' },
                      ]
                    )
                  }
                >
                  <FontAwesome5 name="sync" size={14} color="#3B82F6" />
                  <ActionText style={{ color: '#3B82F6' }}>Update</ActionText>
                </ActionBtn>
                <ActionBtn
                  onPress={() => Alert.alert('Reply', 'Open email client to reply')}
                >
                  <FontAwesome5 name="reply" size={14} color="#10B981" />
                  <ActionText style={{ color: '#10B981' }}>Reply</ActionText>
                </ActionBtn>
                <ActionBtn
                  onPress={() => Alert.alert('View Details', `Full ticket: ${ticket.id}`)}
                >
                  <FontAwesome5 name="eye" size={14} color="#6B7280" />
                  <ActionText style={{ color: '#6B7280' }}>View</ActionText>
                </ActionBtn>
              </ActionRow>
            </TicketCard>
          );
        })}
      </ScrollView>
    </Wrapper>
  );
};

export default AdminSupportScreen;

const Wrapper = styled.View`
  flex: 1;
  background-color: #f9fafb;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const BackBtn = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f9fafb;
  align-items: center;
  justify-content: center;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  flex: 1;
  text-align: center;
`;

const PlaceholderBtn = styled.View`
  width: 40px;
`;

const TicketCard = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const TicketHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const TicketId = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;

const BadgeRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const PriorityBadge = styled.View`
  padding: 4px 8px;
  border-radius: 8px;
  border-width: 1px;
  margin-right: 6px;
`;

const PriorityText = styled.Text`
  font-size: 10px;
  font-weight: 700;
`;

const StatusBadge = styled.View`
  padding: 4px 10px;
  border-radius: 8px;
`;

const StatusText = styled.Text`
  font-size: 11px;
  font-weight: 600;
`;

const CustomerRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
`;

const CustomerText = styled.Text`
  font-size: 12px;
  color: #6b7280;
  margin-left: 8px;
`;

const Subject = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin-top: 8px;
  margin-bottom: 6px;
`;

const Message = styled.Text`
  font-size: 13px;
  color: #6b7280;
  line-height: 20px;
  margin-bottom: 8px;
`;

const DateText = styled.Text`
  font-size: 11px;
  color: #9ca3af;
  margin-bottom: 12px;
`;

const ActionRow = styled.View`
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: #e5e7eb;
  padding-top: 12px;
  justify-content: space-around;
`;

const ActionBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 8px 10px;
  border-radius: 8px;
  background-color: #f9fafb;
`;

const ActionText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  margin-left: 4px;
`;
