import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

const AdminPricingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState<'material' | 'gst' | 'offers' | 'shipping'>('material');

  const materialPrices = [
    { id: '1', material: 'Clear BOPP', basePrice: 12, gst: 18, bulkDiscount: 10 },
    { id: '2', material: 'Silver Metalized', basePrice: 18, gst: 18, bulkDiscount: 12 },
    { id: '3', material: 'Kraft Paper', basePrice: 15, gst: 12, bulkDiscount: 8 },
    { id: '4', material: 'Milky White', basePrice: 20, gst: 18, bulkDiscount: 15 },
  ];

  const offers = [
    { id: '1', name: 'Festival Sale', type: 'Percentage', value: 20, active: true, validUntil: '2024-01-31' },
    { id: '2', name: 'Bulk Order Discount', type: 'Percentage', value: 15, active: true, validUntil: '2024-12-31' },
    { id: '3', name: 'First Order', type: 'Fixed', value: 500, active: false, validUntil: '2024-06-30' },
  ];

  const handleEditPrice = (item: any) => {
    Alert.alert('Edit Price', `Update pricing for ${item.material}`);
  };

  const renderMaterialPricing = () => (
    <ContentSection>
      {materialPrices.map((item) => (
        <PriceCard key={item.id}>
          <PriceCardHeader>
            <MaterialName>{item.material}</MaterialName>
            <EditButton onPress={() => handleEditPrice(item)}>
              <FontAwesome5 name="edit" size={14} color="#0F8A3C" />
            </EditButton>
          </PriceCardHeader>

          <PriceGrid>
            <PriceItem>
              <PriceLabel>Base Price</PriceLabel>
              <PriceValue>${item.basePrice}/unit</PriceValue>
            </PriceItem>
            <PriceItem>
              <PriceLabel>GST Rate</PriceLabel>
              <PriceValue>{item.gst}%</PriceValue>
            </PriceItem>
            <PriceItem>
              <PriceLabel>Bulk Discount</PriceLabel>
              <PriceValue>{item.bulkDiscount}%</PriceValue>
            </PriceItem>
            <PriceItem>
              <PriceLabel>Final Price</PriceLabel>
              <PriceValue highlight>${(item.basePrice * (1 + item.gst / 100)).toFixed(2)}</PriceValue>
            </PriceItem>
          </PriceGrid>

          <BulkTierSection>
            <BulkTierTitle>Bulk Pricing Tiers</BulkTierTitle>
            <BulkTier>
              <BulkTierQty>500-1000 units</BulkTierQty>
              <BulkTierPrice>5% off</BulkTierPrice>
            </BulkTier>
            <BulkTier>
              <BulkTierQty>1000-5000 units</BulkTierQty>
              <BulkTierPrice>10% off</BulkTierPrice>
            </BulkTier>
            <BulkTier>
              <BulkTierQty>5000+ units</BulkTierQty>
              <BulkTierPrice>15% off</BulkTierPrice>
            </BulkTier>
          </BulkTierSection>
        </PriceCard>
      ))}
    </ContentSection>
  );

  const renderGSTSettings = () => (
    <ContentSection>
      <GSTCard>
        <GSTTitle>GST Configuration</GSTTitle>
        <GSTRow>
          <GSTLabel>Standard GST Rate:</GSTLabel>
          <GSTInput value="18" keyboardType="numeric" />
          <GSTUnit>%</GSTUnit>
        </GSTRow>
        <GSTRow>
          <GSTLabel>Eco-Friendly GST Rate:</GSTLabel>
          <GSTInput value="12" keyboardType="numeric" />
          <GSTUnit>%</GSTUnit>
        </GSTRow>
        <GSTRow>
          <GSTLabel>CGST:</GSTLabel>
          <GSTValue>9%</GSTValue>
        </GSTRow>
        <GSTRow>
          <GSTLabel>SGST:</GSTLabel>
          <GSTValue>9%</GSTValue>
        </GSTRow>
        <SaveButton>
          <SaveButtonText>Update GST Settings</SaveButtonText>
        </SaveButton>
      </GSTCard>
    </ContentSection>
  );

  const renderOffers = () => (
    <ContentSection>
      <AddOfferButton onPress={() => Alert.alert('Create Offer', 'Create new promotional offer')}>
        <FontAwesome5 name="plus-circle" size={16} color="#FFF" style={{ marginRight: 8 }} />
        <AddOfferButtonText>Create New Offer</AddOfferButtonText>
      </AddOfferButton>

      {offers.map((offer) => (
        <OfferCard key={offer.id} active={offer.active}>
          <OfferHeader>
            <OfferName>{offer.name}</OfferName>
            <OfferToggle active={offer.active}>
              <FontAwesome5 
                name={offer.active ? "toggle-on" : "toggle-off"} 
                size={24} 
                color={offer.active ? "#0F8A3C" : "#9CA3AF"} 
              />
            </OfferToggle>
          </OfferHeader>
          
          <OfferDetails>
            <OfferDetailItem>
              <OfferDetailLabel>Type:</OfferDetailLabel>
              <OfferDetailValue>{offer.type}</OfferDetailValue>
            </OfferDetailItem>
            <OfferDetailItem>
              <OfferDetailLabel>Discount:</OfferDetailLabel>
              <OfferDetailValue highlight>
                {offer.type === 'Percentage' ? `${offer.value}%` : `$${offer.value}`}
              </OfferDetailValue>
            </OfferDetailItem>
            <OfferDetailItem>
              <OfferDetailLabel>Valid Until:</OfferDetailLabel>
              <OfferDetailValue>{offer.validUntil}</OfferDetailValue>
            </OfferDetailItem>
          </OfferDetails>

          <OfferActions>
            <OfferActionButton>
              <FontAwesome5 name="edit" size={12} color="#0F8A3C" />
            </OfferActionButton>
            <OfferActionButton>
              <FontAwesome5 name="trash" size={12} color="#EF4444" />
            </OfferActionButton>
          </OfferActions>
        </OfferCard>
      ))}
    </ContentSection>
  );

  const renderShipping = () => (
    <ContentSection>
      <ShippingCard>
        <ShippingTitle>Shipping Charges</ShippingTitle>
        <ShippingRow>
          <ShippingLabel>Standard Shipping:</ShippingLabel>
          <ShippingInput value="50" keyboardType="numeric" />
          <ShippingUnit>$ / order</ShippingUnit>
        </ShippingRow>
        <ShippingRow>
          <ShippingLabel>Express Shipping:</ShippingLabel>
          <ShippingInput value="100" keyboardType="numeric" />
          <ShippingUnit>$ / order</ShippingUnit>
        </ShippingRow>
        <ShippingRow>
          <ShippingLabel>Free Shipping Above:</ShippingLabel>
          <ShippingInput value="5000" keyboardType="numeric" />
          <ShippingUnit>$</ShippingUnit>
        </ShippingRow>
        <SaveButton>
          <SaveButtonText>Update Shipping Rates</SaveButtonText>
        </SaveButton>
      </ShippingCard>
    </ContentSection>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#1F2937" />
        </BackButton>
        <HeaderTitle>Price Management</HeaderTitle>
        <Placeholder />
      </Header>

      <TabContainer>
        <Tab active={selectedTab === 'material'} onPress={() => setSelectedTab('material')}>
          <TabText active={selectedTab === 'material'}>Material</TabText>
        </Tab>
        <Tab active={selectedTab === 'gst'} onPress={() => setSelectedTab('gst')}>
          <TabText active={selectedTab === 'gst'}>GST</TabText>
        </Tab>
        <Tab active={selectedTab === 'offers'} onPress={() => setSelectedTab('offers')}>
          <TabText active={selectedTab === 'offers'}>Offers</TabText>
        </Tab>
        <Tab active={selectedTab === 'shipping'} onPress={() => setSelectedTab('shipping')}>
          <TabText active={selectedTab === 'shipping'}>Shipping</TabText>
        </Tab>
      </TabContainer>

      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 'material' && renderMaterialPricing()}
        {selectedTab === 'gst' && renderGSTSettings()}
        {selectedTab === 'offers' && renderOffers()}
        {selectedTab === 'shipping' && renderShipping()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminPricingScreen;

const Header = styled.View`
  flex-direction: row; align-items: center; justify-content: space-between;
  padding: 16px 20px; background-color: #FFFFFF;
  border-bottom-width: 1px; border-bottom-color: #E5E7EB;
`;
const BackButton = styled.TouchableOpacity`width: 40px; height: 40px; align-items: center; justify-content: center;`;
const HeaderTitle = styled.Text`font-size: 18px; font-weight: 700; color: #1F2937;`;
const Placeholder = styled.View`width: 40px;`;

const TabContainer = styled.View`
  flex-direction: row; background-color: #FFFFFF;
  padding: 4px; margin: 16px; border-radius: 12px;
  border-width: 1px; border-color: #E5E7EB;
`;
const Tab = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1; padding: 10px; border-radius: 8px;
  background-color: ${({ active }) => active ? '#0F8A3C' : 'transparent'};
`;
const TabText = styled.Text<{ active: boolean }>`
  font-size: 13px; font-weight: 700; text-align: center;
  color: ${({ active }) => active ? '#FFFFFF' : '#6B7280'};
`;

const ContentSection = styled.View`padding: 0 16px 24px;`;

const PriceCard = styled.View`
  background-color: #FFFFFF; border-radius: 16px; padding: 16px;
  margin-bottom: 16px; border-width: 1px; border-color: #F3F4F6;
`;
const PriceCardHeader = styled.View`
  flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 16px;
`;
const MaterialName = styled.Text`font-size: 16px; font-weight: 700; color: #111827;`;
const EditButton = styled.TouchableOpacity`
  width: 36px; height: 36px; border-radius: 10px;
  background-color: #DCFCE7; align-items: center; justify-content: center;
`;

const PriceGrid = styled.View`
  flex-direction: row; flex-wrap: wrap; margin-bottom: 16px;
`;
const PriceItem = styled.View`
  width: 50%; margin-bottom: 12px;
`;
const PriceLabel = styled.Text`font-size: 11px; color: #9CA3AF; margin-bottom: 4px;`;
const PriceValue = styled.Text<{ highlight?: boolean }>`
  font-size: 15px; font-weight: 700;
  color: ${({ highlight }) => highlight ? '#0F8A3C' : '#111827'};
`;

const BulkTierSection = styled.View`
  padding-top: 16px; border-top-width: 1px; border-top-color: #F3F4F6;
`;
const BulkTierTitle = styled.Text`
  font-size: 12px; font-weight: 700; color: #6B7280; margin-bottom: 12px;
`;
const BulkTier = styled.View`
  flex-direction: row; justify-content: space-between; padding: 8px 12px;
  background-color: #F9FAFB; border-radius: 8px; margin-bottom: 6px;
`;
const BulkTierQty = styled.Text`font-size: 12px; color: #6B7280;`;
const BulkTierPrice = styled.Text`font-size: 12px; font-weight: 700; color: #0F8A3C;`;

const GSTCard = styled.View`
  background-color: #FFFFFF; border-radius: 16px; padding: 20px;
  border-width: 1px; border-color: #F3F4F6;
`;
const GSTTitle = styled.Text`
  font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 16px;
`;
const GSTRow = styled.View`
  flex-direction: row; align-items: center; margin-bottom: 16px;
`;
const GSTLabel = styled.Text`font-size: 13px; color: #6B7280; flex: 1;`;
const GSTInput = styled.TextInput`
  width: 60px; height: 40px; background-color: #F9FAFB;
  border-width: 1px; border-color: #E5E7EB; border-radius: 8px;
  padding: 0 12px; font-size: 14px; font-weight: 700; color: #111827;
  text-align: center;
`;
const GSTUnit = styled.Text`font-size: 13px; color: #6B7280; margin-left: 8px; width: 30px;`;
const GSTValue = styled.Text`font-size: 14px; font-weight: 700; color: #111827;`;

const SaveButton = styled.TouchableOpacity`
  background-color: #0F8A3C; padding: 14px; border-radius: 12px;
  align-items: center; margin-top: 8px;
`;
const SaveButtonText = styled.Text`font-size: 14px; font-weight: 700; color: #FFFFFF;`;

const AddOfferButton = styled.TouchableOpacity`
  flex-direction: row; align-items: center; justify-content: center;
  background-color: #0F8A3C; padding: 14px; border-radius: 12px; margin-bottom: 16px;
`;
const AddOfferButtonText = styled.Text`font-size: 14px; font-weight: 700; color: #FFFFFF;`;

const OfferCard = styled.View<{ active: boolean }>`
  background-color: #FFFFFF; border-radius: 16px; padding: 16px;
  margin-bottom: 12px; border-width: 2px;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
`;
const OfferHeader = styled.View`
  flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 12px;
`;
const OfferName = styled.Text`font-size: 15px; font-weight: 700; color: #111827;`;
const OfferToggle = styled.TouchableOpacity<{ active: boolean }>``;

const OfferDetails = styled.View`margin-bottom: 12px;`;
const OfferDetailItem = styled.View`
  flex-direction: row; justify-content: space-between; margin-bottom: 8px;
`;
const OfferDetailLabel = styled.Text`font-size: 12px; color: #9CA3AF;`;
const OfferDetailValue = styled.Text<{ highlight?: boolean }>`
  font-size: 13px; font-weight: 600;
  color: ${({ highlight }) => highlight ? '#0F8A3C' : '#111827'};
`;

const OfferActions = styled.View`
  flex-direction: row; gap: 8px; padding-top: 12px;
  border-top-width: 1px; border-top-color: #F3F4F6;
`;
const OfferActionButton = styled.TouchableOpacity`
  flex: 1; padding: 10px; border-radius: 8px;
  background-color: #F3F4F6; align-items: center;
`;

const ShippingCard = styled.View`
  background-color: #FFFFFF; border-radius: 16px; padding: 20px;
  border-width: 1px; border-color: #F3F4F6;
`;
const ShippingTitle = styled.Text`
  font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 16px;
`;
const ShippingRow = styled.View`
  flex-direction: row; align-items: center; margin-bottom: 16px;
`;
const ShippingLabel = styled.Text`font-size: 13px; color: #6B7280; flex: 1;`;
const ShippingInput = styled.TextInput`
  width: 80px; height: 40px; background-color: #F9FAFB;
  border-width: 1px; border-color: #E5E7EB; border-radius: 8px;
  padding: 0 12px; font-size: 14px; font-weight: 700; color: #111827;
  text-align: center;
`;
const ShippingUnit = styled.Text`font-size: 13px; color: #6B7280; margin-left: 8px; width: 70px;`;
