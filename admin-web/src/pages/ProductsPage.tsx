import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import ImageUpload from '../components/ImageUpload';
import { useAppSelector, useAppDispatch } from '../store';
import { addProduct, updateProduct, deleteProduct } from '../store/slices/productsSlice';
import { Product, ProductImage } from '../types';

interface FormData {
  name: string;
  category: string;
  material: string;
  size: string;
  thickness: string;
  zipperType: string;
  price: number | '';
  stock: number | '';
  lowStockThreshold: number | '';
  description: string;
}

const ProductsPage: React.FC = () => {
  const products = useAppSelector((state) => state.products.items);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: 'bag',
    material: '',
    size: '',
    thickness: '',
    zipperType: '',
    price: '',
    stock: '',
    lowStockThreshold: '',
    description: '',
  });
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = () => {
    setFormData({
      name: '',
      category: 'bag',
      material: '',
      size: '',
      thickness: '',
      zipperType: '',
      price: '',
      stock: '',
      lowStockThreshold: '',
      description: '',
    });
    setProductImages([]);
    setEditingProductId(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditClick = (product: Product) => {
    setFormData({
      name: product.name,
      category: product.category,
      material: product.material,
      size: product.size,
      thickness: product.thickness,
      zipperType: product.zipperType || '',
      price: product.price,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      description: product.description,
    });
    setProductImages(product.images || []);
    setEditingProductId(product.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete));
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const handleImageError = (productId: string) => {
    setFailedImages((prev) => new Set([...prev, productId]));
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'lowStockThreshold'
        ? value === '' ? '' : Number(value)
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.stock) {
      alert('Please fill in all required fields');
      return;
    }

    if (productImages.length === 0) {
      alert('Please upload at least one product image');
      return;
    }

    const primaryImage = productImages.find((img) => img.isPrimary);
    if (!primaryImage) {
      alert('Please set a primary image');
      return;
    }

    if (isEditing && editingProductId) {
      const updatedProduct: Product = {
        id: editingProductId,
        name: formData.name,
        category: formData.category,
        material: formData.material,
        size: formData.size,
        thickness: formData.thickness,
        zipperType: formData.zipperType || undefined,
        price: Number(formData.price),
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        imageUrl: primaryImage.url, // Use primary image as main URL
        images: productImages,
        description: formData.description,
        isActive: true,
        createdAt: products.find((p) => p.id === editingProductId)?.createdAt || new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      dispatch(updateProduct(updatedProduct));
    } else {
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        name: formData.name,
        category: formData.category,
        material: formData.material,
        size: formData.size,
        thickness: formData.thickness,
        zipperType: formData.zipperType || undefined,
        price: Number(formData.price),
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        imageUrl: primaryImage.url, // Use primary image as main URL
        images: productImages,
        description: formData.description,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      dispatch(addProduct(newProduct));
    }

    setShowModal(false);
    setIsEditing(false);
    setEditingProductId(null);
    setProductImages([]);
  };

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitle>Products Management</PageTitle>
          <HeaderActions>
            <SearchBox>
              <SearchInput
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBox>
            <AddBtn onClick={handleAddClick}>+ Add Product</AddBtn>
          </HeaderActions>
        </PageHeader>

        <ProductGrid>
          {filtered.map((product) => (
            <ProductCard key={product.id}>
              <ProductImageWrapper>
                {failedImages.has(product.id) ? (
                  <FallbackImage>📦</FallbackImage>
                ) : (
                  <ProductImageImg
                    src={product.imageUrl}
                    alt={product.name}
                    onError={() => handleImageError(product.id)}
                  />
                )}
              </ProductImageWrapper>
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductCategory>{product.category}</ProductCategory>
                <ProductDetails>
                  <DetailItem>Size: {product.size}</DetailItem>
                  <DetailItem>Stock: {product.stock}</DetailItem>
                </ProductDetails>
                <ProductFooter>
                  <Price>₹{product.price}</Price>
                  <Actions>
                    <ActionBtn edit onClick={() => handleEditClick(product)}>
                      Edit
                    </ActionBtn>
                    <ActionBtn onClick={() => handleDeleteClick(product.id)}>
                      Delete
                    </ActionBtn>
                  </Actions>
                </ProductFooter>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>

        {filtered.length === 0 && (
          <EmptyState>
            <EmptyIcon>📦</EmptyIcon>
            <EmptyTitle>No products found</EmptyTitle>
            <EmptyDesc>Try adjusting your search or add a new product.</EmptyDesc>
          </EmptyState>
        )}
      </PageContainer>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</ModalTitle>
              <CloseBtn onClick={() => setShowModal(false)}>×</CloseBtn>
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <Label>Product Name *</Label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g., Zipper Pouch - Small"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Category *</Label>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="bag">Bag</option>
                    <option value="box">Box</option>
                    <option value="mailer">Mailer</option>
                    <option value="tape">Tape</option>
                    <option value="other">Other</option>
                  </Select>
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>Material *</Label>
                  <Input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleFormChange}
                    placeholder="e.g., LDPE/HDPE"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Size *</Label>
                  <Input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleFormChange}
                    placeholder="e.g., 5x7 inches"
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>Thickness *</Label>
                  <Input
                    type="text"
                    name="thickness"
                    value={formData.thickness}
                    onChange={handleFormChange}
                    placeholder="e.g., 2 mil"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Zipper Type</Label>
                  <Input
                    type="text"
                    name="zipperType"
                    value={formData.zipperType}
                    onChange={handleFormChange}
                    placeholder="e.g., Slider Lock (optional)"
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>Price (₹) *</Label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="0"
                    required
                    step="0.01"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Stock Quantity *</Label>
                  <Input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleFormChange}
                    placeholder="0"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Low Stock Threshold *</Label>
                  <Input
                    type="number"
                    name="lowStockThreshold"
                    value={formData.lowStockThreshold}
                    onChange={handleFormChange}
                    placeholder="0"
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <ImageUpload
                  images={productImages}
                  onImagesChange={setProductImages}
                  maxImages={10}
                  context="product"
                />
              </FormGroup>

              <FormGroup>
                <Label>Description *</Label>
                <TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Product description..."
                  required
                  rows={3}
                />
              </FormGroup>

              <ButtonGroup>
                <CancelBtn type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </CancelBtn>
                <SubmitBtn type="submit">
                  {isEditing ? 'Update Product' : 'Add Product'}
                </SubmitBtn>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ModalOverlay onClick={() => setShowDeleteModal(false)}>
          <ConfirmModalContent onClick={(e) => e.stopPropagation()}>
            <ConfirmIcon>⚠️</ConfirmIcon>
            <ConfirmTitle>Delete Product?</ConfirmTitle>
            <ConfirmDesc>
              Are you sure you want to delete this product? This action cannot be undone.
            </ConfirmDesc>
            <ConfirmButtonGroup>
              <CancelBtn onClick={() => setShowDeleteModal(false)}>
                Keep Product
              </CancelBtn>
              <DeleteConfirmBtn onClick={handleConfirmDelete}>
                Delete Product
              </DeleteConfirmBtn>
            </ConfirmButtonGroup>
          </ConfirmModalContent>
        </ModalOverlay>
      )}
    </Layout>
  );
};

export default ProductsPage;

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 10px 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  width: 240px;

  &:focus {
    outline: none;
    border-color: #0F8A3C;
    box-shadow: 0 0 0 3px rgba(15, 138, 60, 0.1);
  }
`;

const AddBtn = styled.button`
  padding: 10px 20px;
  background-color: #0F8A3C;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background-color: #0D7A35;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
`;

const ProductCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
  transition: all 150ms ease;

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }
`;

const ProductImageWrapper = styled.div`
  width: 100%;
  height: 180px;
  background-color: #F9FAFB;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
`;

const ProductImageImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #F9FAFB;
`;

const FallbackImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: white;
`;

const ProductInfo = styled.div`
  padding: 16px;
`;

const ProductName = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px;
  line-height: 1.3;
`;

const ProductCategory = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: #0F8A3C;
  background-color: #DCFCE7;
  padding: 3px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const ProductDetails = styled.div`
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 12px;
`;

const DetailItem = styled.div`
  margin-bottom: 2px;
`;

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #E5E7EB;
  padding-top: 12px;
`;

const Price = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: #0F8A3C;
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
`;

const ActionBtn = styled.button<{ edit?: boolean }>`
  padding: 6px 12px;
  background-color: ${({ edit }) => (edit ? '#DCFCE7' : '#FEE2E2')};
  color: ${({ edit }) => (edit ? '#0F8A3C' : '#DC2626')};
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    opacity: 0.8;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #F9FAFB;
  border-radius: 12px;
  border: 1px dashed #E5E7EB;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px;
`;

const EmptyDesc = styled.p`
  font-size: 14px;
  color: #6B7280;
  margin: 0;
`;

/* ─── Modal Styles ──────────────────────────────────────────────────── */

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #E5E7EB;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  color: #6B7280;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #111827;
  }
`;

const Form = styled.form`
  padding: 24px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  transition: all 150ms ease;

  &:focus {
    outline: none;
    border-color: #0F8A3C;
    box-shadow: 0 0 0 3px rgba(15, 138, 60, 0.1);
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  transition: all 150ms ease;
  background-color: #FFFFFF;

  &:focus {
    outline: none;
    border-color: #0F8A3C;
    box-shadow: 0 0 0 3px rgba(15, 138, 60, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: all 150ms ease;

  &:focus {
    outline: none;
    border-color: #0F8A3C;
    box-shadow: 0 0 0 3px rgba(15, 138, 60, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const SubmitBtn = styled.button`
  padding: 10px 24px;
  background-color: #0F8A3C;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background-color: #0D7A35;
  }
`;

const CancelBtn = styled.button`
  padding: 10px 24px;
  background-color: #E5E7EB;
  color: #111827;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background-color: #D1D5DB;
  }
`;

/* ─── Delete Confirmation Modal ──────────────────────────────────────── */

const ConfirmModalContent = styled(ModalContent)`
  max-width: 400px;
  text-align: center;
`;

const ConfirmIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  padding-top: 24px;
`;

const ConfirmTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px;
`;

const ConfirmDesc = styled.p`
  font-size: 14px;
  color: #6B7280;
  margin: 0 0 24px;
  line-height: 1.6;
`;

const ConfirmButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 24px;
`;

const DeleteConfirmBtn = styled.button`
  padding: 10px 24px;
  background-color: #DC2626;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background-color: #B91C1C;
  }
`;

const InfoText = styled.p`
  font-size: 12px;
  color: #6B7280;
  margin: 6px 0 0;
  font-style: italic;
  line-height: 1.4;
`;

const ImagePreviewContainer = styled.div`
  margin-top: 12px;
  padding: 12px;
  background-color: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
`;

const ImagePreviewLabel = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
  margin: 0 0 8px;
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 6px;
  background-color: #FFFFFF;
`;

const SuggestionBox = styled.div`
  background-color: #FEF3C7;
  border: 1px solid #FCD34D;
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
`;

const SuggestionTitle = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: #92400E;
  margin: 0 0 6px;
`;

const SuggestionText = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #B45309;
  margin: 0 0 6px;
`;

const SuggestionList = styled.ul`
  font-size: 12px;
  color: #92400E;
  margin: 0;
  padding-left: 16px;

  li {
    margin-bottom: 4px;
    line-height: 1.4;

    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: #78350F;
  }
`;
