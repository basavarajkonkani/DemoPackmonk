import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation: any;
}

const SupportTicketsScreen: React.FC<Props> = ({ navigation }) => {
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-001',
      subject: 'Issue with order delivery',
      message: 'My order ORD-1001 has not arrived yet. Expected delivery was 3 days ago.',
      status: 'open' as const,
      createdAt: '2024-01-22',
      updatedAt: '2024-01-22',
    },
    {
      id: 'TKT-002',
      subject: 'Question about artwork approval',
      message: 'How long does it take for artwork to be reviewed and approved?',
      status: 'in_progress' as const,
      createdAt: '2024-01-20',
      updatedAt: '2024-01-21',
    },
    {
      id: 'TKT-003',
      subject: 'Invoice not received',
      message: 'I completed payment but have not received the invoice yet.',
      status: 'resolved' as const,
      createdAt: '2024-01-18',
      updatedAt: '2024-01-19',
    },
  ]);

  const statusConfig = {
    open: { label: 'Open', color: '#EF4444', bg: '#FEE2E2', icon: 'exclamation-circle' },
    in_progress: { label: 'In Progress', color: '#3B82F6', bg: '#DBEAFE', icon: 'sync' },
    resolved: { label: 'Resolved', color: '#10B981', bg: '#D1FAE5', icon: 'check-circle' },
    closed: { label: 'Closed', color: '#6B7280', bg: '#F3F4F6', icon: 'times-circle' },
  };

  return (
    <Wrapper>
      <Header>
        <BackBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color="#111827" />
        </BackBtn>
        <HeaderTitle>Support Tickets</HeaderTitle>
        <AddBtn onPress={() => Alert.alert('New Ticket', 'Feature coming soon')}>
          <FontAwesome5 name="plus" size={18} color="#ffffff" />
        </AddBtn>
      </Header>

      <QuickHelp>
        <HelpTitle>Need Help?</HelpTitle>
        <HelpRow>
          <HelpBtn onPress={() => Alert.alert('Chat', 'Live chat coming soon')}>
            <FontAwesome5 name="comments" size={20} color="#10B981" />
            <HelpLabel>Live Chat</HelpLabel>
          </HelpBtn>
          <HelpBtn onPress={() => Alert.alert('Call', 'tel:+911234567890')}>
            <FontAwesome5 name="phone" size={20} color="#3B82F6" />
            <HelpLabel>Call Support</HelpLabel>
          </HelpBtn>
          <HelpBtn onPress={() => Alert.alert('FAQ', 'FAQ section coming soon')}>
            <FontAwesome5 name="question-circle" size={20} color="#F59E0B" />
            <HelpLabel>FAQs</HelpLabel>
          </HelpBtn>
        </HelpRow>
      </QuickHelp>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {tickets.map((ticket) => {
          const config = statusConfig[ticket.status];
          return (
            <TicketCard
              key={ticket.id}
              onPress={() => Alert.alert('Ticket Details', `View full ticket: ${ticket.id}`)}
              activeOpacity={0.8}
            >
              <TicketHeader>
                <TicketId>{ticket.id}</TicketId>
                <StatusBadge style={{ backgroundColor: config.bg }}>
                  <FontAwesome5
                    name={config.icon}
                    size={10}
                    color={config.color}
                    style={{ marginRight: 4 }}
                  />
                  <StatusText style={{ color: config.color }}>{config.label}</StatusText>
                </StatusBadge>
              </TicketHeader>

              <Subject>{ticket.subject}</Subject>
              <Message numberOfLines={2}>{ticket.message}</Message>

              <DateRow>
                <DateText>Created: {ticket.createdAt}</DateText>
                <DateText>Updated: {ticket.updatedAt}</DateText>
              </DateRow>
            </TicketCard>
          );
        })}

        <CreateTicketCard
          onPress={() => Alert.alert('New Ticket', 'Feature coming soon')}
        >
          <FontAwesome5 name="headset" size={32} color="#0f8a3c" />
          <CreateTitle>Create New Ticket</CreateTitle>
          <CreateSubtext>Our support team will respond within 24 hours</CreateSubtext>
        </CreateTicketCard>
      </ScrollView>
    </Wrapper>
  );
};

export default SupportTicketsScreen;

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

const AddBtn = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #0f8a3c;
  align-items: center;
  justify-content: center;
`;

const QuickHelp = styled.View`
  background-color: #ffffff;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const HelpTitle = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
`;

const HelpRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

const HelpBtn = styled.TouchableOpacity`
  align-items: center;
  padding: 12px;
`;

const HelpLabel = styled.Text`
  font-size: 12px;
  color: #6b7280;
  margin-top: 6px;
  font-weight: 600;
`;

const TicketCard = styled.TouchableOpacity`
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
  margin-bottom: 10px;
`;

const TicketId = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
`;

const StatusBadge = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 4px 10px;
  border-radius: 10px;
`;

const StatusText = styled.Text`
  font-size: 11px;
  font-weight: 600;
`;

const Subject = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
`;

const Message = styled.Text`
  font-size: 13px;
  color: #6b7280;
  line-height: 20px;
  margin-bottom: 10px;
`;

const DateRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  border-top-width: 1px;
  border-top-color: #f3f4f6;
  padding-top: 8px;
`;

const DateText = styled.Text`
  font-size: 11px;
  color: #9ca3af;
`;

const CreateTicketCard = styled.TouchableOpacity`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 32px;
  border-width: 2px;
  border-color: #0f8a3c;
  border-style: dashed;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
`;

const CreateTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #0f8a3c;
  margin-top: 12px;
`;

const CreateSubtext = styled.Text`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
  text-align: center;
`;
