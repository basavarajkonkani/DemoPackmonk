import React, { useState, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchCatalog, setCatalogProductPrice, selectCatalogItems } from '../../store/catalogSlice';
import {
  fetchPricingRules,
  updatePricingRuleThunk,
  createPricingRuleThunk,
  deletePricingRuleThunk,
  selectPricingRules,
} from '../../store/pricingSlice';
import type { PricingRule } from '../../store/pricingSlice';

const AdminPricingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectCatalogItems);
  const pricingRules = useAppSelector(selectPricingRules);
  const [selectedTab, setSelectedTab] = useState<'products' | 'rules'>('products');

  useEffect(() => {
    dispatch(fetchCatalog());
    dispatch(fetchPricingRules());
  }, [dispatch]);

  const handleEditRule = (rule: PricingRule) => {
    Alert.prompt(
      'Edit Rule',
      `Edit ${rule.name}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: (newValue?: string) => {
            if (newValue && !isNaN(parseFloat(newValue))) {
              dispatch(updatePricingRuleThunk({ ...rule, value: parseFloat(newValue) }));
              Alert.alert('Success', 'Rule updated successfully');
            }
          },
        },
      ],
      'plain-text',
      rule.value.toString(),
      'numeric'
    );
  };

  const handleDeleteRule = (rule: PricingRule) => {
    Alert.alert('Delete Rule', `Delete "${rule.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deletePricingRuleThunk(rule.id)),
      },
    ]);
  };

  const handleAddRule = () => {
    Alert.prompt(
      'New Pricing Rule',
      'Enter rule name',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Next',
          onPress: (name?: string) => {
            if (!name?.trim()) return;
            Alert.prompt(
              'Rule Value',
              'Enter the numeric value (% or ₹ depending on type)',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Create',
                  onPress: (value?: string) => {
                    const numeric = parseFloat(value ?? '');
                    if (isNaN(numeric)) return;
                    dispatch(
                      createPricingRuleThunk({
                        name: name.trim(),
                        type: 'setup',
                        value: numeric,
                        description: `Custom rule: ${name.trim()}`,
                        isActive: true,
                      })
                    );
                  },
                },
              ],
              'plain-text',
              '',
              'numeric'
            );
          },
        },
      ],
      'plain-text'
    );
  };

  const handleEditPrice = (product: (typeof products)[number]) => {
    Alert.prompt(
      'Edit Base Price',
      `Edit pricing for ${product.name}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: (newPrice?: string) => {
            if (newPrice && !isNaN(parseFloat(newPrice))) {
              dispatch(setCatalogProductPrice({ id: product.id, price: parseFloat(newPrice) }));
              Alert.alert('Success', 'Pricing updated successfully');
            }
          },
        },
      ],
      'plain-text',
      product.price.toString(),
      'numeric'
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#1F2937" />
        </BackButton>
        <HeaderTitle>Pricing Management</HeaderTitle>
        <AddButton onPress={handleAddRule}>
          <FontAwesome5 name="plus" size={18} color="#FFF" />
        </AddButton>
      </Header>

      <TabContainer>
        <TabButton active={selectedTab === 'products'} onPress={() => setSelectedTab('products')}>
          <TabButtonText active={selectedTab === 'products'}>Products</TabButtonText>
        </TabButton>
        <TabButton active={selectedTab === 'rules'} onPress={() => setSelectedTab('rules')}>
          <TabButtonText active={selectedTab === 'rules'}>Pricing Rules</TabButtonText>
        </TabButton>
      </TabContainer>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {selectedTab === 'products' ? (
          <>
            {products.map((product) => (
              <ProductCard key={product.id}>
                <ProductHeader>
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductMeta>{product.material} • {product.size}</ProductMeta>
                  </ProductInfo>
                  <EditBtn onPress={() => handleEditPrice(product)}>
                    <FontAwesome5 name="edit" size={16} color="#0F8A3C" />
                  </EditBtn>
                </ProductHeader>

                <BasePrice>
                  <PriceLabel>Base Price:</PriceLabel>
                  <PriceValue>₹{product.price.toFixed(2)}</PriceValue>
                </BasePrice>

                <TierContainer>
                  <TierTitle>Volume Discounts (Sample)</TierTitle>
                  {[
                    { name: '100-500 units', discount: 0, price: product.price },
                    { name: '500-1000 units', discount: 5, price: product.price * 0.95 },
                    { name: '1000-5000 units', discount: 10, price: product.price * 0.90 },
                    { name: '5000+ units', discount: 15, price: product.price * 0.85 },
                  ].map((tier, idx) => (
                    <TierItem key={idx}>
                      <TierBadge>
                        <TierBadgeText>{idx + 1}</TierBadgeText>
                      </TierBadge>
                      <TierInfo>
                        <TierName>{tier.name}</TierName>
                        <TierDiscount>{tier.discount}% off</TierDiscount>
                      </TierInfo>
                      <TierPrice>₹{tier.price.toFixed(2)}</TierPrice>
                    </TierItem>
                  ))}
                </TierContainer>

                <LastModified>Last modified: {new Date().toISOString().split('T')[0]}</LastModified>
              </ProductCard>
            ))}
          </>
        ) : (
          <>
            {pricingRules.map((rule) => (
              <RuleCard key={rule.id}>
                <RuleHeader>
                  <RuleInfo>
                    <RuleName>{rule.name}</RuleName>
                    <RuleDesc>{rule.description}</RuleDesc>
                  </RuleInfo>
                  <RuleActions>
                    <EditBtn onPress={() => handleEditRule(rule)}>
                      <FontAwesome5 name="edit" size={16} color="#0F8A3C" />
                    </EditBtn>
                    <EditBtn onPress={() => handleDeleteRule(rule)} style={{ backgroundColor: '#FEE2E2' }}>
                      <FontAwesome5 name="trash" size={16} color="#EF4444" />
                    </EditBtn>
                  </RuleActions>
                </RuleHeader>

                <RuleValue>
                  <RuleValueLabel>{rule.type === 'material' ? rule.value + '%' : '₹' + rule.value}</RuleValueLabel>
                </RuleValue>
              </RuleCard>
            ))}

            <InfoCard>
              <InfoTitle>About Pricing Rules</InfoTitle>
              <InfoText>• Material Markup: Percentage added to base price for premium materials</InfoText>
              <InfoText>• Rush Order Fee: Flat fee added when delivery needed within 48 hours</InfoText>
              <InfoText>• Custom Print Charge: Per-color cost multiplied by print area</InfoText>
              <InfoText>• Setup Fee: One-time charge applied to first order of a new design</InfoText>
            </InfoCard>
          </>
        )}
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
const AddButton = styled.TouchableOpacity`
  width: 40px; height: 40px; border-radius: 12px;
  background-color: #0F8A3C; align-items: center; justify-content: center;
`;

const TabContainer = styled.View`
  flex-direction: row; background-color: #FFFFFF;
  padding: 4px; margin: 0; border-bottom-width: 1px; border-bottom-color: #E5E7EB;
`;
const TabButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1; padding: 12px;
  border-bottom-width: ${({ active }) => active ? '2px' : '0px'};
  border-bottom-color: ${({ active }) => active ? '#0F8A3C' : 'transparent'};
`;
const TabButtonText = styled.Text<{ active: boolean }>`
  font-size: 14px; font-weight: 700; text-align: center;
  color: ${({ active }) => active ? '#0F8A3C' : '#6B7280'};
`;

const ProductCard = styled.View`
  background-color: #FFFFFF; border-radius: 12px; padding: 16px;
  margin: 16px 16px 0; border-width: 1px; border-color: #E5E7EB;
`;
const ProductHeader = styled.View`
  flex-direction: row; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;
`;
const ProductInfo = styled.View`flex: 1;`;
const ProductName = styled.Text`font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 4px;`;
const ProductMeta = styled.Text`font-size: 12px; color: #9CA3AF;`;
const EditBtn = styled.TouchableOpacity`
  width: 36px; height: 36px; border-radius: 8px;
  background-color: #DCFCE7; align-items: center; justify-content: center;
`;

const BasePrice = styled.View`
  flex-direction: row; justify-content: space-between; background-color: #DCFCE7;
  border-radius: 8px; padding: 12px; margin-bottom: 12px;
`;
const PriceLabel = styled.Text`font-size: 13px; color: #0F8A3C;`;
const PriceValue = styled.Text`font-size: 18px; font-weight: 800; color: #0F8A3C;`;

const TierContainer = styled.View``;
const TierTitle = styled.Text`font-size: 13px; font-weight: 700; color: #6B7280; margin-bottom: 8px;`;
const TierItem = styled.View`
  flex-direction: row; align-items: center; background-color: #F9FAFB;
  border-radius: 8px; padding: 10px; margin-bottom: 6px;
`;
const TierBadge = styled.View`
  width: 32px; height: 32px; border-radius: 8px;
  background-color: #FFFFFF; align-items: center; justify-content: center; margin-right: 10px;
`;
const TierBadgeText = styled.Text`font-size: 12px; font-weight: 700; color: #6B7280;`;
const TierInfo = styled.View`flex: 1;`;
const TierName = styled.Text`font-size: 12px; font-weight: 600; color: #111827; margin-bottom: 2px;`;
const TierDiscount = styled.Text`font-size: 11px; color: #0F8A3C; font-weight: 700;`;
const TierPrice = styled.Text`font-size: 13px; font-weight: 700; color: #111827;`;

const LastModified = styled.Text`font-size: 10px; color: #9CA3AF; margin-top: 12px;`;

const RuleCard = styled.View`
  background-color: #FFFFFF; border-radius: 12px; padding: 16px;
  margin: 16px 16px 0; border-width: 1px; border-color: #E5E7EB;
`;
const RuleHeader = styled.View`
  flex-direction: row; justify-content: space-between; align-items: flex-start;
`;
const RuleInfo = styled.View`flex: 1; margin-right: 12px;`;
const RuleActions = styled.View`flex-direction: row; gap: 8px;`;
const RuleName = styled.Text`font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 4px;`;
const RuleDesc = styled.Text`font-size: 12px; color: #9CA3AF; line-height: 18px;`;

const RuleValue = styled.View`
  background-color: #DCFCE7; border-radius: 8px; padding: 8px 12px; margin-top: 12px;
`;
const RuleValueLabel = styled.Text`font-size: 18px; font-weight: 800; color: #0F8A3C;`;

const InfoCard = styled.View`
  background-color: #FFFFFF; border-radius: 12px; padding: 16px;
  margin: 16px; border-width: 1px; border-color: #E5E7EB; border-left-width: 4px; border-left-color: #0F8A3C;
`;
const InfoTitle = styled.Text`font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 8px;`;
const InfoText = styled.Text`font-size: 12px; color: #6B7280; margin-bottom: 6px; line-height: 18px;`;
