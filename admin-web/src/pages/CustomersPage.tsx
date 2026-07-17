import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { useAppSelector, RootState } from '../store';

const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const customers = useAppSelector((state: RootState) => state.customers.items);

  const handleViewDetails = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  return (
    <Layout>
      <PageContainer>
        <PageTitle>Customers Management</PageTitle>
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

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 32px;
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
