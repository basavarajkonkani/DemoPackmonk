import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation: any;
}

const AdminUsersScreen: React.FC<Props> = ({ navigation }) => {
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul@company.com',
      phone: '+91 98765 43210',
      companyName: 'Sharma Industries',
      gstNumber: '22AAAAA0000A1Z5',
      role: 'user' as const,
      isActive: true,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya@business.com',
      phone: '+91 98765 43211',
      companyName: 'Patel Enterprises',
      gstNumber: '24BBBBB1111B2Y6',
      role: 'user' as const,
      isActive: true,
      createdAt: '2024-02-20',
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@packmonk.com',
      phone: '+91 98765 00000',
      companyName: 'PackMonk',
      role: 'admin' as const,
      isActive: true,
      createdAt: '2023-12-01',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'user' | 'admin'>('all');

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  const deleteUser = (id: string) => {
    Alert.alert('Delete User', 'Are you sure you want to delete this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setUsers((prev) => prev.filter((u) => u.id !== id)),
      },
    ]);
  };

  const filteredUsers = users.filter((u) => filter === 'all' || u.role === filter);

  const handleAddUser = () => {
    Alert.prompt(
      'Add User',
      "Enter the new user's full name",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Next',
          onPress: (name?: string) => {
            if (!name?.trim()) return;
            Alert.prompt(
              'Email Address',
              `Enter email for ${name.trim()}`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Create User',
                  onPress: (email?: string) => {
                    if (!email?.trim()) return;
                    setUsers((prev) => [
                      ...prev,
                      {
                        id: Date.now().toString(),
                        name: name.trim(),
                        email: email.trim(),
                        phone: '',
                        companyName: '',
                        gstNumber: '',
                        role: 'user',
                        isActive: true,
                        createdAt: new Date().toISOString().split('T')[0],
                      },
                    ]);
                  },
                },
              ],
              'plain-text'
            );
          },
        },
      ],
      'plain-text'
    );
  };

  const handleEditUser = (user: (typeof users)[number]) => {
    Alert.prompt(
      'Edit Name',
      `Update name for ${user.email}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: (name?: string) => {
            if (!name?.trim()) return;
            setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, name: name.trim() } : u)));
          },
        },
      ],
      'plain-text',
      user.name
    );
  };

  return (
    <Wrapper>
      <Header>
        <BackBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color="#111827" />
        </BackBtn>
        <HeaderTitle>User Management</HeaderTitle>
        <AddBtn onPress={handleAddUser}>
          <FontAwesome5 name="user-plus" size={18} color="#ffffff" />
        </AddBtn>
      </Header>

      <FilterRow>
        <FilterBtn isActive={filter === 'all'} onPress={() => setFilter('all')}>
          <FilterText isActive={filter === 'all'}>All ({users.length})</FilterText>
        </FilterBtn>
        <FilterBtn
          isActive={filter === 'user'}
          onPress={() => setFilter('user')}
        >
          <FilterText isActive={filter === 'user'}>
            Users ({users.filter((u) => u.role === 'user').length})
          </FilterText>
        </FilterBtn>
        <FilterBtn
          isActive={filter === 'admin'}
          onPress={() => setFilter('admin')}
        >
          <FilterText isActive={filter === 'admin'}>
            Admins ({users.filter((u) => u.role === 'admin').length})
          </FilterText>
        </FilterBtn>
      </FilterRow>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {filteredUsers.map((user) => (
          <UserCard key={user.id}>
            <UserHeader>
              <AvatarCircle>
                <AvatarText>{user.name.charAt(0)}</AvatarText>
              </AvatarCircle>
              <UserInfo>
                <UserName>{user.name}</UserName>
                <RoleBadge role={user.role}>
                  <RoleText role={user.role}>{user.role.toUpperCase()}</RoleText>
                </RoleBadge>
              </UserInfo>
              <StatusIndicator isActive={user.isActive} />
            </UserHeader>

            <InfoSection>
              <InfoRow>
                <FontAwesome5 name="envelope" size={12} color="#6b7280" />
                <InfoText>{user.email}</InfoText>
              </InfoRow>
              <InfoRow>
                <FontAwesome5 name="phone" size={12} color="#6b7280" />
                <InfoText>{user.phone}</InfoText>
              </InfoRow>
              {user.companyName && (
                <InfoRow>
                  <FontAwesome5 name="building" size={12} color="#6b7280" />
                  <InfoText>{user.companyName}</InfoText>
                </InfoRow>
              )}
              {user.gstNumber && (
                <InfoRow>
                  <FontAwesome5 name="file-invoice" size={12} color="#6b7280" />
                  <InfoText>GST: {user.gstNumber}</InfoText>
                </InfoRow>
              )}
              <InfoRow>
                <FontAwesome5 name="calendar" size={12} color="#6b7280" />
                <InfoText>Joined: {user.createdAt}</InfoText>
              </InfoRow>
            </InfoSection>

            <UserActions>
              <ActionBtn onPress={() => handleEditUser(user)}>
                <FontAwesome5 name="edit" size={16} color="#3B82F6" />
                <ActionText style={{ color: '#3B82F6' }}>Edit</ActionText>
              </ActionBtn>
              <ActionBtn onPress={() => toggleUserStatus(user.id)}>
                <FontAwesome5
                  name={user.isActive ? 'ban' : 'check-circle'}
                  size={16}
                  color={user.isActive ? '#F59E0B' : '#10B981'}
                />
                <ActionText style={{ color: user.isActive ? '#F59E0B' : '#10B981' }}>
                  {user.isActive ? 'Disable' : 'Enable'}
                </ActionText>
              </ActionBtn>
              {user.role !== 'admin' && (
                <ActionBtn onPress={() => deleteUser(user.id)}>
                  <FontAwesome5 name="trash" size={16} color="#EF4444" />
                  <ActionText style={{ color: '#EF4444' }}>Delete</ActionText>
                </ActionBtn>
              )}
            </UserActions>
          </UserCard>
        ))}
      </ScrollView>
    </Wrapper>
  );
};

export default AdminUsersScreen;

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

const FilterRow = styled.View`
  flex-direction: row;
  padding: 12px 16px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const FilterBtn = styled.TouchableOpacity<{ isActive: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  margin-right: 8px;
  background-color: ${(props: { isActive: boolean }) => (props.isActive ? '#0f8a3c' : '#f3f4f6')};
`;

const FilterText = styled.Text<{ isActive: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${(props: { isActive: boolean }) => (props.isActive ? '#ffffff' : '#6b7280')};
`;

const UserCard = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const UserHeader = styled.View`
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

const UserInfo = styled.View`
  flex: 1;
`;

const UserName = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
`;

const RoleBadge = styled.View<{ role: string }>`
  padding: 4px 8px;
  border-radius: 8px;
  background-color: ${(props: { role: string }) =>
    props.role === 'admin' ? '#FEE2E2' : '#DBEAFE'};
  align-self: flex-start;
`;

const RoleText = styled.Text<{ role: string }>`
  font-size: 10px;
  font-weight: 700;
  color: ${(props: { role: string }) => (props.role === 'admin' ? '#EF4444' : '#3B82F6')};
`;

const StatusIndicator = styled.View<{ isActive: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${(props: { isActive: boolean }) => (props.isActive ? '#10B981' : '#EF4444')};
`;

const InfoSection = styled.View`
  margin-bottom: 12px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const InfoText = styled.Text`
  font-size: 13px;
  color: #6b7280;
  margin-left: 8px;
`;

const UserActions = styled.View`
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: #e5e7eb;
  padding-top: 12px;
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
  font-size: 13px;
  font-weight: 600;
  margin-left: 6px;
`;
