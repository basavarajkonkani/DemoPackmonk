import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { useAppSelector, useAppDispatch } from '../store';
import { addBanner, updateBanner, deleteBanner } from '../store/slices/bannersSlice';
import { Banner } from '../types';

const BannersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const banners = useAppSelector((state) => state.banners.items);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    imageUrl: string;
    linkUrl: string;
    displayLocation: 'home' | 'products' | 'checkout';
    isActive: boolean;
    startDate: string;
    endDate: string;
  }>({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    displayLocation: 'home',
    isActive: true,
    startDate: '',
    endDate: '',
  });

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      displayLocation: 'home',
      isActive: true,
      startDate: '',
      endDate: '',
    });
    setShowForm(true);
  };

  const handleEditClick = (banner: Banner) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || '',
      displayLocation: banner.displayLocation,
      isActive: banner.isActive,
      startDate: banner.startDate,
      endDate: banner.endDate,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.imageUrl) {
      alert('Please fill in title and image URL');
      return;
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      alert('Start date must be before end date');
      return;
    }

    if (editingId) {
      const existing = banners.find((b) => b.id === editingId);
      if (existing) {
        dispatch(updateBanner({ ...existing, ...formData }));
      }
    } else {
      dispatch(addBanner(formData));
    }

    setShowForm(false);
  };

  const handleDeleteClick = (bannerId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this banner?');
    if (confirmed) {
      dispatch(deleteBanner(bannerId));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitle>Banner Management</PageTitle>
          <AddBtn onClick={handleAddClick}>+ Add Banner</AddBtn>
        </PageHeader>

        {showForm && (
          <FormOverlay onClick={handleCancel}>
            <FormContainer onClick={(e) => e.stopPropagation()}>
              <FormTitle>{editingId ? 'Edit Banner' : 'Add New Banner'}</FormTitle>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Title *</Label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter banner title"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Description</Label>
                  <TextArea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter banner description"
                    rows={3}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Image URL *</Label>
                  <Input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Link URL</Label>
                  <Input
                    type="text"
                    name="linkUrl"
                    value={formData.linkUrl}
                    onChange={handleInputChange}
                    placeholder="/products?sale=true"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Display Location</Label>
                  <Select name="displayLocation" value={formData.displayLocation} onChange={handleInputChange}>
                    <option value="home">Home</option>
                    <option value="products">Products</option>
                    <option value="checkout">Checkout</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup checkbox>
                  <CheckboxInput
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <Label>Active</Label>
                </FormGroup>

                <FormButtons>
                  <SubmitBtn type="submit">{editingId ? 'Update Banner' : 'Add Banner'}</SubmitBtn>
                  <CancelBtn type="button" onClick={handleCancel}>Cancel</CancelBtn>
                </FormButtons>
              </Form>
            </FormContainer>
          </FormOverlay>
        )}

        <Grid>
          {banners.map((banner) => (
            <BannerCard key={banner.id}>
              <BannerImage src={banner.imageUrl} alt={banner.title} />
              <BannerContent>
                <BannerTitle>{banner.title}</BannerTitle>
                <BannerDesc>{banner.description}</BannerDesc>
                <BannerMeta>
                  <Badge active={banner.isActive}>{banner.isActive ? 'Active' : 'Inactive'}</Badge>
                  <Location>{banner.displayLocation}</Location>
                </BannerMeta>
                <Actions>
                  <ActionBtn onClick={() => handleEditClick(banner)}>Edit</ActionBtn>
                  <ActionBtn danger onClick={() => handleDeleteClick(banner.id)}>Delete</ActionBtn>
                </Actions>
              </BannerContent>
            </BannerCard>
          ))}
        </Grid>

        {banners.length === 0 && (
          <EmptyState>
            <EmptyIcon>🎨</EmptyIcon>
            <EmptyText>No banners yet. Click "Add Banner" to create one.</EmptyText>
          </EmptyState>
        )}
      </PageContainer>
    </Layout>
  );
};

export default BannersPage;

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

const AddBtn = styled.button`
  padding: 10px 20px;
  background-color: #0F8A3C;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #0D7A35;
  }
`;

const FormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
`;

const FormTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div<{ checkbox?: boolean }>`
  display: flex;
  flex-direction: ${({ checkbox }) => (checkbox ? 'row' : 'column')};
  gap: ${({ checkbox }) => (checkbox ? '8px' : '8px')};
  align-items: ${({ checkbox }) => (checkbox ? 'center' : 'flex-start')};
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #0F8A3C;
    box-shadow: 0 0 0 3px rgba(15, 138, 60, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #0F8A3C;
    box-shadow: 0 0 0 3px rgba(15, 138, 60, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #0F8A3C;
    box-shadow: 0 0 0 3px rgba(15, 138, 60, 0.1);
  }
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const FormButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const SubmitBtn = styled.button`
  flex: 1;
  padding: 12px 16px;
  background-color: #0F8A3C;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #0D7A35;
  }
`;

const CancelBtn = styled.button`
  flex: 1;
  padding: 12px 16px;
  background-color: #E5E7EB;
  color: #111827;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #D1D5DB;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const BannerCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const BannerImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const BannerContent = styled.div`
  padding: 16px;
`;

const BannerTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px;
`;

const BannerDesc = styled.p`
  font-size: 13px;
  color: #6B7280;
  margin: 0 0 12px;
`;

const BannerMeta = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const Badge = styled.span<{ active: boolean }>`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  background-color: ${({ active }) => (active ? '#DCFCE7' : '#FEE2E2')};
  color: ${({ active }) => (active ? '#0F8A3C' : '#DC2626')};
`;

const Location = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  background-color: #DBEAFE;
  color: #0284C7;
  text-transform: capitalize;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  border-top: 1px solid #E5E7EB;
  padding-top: 12px;
`;

const ActionBtn = styled.button<{ danger?: boolean }>`
  flex: 1;
  padding: 8px 12px;
  background-color: ${({ danger }) => (danger ? '#FEE2E2' : '#DCFCE7')};
  color: ${({ danger }) => (danger ? '#DC2626' : '#0F8A3C')};
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

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

const EmptyText = styled.p`
  font-size: 16px;
  color: #6B7280;
  margin: 0;
`;
