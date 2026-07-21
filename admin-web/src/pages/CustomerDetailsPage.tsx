import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { useAppSelector, useAppDispatch, RootState } from '../store';
import { updateCustomer } from '../store/slices/customersSlice';
import { CustomerNote } from '../types';

const CustomerDetailsPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const customer = useAppSelector((state: RootState) =>
    state.customers.items.find((c: any) => c.id === customerId)
  );
  const orders = useAppSelector((state: RootState) => state.orders.items);
  
  const [newNote, setNewNote] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editForm, setEditForm] = useState({
    name: customer?.name ?? '',
    companyName: customer?.companyName ?? '',
    email: customer?.email ?? '',
    phone: customer?.phone ?? '',
    gstNumber: customer?.gstNumber ?? '',
  });

  if (!customer) {
    return (
      <Layout>
        <Container>
          <BackBtn onClick={() => navigate('/customers')}>← Back</BackBtn>
          <Error>Customer not found</Error>
        </Container>
      </Layout>
    );
  }

  const customerOrders = orders.filter((o: any) => o.customerId === customerId);

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: CustomerNote = {
        id: `note_${Date.now()}`,
        content: newNote,
        createdBy: 'admin@pacmonk.com',
        createdAt: new Date().toISOString(),
      };
      const updatedNotes = [...(customer.notes || []), note];
      dispatch(updateCustomer({ ...customer, notes: updatedNotes }));
      setNewNote('');
      setShowNoteForm(false);
    }
  };

  const handleDisableCustomer = () => {
    const confirmed = window.confirm('Are you sure you want to disable this customer account?');
    if (confirmed) {
      dispatch(updateCustomer({ ...customer, accountStatus: 'inactive', isActive: false }));
    }
  };

  const handleEnableCustomer = () => {
    dispatch(updateCustomer({ ...customer, accountStatus: 'active', isActive: true }));
  };

  const handleDownloadReport = () => {
    alert(`📥 Downloading customer report for ${customer.name}...`);
  };

  const handleEmailCustomer = () => {
    alert(`📧 Email draft opened:\nTo: ${customer.email}\n\nCompose your message...`);
  };

  const handleWhatsAppCustomer = () => {
    alert(`💬 Opening WhatsApp:\nContact: ${customer.phone}`);
  };

  const handleCallCustomer = () => {
    alert(`☎️ Initiating call to ${customer.phone}`);
  };

  const openEdit = () => {
    setEditForm({
      name: customer.name,
      companyName: customer.companyName ?? '',
      email: customer.email,
      phone: customer.phone,
      gstNumber: customer.gstNumber ?? '',
    });
    setShowEditForm(true);
  };

  const saveEdit = () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      alert('Name and email are required');
      return;
    }
    dispatch(
      updateCustomer({
        ...customer,
        name: editForm.name.trim(),
        companyName: editForm.companyName.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        gstNumber: editForm.gstNumber.trim() || undefined,
      })
    );
    setShowEditForm(false);
  };

  return (
    <Layout>
      <Container>
        <BackBtn onClick={() => navigate('/customers')}>← Back to Customers</BackBtn>
        
        {/* Header Section */}
        <Header>
          <HeaderLeft>
            <Avatar>{customer.name.charAt(0)}</Avatar>
            <HeaderInfo>
              <Title>{customer.name}</Title>
              <Subtitle>{customer.companyName}</Subtitle>
              <Status active={customer.isActive}>
                {customer.accountStatus === 'active' ? '✓ Active' : '✗ Inactive'}
              </Status>
            </HeaderInfo>
          </HeaderLeft>
          <TotalSpent>₹{(customer.totalSpent / 100000).toFixed(1)}L</TotalSpent>
        </Header>

        {/* Quick Stats */}
        <StatsGrid>
          <StatCard>
            <StatLabel>Total Orders</StatLabel>
            <StatValue>{customer.totalOrders}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Average Order</StatLabel>
            <StatValue>₹{(customer.averageOrderValue / 1000).toFixed(1)}K</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Last Order</StatLabel>
            <StatValue>{customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'N/A'}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Outstanding Balance</StatLabel>
            <StatValue highlight>₹{(customer.outstandingBalance || 0).toLocaleString()}</StatValue>
          </StatCard>
        </StatsGrid>

        {/* Customer Information */}
        <Section>
          <SectionTitle>Customer Information</SectionTitle>
          <Grid>
            <Item><Label>Customer ID</Label><Value>{customer.id}</Value></Item>
            <Item><Label>Type</Label><Value>{customer.customerType === 'business' ? '💼 Business' : '👤 Retail'}</Value></Item>
            <Item><Label>Contact Person</Label><Value>{customer.contactPerson || 'N/A'}</Value></Item>
            <Item><Label>Registration Date</Label><Value>{new Date(customer.createdAt).toLocaleDateString()}</Value></Item>
            <Item><Label>Email</Label><Value>{customer.email}</Value></Item>
            <Item><Label>Mobile</Label><Value>{customer.phone}</Value></Item>
            {customer.alternatePhone && <Item><Label>Alternate Phone</Label><Value>{customer.alternatePhone}</Value></Item>}
            <Item><Label>GST Number</Label><Value>{customer.gstNumber || 'N/A'}</Value></Item>
            <Item><Label>PAN Number</Label><Value>{customer.panNumber || 'Demo - Not Applicable'}</Value></Item>
          </Grid>
        </Section>

        {/* Business Information */}
        <Section>
          <SectionTitle>Business Information</SectionTitle>
          <BusinessGrid>
            <BusinessItem>
              <BLabel>Credit Limit</BLabel>
              <BValue>₹{(customer.creditLimit || 0).toLocaleString()}</BValue>
            </BusinessItem>
            <BusinessItem>
              <BLabel>Outstanding Balance</BLabel>
              <BValue balance>₹{(customer.outstandingBalance || 0).toLocaleString()}</BValue>
            </BusinessItem>
            <BusinessItem>
              <BLabel>Preferred Payment</BLabel>
              <BValue>{customer.preferredPaymentMethod.replace('_', ' ').toUpperCase()}</BValue>
            </BusinessItem>
            <BusinessItem>
              <BLabel>Account Status</BLabel>
              <BValue status={customer.accountStatus}>
                {customer.accountStatus === 'active' ? '✓ Active' : customer.accountStatus === 'inactive' ? '✗ Inactive' : '⚠️ Suspended'}
              </BValue>
            </BusinessItem>
          </BusinessGrid>
        </Section>

        {/* Addresses */}
        <Section>
          <SectionTitle>Addresses</SectionTitle>
          <AddressGrid>
            {customer.addresses?.map((addr: any) => (
              <AddressBox key={addr.id} type={addr.type}>
                <AddressType>{addr.type === 'billing' ? '📍 Billing' : addr.type === 'shipping' ? '📦 Shipping' : '🚚 Delivery'}</AddressType>
                <AddressCompany>{addr.company}</AddressCompany>
                <AddressText>{addr.street}</AddressText>
                <AddressText>{addr.city}, {addr.state} {addr.zip}</AddressText>
                <AddressText>{addr.country}</AddressText>
                {addr.isDefault && <DefaultBadge>Default</DefaultBadge>}
              </AddressBox>
            ))}
          </AddressGrid>
        </Section>

        {/* Order History */}
        <Section>
          <SectionTitle>Order History</SectionTitle>
          {customerOrders.length > 0 ? (
            <OrderTable>
              <TableHeader>
                <TableHeaderCell>Order ID</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Products</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </TableHeader>
              <TableBody>
                {customerOrders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>{order.items.length} product(s)</TableCell>
                    <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <ActionBtn onClick={() => navigate(`/orders/${order.id}`)}>View Order</ActionBtn>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </OrderTable>
          ) : (
            <NoData>No orders yet</NoData>
          )}
        </Section>

        {/* Saved Designs */}
        <Section>
          <SectionTitle>Saved Designs</SectionTitle>
          {customer.designs && customer.designs.length > 0 ? (
            <DesignGrid>
              {customer.designs.map((design: any) => (
                <DesignCard key={design.id}>
                  <DesignPlaceholder>🎨</DesignPlaceholder>
                  <DesignName>{design.fileName}</DesignName>
                  <DesignDate>{new Date(design.uploadedAt).toLocaleDateString()}</DesignDate>
                  {design.description && <DesignDesc>{design.description}</DesignDesc>}
                  <DesignBtn onClick={() => alert(`📥 Downloading ${design.fileName}...`)}>Download</DesignBtn>
                </DesignCard>
              ))}
            </DesignGrid>
          ) : (
            <NoData>No saved designs</NoData>
          )}
        </Section>

        {/* Invoices */}
        <Section>
          <SectionTitle>Invoices</SectionTitle>
          {customer.invoices && customer.invoices.length > 0 ? (
            <InvoiceTable>
              <TableHeader>
                <TableHeaderCell>Invoice #</TableHeaderCell>
                <TableHeaderCell>Order ID</TableHeaderCell>
                <TableHeaderCell>Issued Date</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </TableHeader>
              <TableBody>
                {customer.invoices.map((invoice: any) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.orderId}</TableCell>
                    <TableCell>{new Date(invoice.issuedDate).toLocaleDateString()}</TableCell>
                    <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <InvoiceStatusBadge status={invoice.status}>
                        {invoice.status.toUpperCase()}
                      </InvoiceStatusBadge>
                    </TableCell>
                    <TableCell>
                      <ActionBtn onClick={() => alert(`📥 Downloading invoice ${invoice.invoiceNumber}...`)}>Download</ActionBtn>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </InvoiceTable>
          ) : (
            <NoData>No invoices</NoData>
          )}
        </Section>

        {/* Wishlist */}
        <Section>
          <SectionTitle>Wishlist</SectionTitle>
          {customer.wishlist && customer.wishlist.length > 0 ? (
            <WishlistTable>
              <TableHeader>
                <TableHeaderCell>Product Name</TableHeaderCell>
                <TableHeaderCell>Quantity</TableHeaderCell>
                <TableHeaderCell>Added Date</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </TableHeader>
              <TableBody>
                {customer.wishlist.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.quantity || 'N/A'}</TableCell>
                    <TableCell>{new Date(item.addedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <ActionBtn onClick={() => alert(`Creating quote for ${item.productName}...`)}>Create Quote</ActionBtn>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </WishlistTable>
          ) : (
            <NoData>No wishlist items</NoData>
          )}
        </Section>

        {/* Support Tickets */}
        <Section>
          <SectionTitle>Support Tickets</SectionTitle>
          {customer.supportTickets && customer.supportTickets.length > 0 ? (
            <TicketGrid>
              {customer.supportTickets.map((ticket: any) => (
                <TicketCard key={ticket.id}>
                  <TicketNumber>{ticket.ticketNumber}</TicketNumber>
                  <TicketSubject>{ticket.subject}</TicketSubject>
                  <TicketDesc>{ticket.description}</TicketDesc>
                  <TicketMeta>
                    <TicketStatus status={ticket.status}>{ticket.status.toUpperCase()}</TicketStatus>
                    <TicketDate>{new Date(ticket.createdAt).toLocaleDateString()}</TicketDate>
                  </TicketMeta>
                  <TicketBtn onClick={() => alert(`Opening ticket ${ticket.ticketNumber}...`)}>View Details</TicketBtn>
                </TicketCard>
              ))}
            </TicketGrid>
          ) : (
            <NoData>No support tickets</NoData>
          )}
        </Section>

        {/* Internal Notes */}
        <Section>
          <SectionTitle>Internal Notes</SectionTitle>
          <NoteBox>
            {!showNoteForm ? (
              <AddNoteBtn onClick={() => setShowNoteForm(true)}>+ Add Note</AddNoteBtn>
            ) : (
              <NoteForm>
                <TextArea
                  placeholder="Add internal note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <NoteFormButtons>
                  <NoteSubmitBtn onClick={handleAddNote}>Save Note</NoteSubmitBtn>
                  <NoteCancelBtn onClick={() => { setShowNoteForm(false); setNewNote(''); }}>Cancel</NoteCancelBtn>
                </NoteFormButtons>
              </NoteForm>
            )}
          </NoteBox>
          {customer.notes && customer.notes.length > 0 && (
            <NotesList>
              {customer.notes.map((note: any) => (
                <NoteItem key={note.id}>
                  <NoteTime>{new Date(note.createdAt).toLocaleDateString()} • {new Date(note.createdAt).toLocaleTimeString()}</NoteTime>
                  <NoteText>{note.content}</NoteText>
                </NoteItem>
              ))}
            </NotesList>
          )}
        </Section>

        {/* Actions */}
        <ActionsSection>
          <SectionTitle>Actions</SectionTitle>
          <ActionsGrid>
            <ActionButton onClick={openEdit}>Edit Customer</ActionButton>
            {customer.isActive ? (
              <ActionButton disabled={false} onClick={handleDisableCustomer}>Disable Customer</ActionButton>
            ) : (
              <ActionButton positive onClick={handleEnableCustomer}>Enable Customer</ActionButton>
            )}
            <ActionButton onClick={handleDownloadReport}>📥 Download Report</ActionButton>
            <ActionButton onClick={handleEmailCustomer}>📧 Email Customer</ActionButton>
            <ActionButton onClick={handleWhatsAppCustomer}>💬 WhatsApp</ActionButton>
            <ActionButton onClick={handleCallCustomer}>☎️ Call Customer</ActionButton>
          </ActionsGrid>
        </ActionsSection>

        {showEditForm && (
          <EditOverlay onClick={() => setShowEditForm(false)}>
            <EditModal onClick={(e) => e.stopPropagation()}>
              <EditTitle>Edit Customer</EditTitle>
              <EditFieldLabel>Name *</EditFieldLabel>
              <EditInput value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              <EditFieldLabel>Company Name</EditFieldLabel>
              <EditInput value={editForm.companyName} onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })} />
              <EditFieldLabel>Email *</EditFieldLabel>
              <EditInput value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} type="email" />
              <EditFieldLabel>Phone</EditFieldLabel>
              <EditInput value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
              <EditFieldLabel>GST Number</EditFieldLabel>
              <EditInput value={editForm.gstNumber} onChange={(e) => setEditForm({ ...editForm, gstNumber: e.target.value })} />
              <NoteFormButtons>
                <NoteSubmitBtn onClick={saveEdit}>Save Changes</NoteSubmitBtn>
                <NoteCancelBtn onClick={() => setShowEditForm(false)}>Cancel</NoteCancelBtn>
              </NoteFormButtons>
            </EditModal>
          </EditOverlay>
        )}
      </Container>
    </Layout>
  );
};

export default CustomerDetailsPage;


/* ─── STYLED COMPONENTS ─────────────────────────────────────────────────── */

const Container = styled.div`max-width: 1200px; margin: 0 auto; padding: 20px;`;
const BackBtn = styled.button`background: none; border: none; color: #0284C7; cursor: pointer; font-weight: 600; margin-bottom: 20px; font-size: 14px;`;

const Header = styled.div`display: flex; justify-content: space-between; align-items: center; background: white; padding: 24px; border-radius: 12px; border: 1px solid #E5E7EB; margin-bottom: 24px;`;
const HeaderLeft = styled.div`display: flex; align-items: center; gap: 16px;`;
const Avatar = styled.div`width: 56px; height: 56px; border-radius: 50%; background-color: #0F8A3C; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 24px;`;
const HeaderInfo = styled.div``;
const Title = styled.h1`margin: 0; font-size: 24px; font-weight: 700; color: #111827;`;
const Subtitle = styled.p`margin: 4px 0 8px; color: #6B7280; font-size: 14px;`;
const Status = styled.div<{ active: boolean }>`display: inline-block; padding: 4px 8px; background: ${({ active }) => active ? '#DCFCE7' : '#FECACA'}; color: ${({ active }) => active ? '#15803D' : '#991B1B'}; border-radius: 4px; font-size: 12px; font-weight: 600;`;
const TotalSpent = styled.div`font-size: 32px; font-weight: 700; color: #0F8A3C;`;

const StatsGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;`;
const StatCard = styled.div`background: white; padding: 16px; border-radius: 8px; border: 1px solid #E5E7EB;`;
const StatLabel = styled.div`font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; margin-bottom: 8px;`;
const StatValue = styled.div<{ highlight?: boolean }>`font-size: 20px; font-weight: 700; color: ${({ highlight }) => highlight ? '#DC2626' : '#111827'};`;

const Section = styled.div`background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 20px;`;
const SectionTitle = styled.h2`margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #111827;`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;`;
const Item = styled.div``;
const Label = styled.div`font-size: 11px; font-weight: 700; color: #6B7280; text-transform: uppercase; margin-bottom: 4px;`;
const Value = styled.div`font-size: 14px; color: #111827; font-weight: 500;`;

const BusinessGrid = styled.div`display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;`;
const BusinessItem = styled.div`background: #F9FAFB; padding: 12px; border-radius: 8px;`;
const BLabel = styled.div`font-size: 11px; font-weight: 700; color: #6B7280; text-transform: uppercase; margin-bottom: 6px;`;
const BValue = styled.div<{ balance?: boolean; status?: string }>`font-size: 16px; font-weight: 700; color: ${({ balance, status }) => balance ? '#DC2626' : status === 'active' ? '#15803D' : status === 'inactive' ? '#991B1B' : '#111827'};`;

const AddressGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;`;
const AddressBox = styled.div<{ type: string }>`background: #F9FAFB; padding: 14px; border-radius: 8px; border-left: 4px solid ${({ type }) => type === 'billing' ? '#0284C7' : type === 'shipping' ? '#0F8A3C' : '#F59E0B'};`;
const AddressType = styled.div`font-weight: 700; color: #111827; margin-bottom: 6px; font-size: 13px;`;
const AddressCompany = styled.div`font-weight: 600; color: #111827; font-size: 13px; margin-bottom: 4px;`;
const AddressText = styled.div`font-size: 12px; color: #6B7280; line-height: 1.4;`;
const DefaultBadge = styled.div`display: inline-block; margin-top: 6px; padding: 2px 6px; background: #0284C7; color: white; border-radius: 3px; font-size: 10px; font-weight: 600;`;

const OrderTable = styled.table`width: 100%; border-collapse: collapse;`;
const TableHeader = styled.thead`background: #F9FAFB;`;
const TableHeaderCell = styled.th`text-align: left; padding: 12px; font-size: 12px; font-weight: 700; color: #6B7280; border-bottom: 2px solid #E5E7EB; text-transform: uppercase;`;
const TableBody = styled.tbody``;
const TableRow = styled.tr`border-bottom: 1px solid #E5E7EB; &:hover { background: #F9FAFB; }`;
const TableCell = styled.td`padding: 12px; font-size: 13px; color: #111827;`;
const StatusBadge = styled.div<{ status: string }>`display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: ${({ status }) => status === 'pending_review' ? '#FEF3C7' : status === 'in_production' ? '#DBEAFE' : status === 'shipped' ? '#DCFCE7' : status === 'delivered' ? '#C7D2FE' : '#FECACA'}; color: ${({ status }) => status === 'pending_review' ? '#92400E' : status === 'in_production' ? '#1E40AF' : status === 'shipped' ? '#15803D' : status === 'delivered' ? '#3730A3' : '#991B1B'};`;
const InvoiceStatusBadge = styled.div<{ status: string }>`display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: ${({ status }) => status === 'paid' ? '#DCFCE7' : status === 'pending' ? '#FEF3C7' : '#FECACA'}; color: ${({ status }) => status === 'paid' ? '#15803D' : status === 'pending' ? '#92400E' : '#991B1B'};`;
const ActionBtn = styled.button`padding: 6px 12px; background: #0284C7; color: white; border: none; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer; &:hover { background: #0369A1; }`;

const DesignGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px;`;
const DesignCard = styled.div`background: #F9FAFB; padding: 12px; border-radius: 8px; text-align: center; border: 1px solid #E5E7EB;`;
const DesignPlaceholder = styled.div`font-size: 32px; margin-bottom: 8px;`;
const DesignName = styled.div`font-weight: 600; color: #111827; font-size: 12px; margin-bottom: 4px; word-break: break-word;`;
const DesignDate = styled.div`font-size: 11px; color: #6B7280; margin-bottom: 8px;`;
const DesignDesc = styled.div`font-size: 11px; color: #6B7280; margin-bottom: 8px; font-style: italic;`;
const DesignBtn = styled.button`width: 100%; padding: 6px; background: #0284C7; color: white; border: none; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer; &:hover { background: #0369A1; }`;

const InvoiceTable = styled(OrderTable)``;
const WishlistTable = styled(OrderTable)``;

const TicketGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px;`;
const TicketCard = styled.div`background: #F9FAFB; padding: 12px; border-radius: 8px; border: 1px solid #E5E7EB;`;
const TicketNumber = styled.div`font-weight: 700; color: #111827; font-size: 13px; margin-bottom: 4px;`;
const TicketSubject = styled.div`font-weight: 600; color: #111827; font-size: 13px; margin-bottom: 6px;`;
const TicketDesc = styled.div`font-size: 12px; color: #6B7280; margin-bottom: 8px; line-height: 1.4;`;
const TicketMeta = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 11px;`;
const TicketStatus = styled.div<{ status: string }>`padding: 2px 6px; background: ${({ status }) => status === 'open' ? '#FEF3C7' : status === 'in_progress' ? '#DBEAFE' : status === 'resolved' ? '#DCFCE7' : '#F3F4F6'}; color: ${({ status }) => status === 'open' ? '#92400E' : status === 'in_progress' ? '#1E40AF' : status === 'resolved' ? '#15803D' : '#374151'}; border-radius: 3px; font-weight: 600;`;
const TicketDate = styled.div`color: #9CA3AF;`;
const TicketBtn = styled.button`width: 100%; padding: 6px; background: #0284C7; color: white; border: none; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer; &:hover { background: #0369A1; }`;

const NoteBox = styled.div`background: #F9FAFB; padding: 16px; border-radius: 8px;`;
const NoteForm = styled.div``;
const TextArea = styled.textarea`width: 100%; padding: 10px; border: 1px solid #D1D5DB; border-radius: 6px; font-family: inherit; font-size: 13px; resize: vertical;`;
const NoteFormButtons = styled.div`display: flex; gap: 8px; margin-top: 10px;`;
const NoteSubmitBtn = styled.button`padding: 8px 16px; background: #0284C7; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; &:hover { background: #0369A1; }`;
const NoteCancelBtn = styled.button`padding: 8px 16px; background: #E5E7EB; color: #111827; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; &:hover { background: #D1D5DB; }`;
const AddNoteBtn = styled.button`padding: 10px 16px; background: #0284C7; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; width: 100%; &:hover { background: #0369A1; }`;

const NotesList = styled.div`margin-top: 16px; display: flex; flex-direction: column; gap: 12px;`;
const NoteItem = styled.div`background: #F9FAFB; padding: 12px; border-radius: 6px; border-left: 3px solid #0284C7;`;
const NoteTime = styled.div`font-size: 11px; color: #9CA3AF; margin-bottom: 4px;`;
const NoteText = styled.div`font-size: 13px; color: #111827; line-height: 1.5;`;

const ActionsSection = styled(Section)``;
const ActionsGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;`;
const ActionButton = styled.button<{ disabled?: boolean; positive?: boolean }>`padding: 12px 16px; background: ${({ positive }) => positive ? '#10B981' : '#0284C7'}; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'}; opacity: ${({ disabled }) => disabled ? 0.5 : 1}; &:hover { background: ${({ positive }) => positive ? '#059669' : '#0369A1'}; }`;

const NoData = styled.div`padding: 20px; text-align: center; color: #6B7280; background: #F9FAFB; border-radius: 8px;`;

const Error = styled.div`padding: 20px; background: #FEE2E2; border: 1px solid #FECACA; border-radius: 8px; color: #991B1B; font-weight: 500;`;

const EditOverlay = styled.div`position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;`;
const EditModal = styled.div`background: white; border-radius: 12px; padding: 28px; max-width: 420px; width: 90%; box-shadow: 0 20px 25px rgba(0,0,0,0.15);`;
const EditTitle = styled.h2`margin: 0 0 20px; font-size: 18px; font-weight: 700; color: #111827;`;
const EditFieldLabel = styled.div`font-size: 12px; font-weight: 600; color: #6B7280; margin-bottom: 6px; margin-top: 14px;`;
const EditInput = styled.input`width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px; font-family: inherit; &:focus { outline: none; border-color: #0284C7; box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1); }`;
