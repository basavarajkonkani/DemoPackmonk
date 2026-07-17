import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { useAppSelector, useAppDispatch } from '../store';
import { updateOrderStatus, updateProductionStage, addOrderNote } from '../store/slices/ordersSlice';
import { OrderStatus, ProductionStage, OrderNote } from '../types';

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const order = useAppSelector((state: any) => state.orders.items.find((o: any) => o.id === orderId));
  const [newNote, setNewNote] = useState('');

  if (!order) {
    return (
      <Layout>
        <Container>
          <BackBtn onClick={() => navigate('/orders')}>← Back</BackBtn>
          <Error>Order not found</Error>
        </Container>
      </Layout>
    );
  }

  const handleStatusChange = (newStatus: OrderStatus) => {
    dispatch(updateOrderStatus({ orderId: order.id, status: newStatus }));
  };

  const handleStageChange = (stage: ProductionStage) => {
    dispatch(updateProductionStage({ orderId: order.id, stage }));
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: OrderNote = {
        id: `note_${Date.now()}`,
        content: newNote,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        isInternal: true,
      };
      dispatch(addOrderNote({ orderId: order.id, note }));
      setNewNote('');
    }
  };

  return (
    <Layout>
      <Container>
        <BackBtn onClick={() => navigate('/orders')}>← Back to Orders</BackBtn>
        <Header>
          <div>
            <Title>{order.id}</Title>
            <Subtitle>{order.customerName} • {new Date(order.orderDate).toLocaleDateString()}</Subtitle>
          </div>
          <Amount>₹{order.totalAmount.toLocaleString()}</Amount>
        </Header>

        <Section>
          <SectionTitle>Customer Details</SectionTitle>
          <Grid>
            <Item><Label>Name</Label><Value>{order.customerName}</Value></Item>
            <Item><Label>Company</Label><Value>{order.companyName || 'N/A'}</Value></Item>
            <Item><Label>GST</Label><Value>{order.gstNumber || 'N/A'}</Value></Item>
            <Item><Label>Email</Label><Value>{order.customerEmail}</Value></Item>
            <Item><Label>Phone</Label><Value>{order.contactDetails?.phone || 'N/A'}</Value></Item>
            <Item><Label>Contact Person</Label><Value>{order.contactDetails?.contactPerson || 'N/A'}</Value></Item>
          </Grid>
          <AddressGrid>
            <AddressBox>
              <AddressTitle>Shipping</AddressTitle>
              <AddressText>{order.shippingAddress}</AddressText>
            </AddressBox>
            <AddressBox>
              <AddressTitle>Billing</AddressTitle>
              <AddressText>{order.billingAddress || order.shippingAddress}</AddressText>
            </AddressBox>
          </AddressGrid>
        </Section>

        <Section>
          <SectionTitle>Products</SectionTitle>
          {order.items.map((item: any, i: number) => (
            <ProductCard key={i}>
              {item.imageUrl && <ProductImg src={item.imageUrl} alt={item.productName} />}
              <ProductInfo>
                <ProductName>{item.productName}</ProductName>
                <ProductMeta>
                  {item.material && <span>Material: {item.material}</span>}
                  {item.finish && <span>Finish: {item.finish}</span>}
                  {item.size && <span>Size: {item.size}</span>}
                </ProductMeta>
                <ProductPricing>
                  <span>Qty: {item.quantity} × ₹{item.unitPrice}</span>
                  <Price>₹{(item.totalPrice || item.quantity * item.unitPrice).toLocaleString()}</Price>
                </ProductPricing>
              </ProductInfo>
            </ProductCard>
          ))}
        </Section>

        <Section>
          <SectionTitle>Payment Summary</SectionTitle>
          <PaymentTable>
            <PaymentRow>
              <PaymentLabel>Subtotal</PaymentLabel>
              <PaymentValue>₹{order.subtotal?.toLocaleString() || order.totalAmount.toLocaleString()}</PaymentValue>
            </PaymentRow>
            <PaymentRow>
              <PaymentLabel>GST (18%)</PaymentLabel>
              <PaymentValue>₹{order.gstAmount?.toLocaleString() || '0'}</PaymentValue>
            </PaymentRow>
            <PaymentRow>
              <PaymentLabel>Shipping</PaymentLabel>
              <PaymentValue>₹{order.shippingCharges?.toLocaleString() || '0'}</PaymentValue>
            </PaymentRow>
            <PaymentRowTotal>
              <PaymentLabel>Total</PaymentLabel>
              <TotalValue>₹{order.totalAmount.toLocaleString()}</TotalValue>
            </PaymentRowTotal>
          </PaymentTable>
          <PaymentInfo>
            <PaymentDetail>
              <Label>Payment Method</Label>
              <Value>{order.paymentMethod?.replace('_', ' ').toUpperCase()}</Value>
            </PaymentDetail>
            <PaymentDetail>
              <Label>Payment Status</Label>
              <Badge status={order.paymentStatus}>{order.paymentStatus.toUpperCase()}</Badge>
            </PaymentDetail>
          </PaymentInfo>
        </Section>

        <Section>
          <SectionTitle>Order Status</SectionTitle>
          <ControlGroup>
            <Label>Update Status</Label>
            <Select value={order.status} onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}>
              <option value="pending_review">Pending Review</option>
              <option value="artwork_approved">Artwork Approved</option>
              <option value="in_production">In Production</option>
              <option value="quality_check">Quality Check</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </ControlGroup>
        </Section>

        <Section>
          <SectionTitle>Production Stage</SectionTitle>
          <ControlGroup>
            <Label>Production</Label>
            <Select value={order.productionStage} onChange={(e) => handleStageChange(e.target.value as ProductionStage)}>
              <option value="received">Received</option>
              <option value="artwork_review">Artwork Review</option>
              <option value="artwork_approved">Artwork Approved</option>
              <option value="cylinder_making">Cylinder Making</option>
              <option value="printing">Printing</option>
              <option value="lamination">Lamination</option>
              <option value="cutting">Cutting</option>
              <option value="packing">Packing</option>
              <option value="dispatch">Dispatch</option>
              <option value="delivered">Delivered</option>
            </Select>
          </ControlGroup>
        </Section>

        <Section>
          <SectionTitle>Internal Notes</SectionTitle>
          <NoteBox>
            <TextArea placeholder="Add a note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} rows={3} />
            <NoteBtn onClick={handleAddNote}>Add Note</NoteBtn>
          </NoteBox>
          {order.notes && order.notes.length > 0 && (
            <NotesList>
              {order.notes.map((note: any) => (
                <NoteItem key={note.id}>
                  <NoteTime>{new Date(note.createdAt).toLocaleDateString()}</NoteTime>
                  <NoteText>{note.content}</NoteText>
                </NoteItem>
              ))}
            </NotesList>
          )}
        </Section>
      </Container>
    </Layout>
  );
};

export default OrderDetailsPage;

const Container = styled.div`max-width: 1200px; margin: 0 auto; padding: 20px;`;
const BackBtn = styled.button`background: none; border: none; color: #0284C7; cursor: pointer; font-weight: 600; margin-bottom: 20px;`;
const Header = styled.div`display: flex; justify-content: space-between; align-items: center; background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; margin-bottom: 24px;`;
const Title = styled.h1`margin: 0; font-size: 24px; color: #111827;`;
const Subtitle = styled.p`margin: 4px 0 0; color: #6B7280; font-size: 14px;`;
const Amount = styled.div`font-size: 28px; font-weight: 700; color: #0F8A3C;`;
const Section = styled.div`background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 20px;`;
const SectionTitle = styled.h2`margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #111827;`;
const Grid = styled.div`display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px;`;
const Item = styled.div``;
const Label = styled.div`font-size: 11px; font-weight: 700; color: #6B7280; text-transform: uppercase; margin-bottom: 4px;`;
const Value = styled.div`font-size: 14px; color: #111827;`;
const AddressGrid = styled.div`display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;`;
const AddressBox = styled.div`background: #F9FAFB; border-radius: 8px; padding: 12px;`;
const AddressTitle = styled.div`font-size: 12px; font-weight: 700; color: #6B7280; text-transform: uppercase; margin-bottom: 8px;`;
const AddressText = styled.div`font-size: 13px; color: #111827; line-height: 1.5;`;
const ProductCard = styled.div`display: flex; gap: 16px; padding: 16px; border: 1px solid #E5E7EB; border-radius: 8px; margin-bottom: 12px;`;
const ProductImg = styled.img`width: 80px; height: 80px; border-radius: 6px; object-fit: cover;`;
const ProductInfo = styled.div`flex: 1;`;
const ProductName = styled.div`font-weight: 700; color: #111827; margin-bottom: 8px;`;
const ProductMeta = styled.div`display: flex; gap: 12px; font-size: 12px; color: #6B7280; margin-bottom: 8px;`;
const ProductPricing = styled.div`display: flex; justify-content: space-between; font-weight: 600; color: #111827;`;
const Price = styled.span``;
const PaymentTable = styled.div`margin-bottom: 16px;`;
const PaymentRow = styled.div`display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB;`;
const PaymentRowTotal = styled(PaymentRow)`border-top: 2px solid #111827; border-bottom: 2px solid #111827; padding: 12px 0; font-weight: 700;`;
const PaymentLabel = styled.span`color: #6B7280; font-weight: 600;`;
const PaymentValue = styled.span`color: #111827; font-weight: 600;`;
const TotalValue = styled(PaymentValue)`font-size: 16px; color: #0F8A3C;`;
const PaymentInfo = styled.div`display: flex; gap: 16px;`;
const PaymentDetail = styled.div`flex: 1;`;
const Badge = styled.div<{ status: string }>`display: inline-block; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; background: ${({ status }) => status === 'paid' ? '#DCFCE7' : status === 'pending' ? '#FEF3C7' : '#FECACA'}; color: ${({ status }) => status === 'paid' ? '#15803D' : status === 'pending' ? '#92400E' : '#991B1B'};`;
const ControlGroup = styled.div`margin-bottom: 16px;`;
const Select = styled.select`width: 100%; padding: 10px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;`;
const NoteBox = styled.div`background: #F9FAFB; padding: 16px; border-radius: 8px;`;
const TextArea = styled.textarea`width: 100%; padding: 10px; border: 1px solid #D1D5DB; border-radius: 6px; font-family: inherit; font-size: 13px; resize: vertical;`;
const NoteBtn = styled.button`margin-top: 10px; padding: 8px 16px; background: #0284C7; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;`;
const NotesList = styled.div`margin-top: 16px; display: flex; flex-direction: column; gap: 12px;`;
const NoteItem = styled.div`background: #F9FAFB; padding: 12px; border-radius: 6px;`;
const NoteTime = styled.div`font-size: 11px; color: #9CA3AF; margin-bottom: 4px;`;
const NoteText = styled.div`font-size: 13px; color: #111827;`;
const Error = styled.div`padding: 20px; background: #FEE2E2; border: 1px solid #FECACA; border-radius: 8px; color: #991B1B;`;
