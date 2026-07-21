import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { useAppSelector, useAppDispatch } from '../store';
import { addPricingRule, updatePricingRule, deletePricingRule } from '../store/slices/pricingSlice';
import { PricingRule } from '../types';

const EMPTY_FORM: Omit<PricingRule, 'id' | 'createdAt'> = {
  name: '',
  description: '',
  type: 'percentage',
  value: 0,
  minQuantity: 1,
  maxQuantity: undefined,
  applicableProducts: [],
  isActive: true,
};

const PricingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const rules = useAppSelector((state) => state.pricing.rules);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const openAdd = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (rule: PricingRule) => {
    setEditingId(rule.id);
    setFormData({
      name: rule.name,
      description: rule.description,
      type: rule.type,
      value: rule.value,
      minQuantity: rule.minQuantity,
      maxQuantity: rule.maxQuantity,
      applicableProducts: rule.applicableProducts,
      isActive: rule.isActive,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.value <= 0) {
      alert('Please provide a rule name and a positive value');
      return;
    }

    if (editingId) {
      const existing = rules.find((r) => r.id === editingId);
      if (existing) {
        dispatch(updatePricingRule({ ...existing, ...formData }));
      }
    } else {
      dispatch(addPricingRule(formData));
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this pricing rule?')) {
      dispatch(deletePricingRule(id));
    }
  };

  const toggleActive = (rule: PricingRule) => {
    dispatch(updatePricingRule({ ...rule, isActive: !rule.isActive }));
  };

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitle>Pricing Management</PageTitle>
          <AddBtn onClick={openAdd}>+ Add Pricing Rule</AddBtn>
        </PageHeader>

        {showForm && (
          <FormOverlay onClick={() => setShowForm(false)}>
            <FormContainer onClick={(e) => e.stopPropagation()}>
              <FormTitle>{editingId ? 'Edit Pricing Rule' : 'New Pricing Rule'}</FormTitle>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Rule Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Bulk Discount 1000+"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Description</Label>
                  <TextArea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Explain when this rule applies"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Discount Type</Label>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Value *</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Minimum Quantity</Label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.minQuantity}
                    onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
                  />
                </FormGroup>
                <FormGroup checkbox>
                  <CheckboxInput
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <Label>Active</Label>
                </FormGroup>
                <FormButtons>
                  <SubmitBtn type="submit">{editingId ? 'Save Changes' : 'Create Rule'}</SubmitBtn>
                  <CancelBtn type="button" onClick={() => setShowForm(false)}>Cancel</CancelBtn>
                </FormButtons>
              </Form>
            </FormContainer>
          </FormOverlay>
        )}

        {rules.length === 0 ? (
          <EmptyState>
            <EmptyIcon>💰</EmptyIcon>
            <EmptyText>No pricing rules yet. Click "Add Pricing Rule" to create one.</EmptyText>
          </EmptyState>
        ) : (
          <RulesList>
            {rules.map((rule) => (
              <RuleCard key={rule.id}>
                <RuleHeader>
                  <RuleName>{rule.name}</RuleName>
                  <Badge active={rule.isActive} onClick={() => toggleActive(rule)}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </RuleHeader>
                <RuleDesc>{rule.description}</RuleDesc>
                <RuleMeta>
                  <MetaChip>
                    {rule.type === 'percentage' ? `${rule.value}% off` : `₹${rule.value} flat`}
                  </MetaChip>
                  <MetaChip>Min qty: {rule.minQuantity}</MetaChip>
                </RuleMeta>
                <Actions>
                  <ActionBtn onClick={() => openEdit(rule)}>Edit</ActionBtn>
                  <ActionBtn danger onClick={() => handleDelete(rule.id)}>Delete</ActionBtn>
                </Actions>
              </RuleCard>
            ))}
          </RulesList>
        )}
      </PageContainer>
    </Layout>
  );
};

export default PricingPage;

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
  max-width: 480px;
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
  gap: 8px;
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

const RulesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const RuleCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 20px;

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
`;

const RuleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 8px;
`;

const RuleName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const RuleDesc = styled.p`
  font-size: 13px;
  color: #6B7280;
  margin: 0 0 12px;
  line-height: 1.5;
`;

const RuleMeta = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const MetaChip = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  background-color: #F3F4F6;
  color: #374151;
`;

const Badge = styled.span<{ active: boolean }>`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  background-color: ${({ active }) => (active ? '#DCFCE7' : '#FEE2E2')};
  color: ${({ active }) => (active ? '#0F8A3C' : '#DC2626')};
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
