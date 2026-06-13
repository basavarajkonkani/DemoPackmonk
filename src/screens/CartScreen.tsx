import React from 'react';
import { ScrollView, View, Alert, Platform } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store';
import { removeFromCart, updateQuantity, clearCart, selectCartTotal } from '../store/cartSlice';
import { GST_RATE, DEFAULT_SHIPPING_FEE } from '../constants';
import {
  POUCH_TYPE_LABELS,
  WINDOW_LABELS,
  MATERIAL_LABELS,
  calculatePouchPrice,
} from '../store/pouchSlice';

const CartScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
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
    if (item?.category === 'pouch') {
      const step = 500;
      const minQty = 1000;
      if (dir === 'dec' && qty <= minQty) {
        Alert.alert('Minimum Quantity', `Min order is ${minQty} pcs.`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => dispatch(removeFromCart(cartId)) },
        ]);
        return;
      }
      const newQty = dir === 'inc' ? qty + step : qty - step;
      if (item.pouchConfig) {
        const updatedConfig = { ...item.pouchConfig, quantity: newQty };
        const newTotal = calculatePouchPrice({
          pouchType: updatedConfig.pouchType,
          windowOption: updatedConfig.windowOption,
          materialType: updatedConfig.materialType,
          capacity: updatedConfig.capacity,
          quantity: newQty,
          artworkUri: updatedConfig.artworkUri,
          needsDesignAssistance: updatedConfig.needsDesignAssistance,
        });
        dispatch(removeFromCart(cartId));
        dispatch({
          type: 'cart/addToCart',
          payload: {
            ...item,
            quantity: newQty,
            totalPrice: newTotal,
            unitPrice: newTotal / newQty,
            pouchConfig: updatedConfig,
          },
        });
      }
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    if (dir === 'dec' && qty <= product.minQuantity) {
      Alert.alert('Minimum Quantity', `Min order is ${product.minQuantity} units.`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => dispatch(removeFromCart(cartId)) },
      ]);
      return;
    }
    const step = product.category === 'tape' ? 5 : 50;
    dispatch(updateQuantity({ cartId, quantity: dir === 'inc' ? qty + step : qty - step, product }));
  };

  if (cartItems.length === 0) {
    return (
      <Container>
        <NavBar>
          <NavBtn onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={16} color="#111827" />
          </NavBtn>
          <NavTitle>My Cart</NavTitle>
          <View style={{ width: 38 }} />
        </NavBar>
        <EmptyWrap>
          <EmptyIcon>
            <FontAwesome5 name="shopping-bag" size={40} color="#9CA3AF" />
          </EmptyIcon>
          <EmptyTitle>Your cart is empty</EmptyTitle>
          <EmptyDesc>Configure a pouch or browse products to get started.</EmptyDesc>
          <BrowseBtn onPress={() => navigation.navigate('PouchConfigurator')} activeOpacity={0.9}>
            <BrowseBtnText>Configure Pouch</BrowseBtnText>
          </BrowseBtn>
        </EmptyWrap>
      </Container>
    );
  }

  return (
    <Container>
      <NavBar>
        <NavBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={16} color="#111827" />
        </NavBtn>
        <NavTitle>My Cart</NavTitle>
        <EditBtn onPress={() => Alert.alert('Clear Cart', 'Remove all items?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear All', style: 'destructive', onPress: () => dispatch(clearCart()) },
        ])}>
          <EditBtnText>Edit</EditBtnText>
        </EditBtn>
      </NavBar>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 160 }}>
        {cartItems.map((item) => (
          <ItemCard key={item.cartId}>
            <ItemIconBox>
              <FontAwesome5
                name={item.category === 'pouch' ? 'shopping-bag' : 'box-open'}
                size={24}
                color="#0F8A3C"
              />
            </ItemIconBox>
            <ItemBody>
              <ItemName>{item.name}</ItemName>

              {item.category === 'pouch' && item.pouchConfig ? (
                <ItemSpec>
                  {WINDOW_LABELS[item.pouchConfig.windowOption]} • {MATERIAL_LABELS[item.pouchConfig.materialType]}{'\n'}
                  {item.pouchConfig.capacity} — {item.pouchConfig.dimensions.width}×{item.pouchConfig.dimensions.height}{item.pouchConfig.dimensions.unit}
                </ItemSpec>
              ) : (
                <ItemSpec>
                  {item.design.length}" × {item.design.width}" · {item.design.materialId.replace(/-/g, ' ')}
                </ItemSpec>
              )}

              <QtyRow>
                <QtyBtn onPress={() => handleQty(item.cartId, 'dec', item.quantity, item.productId)}>
                  <FontAwesome5 name="minus" size={10} color="#374151" />
                </QtyBtn>
                <QtyNum>{item.quantity.toLocaleString()}</QtyNum>
                <QtyBtn onPress={() => handleQty(item.cartId, 'inc', item.quantity, item.productId)}>
                  <FontAwesome5 name="plus" size={10} color="#374151" />
                </QtyBtn>
              </QtyRow>
            </ItemBody>
            <ItemRight>
              <RemoveBtn onPress={() => dispatch(removeFromCart(item.cartId))}>
                <FontAwesome5 name="trash-alt" size={14} color="#EF4444" />
              </RemoveBtn>
              <ItemTotal>
                {item.category === 'pouch' ? `₹${item.totalPrice.toLocaleString()}` : `$${item.totalPrice.toFixed(2)}`}
              </ItemTotal>
            </ItemRight>
          </ItemCard>
        ))}

        {/* GST Details */}
        <GSTCard>
          <GSTHeader>
            <FontAwesome5 name="file-invoice" size={13} color="#374151" style={{ marginRight: 6 }} />
            <GSTTitle>GST Details</GSTTitle>
          </GSTHeader>
          <GSTRow>
            <GSTKey>GST Number</GSTKey>
            <GSTValue>29ABCDE1234F1Z5</GSTValue>
          </GSTRow>
        </GSTCard>

        {/* Order Summary */}
        <SummaryCard>
          <SummaryRow>
            <SummaryKey>Subtotal</SummaryKey>
            <SummaryVal>₹{subtotal.toLocaleString()}</SummaryVal>
          </SummaryRow>
          {setupFees > 0 && (
            <SummaryRow>
              <SummaryKey>Plate Setup</SummaryKey>
              <SummaryVal>₹{setupFees.toLocaleString()}</SummaryVal>
            </SummaryRow>
          )}
          <SummaryRow>
            <SummaryKey>Shipping</SummaryKey>
            <SummaryVal>₹{shipping.toLocaleString()}</SummaryVal>
          </SummaryRow>
          <SummaryRow>
            <SummaryKey>GST (9%)</SummaryKey>
            <SummaryVal>₹{gst.toLocaleString()}</SummaryVal>
          </SummaryRow>
          <SummaryNote>GST rate as applicable</SummaryNote>
          <SummaryDivider />
          <GrandRow>
            <GrandLabel>Total Amount</GrandLabel>
            <GrandVal>₹{total.toLocaleString()}</GrandVal>
          </GrandRow>
        </SummaryCard>
      </ScrollView>

      {/* Checkout Bar */}
      <CheckoutBar>
        <CheckoutBtn onPress={() => navigation.navigate('Checkout')} activeOpacity={0.9}>
          <CheckoutLabel>Proceed to Checkout</CheckoutLabel>
        </CheckoutBtn>
      </CheckoutBar>
    </Container>
  );
};

export default CartScreen;

const Container = styled.View`flex: 1; background-color: #F8F9FA;`;

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
const EditBtn = styled.TouchableOpacity`padding: 6px 12px;`;
const EditBtnText = styled.Text`font-size: 14px; font-weight: 600; color: #0F8A3C;`;

const EmptyWrap = styled.View`flex: 1; align-items: center; justify-content: center; padding: 40px;`;
const EmptyIcon = styled.View`
  width: 80px; height: 80px; border-radius: 24px;
  background-color: #F3F4F6; align-items: center; justify-content: center; margin-bottom: 20px;
`;
const EmptyTitle = styled.Text`font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 8px;`;
const EmptyDesc = styled.Text`font-size: 14px; color: #9CA3AF; text-align: center; line-height: 20px; margin-bottom: 24px;`;
const BrowseBtn = styled.TouchableOpacity`
  height: 50px; background-color: #0F8A3C; border-radius: 14px;
  padding-horizontal: 28px; align-items: center; justify-content: center;
`;
const BrowseBtnText = styled.Text`font-size: 15px; font-weight: 700; color: #FFF;`;

const ItemCard = styled.View`
  flex-direction: row; background-color: #FFFFFF; border-radius: 14px;
  border-width: 1px; border-color: #E5E7EB; padding: 14px; margin-bottom: 12px;
`;
const ItemIconBox = styled.View`
  width: 52px; height: 52px; border-radius: 13px;
  background-color: #DCFCE7; align-items: center; justify-content: center; margin-right: 12px;
`;
const ItemBody = styled.View`flex: 1;`;
const ItemName = styled.Text`font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 3px;`;
const ItemSpec = styled.Text`font-size: 11px; color: #9CA3AF; line-height: 16px; margin-bottom: 8px;`;

const QtyRow = styled.View`
  flex-direction: row; align-items: center; align-self: flex-start;
  background-color: #F9FAFB; border-radius: 10px; padding: 4px;
  border-width: 1px; border-color: #E5E7EB;
`;
const QtyBtn = styled.TouchableOpacity`
  width: 28px; height: 28px; background-color: #FFFFFF; border-radius: 7px;
  align-items: center; justify-content: center; border-width: 1px; border-color: #E5E7EB;
`;
const QtyNum = styled.Text`
  font-size: 14px; font-weight: 700; color: #111827; padding-horizontal: 12px; min-width: 60px; text-align: center;
`;
const ItemRight = styled.View`align-items: flex-end; justify-content: space-between;`;
const RemoveBtn = styled.TouchableOpacity`
  width: 30px; height: 30px; border-radius: 8px;
  background-color: #FEF2F2; align-items: center; justify-content: center;
`;
const ItemTotal = styled.Text`font-size: 15px; font-weight: 800; color: #111827; margin-top: 8px;`;

/* GST Card */
const GSTCard = styled.View`
  background-color: #FFFFFF; border-radius: 14px; padding: 14px;
  border-width: 1px; border-color: #E5E7EB; margin-bottom: 12px;
`;
const GSTHeader = styled.View`flex-direction: row; align-items: center; margin-bottom: 10px;`;
const GSTTitle = styled.Text`font-size: 13px; font-weight: 700; color: #374151;`;
const GSTRow = styled.View`flex-direction: row; justify-content: space-between;`;
const GSTKey = styled.Text`font-size: 12px; color: #9CA3AF;`;
const GSTValue = styled.Text`font-size: 12px; font-weight: 600; color: #374151;`;

/* Summary Card */
const SummaryCard = styled.View`
  background-color: #FFFFFF; border-radius: 14px; padding: 16px;
  border-width: 1px; border-color: #E5E7EB; margin-bottom: 12px;
`;
const SummaryRow = styled.View`flex-direction: row; justify-content: space-between; margin-bottom: 10px;`;
const SummaryKey = styled.Text`font-size: 13px; color: #9CA3AF;`;
const SummaryVal = styled.Text`font-size: 13px; font-weight: 600; color: #374151;`;
const SummaryNote = styled.Text`font-size: 10px; color: #9CA3AF; margin-bottom: 10px;`;
const SummaryDivider = styled.View`height: 1px; background-color: #F3F4F6; margin-bottom: 12px;`;
const GrandRow = styled.View`flex-direction: row; justify-content: space-between; align-items: center;`;
const GrandLabel = styled.Text`font-size: 16px; font-weight: 700; color: #111827;`;
const GrandVal = styled.Text`font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.4px;`;

/* Checkout bar */
const CheckoutBar = styled.View`
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 12px 16px ${Platform.OS === 'ios' ? '36px' : '20px'};
  background-color: #FFFFFF; border-top-width: 1px; border-top-color: #E5E7EB;
`;
const CheckoutBtn = styled.TouchableOpacity`
  height: 52px; background-color: #0F8A3C; border-radius: 14px;
  align-items: center; justify-content: center;
`;
const CheckoutLabel = styled.Text`font-size: 16px; font-weight: 700; color: #FFFFFF;`;
