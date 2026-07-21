import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, Alert, TouchableOpacity, TextInput, Modal, View, FlatList, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchCatalog,
  createCatalogProduct,
  updateCatalogProduct,
  deleteCatalogProduct,
  toggleCatalogProductActive,
  setCatalogProductStock,
  setCatalogProductPrice,
  selectCatalogItems,
} from '../../store/catalogSlice';
import type { CatalogProduct } from '../../store/catalogSlice';
// Backward-compat alias so the rest of this file (originally written against
// the old AdminProduct shape) needs minimal changes.
type AdminProduct = CatalogProduct;

interface Props {
  navigation: any;
}

type SortField = 'name' | 'price' | 'stock' | 'date';
type SortOrder = 'asc' | 'desc';

interface FormErrors {
  name?: string;
  category?: string;
  price?: string;
  stock?: string;
}

const AdminProductsScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectCatalogItems);

  useEffect(() => {
    dispatch(fetchCatalog());
  }, [dispatch]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    material: '',
    size: '',
    thickness: '',
    price: '',
    stock: '',
    lowStockThreshold: '',
    moq: '',
    description: '',
    productCode: '',
    sku: '',
    finish: '',
    images: [] as string[],
    isActive: true,
  });

  // Get unique categories
  const categories = Array.from(
    new Set(products.map((p) => p.category))
  ).filter(Boolean);

  // Validation function
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }
    if (!formData.price.trim()) {
      errors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      errors.price = 'Price must be a valid positive number';
    }
    if (formData.stock && (isNaN(parseInt(formData.stock, 10)) || parseInt(formData.stock, 10) < 0)) {
      errors.stock = 'Stock must be a valid positive number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Filter products
  const filteredByText = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.productCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByCategory = categoryFilter === 'all'
    ? filteredByText
    : filteredByText.filter((p) => p.category === categoryFilter);

  const filteredByStatus = statusFilter === 'all'
    ? filteredByCategory
    : filteredByCategory.filter((p) => (statusFilter === 'active' ? p.isActive : !p.isActive));

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredByStatus];
    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case 'date':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
    return sorted;
  }, [filteredByStatus, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      material: '',
      size: '',
      thickness: '',
      price: '',
      stock: '',
      lowStockThreshold: '',
      moq: '',
      description: '',
      productCode: '',
      sku: '',
      finish: '',
      images: [],
      isActive: true,
    });
    setEditingProduct(null);
    setFormErrors({});
  };

  const handleOpenEdit = (product: AdminProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      material: product.material,
      size: product.size,
      thickness: product.thickness,
      price: product.price.toString(),
      stock: product.stock.toString(),
      lowStockThreshold: product.lowStockThreshold.toString(),
      moq: product.moq.toString(),
      description: product.description,
      productCode: product.productCode || '',
      sku: product.sku || '',
      finish: product.finish || '',
      images: product.images || [],
      isActive: product.isActive,
    });
    setCurrentPage(1);
    setShowAddModal(true);
  };

  const handleSaveProduct = () => {
    if (!validateForm()) {
      return;
    }

    if (editingProduct) {
      dispatch(
        updateCatalogProduct({
          ...editingProduct,
          name: formData.name.trim(),
          category: formData.category.trim(),
          material: formData.material.trim(),
          size: formData.size.trim(),
          thickness: formData.thickness.trim(),
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock || '0', 10),
          lowStockThreshold: parseInt(formData.lowStockThreshold || '0', 10),
          moq: parseInt(formData.moq || '0', 10),
          description: formData.description.trim(),
          productCode: formData.productCode.trim(),
          sku: formData.sku.trim(),
          finish: formData.finish.trim(),
          images: formData.images.length > 0 ? formData.images : ['default.jpg'],
          isActive: formData.isActive,
        })
      );
      Alert.alert('Success', 'Product updated successfully');
    } else {
      dispatch(
        createCatalogProduct({
          name: formData.name.trim(),
          category: formData.category.trim(),
          material: formData.material.trim(),
          size: formData.size.trim(),
          thickness: formData.thickness.trim(),
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock || '0', 10),
          lowStockThreshold: parseInt(formData.lowStockThreshold || '0', 10),
          moq: parseInt(formData.moq || '0', 10),
          images: formData.images.length > 0 ? formData.images : ['default.jpg'],
          description: formData.description.trim(),
          isActive: formData.isActive,
          productCode: formData.productCode.trim(),
          sku: formData.sku.trim(),
          finish: formData.finish.trim(),
          hasZipper: false,
          hasWindow: false,
          ecoRating: 3,
          sizeOptions: [],
        })
      );
      Alert.alert('Success', 'Product added successfully');
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteProduct = (id: string) => {
    Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteCatalogProduct(id));
          Alert.alert('Success', 'Product deleted');
        },
      },
    ]);
  };

  const handleToggleStatus = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) dispatch(toggleCatalogProductActive({ id, isActive: !product.isActive }));
  };

  const handleUpdatePrice = (product: AdminProduct) => {
    Alert.prompt(
      'Update Price',
      `Current price: ₹${product.price}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: (newPrice?: string) => {
            if (newPrice && !isNaN(parseFloat(newPrice))) {
              dispatch(setCatalogProductPrice({ id: product.id, price: parseFloat(newPrice) }));
              Alert.alert('Success', `Price updated to ₹${newPrice}`);
            }
          },
        },
      ],
      'plain-text',
      product.price.toString(),
      'numeric'
    );
  };

  const handleUpdateStock = (product: AdminProduct) => {
    Alert.prompt(
      'Update Stock',
      `Current stock: ${product.stock} units`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: (newStock?: string) => {
            if (newStock && !isNaN(parseInt(newStock, 10))) {
              dispatch(setCatalogProductStock({ id: product.id, stock: parseInt(newStock, 10) }));
              Alert.alert('Success', `Stock updated to ${newStock} units`);
            }
          },
        },
      ],
      'plain-text',
      product.stock.toString(),
      'numeric'
    );
  };

  return (
    <Wrapper>
      <Header>
        <BackBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color="#111827" />
        </BackBtn>
        <HeaderTitle>Product Management</HeaderTitle>
        <AddBtn onPress={() => { resetForm(); setShowAddModal(true); }}>
          <FontAwesome5 name="plus" size={18} color="#ffffff" />
        </AddBtn>
      </Header>

      <SearchContainer>
        <FontAwesome5 name="search" size={14} color="#9CA3AF" />
        <SearchInput
          placeholder="Search by name, code, SKU..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setCurrentPage(1);
          }}
        />
      </SearchContainer>

      <FiltersContainer>
        <FilterRow>
          <FilterLabel>Category:</FilterLabel>
          <FilterScroll horizontal showsHorizontalScrollIndicator={false}>
            <FilterChip
              isActive={categoryFilter === 'all'}
              onPress={() => {
                setCategoryFilter('all');
                setCurrentPage(1);
              }}
            >
              <FilterChipText isActive={categoryFilter === 'all'}>All</FilterChipText>
            </FilterChip>
            {categories.map((cat) => (
              <FilterChip
                key={cat}
                isActive={categoryFilter === cat}
                onPress={() => {
                  setCategoryFilter(cat);
                  setCurrentPage(1);
                }}
              >
                <FilterChipText isActive={categoryFilter === cat}>{cat}</FilterChipText>
              </FilterChip>
            ))}
          </FilterScroll>
        </FilterRow>

        <FilterRow>
          <FilterLabel>Status:</FilterLabel>
          <FilterScroll horizontal showsHorizontalScrollIndicator={false}>
            <FilterChip
              isActive={statusFilter === 'all'}
              onPress={() => {
                setStatusFilter('all');
                setCurrentPage(1);
              }}
            >
              <FilterChipText isActive={statusFilter === 'all'}>All</FilterChipText>
            </FilterChip>
            <FilterChip
              isActive={statusFilter === 'active'}
              onPress={() => {
                setStatusFilter('active');
                setCurrentPage(1);
              }}
            >
              <FilterChipText isActive={statusFilter === 'active'}>Active</FilterChipText>
            </FilterChip>
            <FilterChip
              isActive={statusFilter === 'inactive'}
              onPress={() => {
                setStatusFilter('inactive');
                setCurrentPage(1);
              }}
            >
              <FilterChipText isActive={statusFilter === 'inactive'}>Inactive</FilterChipText>
            </FilterChip>
          </FilterScroll>
        </FilterRow>

        <FilterRow>
          <FilterLabel>Sort:</FilterLabel>
          <SortContainer>
            <SortButton onPress={() => setSortField('date')}>
              <SortButtonText isActive={sortField === 'date'}>Date</SortButtonText>
            </SortButton>
            <SortButton onPress={() => setSortField('name')}>
              <SortButtonText isActive={sortField === 'name'}>Name</SortButtonText>
            </SortButton>
            <SortButton onPress={() => setSortField('price')}>
              <SortButtonText isActive={sortField === 'price'}>Price</SortButtonText>
            </SortButton>
            <SortButton onPress={() => setSortField('stock')}>
              <SortButtonText isActive={sortField === 'stock'}>Stock</SortButtonText>
            </SortButton>
            <OrderToggleButton onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
              <FontAwesome5
                name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                size={12}
                color="#0f8a3c"
              />
            </OrderToggleButton>
          </SortContainer>
        </FilterRow>
      </FiltersContainer>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 8, paddingBottom: 100 }}>
        {sortedProducts.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>
              <FontAwesome5 name="box" size={32} color="#D1D5DB" />
            </EmptyStateIcon>
            <EmptyStateText>No products found</EmptyStateText>
          </EmptyState>
        ) : (
          <>
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id}>
                <ProductImageContainer>
                  {product.images && product.images.length > 0 ? (
                    <ProductImage source={{ uri: product.images[0] }}>
                      <ImageOverlay>
                        {product.images.length > 1 && (
                          <ImageBadge>
                            <ImageBadgeText>+{product.images.length - 1}</ImageBadgeText>
                          </ImageBadge>
                        )}
                      </ImageOverlay>
                    </ProductImage>
                  ) : (
                    <ProductImagePlaceholder>
                      <FontAwesome5 name="image" size={24} color="#9CA3AF" />
                    </ProductImagePlaceholder>
                  )}
                </ProductImageContainer>

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
                    <InfoLabel>Code:</InfoLabel>
                    <InfoValue>{product.productCode || product.sku || 'N/A'}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Category:</InfoLabel>
                    <InfoValue>{product.category}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Material:</InfoLabel>
                    <InfoValue>{product.material || 'N/A'}</InfoValue>
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
                      {product.stock < product.lowStockThreshold && ' (Low!)'}
                    </InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>MOQ:</InfoLabel>
                    <InfoValue>{product.moq} units</InfoValue>
                  </InfoRow>
                </ProductInfo>

                <ProductActions>
                  <ActionBtn onPress={() => handleOpenEdit(product)}>
                    <FontAwesome5 name="edit" size={14} color="#3B82F6" />
                    <ActionText style={{ color: '#3B82F6' }}>Edit</ActionText>
                  </ActionBtn>
                  <ActionBtn onPress={() => handleUpdatePrice(product)}>
                    <FontAwesome5 name="dollar-sign" size={14} color="#0F8A3C" />
                    <ActionText style={{ color: '#0F8A3C' }}>Price</ActionText>
                  </ActionBtn>
                  <ActionBtn onPress={() => handleUpdateStock(product)}>
                    <FontAwesome5 name="boxes" size={14} color="#F59E0B" />
                    <ActionText style={{ color: '#F59E0B' }}>Stock</ActionText>
                  </ActionBtn>
                  <ActionBtn onPress={() => handleToggleStatus(product.id)}>
                    <FontAwesome5
                      name={product.isActive ? 'eye-slash' : 'eye'}
                      size={14}
                      color="#6B7280"
                    />
                    <ActionText style={{ color: '#6B7280' }}>
                      {product.isActive ? 'Disable' : 'Enable'}
                    </ActionText>
                  </ActionBtn>
                  <ActionBtn onPress={() => handleDeleteProduct(product.id)}>
                    <FontAwesome5 name="trash" size={14} color="#EF4444" />
                    <ActionText style={{ color: '#EF4444' }}>Delete</ActionText>
                  </ActionBtn>
                </ProductActions>
              </ProductCard>
            ))}

            {totalPages > 1 && (
              <PaginationContainer>
                <PaginationBtn
                  disabled={currentPage === 1}
                  onPress={() => setCurrentPage(currentPage - 1)}
                >
                  <FontAwesome5 name="chevron-left" size={12} color={currentPage === 1 ? '#D1D5DB' : '#0F8A3C'} />
                </PaginationBtn>

                <PaginationText>
                  Page {currentPage} of {totalPages}
                </PaginationText>

                <PaginationBtn
                  disabled={currentPage === totalPages}
                  onPress={() => setCurrentPage(currentPage + 1)}
                >
                  <FontAwesome5 name="chevron-right" size={12} color={currentPage === totalPages ? '#D1D5DB' : '#0F8A3C'} />
                </PaginationBtn>
              </PaginationContainer>
            )}
          </>
        )}
      </ScrollView>

      <Modal visible={showAddModal} transparent animationType="slide">
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</ModalTitle>
              <CloseBtn onPress={() => { setShowAddModal(false); resetForm(); }}>
                <FontAwesome5 name="times" size={18} color="#111827" />
              </CloseBtn>
            </ModalHeader>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
              <FormGroup>
                <FormLabel>Product Name *</FormLabel>
                <FormInput
                  placeholder="e.g., Stand-Up Pouch"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
                {formErrors.name && <ErrorText>{formErrors.name}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <FormLabel>Category *</FormLabel>
                <FormInput
                  placeholder="e.g., Pouches"
                  value={formData.category}
                  onChangeText={(text) => setFormData({ ...formData, category: text })}
                />
                {formErrors.category && <ErrorText>{formErrors.category}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <FormLabel>Material</FormLabel>
                <FormInput
                  placeholder="e.g., BOPP"
                  value={formData.material}
                  onChangeText={(text) => setFormData({ ...formData, material: text })}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Finish</FormLabel>
                <FormInput
                  placeholder="e.g., Matte, Glossy"
                  value={formData.finish}
                  onChangeText={(text) => setFormData({ ...formData, finish: text })}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Thickness</FormLabel>
                <FormInput
                  placeholder="e.g., 75 micron"
                  value={formData.thickness}
                  onChangeText={(text) => setFormData({ ...formData, thickness: text })}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Size</FormLabel>
                <FormInput
                  placeholder="e.g., 5x8 inch"
                  value={formData.size}
                  onChangeText={(text) => setFormData({ ...formData, size: text })}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Price (₹) *</FormLabel>
                <FormInput
                  placeholder="0.00"
                  value={formData.price}
                  onChangeText={(text) => setFormData({ ...formData, price: text })}
                  keyboardType="decimal-pad"
                />
                {formErrors.price && <ErrorText>{formErrors.price}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <FormLabel>Available Stock</FormLabel>
                <FormInput
                  placeholder="0"
                  value={formData.stock}
                  onChangeText={(text) => setFormData({ ...formData, stock: text })}
                  keyboardType="number-pad"
                />
                {formErrors.stock && <ErrorText>{formErrors.stock}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <FormLabel>Low Stock Threshold</FormLabel>
                <FormInput
                  placeholder="0"
                  value={formData.lowStockThreshold}
                  onChangeText={(text) => setFormData({ ...formData, lowStockThreshold: text })}
                  keyboardType="number-pad"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>MOQ (Minimum Order Qty)</FormLabel>
                <FormInput
                  placeholder="0"
                  value={formData.moq}
                  onChangeText={(text) => setFormData({ ...formData, moq: text })}
                  keyboardType="number-pad"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Product Code</FormLabel>
                <FormInput
                  placeholder="e.g., PC-001"
                  value={formData.productCode}
                  onChangeText={(text) => setFormData({ ...formData, productCode: text })}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>SKU</FormLabel>
                <FormInput
                  placeholder="e.g., SKU-001"
                  value={formData.sku}
                  onChangeText={(text) => setFormData({ ...formData, sku: text })}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Description</FormLabel>
                <FormInput
                  placeholder="Product description..."
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  multiline
                  numberOfLines={4}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Active Status</FormLabel>
                <StatusToggleContainer>
                  <StatusToggleBtn
                    isActive={formData.isActive}
                    onPress={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  >
                    <StatusToggleText isActive={formData.isActive}>
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </StatusToggleText>
                  </StatusToggleBtn>
                </StatusToggleContainer>
              </FormGroup>

              <FormGroup>
                <FormLabel>Images (Mock URLs)</FormLabel>
                <FormInput
                  placeholder="e.g., image1.jpg, image2.jpg"
                  value={formData.images.join(', ')}
                  onChangeText={(text) => setFormData({ ...formData, images: text.split(',').map(s => s.trim()).filter(Boolean) })}
                  multiline
                  numberOfLines={2}
                />
                <InfoNote>Enter comma-separated image URLs or filenames</InfoNote>
              </FormGroup>
            </ScrollView>

            <ModalFooter>
              <CancelBtn onPress={() => { setShowAddModal(false); resetForm(); }}>
                <CancelBtnText>Cancel</CancelBtnText>
              </CancelBtn>
              <SaveBtn onPress={handleSaveProduct}>
                <SaveBtnText>Save Product</SaveBtnText>
              </SaveBtn>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Wrapper>
  );
};

export default AdminProductsScreen;

const Wrapper = styled.View`
  flex: 1;
  background-color: #f8f9fa;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const BackBtn = styled.TouchableOpacity`
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

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  margin: 8px 12px;
  padding: 8px 12px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 12px;
  color: #111827;
  margin-left: 8px;
`;

const FiltersContainer = styled.View`
  background-color: #ffffff;
  padding: 8px 12px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const FilterRow = styled.View`
  margin-bottom: 8px;
`;

const FilterLabel = styled.Text`
  font-size: 10px;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 4px;
`;

const FilterScroll = styled.ScrollView`
  flex-direction: row;
`;

const FilterChip = styled.TouchableOpacity<{ isActive: boolean }>`
  padding: 6px 12px;
  border-radius: 16px;
  margin-right: 8px;
  background-color: ${(props: { isActive: boolean }) => (props.isActive ? '#0f8a3c' : '#f3f4f6')};
  border-width: 1px;
  border-color: ${(props: { isActive: boolean }) => (props.isActive ? '#0f8a3c' : '#e5e7eb')};
`;

const FilterChipText = styled.Text<{ isActive: boolean }>`
  font-size: 10px;
  font-weight: 600;
  color: ${(props: { isActive: boolean }) => (props.isActive ? '#ffffff' : '#6b7280')};
`;

const SortContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const SortButton = styled.TouchableOpacity`
  padding: 5px 10px;
  border-radius: 6px;
  background-color: #f3f4f6;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const SortButtonText = styled.Text<{ isActive: boolean }>`
  font-size: 9px;
  font-weight: 600;
  color: ${(props: { isActive: boolean }) => (props.isActive ? '#0f8a3c' : '#6b7280')};
`;

const OrderToggleButton = styled.TouchableOpacity`
  width: 32px;
  height: 28px;
  border-radius: 6px;
  background-color: #f3f4f6;
  border-width: 1px;
  border-color: #e5e7eb;
  align-items: center;
  justify-content: center;
`;

const ProductCard = styled.View`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 7px;
  border-width: 1px;
  border-color: #e5e7eb;
  shadow-color: rgba(0, 0, 0, 0.04);
  shadow-offset: 0px 1px;
  shadow-opacity: 1;
  shadow-radius: 2;
  elevation: 1;
`;

const ProductImageContainer = styled.View`
  width: 100%;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProductImage = styled.ImageBackground`
  width: 100%;
  height: 100%;
`;

const ProductImagePlaceholder = styled.View`
  width: 100%;
  height: 100%;
  background-color: #f3f4f6;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const ImageOverlay = styled.View`
  position: absolute;
  bottom: 4px;
  right: 4px;
`;

const ImageBadge = styled.View`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 2px 6px;
  border-radius: 4px;
`;

const ImageBadgeText = styled.Text`
  font-size: 8px;
  font-weight: 600;
  color: #ffffff;
`;

const ProductHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const ProductName = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  flex: 1;
`;

const StatusBadge = styled.View<{ isActive: boolean }>`
  padding: 3px 8px;
  border-radius: 6px;
  background-color: ${(props: { isActive: boolean }) => (props.isActive ? '#D1FAE5' : '#FEE2E2')};
`;

const StatusText = styled.Text<{ isActive: boolean }>`
  font-size: 9px;
  font-weight: 700;
  color: ${(props: { isActive: boolean }) => (props.isActive ? '#10B981' : '#EF4444')};
`;

const ProductInfo = styled.View`
  margin-bottom: 8px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 3px;
`;

const InfoLabel = styled.Text`
  font-size: 10px;
  color: #6b7280;
  width: 60px;
  font-weight: 600;
`;

const InfoValue = styled.Text`
  font-size: 10px;
  font-weight: 600;
  color: #111827;
  flex: 1;
`;

const ProductActions = styled.View`
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: #e5e7eb;
  padding-top: 6px;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 3px;
`;

const ActionBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 4px 6px;
  border-radius: 6px;
  background-color: #f3f4f6;
  flex: 1;
  min-width: 45%;
`;

const ActionText = styled.Text`
  font-size: 9px;
  font-weight: 600;
  margin-left: 3px;
`;

const PaginationContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #ffffff;
  border-top-width: 1px;
  border-top-color: #e5e7eb;
`;

const PaginationBtn = styled.TouchableOpacity<{ disabled: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: #f3f4f6;
  align-items: center;
  justify-content: center;
  opacity: ${(props: { disabled: boolean }) => (props.disabled ? 0.5 : 1)};
`;

const PaginationText = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
`;

const EmptyState = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
`;

const EmptyStateIcon = styled.View`
  margin-bottom: 12px;
`;

const EmptyStateText = styled.Text`
  font-size: 14px;
  color: #9CA3AF;
  font-weight: 600;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const ModalContent = styled.View`
  background-color: #ffffff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 0;
  max-height: 90%;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const ModalTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;

const CloseBtn = styled.TouchableOpacity`
  padding: 8px;
`;

const ModalFooter = styled.View`
  flex-direction: row;
  padding: 16px;
  border-top-width: 1px;
  border-top-color: #e5e7eb;
  gap: 12px;
`;

const CancelBtn = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  background-color: #f3f4f6;
  align-items: center;
`;

const CancelBtnText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
`;

const SaveBtn = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  background-color: #0f8a3c;
  align-items: center;
`;

const SaveBtnText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

const FormGroup = styled.View`
  margin-bottom: 16px;
`;

const FormLabel = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
`;

const FormInput = styled.TextInput`
  background-color: #f3f4f6;
  border-width: 1px;
  border-color: #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12px;
  color: #111827;
`;

const ErrorText = styled.Text`
  font-size: 11px;
  color: #ef4444;
  margin-top: 4px;
  font-weight: 600;
`;

const InfoNote = styled.Text`
  font-size: 10px;
  color: #6b7280;
  margin-top: 4px;
  font-style: italic;
`;

const StatusToggleContainer = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const StatusToggleBtn = styled.TouchableOpacity<{ isActive: boolean }>`
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  background-color: ${(props: { isActive: boolean }) => (props.isActive ? '#D1FAE5' : '#FEE2E2')};
  border-width: 1px;
  border-color: ${(props: { isActive: boolean }) => (props.isActive ? '#10B981' : '#EF4444')};
  align-items: center;
`;

const StatusToggleText = styled.Text<{ isActive: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${(props: { isActive: boolean }) => (props.isActive ? '#10B981' : '#EF4444')};
`;

