import React, { useState, useEffect } from 'react';
import { ScrollView, TextInput, Alert, Modal } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchInventory,
  setInventoryStockThunk,
  createInventoryItemThunk,
  deleteInventoryItemThunk,
  selectInventory,
} from '../../store/inventorySlice';

const AdminInventoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const inventory = useAppSelector(selectInventory);
  const [filterMaterial, setFilterMaterial] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', material: 'clear', size: '', thickness: '', stock: '', reorderPoint: '', price: '' });

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const handleCreateItem = () => {
    if (!newItem.name.trim() || !newItem.size.trim()) {
      Alert.alert('Error', 'Name and size are required');
      return;
    }
    dispatch(
      createInventoryItemThunk({
        name: newItem.name.trim(),
        material: newItem.material,
        size: newItem.size.trim(),
        thickness: parseFloat(newItem.thickness) || 0,
        hasZip: false,
        stock: parseInt(newItem.stock, 10) || 0,
        reorderPoint: parseInt(newItem.reorderPoint, 10) || 100,
        price: parseFloat(newItem.price) || 0,
      })
    );
    setShowAddModal(false);
    setNewItem({ name: '', material: 'clear', size: '', thickness: '', stock: '', reorderPoint: '', price: '' });
  };

  const handleDeleteItem = (id: string, name: string) => {
    Alert.alert('Delete Item', `Remove "${name}" from inventory?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteInventoryItemThunk(id)) },
    ]);
  };

  const materials = ['all', 'clear', 'silver', 'kraft', 'milky'];

  const filteredInventory = inventory.filter((item) => {
    const matchesMaterial = filterMaterial === 'all' || item.material === filterMaterial;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMaterial && matchesSearch;
  });

  const getStockStatus = (stock: number, reorderPoint: number) => {
    const percentage = (stock / reorderPoint) * 100;
    if (percentage < 50) return { status: 'critical', color: '#EF4444', bg: '#FEE2E2' };
    if (percentage < 100) return { status: 'low', color: '#F59E0B', bg: '#FEF3C7' };
    return { status: 'good', color: '#0F8A3C', bg: '#DCFCE7' };
  };

  const handleUpdateStock = (item: any) => {
    Alert.prompt(
      'Update Stock',
      `Current stock: ${item.stock} units`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: (newStock?: string) => {
            if (newStock && !isNaN(parseInt(newStock, 10))) {
              dispatch(setInventoryStockThunk({ id: item.id, stock: parseInt(newStock, 10) }));
              Alert.alert('Success', `Stock updated to ${newStock} units`);
            }
          },
        },
      ],
      'plain-text',
      String(item.stock),
      'numeric'
    );
  };

  const handleIncreaseStock = (item: any) => {
    dispatch(setInventoryStockThunk({ id: item.id, stock: item.stock + 100 }));
  };

  const handleDecreaseStock = (item: any) => {
    if (item.stock > 0) {
      dispatch(setInventoryStockThunk({ id: item.id, stock: Math.max(0, item.stock - 100) }));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#1F2937" />
        </BackButton>
        <HeaderTitle>Inventory Management</HeaderTitle>
        <AddButton onPress={() => setShowAddModal(true)}>
          <FontAwesome5 name="plus" size={18} color="#FFF" />
        </AddButton>
      </Header>

      <SearchContainer>
        <FontAwesome5 name="search" size={16} color="#9CA3AF" style={{ marginRight: 12 }} />
        <SearchInput
          placeholder="Search inventory..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </SearchContainer>

      <FilterContainer>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {materials.map((mat) => (
            <FilterButton
              key={mat}
              active={filterMaterial === mat}
              onPress={() => setFilterMaterial(mat)}
            >
              <FilterButtonText active={filterMaterial === mat}>
                {mat.charAt(0).toUpperCase() + mat.slice(1)}
              </FilterButtonText>
            </FilterButton>
          ))}
        </ScrollView>
      </FilterContainer>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <StatsRow>
          <StatCard>
            <StatIcon bgColor="#DBEAFE">
              <FontAwesome5 name="warehouse" size={16} color="#3B82F6" />
            </StatIcon>
            <StatValue>{inventory.reduce((sum, i) => sum + i.stock, 0)}</StatValue>
            <StatLabel>Total Units</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon bgColor="#FEE2E2">
              <FontAwesome5 name="exclamation-triangle" size={16} color="#EF4444" />
            </StatIcon>
            <StatValue>{inventory.filter((i) => i.stock < i.reorderPoint).length}</StatValue>
            <StatLabel>Low Stock</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon bgColor="#DCFCE7">
              <FontAwesome5 name="box" size={16} color="#0F8A3C" />
            </StatIcon>
            <StatValue>{inventory.length}</StatValue>
            <StatLabel>Products</StatLabel>
          </StatCard>
        </StatsRow>

        <InventoryList>
          {filteredInventory.map((item) => {
            const stockStatus = getStockStatus(item.stock, item.reorderPoint);
            return (
              <InventoryCard key={item.id}>
                <CardHeader>
                  <ItemName>{item.name}</ItemName>
                  <StockBadge bgColor={stockStatus.bg}>
                    <StockBadgeText color={stockStatus.color}>
                      {stockStatus.status.toUpperCase()}
                    </StockBadgeText>
                  </StockBadge>
                </CardHeader>

                <ItemDetails>
                  <DetailRow>
                    <DetailLabel>Material:</DetailLabel>
                    <DetailValue>{item.material.toUpperCase()}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Size:</DetailLabel>
                    <DetailValue>{item.size} inches</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Thickness:</DetailLabel>
                    <DetailValue>{item.thickness} microns</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Zipper:</DetailLabel>
                    <DetailValue>{item.hasZip ? 'Yes' : 'No'}</DetailValue>
                  </DetailRow>
                </ItemDetails>

                <StockInfo>
                  <StockBar>
                    <StockBarLabel>Stock Level</StockBarLabel>
                    <StockBarValue>{item.stock} / {item.reorderPoint} units</StockBarValue>
                  </StockBar>
                  <ProgressBar>
                    <ProgressFill
                      percentage={Math.min(100, (item.stock / item.reorderPoint) * 100)}
                      color={stockStatus.color}
                    />
                  </ProgressBar>
                </StockInfo>

                <CardFooter>
                  <PriceText>₹{item.price}/unit</PriceText>
                  <ActionButtons>
                    <ActionButton onPress={() => handleDecreaseStock(item)}>
                      <FontAwesome5 name="minus" size={12} color="#EF4444" />
                    </ActionButton>
                    <ActionButton onPress={() => handleUpdateStock(item)}>
                      <FontAwesome5 name="edit" size={12} color="#0F8A3C" />
                    </ActionButton>
                    <ActionButton onPress={() => handleIncreaseStock(item)}>
                      <FontAwesome5 name="plus" size={12} color="#10B981" />
                    </ActionButton>
                    <ActionButton onPress={() => handleDeleteItem(item.id, item.name)}>
                      <FontAwesome5 name="trash" size={12} color="#EF4444" />
                    </ActionButton>
                  </ActionButtons>
                </CardFooter>
              </InventoryCard>
            );
          })}
        </InventoryList>
      </ScrollView>

      <Modal visible={showAddModal} transparent animationType="slide">
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Add Inventory Item</ModalTitle>
              <CloseBtn onPress={() => setShowAddModal(false)}>
                <FontAwesome5 name="times" size={18} color="#111827" />
              </CloseBtn>
            </ModalHeader>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <FormLabel>Name *</FormLabel>
              <FormInput placeholder="e.g., Clear BOPP Pouch" value={newItem.name} onChangeText={(t) => setNewItem({ ...newItem, name: t })} />
              <FormLabel>Material</FormLabel>
              <FormInput placeholder="clear / silver / kraft / milky" value={newItem.material} onChangeText={(t) => setNewItem({ ...newItem, material: t })} />
              <FormLabel>Size *</FormLabel>
              <FormInput placeholder="e.g., 5x8" value={newItem.size} onChangeText={(t) => setNewItem({ ...newItem, size: t })} />
              <FormLabel>Thickness (microns)</FormLabel>
              <FormInput placeholder="e.g., 75" value={newItem.thickness} onChangeText={(t) => setNewItem({ ...newItem, thickness: t })} keyboardType="numeric" />
              <FormLabel>Initial Stock</FormLabel>
              <FormInput placeholder="0" value={newItem.stock} onChangeText={(t) => setNewItem({ ...newItem, stock: t })} keyboardType="number-pad" />
              <FormLabel>Reorder Point</FormLabel>
              <FormInput placeholder="500" value={newItem.reorderPoint} onChangeText={(t) => setNewItem({ ...newItem, reorderPoint: t })} keyboardType="number-pad" />
              <FormLabel>Price per unit (₹)</FormLabel>
              <FormInput placeholder="0.00" value={newItem.price} onChangeText={(t) => setNewItem({ ...newItem, price: t })} keyboardType="decimal-pad" />
            </ScrollView>
            <ModalFooter>
              <CancelBtn onPress={() => setShowAddModal(false)}>
                <CancelBtnText>Cancel</CancelBtnText>
              </CancelBtn>
              <SaveBtn onPress={handleCreateItem}>
                <SaveBtnText>Add Item</SaveBtnText>
              </SaveBtn>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </SafeAreaView>
  );
};

export default AdminInventoryScreen;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px;
  background-color: #FFFFFF;
  border-bottom-width: 1px;
  border-bottom-color: #E5E7EB;
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f3f4f6;
  align-items: center;
  justify-content: center;
`;

const HeaderTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #1F2937;
`;

const AddButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: #0F8A3C;
  align-items: center;
  justify-content: center;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  margin: 8px 12px;
  padding: 8px 12px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #E5E7EB;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 12px;
  color: #111827;
`;

const FilterContainer = styled.View`
  margin-bottom: 12px;
  align-items: center;
`;

const FilterButton = styled.TouchableOpacity<{ active: boolean }>`
  padding: 6px 12px;
  border-radius: 16px;
  margin-right: 6px;
  background-color: ${(props: any) => props.active ? '#0F8A3C' : '#FFFFFF'};
  border-width: 1px;
  border-color: ${(props: any) => props.active ? '#0F8A3C' : '#E5E7EB'};
`;

const FilterButtonText = styled.Text<{ active: boolean }>`
  font-size: 11px;
  font-weight: 700;
  color: ${(props: any) => props.active ? '#FFFFFF' : '#6B7280'};
`;

const StatsRow = styled.View`
  flex-direction: row;
  padding: 0 12px;
  margin-bottom: 12px;
  justify-content: center;
`;

const StatCard = styled.View`
  flex: 1;
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 12px;
  margin: 0 4px;
  align-items: center;
  border-width: 1px;
  border-color: #E5E7EB;
  shadow-color: rgba(0, 0, 0, 0.04);
  shadow-offset: 0px 1px;
  shadow-opacity: 1;
  shadow-radius: 2;
  elevation: 1;
`;

const StatIcon = styled.View<{ bgColor: string }>`
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background-color: ${(props: any) => props.bgColor};
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

const StatValue = styled.Text`
  font-size: 18px;
  font-weight: 900;
  color: #111827;
`;

const StatLabel = styled.Text`
  font-size: 9px;
  color: #9CA3AF;
  margin-top: 1px;
  font-weight: 700;
`;

const InventoryList = styled.View`
  padding: 0 12px;
`;

const InventoryCard = styled.View`
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 8px;
  margin-horizontal: auto;
  border-width: 1px;
  border-color: #E5E7EB;
  shadow-color: rgba(0, 0, 0, 0.04);
  shadow-offset: 0px 1px;
  shadow-opacity: 1;
  shadow-radius: 2;
  elevation: 1;
`;

const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ItemName = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: #111827;
  flex: 1;
`;

const StockBadge = styled.View<{ bgColor: string }>`
  background-color: ${(props: any) => props.bgColor};
  padding: 3px 8px;
  border-radius: 6px;
`;

const StockBadgeText = styled.Text<{ color: string }>`
  font-size: 9px;
  font-weight: 800;
  color: ${(props: any) => props.color};
`;

const ItemDetails = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

const DetailRow = styled.View`
  flex-direction: row;
  width: 50%;
  margin-bottom: 4px;
`;

const DetailLabel = styled.Text`
  font-size: 10px;
  color: #9CA3AF;
  margin-right: 4px;
  font-weight: 600;
`;

const DetailValue = styled.Text`
  font-size: 10px;
  font-weight: 700;
  color: #111827;
`;

const StockInfo = styled.View`
  margin-bottom: 8px;
`;

const StockBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
`;
const StockBarLabel = styled.Text`font-size: 11px; color: #6B7280;`;
const StockBarValue = styled.Text`font-size: 11px; font-weight: 700; color: #111827;`;
const ProgressBar = styled.View`
  height: 6px; background-color: #F3F4F6; border-radius: 3px; overflow: hidden;
`;
const ProgressFill = styled.View<{ percentage: number; color: string }>`
  width: ${(props: any) => props.percentage}%;
  height: 100%;
  background-color: ${(props: any) => props.color};
`;

const CardFooter = styled.View`
  flex-direction: row; justify-content: space-between; align-items: center;
  padding-top: 12px; border-top-width: 1px; border-top-color: #F3F4F6;
`;
const PriceText = styled.Text`font-size: 14px; font-weight: 700; color: #0F8A3C;`;
const ActionButtons = styled.View`flex-direction: row; gap: 8px;`;
const ActionButton = styled.TouchableOpacity`
  width: 32px; height: 32px; border-radius: 8px;
  background-color: #F3F4F6; align-items: center; justify-content: center;
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
