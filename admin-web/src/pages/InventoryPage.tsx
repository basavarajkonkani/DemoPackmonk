import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { useAppSelector, useAppDispatch, RootState } from '../store';
import { adjustStock, addInventoryItem, deleteInventoryItem } from '../store/slices/inventorySlice';

const EMPTY_FORM = { productId: '', productName: '', quantity: 0, reorderLevel: 50, location: '' };

const InventoryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const inventory = useAppSelector((state: RootState) => state.inventory.items);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleAdjust = (id: string, delta: number) => {
    dispatch(adjustStock({ id, delta }));
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Remove "${name}" from inventory?`)) {
      dispatch(deleteInventoryItem(id));
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productName.trim()) {
      alert('Product name is required');
      return;
    }
    dispatch(
      addInventoryItem({
        productId: form.productId.trim() || `prod_${Date.now()}`,
        productName: form.productName.trim(),
        quantity: form.quantity,
        reorderLevel: form.reorderLevel,
        location: form.location.trim() || 'Unassigned',
        lastRestockDate: new Date().toISOString().split('T')[0],
      })
    );
    setShowAddModal(false);
    setForm(EMPTY_FORM);
  };

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitle>Inventory Management</PageTitle>
          <AddBtn onClick={() => setShowAddModal(true)}>+ Add Inventory Item</AddBtn>
        </PageHeader>

        {showAddModal && (
          <FormOverlay onClick={() => setShowAddModal(false)}>
            <FormContainer onClick={(e) => e.stopPropagation()}>
              <FormTitle>Add Inventory Item</FormTitle>
              <Form onSubmit={handleAddItem}>
                <FormGroup>
                  <Label>Product Name *</Label>
                  <Input
                    value={form.productName}
                    onChange={(e) => setForm({ ...form, productName: e.target.value })}
                    placeholder="e.g., Zipper Pouch - Large"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Initial Quantity</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Reorder Level</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.reorderLevel}
                    onChange={(e) => setForm({ ...form, reorderLevel: Number(e.target.value) })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Location</Label>
                  <Input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g., Rack A1"
                  />
                </FormGroup>
                <FormButtons>
                  <SubmitBtn type="submit">Add Item</SubmitBtn>
                  <CancelBtn type="button" onClick={() => setShowAddModal(false)}>Cancel</CancelBtn>
                </FormButtons>
              </Form>
            </FormContainer>
          </FormOverlay>
        )}

        <TableCard>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Product</TableHeader>
                <TableHeader>Quantity</TableHeader>
                <TableHeader>Reorder Level</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Location</TableHeader>
                <TableHeader>Last Restock</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} style={{ textAlign: 'center', color: '#9CA3AF', padding: '40px' }}>
                    No inventory items yet.
                  </TableCell>
                </TableRow>
              ) : (
                inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.reorderLevel}</TableCell>
                    <StatusCell status={item.status}>{item.status.replace('_', ' ')}</StatusCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{new Date(item.lastRestockDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <ActionRow>
                        <IconBtn onClick={() => handleAdjust(item.id, -10)} title="Remove 10 units">−</IconBtn>
                        <IconBtn onClick={() => handleAdjust(item.id, 10)} title="Add 10 units">+</IconBtn>
                        <IconBtn danger onClick={() => handleDelete(item.id, item.productName)} title="Remove item">
                          ×
                        </IconBtn>
                      </ActionRow>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableCard>
      </PageContainer>
    </Layout>
  );
};

export default InventoryPage;

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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
  max-width: 420px;
  width: 90%;
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const FormButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
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

const TableCard = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #F9FAFB;
  border-bottom: 2px solid #E5E7EB;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #E5E7EB;

  &:hover {
    background-color: #F9FAFB;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: #6B7280;
  text-transform: uppercase;
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: #111827;
`;

const StatusCell = styled(TableCell)<{ status: string }>`
  font-weight: 600;
  color: ${({ status }) => {
    if (status === 'in_stock') return '#0F8A3C';
    if (status === 'low_stock') return '#D97706';
    return '#EF4444';
  }};
`;

const ActionRow = styled.div`
  display: flex;
  gap: 6px;
`;

const IconBtn = styled.button<{ danger?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid ${({ danger }) => (danger ? '#FECACA' : '#E5E7EB')};
  background-color: ${({ danger }) => (danger ? '#FEE2E2' : '#F9FAFB')};
  color: ${({ danger }) => (danger ? '#DC2626' : '#111827')};
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }
`;
