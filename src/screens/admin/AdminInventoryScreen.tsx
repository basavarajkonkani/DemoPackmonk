import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

const AdminInventoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [filterMaterial, setFilterMaterial] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const inventory = [
    { id: '1', name: 'Clear BOPP Pouch', material: 'clear', size: '5x8', thickness: 75, hasZip: true, stock: 1500, reorderPoint: 500, price: 12 },
    { id: '2', name: 'Silver Metalized Pouch', material: 'silver', size: '8x12', thickness: 100, hasZip: false, stock: 250, reorderPoint: 500, price: 18 },
    { id: '3', name: 'Kraft Paper Pouch', material: 'kraft', size: '6x9', thickness: 90, hasZip: true, stock: 3000, reorderPoint: 800, price: 15 },
    { id: '4', name: 'Milky White Pouch', material: 'milky', size: '10x15', thickness: 120, hasZip: true, stock: 180, reorderPoint: 400, price: 20 },
  ];

  const materials = ['all', 'clear', 'silver', 'kraft', 'milky'];

  const filteredInventory = inventory.filter(item => {
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
        { text: 'Update', onPress: (newStock?: string) => Alert.alert('Success', `Stock updated to ${newStock}`) }
      ],
      'plain-text',
      String(item.stock),
      'numeric'
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#1F2937" />
        </BackButton>
        <HeaderTitle>Inventory Management</HeaderTitle>
        <AddButton onPress={() => Alert.alert('Add Item', 'Add new inventory item')}>
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

      <ScrollView showsVerticalScrollIndicator={false}>
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
            <StatValue>{inventory.filter(i => i.stock < i.reorderPoint).length}</StatValue>
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
                  <PriceText>${item.price}/unit</PriceText>
                  <ActionButtons>
                    <ActionButton onPress={() => handleUpdateStock(item)}>
                      <FontAwesome5 name="edit" size={12} color="#0F8A3C" />
                    </ActionButton>
                    <ActionButton onPress={() => Alert.alert('Settings', 'Configure reorder settings')}>
                      <FontAwesome5 name="cog" size={12} color="#6B7280" />
                    </ActionButton>
                  </ActionButtons>
                </CardFooter>
              </InventoryCard>
            );
          })}
        </InventoryList>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminInventoryScreen;

const Header = styled.View`
  flex-direction: row; align-items: center; justify-content: space-between;
  padding: 16px 20px; background-color: #FFFFFF;
  border-bottom-width: 1px; border-bottom-color: #E5E7EB;
`;
const BackButton = styled.TouchableOpacity`width: 40px; height: 40px; align-items: center; justify-content: center;`;
const HeaderTitle = styled.Text`font-size: 18px; font-weight: 700; color: #1F2937;`;
const AddButton = styled.TouchableOpacity`
  width: 40px; height: 40px; border-radius: 12px;
  background-color: #0F8A3C; align-items: center; justify-content: center;
`;

const SearchContainer = styled.View`
  flex-direction: row; align-items: center; background-color: #FFFFFF;
  margin: 16px; padding: 12px 16px; border-radius: 12px;
  border-width: 1px; border-color: #E5E7EB;
`;
const SearchInput = styled.TextInput`flex: 1; font-size: 14px; color: #111827;`;

const FilterContainer = styled.View`margin-bottom: 16px;`;
const FilterButton = styled.TouchableOpacity<{ active: boolean }>`
  padding: 8px 16px; border-radius: 20px; margin-right: 8px;
  background-color: ${({ active }) => active ? '#0F8A3C' : '#FFFFFF'};
  border-width: 1px; border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
`;
const FilterButtonText = styled.Text<{ active: boolean }>`
  font-size: 13px; font-weight: 600;
  color: ${({ active }) => active ? '#FFFFFF' : '#6B7280'};
`;

const StatsRow = styled.View`flex-direction: row; padding: 0 12px; margin-bottom: 16px;`;
const StatCard = styled.View`
  flex: 1; background-color: #FFFFFF; border-radius: 12px;
  padding: 14px; margin: 0 4px; align-items: center;
  border-width: 1px; border-color: #F3F4F6;
`;
const StatIcon = styled.View<{ bgColor: string }>`
  width: 36px; height: 36px; border-radius: 10px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center; justify-content: center; margin-bottom: 8px;
`;
const StatValue = styled.Text`font-size: 20px; font-weight: 800; color: #111827;`;
const StatLabel = styled.Text`font-size: 11px; color: #9CA3AF; margin-top: 2px;`;

const InventoryList = styled.View`padding: 0 16px 24px;`;
const InventoryCard = styled.View`
  background-color: #FFFFFF; border-radius: 16px; padding: 16px;
  margin-bottom: 12px; border-width: 1px; border-color: #F3F4F6;
`;
const CardHeader = styled.View`
  flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 12px;
`;
const ItemName = styled.Text`font-size: 15px; font-weight: 700; color: #111827; flex: 1;`;
const StockBadge = styled.View<{ bgColor: string }>`
  background-color: ${({ bgColor }) => bgColor};
  padding: 4px 10px; border-radius: 8px;
`;
const StockBadgeText = styled.Text<{ color: string }>`
  font-size: 10px; font-weight: 800; color: ${({ color }) => color};
`;

const ItemDetails = styled.View`
  flex-direction: row; flex-wrap: wrap; margin-bottom: 12px;
`;
const DetailRow = styled.View`
  flex-direction: row; width: 50%; margin-bottom: 6px;
`;
const DetailLabel = styled.Text`font-size: 12px; color: #9CA3AF; margin-right: 4px;`;
const DetailValue = styled.Text`font-size: 12px; font-weight: 600; color: #111827;`;

const StockInfo = styled.View`margin-bottom: 12px;`;
const StockBar = styled.View`
  flex-direction: row; justify-content: space-between; margin-bottom: 6px;
`;
const StockBarLabel = styled.Text`font-size: 11px; color: #6B7280;`;
const StockBarValue = styled.Text`font-size: 11px; font-weight: 700; color: #111827;`;
const ProgressBar = styled.View`
  height: 6px; background-color: #F3F4F6; border-radius: 3px; overflow: hidden;
`;
const ProgressFill = styled.View<{ percentage: number; color: string }>`
  width: ${({ percentage }) => percentage}%;
  height: 100%; background-color: ${({ color }) => color};
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
