import React from 'react';
import { Modal, ScrollView, View, Alert } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store';
import { removeFromCart, updateQuantity, addToCart, selectCartTotal } from '../store/cartSlice';
import { calculatePouchPrice } from '../store/pouchSlice';
import { GST_RATE, DEFAULT_SHIPPING_FEE } from '../constants';
import {
  quantityValidator,
  DEFAULT_QUANTITY_OPTIONS,
  showQuantityValidationAlert,
} from '../utils/quantityValidator';

interface CartModalProps {
  visible: boolean;
  onClose: () => void;
  onCheckoutSuccess: () => void;
  navigation?: any;
}

const CartModal: React.FC<CartModalProps> = ({ visible, onClose, onCheckoutSuccess, navigation }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((s) => s.cart.items);
  const products = useAppSelector((s) => s.products.items);
  const subtotal = useAppSelector(selectCartTotal);
  const setupFees = cartItems.reduce((s, i) => s + i.setupFee, 0);
  const shipping = cartItems.length > 0 ? DEFAULT_SHIPPING_FEE : 0;
  const gst = Number(((subtotal + setupFees + shipping) * GST_RATE).toFixed(2));
  const total = Number((subtotal + setupFees + shipping + gst).toFixed(2));

  const handleQty = (cartId: string, dir: 'inc' | 'dec', qty: number, productId: string) => {
    const item = cartItems.find((i) => i.cartId === cartId);

    // Handle pouch items separately
    if (item?.category === 'pouch') {
      const result =
        dir === 'inc'
          ? quantityValidator.validateQuantityIncrement(qty, DEFAULT_QUANTITY_OPTIONS)
          : quantityValidator.validateQuantityDecrement(qty, DEFAULT_QUANTITY_OPTIONS);

      if (!result.isValid) {
        if (result.alertType === 'min_order') {
          Alert.alert('Min Order', result.message ?? 'Minimum quantity reached.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', style: 'destructive', onPress: () => dispatch(removeFromCart(cartId)) },
          ]);
        } else {
          showQuantityValidationAlert(result);
        }
        return;
      }

      const newQty = result.newQuantity!;
      if (result.shouldShowAlert) {
        showQuantityValidationAlert(result);
      }

      if (item.pouchConfig) {
        const newTotal = calculatePouchPrice({
          pouchType: item.pouchConfig.pouchType,
          windowOption: item.pouchConfig.windowOption,
          materialType: item.pouchConfig.materialType,
          capacity: item.pouchConfig.capacity,
          quantity: newQty,
          artworkUri: item.pouchConfig.artworkUri,
          needsDesignAssistance: item.pouchConfig.needsDesignAssistance,
        });
        dispatch(removeFromCart(cartId));
        dispatch(addToCart({
          ...item,
          quantity: newQty,
          totalPrice: newTotal,
          unitPrice: newTotal / newQty,
        }));
      }
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const result =
      dir === 'inc'
        ? quantityValidator.validateQuantityIncrement(qty, DEFAULT_QUANTITY_OPTIONS)
        : quantityValidator.validateQuantityDecrement(qty, DEFAULT_QUANTITY_OPTIONS);

    if (!result.isValid) {
      if (result.alertType === 'min_order') {
        Alert.alert('Min Order', result.message ?? 'Minimum quantity reached.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => dispatch(removeFromCart(cartId)) },
        ]);
      } else {
        showQuantityValidationAlert(result);
      }
      return;
    }

    if (result.shouldShowAlert) {
      showQuantityValidationAlert(result);
    }

    dispatch(updateQuantity({ cartId, quantity: result.newQuantity!, product }));
  };

  const handleCheckout = () => {
    if (!cartItems.length) return;
    onClose();
    onCheckoutSuccess();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Overlay>
        <Sheet>
          <Handle />
          {/* Header */}
          <ModalHeader>
            <HeaderLeft>
              <HeaderIconWrap>
                <FontAwesome5 name="shopping-bag" size={16} color="#0F8A3C" />
              </HeaderIconWrap>
              <HeaderTitle>Your Cart</HeaderTitle>
              {cartItems.length > 0 && <HeaderCount>{cartItems.length}</HeaderCount>}
            </HeaderLeft>
            <CloseBtn onPress={onClose}>
              <FontAwesome5 name="times" size={16} color="#6B7280" />
            </CloseBtn>
          </ModalHeader>

          {cartItems.length === 0 ? (
            <EmptyWrap>
              <EmptyIconWrap>
                <FontAwesome5 name="shopping-bag" size={36} color="#D1D5DB" />
              </EmptyIconWrap>
              <EmptyTitle>Cart is empty</EmptyTitle>
              <EmptyDesc>Customize a product in the Design Studio to add items.</EmptyDesc>
              <BrowseCatalogBtn onPress={() => { onClose(); if (navigation) navigation.navigate('Products'); }} activeOpacity={0.9}>
                <FontAwesome5 name="box-open" size={13} color="#0F8A3C" style={{ marginRight: 6 }} />
                <BrowseCatalogBtnText>Browse Catalog</BrowseCatalogBtnText>
              </BrowseCatalogBtn>
            </EmptyWrap>
          ) : (
            <>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
                {cartItems.map((item) => (
                  <CartItem key={item.cartId}>
                    <CartItemIcon>
                      <FontAwesome5
                        name={item.category === 'bag' || item.category === 'pouch' ? 'shopping-bag' : item.category === 'tape' ? 'tape' : 'box-open'}
                        size={18}
                        color="#374151"
                      />
                    </CartItemIcon>
                    <CartItemInfo>
                      <CartItemName>{item.name}</CartItemName>
                      <CartItemSpec>
                        {item.category === 'pouch' && item.pouchConfig
                          ? `${item.pouchConfig.capacity} • ${item.pouchConfig.windowOption === 'with_window' ? 'With Window' : 'No Window'} • ${item.pouchConfig.materialType}`
                          : `${item.design.length}" × ${item.design.width}" · ${item.design.materialId.replace(/-/g, ' ')}`}
                      </CartItemSpec>
                      <CartItemPriceRow>
                        <CartQtyRow>
                          <CartQtyBtn onPress={() => handleQty(item.cartId, 'dec', item.quantity, item.productId)}>
                            <FontAwesome5 name="minus" size={9} color="#374151" />
                          </CartQtyBtn>
                          <CartQtyNum>{item.quantity.toLocaleString()}</CartQtyNum>
                          <CartQtyBtn onPress={() => handleQty(item.cartId, 'inc', item.quantity, item.productId)}>
                            <FontAwesome5 name="plus" size={9} color="#374151" />
                          </CartQtyBtn>
                        </CartQtyRow>
                        <CartUnitPrice>
                          ₹{item.unitPrice.toFixed(2)}/{item.category === 'pouch' ? 'pc' : 'unit'}
                        </CartUnitPrice>
                      </CartItemPriceRow>
                    </CartItemInfo>
                    <CartItemRight>
                      <CartRemoveBtn onPress={() => dispatch(removeFromCart(item.cartId))}>
                        <FontAwesome5 name="times" size={12} color="#9CA3AF" />
                      </CartRemoveBtn>
                      <CartItemTotal>
                        ₹{item.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </CartItemTotal>
                    </CartItemRight>
                  </CartItem>
                ))}

                {/* Summary */}
                <SummaryBox>
                  <SummaryTitle>Order Summary</SummaryTitle>
                  <SummaryLine><SumKey>Subtotal</SumKey><SumVal>₹{subtotal.toFixed(2)}</SumVal></SummaryLine>
                  <SummaryLine><SumKey>Print Setup</SumKey><SumVal>₹{setupFees.toFixed(2)}</SumVal></SummaryLine>
                  <SummaryLine><SumKey>Shipping</SumKey><SumVal>₹{shipping.toFixed(2)}</SumVal></SummaryLine>
                  <SummaryLine><SumKey>GST (9%)</SumKey><SumVal>₹{gst.toFixed(2)}</SumVal></SummaryLine>
                  <SumDivider />
                  <SumTotalRow>
                    <SumTotalLabel>Total</SumTotalLabel>
                    <SumTotalVal>₹{total.toFixed(2)}</SumTotalVal>
                  </SumTotalRow>
                </SummaryBox>
              </ScrollView>

              <CheckoutBtn onPress={handleCheckout} activeOpacity={0.9}
                style={{ shadowColor: '#0F8A3C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 }}>
                <CheckoutBtnText>Proceed to Checkout</CheckoutBtnText>
                <FontAwesome5 name="arrow-right" size={14} color="#FFF" style={{ marginLeft: 8 }} />
              </CheckoutBtn>
            </>
          )}
        </Sheet>
      </Overlay>
    </Modal>
  );
};

export default CartModal;

const Overlay = styled.View`
  flex: 1; background-color: rgba(0,0,0,0.5); justify-content: flex-end;
`;
const Sheet = styled.View`
  background-color: #FFFFFF; border-top-left-radius: 32px; border-top-right-radius: 32px;
  height: 85%; padding: 0 20px 32px;
`;
const Handle = styled.View`
  width: 40px; height: 5px; border-radius: 3px;
  background-color: #E5E7EB; align-self: center; margin-top: 14px; margin-bottom: 4px;
`;
const ModalHeader = styled.View`
  flex-direction: row; align-items: center; justify-content: space-between; padding-vertical: 16px;
`;
const HeaderLeft = styled.View`flex-direction: row; align-items: center;`;
const HeaderIconWrap = styled.View`
  width: 34px; height: 34px; border-radius: 10px;
  background-color: #DCFCE7; align-items: center; justify-content: center; margin-right: 10px;
`;
const HeaderTitle = styled.Text`font-size: 18px; font-weight: 800; color: #111827;`;
const HeaderCount = styled.Text`
  font-size: 12px; font-weight: 800; color: #FFFFFF;
  background-color: #0F8A3C; width: 20px; height: 20px; border-radius: 10px;
  text-align: center; line-height: 20px; margin-left: 8px;
`;
const CloseBtn = styled.TouchableOpacity`
  width: 34px; height: 34px; border-radius: 10px;
  background-color: #F9FAFB; align-items: center; justify-content: center;
`;

const EmptyWrap = styled.View`flex: 1; align-items: center; justify-content: center; padding: 20px;`;
const EmptyIconWrap = styled.View`
  width: 80px; height: 80px; border-radius: 24px;
  background-color: #F9FAFB; align-items: center; justify-content: center; margin-bottom: 16px;
  border-width: 1px; border-color: #F3F4F6;
`;
const EmptyTitle = styled.Text`font-size: 17px; font-weight: 700; color: #374151; margin-bottom: 6px;`;
const EmptyDesc = styled.Text`font-size: 13px; color: #9CA3AF; text-align: center; line-height: 19px; margin-bottom: 20px;`;
const BrowseCatalogBtn = styled.TouchableOpacity`
  flex-direction: row; align-items: center; justify-content: center;
  height: 46px; border-radius: 14px; padding-horizontal: 24px;
  border-width: 1.5px; border-color: #0F8A3C;
`;
const BrowseCatalogBtnText = styled.Text`font-size: 14px; font-weight: 700; color: #0F8A3C;`;

const CartItem = styled.View`
  flex-direction: row; align-items: center;
  background-color: #F9FAFB; border-radius: 14px; padding: 12px;
  border-width: 1px; border-color: #F3F4F6; margin-bottom: 10px;
`;
const CartItemIcon = styled.View`
  width: 44px; height: 44px; border-radius: 12px;
  background-color: #FFFFFF; align-items: center; justify-content: center;
  margin-right: 12px; border-width: 1px; border-color: #E5E7EB;
`;
const CartItemInfo = styled.View`flex: 1;`;
const CartItemName = styled.Text`font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 3px;`;
const CartItemSpec = styled.Text`font-size: 10px; color: #9CA3AF; margin-bottom: 6px;`;
const CartItemPriceRow = styled.View`flex-direction: row; align-items: center;`;
const CartQtyRow = styled.View`
  flex-direction: row; align-items: center;
  background-color: #FFFFFF; border-radius: 8px; padding: 3px;
  border-width: 1px; border-color: #E5E7EB; margin-right: 8px;
`;
const CartQtyBtn = styled.TouchableOpacity`
  width: 22px; height: 22px; align-items: center; justify-content: center;
`;
const CartQtyNum = styled.Text`font-size: 12px; font-weight: 700; color: #111827; padding-horizontal: 6px;`;
const CartUnitPrice = styled.Text`font-size: 10px; color: #9CA3AF;`;
const CartItemRight = styled.View`align-items: flex-end; justify-content: space-between; padding-left: 8px;`;
const CartRemoveBtn = styled.TouchableOpacity`
  width: 24px; height: 24px; border-radius: 7px;
  background-color: #FFFFFF; align-items: center; justify-content: center;
  border-width: 1px; border-color: #E5E7EB; margin-bottom: 6px;
`;
const CartItemTotal = styled.Text`font-size: 14px; font-weight: 800; color: #111827;`;

const SummaryBox = styled.View`
  background-color: #F9FAFB; border-radius: 14px;
  padding: 14px; margin-top: 4px; border-width: 1px; border-color: #F3F4F6;
`;
const SummaryTitle = styled.Text`
  font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 12px;
  text-transform: uppercase; letter-spacing: 0.5px;
`;
const SummaryLine = styled.View`flex-direction: row; justify-content: space-between; margin-bottom: 7px;`;
const SumKey = styled.Text`font-size: 12px; color: #9CA3AF;`;
const SumVal = styled.Text`font-size: 12px; font-weight: 600; color: #374151;`;
const SumDivider = styled.View`height: 1px; background-color: #E5E7EB; margin-vertical: 8px;`;
const SumTotalRow = styled.View`flex-direction: row; justify-content: space-between; align-items: center;`;
const SumTotalLabel = styled.Text`font-size: 15px; font-weight: 700; color: #111827;`;
const SumTotalVal = styled.Text`font-size: 20px; font-weight: 800; color: #0F8A3C;`;

const CheckoutBtn = styled.TouchableOpacity`
  height: 54px; background-color: #0F8A3C; border-radius: 16px;
  flex-direction: row; align-items: center; justify-content: center; margin-top: 14px;
`;
const CheckoutBtnText = styled.Text`font-size: 15px; font-weight: 700; color: #FFFFFF;`;
