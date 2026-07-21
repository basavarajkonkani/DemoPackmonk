import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, Modal } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchTeam,
  inviteTeamMemberThunk,
  updateTeamMemberThunk,
  removeTeamMemberThunk,
  selectTeam,
} from '../../store/teamSlice';
import type { TeamMember } from '../../store/teamSlice';

interface Props {
  navigation: any;
}

const EMPTY_FORM = { name: '', email: '', phone: '', role: 'Member' };

const ManageTeamScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const team = useAppSelector(selectTeam);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    dispatch(fetchTeam());
  }, [dispatch]);

  const removeMember = (id: string) => {
    const member = team.find((m) => m.id === id);
    if (member?.isOwner) {
      Alert.alert('Error', 'Cannot remove account owner');
      return;
    }
    Alert.alert('Remove Member', `Remove ${member?.name} from team?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => dispatch(removeTeamMemberThunk(id)),
      },
    ]);
  };

  const openAdd = () => {
    setEditingMember(null);
    setForm(EMPTY_FORM);
    setShowAddModal(true);
  };

  const openEditRole = (member: TeamMember) => {
    setEditingMember(member);
    setForm({ name: member.name, email: member.email, phone: member.phone, role: member.role });
    setShowAddModal(true);
  };

  const saveMember = () => {
    if (!form.name.trim() || !form.email.trim()) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }
    if (editingMember) {
      dispatch(
        updateTeamMemberThunk({
          ...editingMember,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          role: form.role.trim() || 'Member',
        })
      );
    } else {
      dispatch(
        inviteTeamMemberThunk({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          role: form.role.trim() || 'Member',
        })
      );
    }
    setShowAddModal(false);
    setForm(EMPTY_FORM);
  };

  return (
    <Wrapper>
      <Header>
        <BackBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color="#111827" />
        </BackBtn>
        <HeaderTitle>Team Members</HeaderTitle>
        <AddBtn onPress={openAdd}>
          <FontAwesome5 name="user-plus" size={18} color="#ffffff" />
        </AddBtn>
      </Header>

      <InfoBanner>
        <FontAwesome5 name="info-circle" size={16} color="#3B82F6" />
        <InfoText>Team members can place orders and track shipments</InfoText>
      </InfoBanner>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {team.map((member) => (
          <MemberCard key={member.id}>
            <MemberHeader>
              <AvatarCircle>
                <AvatarText>{member.name.charAt(0)}</AvatarText>
              </AvatarCircle>
              <MemberInfo>
                <MemberName>{member.name}</MemberName>
                <RoleBadge isOwner={member.isOwner}>
                  <RoleText isOwner={member.isOwner}>{member.role}</RoleText>
                </RoleBadge>
              </MemberInfo>
            </MemberHeader>

            <ContactRow>
              <FontAwesome5 name="envelope" size={12} color="#6b7280" />
              <ContactText>{member.email}</ContactText>
            </ContactRow>
            <ContactRow>
              <FontAwesome5 name="phone" size={12} color="#6b7280" />
              <ContactText>{member.phone}</ContactText>
            </ContactRow>
            <ContactRow>
              <FontAwesome5 name="calendar" size={12} color="#6b7280" />
              <ContactText>Added: {member.addedAt}</ContactText>
            </ContactRow>

            {!member.isOwner && (
              <ActionRow>
                <ActionBtn onPress={() => openEditRole(member)}>
                  <FontAwesome5 name="edit" size={14} color="#3B82F6" />
                  <ActionText style={{ color: '#3B82F6' }}>Edit Role</ActionText>
                </ActionBtn>
                <ActionBtn onPress={() => removeMember(member.id)}>
                  <FontAwesome5 name="user-times" size={14} color="#EF4444" />
                  <ActionText style={{ color: '#EF4444' }}>Remove</ActionText>
                </ActionBtn>
              </ActionRow>
            )}
          </MemberCard>
        ))}

        <AddNewCard onPress={openAdd}>
          <FontAwesome5 name="user-plus" size={32} color="#0f8a3c" />
          <AddNewText>Invite Team Member</AddNewText>
          <AddNewSubtext>Give access to place and track orders</AddNewSubtext>
        </AddNewCard>
      </ScrollView>

      <Modal visible={showAddModal} transparent animationType="slide">
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{editingMember ? 'Edit Team Member' : 'Invite Team Member'}</ModalTitle>
              <CloseBtn onPress={() => setShowAddModal(false)}>
                <FontAwesome5 name="times" size={18} color="#111827" />
              </CloseBtn>
            </ModalHeader>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <FormLabel>Full Name *</FormLabel>
              <FormInput value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} placeholder="Jane Doe" />
              <FormLabel>Email *</FormLabel>
              <FormInput value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} placeholder="jane@company.com" keyboardType="email-address" />
              <FormLabel>Phone</FormLabel>
              <FormInput value={form.phone} onChangeText={(t) => setForm({ ...form, phone: t })} placeholder="+91 98765 43210" keyboardType="phone-pad" />
              <FormLabel>Role</FormLabel>
              <FormInput value={form.role} onChangeText={(t) => setForm({ ...form, role: t })} placeholder="Manager / Procurement / etc." />
            </ScrollView>
            <ModalFooter>
              <CancelBtn onPress={() => setShowAddModal(false)}>
                <CancelBtnText>Cancel</CancelBtnText>
              </CancelBtn>
              <SaveBtn onPress={saveMember}>
                <SaveBtnText>{editingMember ? 'Save Changes' : 'Send Invite'}</SaveBtnText>
              </SaveBtn>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Wrapper>
  );
};

export default ManageTeamScreen;

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

const InfoBanner = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background-color: #DBEAFE;
  margin: 16px;
  border-radius: 12px;
`;

const InfoText = styled.Text`
  font-size: 13px;
  color: #1E40AF;
  margin-left: 8px;
  flex: 1;
`;

const MemberCard = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const MemberHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const AvatarCircle = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: #0f8a3c;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const AvatarText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
`;

const MemberInfo = styled.View`
  flex: 1;
`;

const MemberName = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
`;

const RoleBadge = styled.View<{ isOwner: boolean }>`
  padding: 4px 10px;
  border-radius: 10px;
  background-color: ${(props: { isOwner: boolean }) => (props.isOwner ? '#FEF3C7' : '#E0E7FF')};
  align-self: flex-start;
`;

const RoleText = styled.Text<{ isOwner: boolean }>`
  font-size: 11px;
  font-weight: 700;
  color: ${(props: { isOwner: boolean }) => (props.isOwner ? '#F59E0B' : '#4F46E5')};
`;

const ContactRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const ContactText = styled.Text`
  font-size: 13px;
  color: #6b7280;
  margin-left: 8px;
`;

const ActionRow = styled.View`
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: #e5e7eb;
  padding-top: 12px;
  margin-top: 8px;
  justify-content: space-around;
`;

const ActionBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #f9fafb;
`;

const ActionText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  margin-left: 4px;
`;

const AddNewCard = styled.TouchableOpacity`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 32px;
  border-width: 2px;
  border-color: #0f8a3c;
  border-style: dashed;
  align-items: center;
  justify-content: center;
`;

const AddNewText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #0f8a3c;
  margin-top: 8px;
`;

const AddNewSubtext = styled.Text`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
`;

const ModalOverlay = styled.View`
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
