import React, { useState } from 'react';
import { ScrollView, Alert, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation: any;
}

const AdminProductsScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'Stand-Up Pouch',
      category: 'Pouches',
      price: 12.5,
      stock: 1500,
      lowStockThreshold: 200,
      isActive: true,
    },
    {
      id: '2',
      name: 'Kraft Paper Box',
      category: 'Boxes',
      price: 25.0,
      stock: 150,
      lowStockThreshold: 200,
      isActive: true,
    },
    {
      id: '3',
      name: 'Window Pouch',
      category: 'Pouches',
      price: 15.0,
      stock: 800,
      lowStockThreshold: 200,
      isActive: false,
    },
  ]);

  const toggleProductStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const deleteProduct = (id: string) => {
    Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setProducts((prev) => prev.filter((p) => p.id !== id)),
      },
    ]);
  };

  return (
    <Wrapper>
      <Header>
        <BackBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color="#111827" />
        </BackBtn>
        <HeaderTitle>Product Management</HeaderTitle>
        <AddBtn onPress={() => Alert.alert('Add Product', 'Feature coming soon')}>
          <FontAwesome5 name="plus" size={18} color="#ffffff" />
        </AddBtn>
      </Header>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {products.map((product) => (
          <ProductCard key={product.id}>
            <ProductHeader>
              <ProductName>{product.name}</ProductName>
              <StatusBadge isActive={product.isActive}>
                <StatusText isActive={product.isActive}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </StatusText>
              </StatusBadge>
            </ProductHeader>

            <ProductInfo>
              <InfoRow>
                <InfoLabel>Category:</InfoLabel>
                <InfoValue>{product.category}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Price:</InfoLabel>
                <InfoValue>₹{product.price.toFixed(2)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Stock:</InfoLabel>
                <InfoValue
                  style={{
                    color: product.stock < product.lowStockThreshold ? '#EF4444' : '#10B981',
                  }}
                >
                  {product.stock} units
                  {product.stock < product.lowStockThreshold && ' (Low Stock!)'}
                </InfoValue>
              </InfoRow>
            </ProductInfo>

            <ProductActions>
              <ActionBtn onPress={() => Alert.alert('Edit', `Edit ${product.name}`)}>
                <FontAwesome5 name="edit" size={16} color="#3B82F6" />
                <ActionText style={{ color: '#3B82F6' }}>Edit</ActionText>
              </ActionBtn>
              <ActionBtn onPress={() => toggleProductStatus(product.id)}>
                <FontAwesome5
                  name={product.isActive ? 'eye-slash' : 'eye'}
                  size={16}
                  color="#F59E0B"
                />
                <ActionText style={{ color: '#F59E0B' }}>
                  {product.isActive ? 'Disable' : 'Enable'}
                </ActionText>
              </ActionBtn>
              <ActionBtn onPress={() => deleteProduct(product.id)}>
                <FontAwesome5 name="trash" size={16} color="#EF4444" />
                <ActionText style={{ color: '#EF4444' }}>Delete</ActionText>
              </ActionBtn>
            </ProductActions>
          </ProductCard>
        ))}
      </ScrollView>
    </Wrapper>
  );
};

export default AdminProductsScreen;

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

const ProductCard = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const ProductHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ProductName = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  flex: 1;
`;

const StatusBadge = styled.View<{ isActive: boolean }>`
  padding: 4px 12px;
  border-radius: 12px;
  background-color: ${(props: { isActive: boolean }) => (props.isActive ? '#D1FAE5' : '#FEE2E2')};
`;

const StatusText = styled.Text<{ isActive: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${(props: { isActive: boolean }) => (props.isActive ? '#10B981' : '#EF4444')};
`;

const ProductInfo = styled.View`
  margin-bottom: 12px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
`;

const InfoLabel = styled.Text`
  font-size: 14px;
  color: #6b7280;
  width: 80px;
`;

const InfoValue = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  flex: 1;
`;

const ProductActions = styled.View`
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
