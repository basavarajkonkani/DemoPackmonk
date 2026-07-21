import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation: any;
}

const AdminPromotionsScreen: React.FC<Props> = ({ navigation }) => {
  const [coupons, setCoupons] = useState([
    {
      id: '1',
      code: 'WELCOME50',
      discountType: 'percentage' as const,
      discountValue: 50,
      minOrderAmount: 10000,
      validUntil: '2024-03-31',
      usageLimit: 100,
      usedCount: 45,
      isActive: true,
    },
    {
      id: '2',
      code: 'BULK500',
      discountType: 'fixed' as const,
      discountValue: 500,
      minOrderAmount: 25000,
      validUntil: '2024-06-30',
      usageLimit: 50,
      usedCount: 12,
      isActive: true,
    },
    {
      id: '3',
      code: 'EXPIRED10',
      discountType: 'percentage' as const,
      discountValue: 10,
      minOrderAmount: 5000,
      validUntil: '2024-01-15',
      usageLimit: 200,
      usedCount: 200,
      isActive: false,
    },
  ]);

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const deleteCoupon = (id: string) => {
    Alert.alert('Delete Coupon', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setCoupons((prev) => prev.filter((c) => c.id !== id)),
      },
    ]);
  };

  const handleAddCoupon = () => {
    Alert.prompt(
      'New Coupon Code',
      'Enter coupon code (e.g., SAVE20)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Next',
          onPress: (code?: string) => {
            if (!code?.trim()) return;
            Alert.prompt(
              'Discount Percentage',
              'Enter discount % (e.g., 20)',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Create',
                  onPress: (value?: string) => {
                    const discountValue = parseFloat(value ?? '');
                    if (isNaN(discountValue)) return;
                    setCoupons((prev) => [
                      ...prev,
                      {
                        id: Date.now().toString(),
                        code: code.trim().toUpperCase(),
                        discountType: 'percentage',
                        discountValue,
                        minOrderAmount: 0,
                        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        usageLimit: 100,
                        usedCount: 0,
                        isActive: true,
                      },
                    ]);
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

  const handleEditCoupon = (coupon: (typeof coupons)[number]) => {
    Alert.prompt(
      'Edit Discount Value',
      `Update discount for ${coupon.code}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: (value?: string) => {
            const discountValue = parseFloat(value ?? '');
            if (isNaN(discountValue)) return;
            setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? { ...c, discountValue } : c)));
          },
        },
      ],
      'plain-text',
      coupon.discountValue.toString(),
      'numeric'
    );
  };

  return (
    <Wrapper>
      <Header>
        <BackBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color="#111827" />
        </BackBtn>
        <HeaderTitle>Promotions & Coupons</HeaderTitle>
        <AddBtn onPress={handleAddCoupon}>
          <FontAwesome5 name="plus" size={18} color="#ffffff" />
        </AddBtn>
      </Header>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {coupons.map((coupon) => (
          <CouponCard key={coupon.id}>
            <CouponHeader>
              <CouponCode>{coupon.code}</CouponCode>
              <StatusBadge isActive={coupon.isActive}>
                <StatusText isActive={coupon.isActive}>
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </StatusText>
              </StatusBadge>
            </CouponHeader>

            <DiscountInfo>
              <DiscountLabel>Discount:</DiscountLabel>
              <DiscountValue>
                {coupon.discountType === 'percentage'
                  ? `${coupon.discountValue}% OFF`
                  : `₹${coupon.discountValue} OFF`}
              </DiscountValue>
            </DiscountInfo>

            <InfoSection>
              <InfoRow>
                <InfoIcon>
                  <FontAwesome5 name="rupee-sign" size={12} color="#6b7280" />
                </InfoIcon>
                <InfoText>Min Order: ₹{coupon.minOrderAmount.toLocaleString()}</InfoText>
              </InfoRow>
              <InfoRow>
                <InfoIcon>
                  <FontAwesome5 name="calendar" size={12} color="#6b7280" />
                </InfoIcon>
                <InfoText>Valid Until: {coupon.validUntil}</InfoText>
              </InfoRow>
              <InfoRow>
                <InfoIcon>
                  <FontAwesome5 name="chart-line" size={12} color="#6b7280" />
                </InfoIcon>
                <InfoText>
                  Usage: {coupon.usedCount}/{coupon.usageLimit}
                </InfoText>
              </InfoRow>
            </InfoSection>

            <ProgressBar>
              <ProgressFill
                style={{
                  width: `${(coupon.usedCount / coupon.usageLimit) * 100}%`,
                }}
              />
            </ProgressBar>

            <ActionRow>
              <ActionBtn onPress={() => handleEditCoupon(coupon)}>
                <FontAwesome5 name="edit" size={14} color="#3B82F6" />
                <ActionText style={{ color: '#3B82F6' }}>Edit</ActionText>
              </ActionBtn>
              <ActionBtn onPress={() => toggleCouponStatus(coupon.id)}>
                <FontAwesome5
                  name={coupon.isActive ? 'toggle-on' : 'toggle-off'}
                  size={14}
                  color={coupon.isActive ? '#10B981' : '#9CA3AF'}
                />
                <ActionText
                  style={{ color: coupon.isActive ? '#10B981' : '#9CA3AF' }}
                >
                  {coupon.isActive ? 'Disable' : 'Enable'}
                </ActionText>
              </ActionBtn>
              <ActionBtn onPress={() => deleteCoupon(coupon.id)}>
                <FontAwesome5 name="trash" size={14} color="#EF4444" />
                <ActionText style={{ color: '#EF4444' }}>Delete</ActionText>
              </ActionBtn>
            </ActionRow>
          </CouponCard>
        ))}
      </ScrollView>
    </Wrapper>
  );
};

export default AdminPromotionsScreen;

const Wrapper = styled.View`
  flex: 1;
  background-color: #f9fafb;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const BackBtn = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f9fafb;
  align-items: center;
  justify-content: center;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  flex: 1;
  text-align: center;
`;

const AddBtn = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #0f8a3c;
  align-items: center;
  justify-content: center;
`;

const CouponCard = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const CouponHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const CouponCode = styled.Text`
  font-size: 18px;
  font-weight: 800;
  color: #0f8a3c;
  letter-spacing: 1px;
`;

const StatusBadge = styled.View<{ isActive: boolean }>`
  padding: 4px 12px;
  border-radius: 12px;
  background-color: ${(props: { isActive: boolean }) => (props.isActive ? '#D1FAE5' : '#FEE2E2')};
`;

const StatusText = styled.Text<{ isActive: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${(props: { isActive: boolean }) => (props.isActive ? '#10B981' : '#EF4444')};
`;

const DiscountInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const DiscountLabel = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-right: 8px;
`;

const DiscountValue = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;

const InfoSection = styled.View`
  margin-bottom: 12px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
`;

const InfoIcon = styled.View`
  width: 20px;
  align-items: center;
`;

const InfoText = styled.Text`
  font-size: 13px;
  color: #6b7280;
  margin-left: 4px;
`;

const ProgressBar = styled.View`
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 12px;
`;

const ProgressFill = styled.View`
  height: 100%;
  background-color: #0f8a3c;
  border-radius: 3px;
`;

const ActionRow = styled.View`
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: #e5e7eb;
  padding-top: 12px;
  justify-content: space-around;
`;

const ActionBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 8px 10px;
  border-radius: 8px;
  background-color: #f9fafb;
`;

const ActionText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  margin-left: 4px;
`;
