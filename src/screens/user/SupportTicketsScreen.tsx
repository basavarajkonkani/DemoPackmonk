import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, Modal, Linking } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchTickets, createTicketThunk, selectTickets } from '../../store/supportSlice';
import { WHATSAPP_NUMBER, SUPPORT_EMAIL } from '../../constants';

interface Props {
  navigation: any;
}

const SupportTicketsScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const tickets = useAppSelector(selectTickets);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [viewingTicket, setViewingTicket] = useState<(typeof tickets)[number] | null>(null);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const statusConfig = {
    open: { label: 'Open', color: '#EF4444', bg: '#FEE2E2', icon: 'exclamation-circle' },
    in_progress: { label: 'In Progress', color: '#3B82F6', bg: '#DBEAFE', icon: 'sync' },
    resolved: { label: 'Resolved', color: '#10B981', bg: '#D1FAE5', icon: 'check-circle' },
    closed: { label: 'Closed', color: '#6B7280', bg: '#F3F4F6', icon: 'times-circle' },
  };

  const handleCreateTicket = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in both subject and message');
      return;
    }
    dispatch(createTicketThunk({ subject: subject.trim(), message: message.trim() }));
    setSubject('');
    setMessage('');
    setShowNewTicket(false);
    Alert.alert('Ticket Submitted', "We've received your request and will respond within 24 hours.");
  };

  const handleCall = () => {
    Linking.openURL('tel:+911234567890').catch(() => Alert.alert('Call Support', '+91 12345 67890'));
  };

  const handleWhatsApp = () => {
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`).catch(() =>
      Alert.alert('WhatsApp', `Contact us on WhatsApp: ${WHATSAPP_NUMBER}`)
    );
  };

  const handleFAQ = () => {
    Alert.alert(
      'Frequently Asked Questions',
      '• How long does production take? 5-7 business days.\n• Can I cancel an order? Yes, before it enters production.\n• What is the MOQ? 100 units for most products.\n• How do I track my order? Visit Orders in your account.'
    );
  };

  return (
    <Wrapper>
      <Header>
        <BackBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color="#111827" />
        </BackBtn>
        <HeaderTitle>Support Tickets</HeaderTitle>
        <AddBtn onPress={() => setShowNewTicket(true)}>
          <FontAwesome5 name="plus" size={18} color="#ffffff" />
        </AddBtn>
      </Header>

      <QuickHelp>
        <HelpTitle>Need Help?</HelpTitle>
        <HelpRow>
          <HelpBtn onPress={handleWhatsApp}>
            <FontAwesome5 name="comments" size={20} color="#10B981" />
            <HelpLabel>Live Chat</HelpLabel>
          </HelpBtn>
          <HelpBtn onPress={handleCall}>
            <FontAwesome5 name="phone" size={20} color="#3B82F6" />
            <HelpLabel>Call Support</HelpLabel>
          </HelpBtn>
          <HelpBtn onPress={handleFAQ}>
            <FontAwesome5 name="question-circle" size={20} color="#F59E0B" />
            <HelpLabel>FAQs</HelpLabel>
          </HelpBtn>
        </HelpRow>
      </QuickHelp>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {tickets.map((ticket) => {
          const config = statusConfig[ticket.status];
          return (
            <TicketCard key={ticket.id} onPress={() => setViewingTicket(ticket)} activeOpacity={0.8}>
              <TicketHeader>
                <TicketId>{ticket.id}</TicketId>
                <StatusBadge style={{ backgroundColor: config.bg }}>
                  <FontAwesome5 name={config.icon} size={10} color={config.color} style={{ marginRight: 4 }} />
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

        <CreateTicketCard onPress={() => setShowNewTicket(true)}>
          <FontAwesome5 name="headset" size={32} color="#0f8a3c" />
          <CreateTitle>Create New Ticket</CreateTitle>
          <CreateSubtext>Our support team will respond within 24 hours</CreateSubtext>
        </CreateTicketCard>
      </ScrollView>

      <Modal visible={showNewTicket} transparent animationType="slide">
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>New Support Ticket</ModalTitle>
              <CloseBtn onPress={() => setShowNewTicket(false)}>
                <FontAwesome5 name="times" size={18} color="#111827" />
              </CloseBtn>
            </ModalHeader>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <FormLabel>Subject *</FormLabel>
              <FormInput value={subject} onChangeText={setSubject} placeholder="Briefly describe your issue" />
              <FormLabel>Message *</FormLabel>
              <FormInput
                value={message}
                onChangeText={setMessage}
                placeholder="Provide details about your issue..."
                multiline
                numberOfLines={5}
                style={{ height: 120, textAlignVertical: 'top' }}
              />
            </ScrollView>
            <ModalFooter>
              <CancelBtn onPress={() => setShowNewTicket(false)}>
                <CancelBtnText>Cancel</CancelBtnText>
              </CancelBtn>
              <SaveBtn onPress={handleCreateTicket}>
                <SaveBtnText>Submit Ticket</SaveBtnText>
              </SaveBtn>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      <Modal visible={!!viewingTicket} transparent animationType="fade">
        <ModalOverlay onPress={() => setViewingTicket(null)}>
          <ModalContent style={{ maxHeight: undefined, borderRadius: 20, margin: 24 }}>
            <ModalHeader>
              <ModalTitle>{viewingTicket?.id}</ModalTitle>
              <CloseBtn onPress={() => setViewingTicket(null)}>
                <FontAwesome5 name="times" size={18} color="#111827" />
              </CloseBtn>
            </ModalHeader>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <Subject>{viewingTicket?.subject}</Subject>
              <Message>{viewingTicket?.message}</Message>
            </ScrollView>
          </ModalContent>
        </ModalOverlay>
      </Modal>
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

const ModalOverlay = styled.TouchableOpacity`
  flex: 1; background-color: rgba(0,0,0,0.5); justify-content: flex-end;
`;
const ModalContent = styled.View`
  background-color: #FFFFFF; border-top-left-radius: 20px; border-top-right-radius: 20px;
  max-height: 85%;
`;
const ModalHeader = styled.View`
  flex-direction: row; justify-content: space-between; align-items: center;
  padding: 16px; border-bottom-width: 1px; border-bottom-color: #F3F4F6;
`;
const ModalTitle = styled.Text`font-size: 16px; font-weight: 700; color: #111827;`;
const CloseBtn = styled.TouchableOpacity`padding: 4px;`;
const FormLabel = styled.Text`font-size: 12px; font-weight: 600; color: #6B7280; margin-bottom: 6px; margin-top: 14px;`;
const FormInput = styled.TextInput`
  border-width: 1px; border-color: #E5E7EB; border-radius: 10px;
  padding: 12px; font-size: 14px; color: #111827; background-color: #F9FAFB;
`;
const ModalFooter = styled.View`
  flex-direction: row; gap: 12px; padding: 16px; border-top-width: 1px; border-top-color: #F3F4F6;
`;
const CancelBtn = styled.TouchableOpacity`
  flex: 1; padding: 14px; border-radius: 10px; background-color: #F3F4F6; align-items: center;
`;
const CancelBtnText = styled.Text`font-size: 14px; font-weight: 700; color: #6B7280;`;
const SaveBtn = styled.TouchableOpacity`
  flex: 1; padding: 14px; border-radius: 10px; background-color: #0F8A3C; align-items: center;
`;
const SaveBtnText = styled.Text`font-size: 14px; font-weight: 700; color: #FFFFFF;`;
