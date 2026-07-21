import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { useAppSelector, useAppDispatch, RootState } from '../store';
import { addCustomer } from '../store/slices/customersSlice';

const EMPTY_FORM = { name: '', email: '', phone: '', companyName: '' };

const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const customers = useAppSelector((state: RootState) => state.customers.items);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleViewDetails = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      alert('Name and email are required');
      return;
    }
    dispatch(
      addCustomer({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        companyName: form.companyName.trim() || undefined,
        customerType: 'business',
        accountStatus: 'active',
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        preferredPaymentMethod: 'bank_transfer',
        isActive: true,
        addresses: [],
      })
    );
    setShowAddModal(false);
    setForm(EMPTY_FORM);
  };

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitle>Customers Management</PageTitle>
          <AddBtn onClick={() => setShowAddModal(true)}>+ Add Customer</AddBtn>
        </PageHeader>

        {showAddModal && (
          <FormOverlay onClick={() => setShowAddModal(false)}>
            <FormContainer onClick={(e) => e.stopPropagation()}>
              <FormTitle>Add Customer</FormTitle>
              <Form onSubmit={handleCreateCustomer}>
                <FormGroup>
                  <FormLabel>Name *</FormLabel>
                  <FormInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Company Name</FormLabel>
                  <FormInput value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Email *</FormLabel>
                  <FormInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Phone</FormLabel>
                  <FormInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </FormGroup>
                <FormButtons>
                  <SubmitBtn type="submit">Create Customer</SubmitBtn>
                  <CancelBtn type="button" onClick={() => setShowAddModal(false)}>Cancel</CancelBtn>
                </FormButtons>
              </Form>
            </FormContainer>
          </FormOverlay>
        )}

        {customers.length === 0 && (
          <EmptyState>
            <EmptyIcon>👥</EmptyIcon>
            <EmptyText>No customers yet. Click "Add Customer" to create one.</EmptyText>
          </EmptyState>
        )}

        <Grid>
          {customers.map((customer) => (
            <Card key={customer.id}>
              <CardHeader>
                <Avatar>{customer.name.charAt(0)}</Avatar>
                <Info>
                  <Name>{customer.name}</Name>
                  <Email>{customer.email}</Email>
                </Info>
              </CardHeader>
              <CardBody>
                <Item><Label>Phone:</Label> <Value>{customer.phone}</Value></Item>
                <Item><Label>Orders:</Label> <Value>{customer.totalOrders}</Value></Item>
                <Item><Label>Total Spent:</Label> <Value>₹{(customer.totalSpent / 1000).toFixed(1)}K</Value></Item>
              </CardBody>
              <CardFooter>
                <ViewBtn onClick={() => handleViewDetails(customer.id)}>View Details</ViewBtn>
              </CardFooter>
            </Card>
          ))}
        </Grid>
      </PageContainer>
    </Layout>
  );
};

export default CustomersPage;

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
  top: 0; left: 0; right: 0; bottom: 0;
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

const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

const FormInput = styled.input`
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
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

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #E5E7EB;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #0F8A3C;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
`;

const Info = styled.div`
  flex: 1;
`;

const Name = styled.div`
  font-weight: 700;
  color: #111827;
  font-size: 14px;
`;

const Email = styled.div`
  font-size: 12px;
  color: #6B7280;
`;

const CardBody = styled.div`
  padding: 16px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  color: #6B7280;
  font-weight: 600;
`;

const Value = styled.span`
  color: #111827;
  font-weight: 700;
`;

const CardFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #E5E7EB;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #F9FAFB;
  border-radius: 12px;
  border: 1px dashed #E5E7EB;
  margin-bottom: 20px;
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

const ViewBtn = styled.button`
  width: 100%;
  padding: 8px 12px;
  background-color: #0F8A3C;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #0D7A35;
  }
`;
