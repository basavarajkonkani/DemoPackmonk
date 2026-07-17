import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';

const PricingPage: React.FC = () => {
  return (
    <Layout>
      <PageContainer>
        <PageTitle>Pricing Management</PageTitle>
        <PlaceholderCard>
          <PlaceholderIcon>💰</PlaceholderIcon>
          <PlaceholderTitle>Pricing Management</PlaceholderTitle>
          <PlaceholderDesc>Manage product pricing, discounts, and special offers</PlaceholderDesc>
          <FeatureList>
            <Feature>✓ Create pricing rules</Feature>
            <Feature>✓ Bulk order discounts</Feature>
            <Feature>✓ Seasonal pricing</Feature>
            <Feature>✓ Customer-specific pricing</Feature>
          </FeatureList>
        </PlaceholderCard>
      </PageContainer>
    </Layout>
  );
};

export default PricingPage;

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

const PlaceholderCard = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  border: 2px dashed #E5E7EB;
  padding: 60px 40px;
  text-align: center;
`;

const PlaceholderIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const PlaceholderTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 8px;
`;

const PlaceholderDesc = styled.p`
  font-size: 16px;
  color: #6B7280;
  margin: 0 0 24px;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Feature = styled.div`
  font-size: 14px;
  color: #0F8A3C;
  font-weight: 600;
`;
