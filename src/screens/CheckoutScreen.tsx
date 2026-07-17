import React, { useState, useEffect } from 'react';
import { ScrollView, View, Alert, Platform, Modal, TextInput, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store';
import { clearCart, selectCartTotal } from '../store/cartSlice';
import { placeOrder } from '../store/ordersSlice';
import { GST_RATE, DEFAULT_SHIPPING_FEE } from '../constants';
import { getTabBarHeight } from '../utils/layoutUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / QR', icon: 'qrcode' },
  { id: 'bank', label: 'Bank Transfer', icon: 'university' },
  { id: 'credit', label: 'Credit Terms (For Existing Customers)', icon: 'handshake' },
];

const CheckoutScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((s) => s.cart.items);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const subtotal = useAppSelector(selectCartTotal);
  const setupFees = cartItems.reduce((s, i) => s + i.setupFee, 0);
  const shipping = DEFAULT_SHIPPING_FEE;
  const gst = Number(((subtotal + setupFees + shipping) * GST_RATE).toFixed(2));
  const total = Number((subtotal + setupFees + shipping + gst).toFixed(2));

  // Calculate proper bottom padding for button
  const tabBarHeight = getTabBarHeight();
  const bottomBarHeight = 90;
  const totalBottomPadding = tabBarHeight + bottomBarHeight + 20;

  const [payment, setPayment] = useState('upi');
  const [company, setCompany] = useState('Work');
  const [street, setStreet] = useState('No.12, 2nd Cross, Peenaya Industrial Area,\nBangalore – 560058, Karnataka');
  const [gstNumber, setGstNumber] = useState('29ABCDE1234F1Z5');
  const [gstChange, setGstChange] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editCompany, setEditCompany] = useState(company);
  const [editStreet, setEditStreet] = useState(street);
  const [editGst, setEditGst] = useState(gstNumber);
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [phoneVerified, setPhoneVerified] = useState(false);

  // Check if mobile verification is needed on screen focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Check route params for verification result
      const params = navigation.getState().routes[navigation.getState().routes.length - 1].params;
      
      if (params?.phoneVerified && params?.verifiedPhone) {
        setVerifiedPhone(params.verifiedPhone);
        setPhoneVerified(true);
      } else if (!phoneVerified) {
        // If not verified, redirect to mobile verification
        navigation.replace('MobileVerification');
      }
    });

    return unsubscribe;
  }, [navigation, phoneVerified]);

  const handlePlaceOrder = () => {
    if (!company.trim()) { Alert.alert('Missing', 'Enter company / address name.'); return; }
    if (cartItems.length === 0) { Alert.alert('Empty Cart', 'Add items to cart first.'); return; }
    if (!gstNumber.trim()) { Alert.alert('Missing', 'Please enter a valid GST number.'); return; }

    // Show payment confirmation
    Alert.alert(
      'Confirm Order',
      `Total Amount: ₹${total.toLocaleString()}\nPayment Method: ${PAYMENT_METHODS.find(p => p.id === payment)?.label}\n\nProceed with order?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Pay',
          onPress: () => {
            const orderId = `PCH${Math.floor(1000 + Math.random() * 9000)}`;
            const order = {
              id: orderId,
              date: new Date().toISOString(),
              status: 'pending_review' as const,
              subtotal, setupFees, shipping, tax: gst, total,
              estimatedDelivery: new Date(Date.now() + 15 * 86400000)
                .toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
              shippingAddress: { company, street, city: 'Bangalore', state: 'Karnataka', zip: '560058', country: 'India' },
              trackingNumber: null,
              milestones: [
                { status: 'pending_review' as const, label: 'Order Confirmed', description: 'Order received.', timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), isCompleted: true },
                { status: 'artwork_approved' as const, label: 'Artwork Approved', description: 'Artwork being reviewed.', timestamp: null, isCompleted: false },
                { status: 'in_production' as const, label: 'Production Started', description: 'Printing in progress.', timestamp: null, isCompleted: false },
                { status: 'quality_check' as const, label: 'Printing', description: 'QC inspection.', timestamp: null, isCompleted: false },
                { status: 'shipped' as const, label: 'Dispatched', description: 'Handed to courier.', timestamp: null, isCompleted: false },
                { status: 'delivered' as const, label: 'Delivered', description: 'Delivered.', timestamp: null, isCompleted: false },
              ],
              items: [...cartItems],
            };
            dispatch(placeOrder(order));
            dispatch(clearCart());
            navigation.replace('OrderPlaced', { orderId });
          },
        },
      ]
    );
  };

  return (
    <Container>
      <NavBar>
        <NavBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={16} color="#111827" />
        </NavBtn>
        <NavTitle>Checkout</NavTitle>
        <View style={{ width: 36 }} />
      </NavBar>

      {/* Mobile Verification Status */}
      {phoneVerified && verifiedPhone && (
        <VerificationStatusBar>
          <VerificationStatusContent>
            <FontAwesome5 name="check-circle" size={16} color="#10B981" style={{ marginRight: 8 }} />
            <VerificationStatusText>Phone verified: {verifiedPhone}</VerificationStatusText>
            <ChangePhoneBtn onPress={() => {
              setPhoneVerified(false);
              setVerifiedPhone(null);
              navigation.replace('MobileVerification');
            }}>
              <ChangePhoneText>Change</ChangePhoneText>
            </ChangePhoneBtn>
          </VerificationStatusContent>
        </VerificationStatusBar>
      )}

      {/* Address Edit Modal */}
      <Modal visible={showAddressModal} animationType="slide" transparent>
        <ModalOverlay>
          <ModalSheet>
            <ModalHeader>
              <ModalTitle>Edit Delivery Address</ModalTitle>
              <ModalCloseBtn onPress={() => setShowAddressModal(false)}>
                <FontAwesome5 name="times" size={16} color="#6B7280" />
              </ModalCloseBtn>
            </ModalHeader>
            <ModalLabel>Company / Name</ModalLabel>
            <ModalInput
              value={editCompany}
              onChangeText={setEditCompany}
              placeholder="Company name"
              placeholderTextColor="#D1D5DB"
            />
            <ModalLabel>Street Address</ModalLabel>
            <ModalInput
              value={editStreet}
              onChangeText={setEditStreet}
              placeholder="Street, city, state, ZIP"
              placeholderTextColor="#D1D5DB"
              multiline
              numberOfLines={3}
              style={{ height: 80, textAlignVertical: 'top', paddingTop: 10 }}
            />
            <ModalLabel>GST Number</ModalLabel>
            <ModalInput
              value={editGst}
              onChangeText={setEditGst}
              placeholder="e.g. 29ABCDE1234F1Z5"
              placeholderTextColor="#D1D5DB"
              autoCapitalize="characters"
              maxLength={15}
            />
            <ModalSaveBtn onPress={() => {
              if (!editCompany.trim()) { Alert.alert('Missing', 'Enter company name.'); return; }
              setCompany(editCompany);
              setStreet(editStreet);
              setGstNumber(editGst);
              setShowAddressModal(false);
            }} activeOpacity={0.9}>
              <ModalSaveBtnText>Save Address</ModalSaveBtnText>
            </ModalSaveBtn>
          </ModalSheet>
        </ModalOverlay>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: totalBottomPadding, alignItems: 'center' }}>
        <ContentWrapper>
        {/* Progress Indicator */}
        <ProgressBar>
          <ProgressStep completed>
            <ProgressStepCircle completed>
              <FontAwesome5 name="check" size={12} color="#FFFFFF" />
            </ProgressStepCircle>
            <ProgressStepLabel completed>Cart</ProgressStepLabel>
          </ProgressStep>
          <ProgressLine />
          <ProgressStep active>
            <ProgressStepCircle active>
              <ProgressStepNumber>2</ProgressStepNumber>
            </ProgressStepCircle>
            <ProgressStepLabel active>Checkout</ProgressStepLabel>
          </ProgressStep>
          <ProgressLine />
          <ProgressStep>
            <ProgressStepCircle>
              <ProgressStepNumber>3</ProgressStepNumber>
            </ProgressStepCircle>
            <ProgressStepLabel>Confirm</ProgressStepLabel>
          </ProgressStep>
        </ProgressBar>

        {/* Order Summary */}
        <SectionCard>
          <SectionTitle>Order Summary</SectionTitle>
          <OrderSummaryRow>
            <OrderSummaryLabel>{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}</OrderSummaryLabel>
            <OrderSummaryValue>₹{subtotal.toLocaleString()}</OrderSummaryValue>
          </OrderSummaryRow>
          {setupFees > 0 && (
            <OrderSummaryRow>
              <OrderSummaryLabel>Setup Fee</OrderSummaryLabel>
              <OrderSummaryValue>₹{setupFees.toLocaleString()}</OrderSummaryValue>
            </OrderSummaryRow>
          )}
          <OrderSummaryRow>
            <OrderSummaryLabel>Shipping</OrderSummaryLabel>
            <OrderSummaryValue>₹{shipping.toLocaleString()}</OrderSummaryValue>
          </OrderSummaryRow>
          <OrderSummaryRow>
            <OrderSummaryLabel>GST (9%)</OrderSummaryLabel>
            <OrderSummaryValue>₹{gst.toLocaleString()}</OrderSummaryValue>
          </OrderSummaryRow>
          <OrderSummaryDivider />
          <OrderSummaryRow>
            <OrderSummaryTotalLabel>Total Amount</OrderSummaryTotalLabel>
            <OrderSummaryTotalValue>₹{total.toLocaleString()}</OrderSummaryTotalValue>
          </OrderSummaryRow>
        </SectionCard>

        {/* Delivery Address */}
        <SectionCard>
          <SectionHeader>
            <SectionTitle>Delivery Address</SectionTitle>
            <ChangeBtn onPress={() => {
              setEditCompany(company);
              setEditStreet(street);
              setEditGst(gstNumber);
              setShowAddressModal(true);
            }} activeOpacity={0.8}>
              <ChangeBtnText>Change</ChangeBtnText>
            </ChangeBtn>
          </SectionHeader>
          <AddressName>{company}</AddressName>
          <AddressLine>{street}</AddressLine>
        </SectionCard>

        {/* GST Details */}
        <SectionCard>
          <SectionHeader>
            <SectionTitle>GST Details</SectionTitle>
            <ChangeBtn onPress={() => {
              setEditCompany(company);
              setEditStreet(street);
              setEditGst(gstNumber);
              setShowAddressModal(true);
            }} activeOpacity={0.8}>
              <ChangeBtnText>Change</ChangeBtnText>
            </ChangeBtn>
          </SectionHeader>
          <GSTRow>
            <GSTKey>GST Number</GSTKey>
            <GSTVal>{gstNumber || 'Not set'}</GSTVal>
          </GSTRow>
        </SectionCard>

        {/* Payment Method */}
        <SectionCard>
          <SectionTitle style={{ marginBottom: 14 }}>Payment Method</SectionTitle>
          {PAYMENT_METHODS.map((pm) => (
            <PayOption
              key={pm.id}
              active={payment === pm.id}
              disabled={pm.id === 'credit'}
              onPress={() => {
                if (pm.id === 'credit') {
                  Alert.alert(
                    'Credit Terms',
                    'Credit payment is only available for existing customers with approved credit terms. Please contact our sales team.',
                    [{ text: 'OK' }]
                  );
                  return;
                }
                setPayment(pm.id);
              }}
              activeOpacity={pm.id === 'credit' ? 1 : 0.85}
            >
              <RadioOuter active={payment === pm.id} disabled={pm.id === 'credit'}>
                {payment === pm.id && <RadioInner />}
              </RadioOuter>
              <PayLabelWrapper>
                <PayLabel disabled={pm.id === 'credit'}>{pm.label}</PayLabel>
                {pm.id === 'credit' && (
                  <PaymentNote>Approval required</PaymentNote>
                )}
              </PayLabelWrapper>
            </PayOption>
          ))}
        </SectionCard>
        </ContentWrapper>
      </ScrollView>

      {/* Place Order */}
      <BottomBar tabBarHeight={tabBarHeight}>
        <PlaceOrderBtn onPress={handlePlaceOrder} activeOpacity={0.9}>
          <FontAwesome5 name="lock" size={14} color="#FFFFFF" style={{ marginRight: 10 }} />
          <PlaceOrderText>Review & Place Order</PlaceOrderText>
        </PlaceOrderBtn>
      </BottomBar>
    </Container>
  );
};

export default CheckoutScreen;

const Container = styled.View`flex: 1; background-color: #F8F9FA;`;

const ContentWrapper = styled.View`
  width: 100%;
  max-width: 900px;
  align-self: center;
`;

const NavBar = styled.View`
  height: ${Platform.OS === 'ios' ? '94px' : '56px'};
  padding-top: ${Platform.OS === 'ios' ? '48px' : '0px'};
  flex-direction: row; align-items: center; justify-content: space-between;
  padding-horizontal: 16px; background-color: #FFFFFF;
  border-bottom-width: 1px; border-bottom-color: #E5E7EB;
`;
const NavBtn = styled.TouchableOpacity`
  width: 36px; height: 36px; border-radius: 10px;
  background-color: #F9FAFB; align-items: center; justify-content: center;
  border-width: 1px; border-color: #E5E7EB;
`;
const NavTitle = styled.Text`font-size: 17px; font-weight: 700; color: #111827;`;

const VerificationStatusBar = styled.View`
  background-color: #ECFDF5;
  border-bottom-width: 1px;
  border-bottom-color: #D1FAE5;
  padding: 12px 16px;
`;

const VerificationStatusContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const VerificationStatusText = styled.Text`
  font-size: 13px;
  font-weight: 500;
  color: #065F46;
  flex: 1;
  margin-left: 8px;
`;

const ChangePhoneBtn = styled.TouchableOpacity`
  padding: 6px 12px;
  background-color: #D1FAE5;
  border-radius: 6px;
`;

const ChangePhoneText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: #059669;
`;

const SectionCard = styled.View`
  background-color: #FFFFFF; border-radius: 14px; padding: 16px;
  border-width: 1px; border-color: #E5E7EB; margin-bottom: 12px;
`;
const SectionHeader = styled.View`flex-direction: row; align-items: center; justify-content: space-between; margin-bottom: 10px;`;
const SectionTitle = styled.Text`font-size: 15px; font-weight: 700; color: #111827;`;
const ChangeBtn = styled.TouchableOpacity``;
const ChangeBtnText = styled.Text`font-size: 13px; font-weight: 600; color: #0F8A3C;`;

const AddressName = styled.Text`font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 4px;`;
const AddressLine = styled.Text`font-size: 13px; color: #6B7280; line-height: 20px;`;

const GSTRow = styled.View``;
const GSTKey = styled.Text`font-size: 12px; color: #9CA3AF; margin-bottom: 3px;`;
const GSTVal = styled.Text`font-size: 14px; font-weight: 600; color: #374151;`;

const PayOption = styled.TouchableOpacity<{ active: boolean; disabled?: boolean }>`
  flex-direction: row; align-items: center; padding: 12px 0;
  border-bottom-width: 1px; border-bottom-color: #F3F4F6;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;
const RadioOuter = styled.View<{ active: boolean; disabled?: boolean }>`
  width: 20px; height: 20px; border-radius: 10px; border-width: 2px;
  border-color: ${({ active, disabled }: { active: boolean; disabled?: boolean }) => 
    disabled ? '#D1D5DB' : active ? '#0F8A3C' : '#D1D5DB'};
  align-items: center; justify-content: center; margin-right: 12px;
`;
const RadioInner = styled.View`
  width: 8px; height: 8px; border-radius: 4px; background-color: #0F8A3C;
`;
const PayLabelWrapper = styled.View`
  flex: 1;
`;
const PayLabel = styled.Text<{ disabled?: boolean }>`
  font-size: 14px; 
  color: ${({ disabled }) => disabled ? '#9CA3AF' : '#374151'}; 
  font-weight: 500;
`;
const PaymentNote = styled.Text`
  font-size: 11px;
  color: #9CA3AF;
  margin-top: 2px;
`;

const BottomBar = styled.View<{ tabBarHeight: number }>`
  position: absolute;
  bottom: ${({ tabBarHeight }) => `${tabBarHeight}px`};
  left: 0;
  right: 0;
  width: 100%;
  padding: 12px 16px;
  background-color: #FFFFFF;
  border-top-width: 1px;
  border-top-color: #E5E7EB;
  z-index: 1000;
  elevation: 10;
  box-sizing: border-box;
`;
const PlaceOrderBtn = styled.TouchableOpacity`
  flex-direction: row;
  height: 52px; background-color: #0F8A3C; border-radius: 14px;
  align-items: center; justify-content: center;
`;
const PlaceOrderText = styled.Text`font-size: 16px; font-weight: 700; color: #FFFFFF;`;

const ProgressBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #FFFFFF;
  border-radius: 14px;
  padding: 20px 16px;
  margin-bottom: 16px;
  border-width: 1px;
  border-color: #E5E7EB;
`;

const ProgressStep = styled.View<{ completed?: boolean; active?: boolean }>`
  align-items: center;
  flex: 1;
`;

const ProgressStepCircle = styled.View<{ completed?: boolean; active?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${({ completed, active }) => 
    completed ? '#10B981' : active ? '#0F8A3C' : '#F3F4F6'};
  border-width: ${({ completed, active }) => (completed || active) ? 0 : 2}px;
  border-color: #E5E7EB;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
`;

const ProgressStepNumber = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #9CA3AF;
`;

const ProgressStepLabel = styled.Text<{ completed?: boolean; active?: boolean }>`
  font-size: 12px;
  font-weight: ${({ completed, active }) => (completed || active) ? '700' : '500'};
  color: ${({ completed, active }) => 
    completed ? '#10B981' : active ? '#0F8A3C' : '#9CA3AF'};
`;

const ProgressLine = styled.View`
  flex: 1;
  height: 2px;
  background-color: #E5E7EB;
  margin-horizontal: 4px;
  margin-bottom: 32px;
`;

const OrderSummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const OrderSummaryLabel = styled.Text`
  font-size: 13px;
  color: #6B7280;
  font-weight: 500;
`;

const OrderSummaryValue = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const OrderSummaryDivider = styled.View`
  height: 1px;
  background-color: #E5E7EB;
  margin-vertical: 12px;
`;

const OrderSummaryTotalLabel = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;

const OrderSummaryTotalValue = styled.Text`
  font-size: 22px;
  font-weight: 800;
  color: #0F8A3C;
`;

/* Address Edit Modal */
const ModalOverlay = styled.View`
  flex: 1; background-color: rgba(0,0,0,0.5); justify-content: flex-end;
`;
const ModalSheet = styled.View`
  background-color: #FFFFFF; border-top-left-radius: 24px; border-top-right-radius: 24px;
  padding: 20px 20px ${Platform.OS === 'ios' ? '40px' : '24px'};
`;
const ModalHeader = styled.View`
  flex-direction: row; align-items: center; justify-content: space-between; margin-bottom: 18px;
`;
const ModalTitle = styled.Text`font-size: 17px; font-weight: 700; color: #111827;`;
const ModalCloseBtn = styled.TouchableOpacity`
  width: 32px; height: 32px; border-radius: 10px;
  background-color: #F3F4F6; align-items: center; justify-content: center;
`;
const ModalLabel = styled.Text`font-size: 12px; font-weight: 600; color: #6B7280; margin-bottom: 6px;`;
const ModalInput = styled.TextInput`
  border-width: 1.5px; border-color: #E5E7EB; border-radius: 12px;
  padding-horizontal: 14px; height: 46px; font-size: 14px; color: #111827;
  background-color: #F9FAFB; margin-bottom: 14px;
`;
const ModalSaveBtn = styled.TouchableOpacity`
  height: 52px; background-color: #0F8A3C; border-radius: 14px;
  align-items: center; justify-content: center; margin-top: 4px;
`;
const ModalSaveBtnText = styled.Text`font-size: 15px; font-weight: 700; color: #FFFFFF;`;
