import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation: any;
}

const ManageTeamScreen: React.FC<Props> = ({ navigation }) => {
  const [team, setTeam] = useState([
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul@company.com',
      phone: '+91 98765 43210',
      role: 'Owner',
      addedAt: '2024-01-01',
      isOwner: true,
    },
    {
      id: '2',
      name: 'Neha Verma',
      email: 'neha@company.com',
      phone: '+91 98765 43211',
      role: 'Manager',
      addedAt: '2024-01-15',
      isOwner: false,
    },
    {
      id: '3',
      name: 'Vikram Singh',
      email: 'vikram@company.com',
      phone: '+91 98765 43212',
      role: 'Procurement',
      addedAt: '2024-01-20',
      isOwner: false,
    },
  ]);

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
        onPress: () => setTeam((prev) => prev.filter((m) => m.id !== id)),
      },
    ]);
  };

  return (
    <Wrapper>
      <Header>
        <BackBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color="#111827" />
        </BackBtn>
        <HeaderTitle>Team Members</HeaderTitle>
        <AddBtn onPress={() => Alert.alert('Add Member', 'Feature coming soon')}>
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
                <ActionBtn
                  onPress={() => Alert.alert('Edit', `Edit ${member.name}'s role`)}
                >
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

        <AddNewCard onPress={() => Alert.alert('Add Member', 'Feature coming soon')}>
          <FontAwesome5 name="user-plus" size={32} color="#0f8a3c" />
          <AddNewText>Invite Team Member</AddNewText>
          <AddNewSubtext>Give access to place and track orders</AddNewSubtext>
        </AddNewCard>
      </ScrollView>
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
