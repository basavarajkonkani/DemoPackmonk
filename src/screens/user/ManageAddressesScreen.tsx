import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation: any;
}

const ManageAddressesScreen: React.FC<Props> = ({ navigation }) => {
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      company: 'Sharma Industries HQ',
      street: '123, Industrial Area, Sector 15',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400001',
      country: 'India',
      isDefault: true,
    },
    {
      id: '2',
      company: 'Warehouse - Pune',
      street: '456, Logistics Park, Hinjewadi',
      city: 'Pune',
      state: 'Maharashtra',
      zip: '411057',
      country: 'India',
      isDefault: false,
    },
  ]);

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({ ...addr, isDefault: addr.id === id }))
    );
    Alert.alert('Success', 'Default address updated');
  };

  const deleteAddress = (id: string) => {
    const address = addresses.find((a) => a.id === id);
    if (address?.isDefault) {
      Alert.alert('Error', 'Cannot delete default address');
      return;
    }
    Alert.alert('Delete Address', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setAddresses((prev) => prev.filter((a) => a.id !== id)),
      },
    ]);
  };

  return (
    <Wrapper>
      <Header>
        <BackBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color="#111827" />
        </BackBtn>
        <HeaderTitle>Shipping Addresses</HeaderTitle>
        <AddBtn onPress={() => Alert.alert('Add Address', 'Feature coming soon')}>
          <FontAwesome5 name="plus" size={18} color="#ffffff" />
        </AddBtn>
      </Header>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {addresses.map((address) => (
          <AddressCard key={address.id}>
            <CardHeader>
              <CompanyName>{address.company}</CompanyName>
              {address.isDefault && (
                <DefaultBadge>
                  <DefaultText>Default</DefaultText>
                </DefaultBadge>
              )}
            </CardHeader>

            <AddressLine>
              <FontAwesome5 name="map-marker-alt" size={14} color="#6b7280" />
              <AddressText>{address.street}</AddressText>
            </AddressLine>
            <AddressLine>
              <FontAwesome5 name="city" size={14} color="#6b7280" />
              <AddressText>
                {address.city}, {address.state} - {address.zip}
              </AddressText>
            </AddressLine>
            <AddressLine>
              <FontAwesome5 name="flag" size={14} color="#6b7280" />
              <AddressText>{address.country}</AddressText>
            </AddressLine>

            <ActionRow>
              <ActionBtn onPress={() => Alert.alert('Edit', `Edit ${address.company}`)}>
                <FontAwesome5 name="edit" size={14} color="#3B82F6" />
                <ActionText style={{ color: '#3B82F6' }}>Edit</ActionText>
              </ActionBtn>
              {!address.isDefault && (
                <ActionBtn onPress={() => setDefaultAddress(address.id)}>
                  <FontAwesome5 name="check-circle" size={14} color="#10B981" />
                  <ActionText style={{ color: '#10B981' }}>Set Default</ActionText>
                </ActionBtn>
              )}
              <ActionBtn onPress={() => deleteAddress(address.id)}>
                <FontAwesome5 name="trash" size={14} color="#EF4444" />
                <ActionText style={{ color: '#EF4444' }}>Delete</ActionText>
              </ActionBtn>
            </ActionRow>
          </AddressCard>
        ))}

        <AddNewCard onPress={() => Alert.alert('Add Address', 'Feature coming soon')}>
          <FontAwesome5 name="plus-circle" size={32} color="#0f8a3c" />
          <AddNewText>Add New Address</AddNewText>
        </AddNewCard>
      </ScrollView>
    </Wrapper>
  );
};

export default ManageAddressesScreen;

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

const AddressCard = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const CompanyName = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  flex: 1;
`;

const DefaultBadge = styled.View`
  padding: 4px 10px;
  border-radius: 10px;
  background-color: #D1FAE5;
`;

const DefaultText = styled.Text`
  font-size: 11px;
  font-weight: 700;
  color: #10B981;
`;

const AddressLine = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const AddressText = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-left: 10px;
  flex: 1;
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
  padding: 8px 10px;
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
