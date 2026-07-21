import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, Modal } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchAddresses,
  createAddressThunk,
  updateAddressThunk,
  deleteAddressThunk,
  setDefaultAddressThunk,
  selectAddresses,
} from '../../store/addressesSlice';
import type { Address } from '../../store/addressesSlice';

interface Props {
  navigation: any;
}

const EMPTY_FORM = { company: '', street: '', city: '', state: '', zip: '', country: 'India' };

const ManageAddressesScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(selectAddresses);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const setDefaultAddress = (id: string) => {
    dispatch(setDefaultAddressThunk(id));
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
        onPress: () => dispatch(deleteAddressThunk(id)),
      },
    ]);
  };

  const openAdd = () => {
    setEditingAddress(null);
    setForm(EMPTY_FORM);
    setShowAddModal(true);
  };

  const openEdit = (address: Address) => {
    setEditingAddress(address);
    setForm({
      company: address.company,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
    });
    setShowAddModal(true);
  };

  const saveAddress = () => {
    if (!form.company.trim() || !form.street.trim() || !form.city.trim() || !form.zip.trim()) {
      Alert.alert('Error', 'Company, street, city and ZIP are required');
      return;
    }
    if (editingAddress) {
      dispatch(
        updateAddressThunk({
          ...editingAddress,
          company: form.company.trim(),
          street: form.street.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          zip: form.zip.trim(),
          country: form.country.trim(),
        })
      );
    } else {
      dispatch(
        createAddressThunk({
          company: form.company.trim(),
          street: form.street.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          zip: form.zip.trim(),
          country: form.country.trim(),
          isDefault: addresses.length === 0,
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
        <HeaderTitle>Shipping Addresses</HeaderTitle>
        <AddBtn onPress={openAdd}>
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
              <ActionBtn onPress={() => openEdit(address)}>
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

        <AddNewCard onPress={openAdd}>
          <FontAwesome5 name="plus-circle" size={32} color="#0f8a3c" />
          <AddNewText>Add New Address</AddNewText>
        </AddNewCard>
      </ScrollView>

      <Modal visible={showAddModal} transparent animationType="slide">
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{editingAddress ? 'Edit Address' : 'New Address'}</ModalTitle>
              <CloseBtn onPress={() => setShowAddModal(false)}>
                <FontAwesome5 name="times" size={18} color="#111827" />
              </CloseBtn>
            </ModalHeader>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <FormLabel>Company / Label *</FormLabel>
              <FormInput value={form.company} onChangeText={(t) => setForm({ ...form, company: t })} placeholder="Warehouse - Pune" />
              <FormLabel>Street Address *</FormLabel>
              <FormInput value={form.street} onChangeText={(t) => setForm({ ...form, street: t })} placeholder="123, Industrial Area" />
              <FormLabel>City *</FormLabel>
              <FormInput value={form.city} onChangeText={(t) => setForm({ ...form, city: t })} placeholder="Mumbai" />
              <FormLabel>State</FormLabel>
              <FormInput value={form.state} onChangeText={(t) => setForm({ ...form, state: t })} placeholder="Maharashtra" />
              <FormLabel>ZIP Code *</FormLabel>
              <FormInput value={form.zip} onChangeText={(t) => setForm({ ...form, zip: t })} placeholder="400001" keyboardType="number-pad" />
              <FormLabel>Country</FormLabel>
              <FormInput value={form.country} onChangeText={(t) => setForm({ ...form, country: t })} placeholder="India" />
            </ScrollView>
            <ModalFooter>
              <CancelBtn onPress={() => setShowAddModal(false)}>
                <CancelBtnText>Cancel</CancelBtnText>
              </CancelBtn>
              <SaveBtn onPress={saveAddress}>
                <SaveBtnText>{editingAddress ? 'Save Changes' : 'Add Address'}</SaveBtnText>
              </SaveBtn>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
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
