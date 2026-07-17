import React from 'react';
import { ScrollView, View, Alert, Platform, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store';
import { addToCart, removeFromCart, updateQuantity, clearCart, selectCartTotal } from '../store/cartSlice';
import Header from '../components/Header';
import { IMAGES, POUCH_TYPE_IMAGES } from '../constants/images';
import { GST_RATE, DEFAULT_SHIPPING_FEE } from '../constants';
import {
  quantityValidator,
  DEFAULT_QUANTITY_OPTIONS,
  showQuantityValidationAlert,
} from '../utils/quantityValidator';
import {
  POUCH_TYPE_LABELS,
  WINDOW_LABELS,
  MATERIAL_LABELS,
  calculatePouchPrice,
} from '../store/pouchSlice';
import { getTabBarHeight, getStickyFooterHeight } from '../utils/layoutUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CartScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((s) => s.cart.items);
  const products = useAppSelector((s) => s.products.items);
  const subtotal = useAppSelector(selectCartTotal);
  const setupFees = cartItems.reduce((s, i) => s + i.setupFee, 0);
  const shipping = cartItems.length > 0 ? DEFAULT_SHIPPING_FEE : 0;
  const gst = Number(((subtotal + setupFees + shipping) * GST_RATE).toFixed(2));
  const total = Number((subtotal + setupFees + shipping + gst).toFixed(2));

  // Calculate proper bottom padding
  const tabBarHeight = getTabBarHeight();
  const checkoutBarHeight = 140; // Approximate height of CheckoutBar
  const totalBottomPadding = tabBarHeight + checkoutBarHeight + 20;

  const handleQty = (cartId: string, dir: 'inc' | 'dec', qty: number, productId: string) => {
    const item = cartItems.find((i) => i.cartId === cartId);
    if (!item) return;

    // Check if this is a ready stock item
    const isReadyStockItem = (item as any).isReadyStock === true;

    if (item?.category === 'pouch' && !isReadyStockItem) {
      // Handle regular pouch configurator items
      const result =
        dir === 'inc'
          ? quantityValidator.validateQuantityIncrement(qty, DEFAULT_QUANTITY_OPTIONS)
          : quantityValidator.validateQuantityDecrement(qty, DEFAULT_QUANTITY_OPTIONS);

      if (!result.isValid) {
        if (result.alertType === 'min_order') {
          Alert.alert('Minimum Quantity', result.message ?? 'Minimum quantity reached.', [
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

      if (item.pouchConfig && (item.pouchConfig as any).pouchType) {
        const updatedConfig = { ...item.pouchConfig, quantity: newQty };
        const newTotal = calculatePouchPrice({
          pouchType: (updatedConfig as any).pouchType,
          windowOption: (updatedConfig as any).windowOption,
          materialType: (updatedConfig as any).materialType,
          capacity: (updatedConfig as any).capacity,
          quantity: newQty,
          artworkUri: (updatedConfig as any).artworkUri,
          needsDesignAssistance: (updatedConfig as any).needsDesignAssistance,
        });
        dispatch(removeFromCart(cartId));
        dispatch(addToCart({
          ...item,
          quantity: newQty,
          totalPrice: newTotal,
          unitPrice: newTotal / newQty,
          pouchConfig: updatedConfig,
        }));
      }
      return;
    }

    // Handle ready stock items and other products
    const result =
      dir === 'inc'
        ? quantityValidator.validateQuantityIncrement(qty, DEFAULT_QUANTITY_OPTIONS)
        : quantityValidator.validateQuantityDecrement(qty, DEFAULT_QUANTITY_OPTIONS);

    if (!result.isValid) {
      if (result.alertType === 'min_order') {
        Alert.alert('Minimum Quantity', result.message ?? 'Minimum quantity reached.', [
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

    const newQty = result.newQuantity!;

    if (isReadyStockItem) {
      // For ready stock items, simple price calculation
      const newTotal = item.unitPrice * newQty;
      dispatch(removeFromCart(cartId));
      dispatch(addToCart({
        ...item,
        quantity: newQty,
        totalPrice: newTotal,
      }));
    } else {
      // For regular products from the catalog
      const product = products.find((p) => p.id === productId);
      if (product) {
        dispatch(updateQuantity({ cartId, quantity: newQty, product }));
      }
    }
  };

  const showBack = navigation.canGoBack();

  const renderTopBar = (showEdit = false) => (
    <>
      {showBack ? (
        <NavBar>
          <NavBtn onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={16} color="#111827" />
          </NavBtn>
          <NavTitle>My Cart</NavTitle>
          {showEdit ? (
            <EditBtn onPress={() => Alert.alert('Clear Cart', 'Remove all items?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear All', style: 'destructive', onPress: () => dispatch(clearCart()) },
            ])}>
              <EditBtnText>Edit</EditBtnText>
            </EditBtn>
          ) : (
            <View style={{ width: 38 }} />
          )}
        </NavBar>
      ) : (
        <>
          <Header navigation={navigation} />
          <CartTitleRow>
            <CartPageTitle>My Cart</CartPageTitle>
            {showEdit && (
              <EditBtn onPress={() => Alert.alert('Clear Cart', 'Remove all items?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear All', style: 'destructive', onPress: () => dispatch(clearCart()) },
              ])}>
                <EditBtnText>Clear</EditBtnText>
              </EditBtn>
            )}
          </CartTitleRow>
        </>
      )}
    </>
  );

  if (cartItems.length === 0) {
    return (
      <Container>
        {renderTopBar(false)}
        <EmptyWrap>
          <EmptyIcon>
            <EmptyImage source={IMAGES.silverStandyPouch} resizeMode="contain" />
          </EmptyIcon>
          <EmptyTitle>Your cart is empty</EmptyTitle>
          <EmptyDesc>Configure a pouch or browse products to get started.</EmptyDesc>
          <EmptyButtonsRow>
            <BrowseBtn onPress={() => navigation.navigate('StreamlinedPouchConfigurator')} activeOpacity={0.9}>
              <BrowseBtnText>Configure Pouch</BrowseBtnText>
            </BrowseBtn>
            <BrowseProductsBtn onPress={() => navigation.navigate('MainTabs', { screen: 'Products' })} activeOpacity={0.9}>
              <BrowseProductsBtnText>Browse Products</BrowseProductsBtnText>
            </BrowseProductsBtn>
          </EmptyButtonsRow>
        </EmptyWrap>
      </Container>
    );
  }

  return (
    <Container>
      {renderTopBar(true)}

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ 
          paddingBottom: totalBottomPadding,
          paddingHorizontal: 16,
          paddingTop: 16,
        }}
        style={{ flex: 1 }}
      >
        <ContentWrapper>
          {cartItems.map((item) => {
          // Check if this is a ready stock item (has isReadyStock flag)
          const isReadyStockItem = (item as any).isReadyStock === true;
          
          // Determine the image source
          let imageSource = IMAGES.boxes;
          if (item.category === 'pouch' && item.pouchConfig) {
            if (isReadyStockItem) {
              // For ready stock items, use a default pouch image
              imageSource = IMAGES.goldStandyPouch;
            } else if ((item.pouchConfig as any).pouchType) {
              // For regular pouch configurator items
              imageSource = POUCH_TYPE_IMAGES[(item.pouchConfig as any).pouchType];
            }
          }
          
          return (
            <ItemCard key={item.cartId}>
              <ItemIconBox>
                <ItemThumb
                  source={imageSource}
                  resizeMode="contain"
                />
              </ItemIconBox>
              <ItemBody>
                <ItemName>{item.name}</ItemName>

                {item.category === 'pouch' && item.pouchConfig ? (
                  isReadyStockItem ? (
                    // For ready stock items, display different specs
                    <ItemSpec>
                      {(item.pouchConfig as any).material} • {(item.pouchConfig as any).thickness}{'\n'}
                      {(item.pouchConfig as any).size} — {(item.pouchConfig as any).finish}
                      {(item.pouchConfig as any).zip && ` • ${(item.pouchConfig as any).zip}`}
                    </ItemSpec>
                  ) : (
                    // For regular pouch configurator items
                    <ItemSpec>
                      {WINDOW_LABELS[(item.pouchConfig as any).windowOption]} • {MATERIAL_LABELS[(item.pouchConfig as any).materialType]}{'\n'}
                      {(item.pouchConfig as any).capacity} — {(item.pouchConfig as any).dimensions.width}×{(item.pouchConfig as any).dimensions.height}{(item.pouchConfig as any).dimensions.unit}
                    </ItemSpec>
                  )
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
                ₹{item.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </ItemTotal>
            </ItemRight>
          </ItemCard>
          );
        })}

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
        </ContentWrapper>
      </ScrollView>

      {/* Checkout Bar */}
      <CheckoutBar tabBarHeight={tabBarHeight}>
        <ContinueShoppingLink onPress={() => navigation.navigate('MainTabs', { screen: 'Products' })} activeOpacity={0.8}>
          <FontAwesome5 name="arrow-left" size={12} color="#0F8A3C" style={{ marginRight: 6 }} />
          <ContinueShoppingText>Continue Shopping</ContinueShoppingText>
        </ContinueShoppingLink>
        <CheckoutBtn onPress={() => navigation.navigate('Checkout')} activeOpacity={0.9}>
          <CheckoutLabel>Proceed to Checkout</CheckoutLabel>
        </CheckoutBtn>
      </CheckoutBar>
    </Container>
  );
};

export default CartScreen;

const Container = styled.View`
  flex: 1;
  background-color: #F8F9FA;
  flex-direction: column;
`;

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
const EditBtn = styled.TouchableOpacity`padding: 6px 12px;`;
const EditBtnText = styled.Text`font-size: 14px; font-weight: 600; color: #0F8A3C;`;

const CartTitleRow = styled.View`
  flex-direction: row; align-items: center; justify-content: space-between;
  padding: 4px 16px 12px; background-color: #ffffff;
`;
const CartPageTitle = styled.Text`font-size: 20px; font-weight: 800; color: #111827;`;

const EmptyWrap = styled.View`flex: 1; align-items: center; justify-content: center; padding: 40px;`;
const EmptyIcon = styled.View`
  width: 96px; height: 96px; border-radius: 20px;
  background-color: #f3f4f6; align-items: center; justify-content: center;
  margin-bottom: 20px; overflow: hidden;
`;
const EmptyImage = styled.Image`width: 72px; height: 72px;`;
const EmptyTitle = styled.Text`font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 8px;`;
const EmptyDesc = styled.Text`font-size: 14px; color: #9CA3AF; text-align: center; line-height: 20px; margin-bottom: 24px;`;
const EmptyButtonsRow = styled.View`
  width: 100%; align-items: center; gap: 12px;
`;
const BrowseBtn = styled.TouchableOpacity`
  width: 100%; max-width: 300px; height: 50px; background-color: #0F8A3C; border-radius: 14px;
  align-items: center; justify-content: center;
`;
const BrowseBtnText = styled.Text`font-size: 15px; font-weight: 700; color: #FFF;`;
const BrowseProductsBtn = styled.TouchableOpacity`
  width: 100%; max-width: 300px; height: 50px; border-radius: 14px;
  align-items: center; justify-content: center; border-width: 1.5px; border-color: #0F8A3C;
  background-color: #FFFFFF;
`;
const BrowseProductsBtnText = styled.Text`font-size: 15px; font-weight: 700; color: #0F8A3C;`;

const ItemCard = styled.View`
  flex-direction: row;
  background-color: #FFFFFF;
  border-radius: 14px;
  border-width: 1px;
  border-color: #E5E7EB;
  padding: 14px;
  margin-bottom: 12px;
  align-items: center;
  width: 100%;
`;

const ItemIconBox = styled.View`
  width: 52px;
  height: 52px;
  border-radius: 13px;
  background-color: #f9fafb;
  overflow: hidden;
  margin-right: 12px;
  align-items: center;
  justify-content: center;
`;
const ItemThumb = styled.Image`width: 52px; height: 52px;`;
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
const CheckoutBar = styled.View<{ tabBarHeight: number }>`
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
  shadow-color: #000000;
  shadow-offset: 0 -2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  box-sizing: border-box;
`;
const ContinueShoppingLink = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  padding: 8px;
`;
const ContinueShoppingText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #0F8A3C;
`;
const CheckoutBtn = styled.TouchableOpacity`
  height: 52px; background-color: #0F8A3C; border-radius: 14px;
  align-items: center; justify-content: center;
`;
const CheckoutLabel = styled.Text`font-size: 16px; font-weight: 700; color: #FFFFFF;`;
