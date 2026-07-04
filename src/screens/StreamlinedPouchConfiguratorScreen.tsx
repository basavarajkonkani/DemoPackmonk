/**
 * StreamlinedPouchConfiguratorScreen
 * New simplified flow with production-ready polish:
 * Material → Finish (Clear/Silver/Kraft/Milky) → Zip (With/Without) → Thickness → Size → Instant Price → Quantity → Add to Cart
 * 
 * Improvements:
 * - Responsive layout for mobile/tablet/web
 * - Smooth animations
 * - Better touch targets
 * - Consistent spacing
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Platform,
  Alert,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch } from '../store';
import { addToCart } from '../store/cartSlice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Material options
const MATERIALS = [
  { id: 'bopp', name: 'BOPP', desc: 'High clarity, moisture resistant', icon: 'layer-group' },
  { id: 'kraft', name: 'Kraft', desc: 'Eco-friendly, natural look', icon: 'leaf' },
  { id: 'metalized', name: 'Metalized', desc: 'Premium barrier protection', icon: 'medal' },
  { id: 'pe', name: 'Polyethylene', desc: 'Flexible, durable', icon: 'shield-alt' },
];

// Finish options
const FINISHES = [
  { id: 'clear', name: 'Clear', desc: 'Transparent, shows product', icon: 'eye' },
  { id: 'silver', name: 'Silver', desc: 'Metallic shine', icon: 'certificate' },
  { id: 'kraft', name: 'Kraft', desc: 'Natural brown', icon: 'leaf' },
  { id: 'milky', name: 'Milky', desc: 'Semi-transparent', icon: 'cloud' },
];

// Zip options
const ZIP_OPTIONS = [
  { id: 'with_zip', name: 'With Zip', desc: 'Resealable closure', icon: 'lock' },
  { id: 'without_zip', name: 'Without Zip', desc: 'Standard seal', icon: 'unlock' },
];

// Thickness options (in microns)
const THICKNESS_OPTIONS = [
  { id: '80', value: 80, name: '80 micron', desc: 'Light duty' },
  { id: '100', value: 100, name: '100 micron', desc: 'Standard' },
  { id: '120', value: 120, name: '120 micron', desc: 'Heavy duty' },
  { id: '150', value: 150, name: '150 micron', desc: 'Premium' },
];

// Size options (W x H in cm)
const SIZE_OPTIONS = [
  { id: 'small', name: 'Small', width: 10, height: 15, unit: 'cm', desc: '10×15 cm' },
  { id: 'medium', name: 'Medium', width: 15, height: 20, unit: 'cm', desc: '15×20 cm' },
  { id: 'large', name: 'Large', width: 20, height: 30, unit: 'cm', desc: '20×30 cm' },
  { id: 'xlarge', name: 'X-Large', width: 25, height: 35, unit: 'cm', desc: '25×35 cm' },
];

// Pricing calculator
const calculatePrice = (
  material: string,
  finish: string,
  zip: string,
  thickness: number,
  size: { width: number; height: number },
  quantity: number
): number => {
  // Base price per unit
  let basePrice = 2.0;

  // Material multiplier
  const materialMultiplier: Record<string, number> = {
    bopp: 1.0,
    kraft: 0.9,
    metalized: 1.3,
    pe: 1.1,
  };
  basePrice *= materialMultiplier[material] || 1.0;

  // Finish multiplier
  const finishMultiplier: Record<string, number> = {
    clear: 1.0,
    silver: 1.2,
    kraft: 0.95,
    milky: 1.05,
  };
  basePrice *= finishMultiplier[finish] || 1.0;

  // Zip premium
  if (zip === 'with_zip') {
    basePrice += 0.5;
  }

  // Thickness multiplier
  basePrice *= thickness / 100;

  // Size area (width × height in cm²)
  const area = (size.width * size.height) / 100; // normalize
  basePrice *= 1 + area * 0.02;

  // Volume discount
  let discount = 1.0;
  if (quantity >= 5000) discount = 0.85;
  else if (quantity >= 3000) discount = 0.88;
  else if (quantity >= 1000) discount = 0.92;
  else if (quantity >= 500) discount = 0.95;

  const unitPrice = basePrice * discount;
  return Math.round(unitPrice * quantity * 100) / 100;
};

const StreamlinedPouchConfiguratorScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  // Configuration state
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedFinish, setSelectedFinish] = useState('');
  const [selectedZip, setSelectedZip] = useState('');
  const [selectedThickness, setSelectedThickness] = useState(0);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [quantity, setQuantity] = useState(100);

  // Calculated price
  const [totalPrice, setTotalPrice] = useState(0);

  // Animation for price card
  const priceCardScale = useRef(new Animated.Value(0)).current;
  const priceCardOpacity = useRef(new Animated.Value(0)).current;
  
  // ScrollView ref for auto-scrolling
  const scrollViewRef = useRef<ScrollView>(null);

  // Calculate price whenever configuration changes
  useEffect(() => {
    if (selectedMaterial && selectedFinish && selectedZip && selectedThickness && selectedSize) {
      const price = calculatePrice(
        selectedMaterial,
        selectedFinish,
        selectedZip,
        selectedThickness,
        selectedSize,
        quantity
      );
      setTotalPrice(price);
      
      // Animate price card appearance
      Animated.parallel([
        Animated.spring(priceCardScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(priceCardOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Auto-scroll to show the price card and quantity selector
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 400);
    } else {
      Animated.parallel([
        Animated.timing(priceCardScale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(priceCardOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedMaterial, selectedFinish, selectedZip, selectedThickness, selectedSize, quantity]);

  const handleAddToCart = () => {
    if (!selectedMaterial || !selectedFinish || !selectedZip || !selectedThickness || !selectedSize) {
      Alert.alert('Incomplete Configuration', 'Please complete all steps before adding to cart.');
      return;
    }

    const cartItem = {
      cartId: `pouch-streamlined-${Date.now()}`,
      productId: `pouch-${selectedMaterial}-${selectedFinish}-${selectedZip}-${selectedThickness}-${selectedSize.id}`,
      name: `Custom ${selectedMaterial.toUpperCase()} Pouch - ${selectedFinish}`,
      category: 'pouch' as const,
      design: {
        length: selectedSize.width,
        width: selectedSize.height,
        height: 0,
        materialId: selectedMaterial,
        inkColor: '#000000',
        logoUri: null,
        logoScale: 1,
        logoPosX: 0,
        logoPosY: 0,
        customText: '',
        textColor: '#000000',
        textSize: 12,
      },
      pouchConfig: {
        pouchType: 'custom' as any,
        windowOption: 'without_window' as any,
        materialType: selectedMaterial as any,
        capacity: `${selectedSize.width}×${selectedSize.height}cm` as any,
        artworkUri: null,
        needsDesignAssistance: false,
        dimensions: {
          width: selectedSize.width,
          height: selectedSize.height,
          unit: selectedSize.unit,
        },
        finish: selectedFinish,
        zip: selectedZip,
        thickness: selectedThickness,
      },
      quantity,
      baseUnitPrice: totalPrice / quantity,
      unitPrice: totalPrice / quantity,
      totalPrice,
      setupFee: 0,
    };

    dispatch(addToCart(cartItem));
    // Redirect directly to cart
    navigation.navigate('MainTabs', { screen: 'Cart' });
  };

  const incrementQty = () => setQuantity((q) => q + 100);
  const decrementQty = () => setQuantity((q) => Math.max(100, q - 100));

  const isConfigComplete =
    selectedMaterial && selectedFinish && selectedZip && selectedThickness && selectedSize;

  return (
    <Container>
      {/* Nav Bar */}
      <NavBar>
        <NavBackBtn onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <FontAwesome5 name="arrow-left" size={16} color="#111827" />
        </NavBackBtn>
        <NavCenter>
          <NavTitle>Configure Your Pouch</NavTitle>
        </NavCenter>
        <NavFavBtn
          onPress={() => Alert.alert('Saved', 'Configuration saved to favourites.')}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="heart" size={15} color="#D1D5DB" />
        </NavFavBtn>
      </NavBar>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingBottom: 140,
          alignItems: 'center',
        }}
        keyboardShouldPersistTaps="handled"
      >
        <ContentWrapper>
        {/* Step 1: Material */}
        <SectionWrap>
          <StepNumber>STEP 1</StepNumber>
          <SectionTitle>Choose Material</SectionTitle>
          <OptionsRow>
            {MATERIALS.map((mat) => (
              <OptionCard
                key={mat.id}
                active={selectedMaterial === mat.id}
                onPress={() => setSelectedMaterial(mat.id)}
                activeOpacity={0.85}
              >
                <OptionIconWrap bgColor={selectedMaterial === mat.id ? '#DCFCE7' : '#F3F4F6'}>
                  <FontAwesome5
                    name={mat.icon as any}
                    size={20}
                    color={selectedMaterial === mat.id ? '#0F8A3C' : '#6B7280'}
                  />
                </OptionIconWrap>
                <OptionName active={selectedMaterial === mat.id}>{mat.name}</OptionName>
                <OptionDesc>{mat.desc}</OptionDesc>
              </OptionCard>
            ))}
          </OptionsRow>
        </SectionWrap>

        {/* Step 2: Finish */}
        <SectionWrap>
          <StepNumber>STEP 2</StepNumber>
          <SectionTitle>Choose Finish</SectionTitle>
          <OptionsRow>
            {FINISHES.map((fin) => (
              <OptionCard
                key={fin.id}
                active={selectedFinish === fin.id}
                onPress={() => setSelectedFinish(fin.id)}
                activeOpacity={0.85}
              >
                <OptionIconWrap bgColor={selectedFinish === fin.id ? '#DCFCE7' : '#F3F4F6'}>
                  <FontAwesome5
                    name={fin.icon as any}
                    size={20}
                    color={selectedFinish === fin.id ? '#0F8A3C' : '#6B7280'}
                  />
                </OptionIconWrap>
                <OptionName active={selectedFinish === fin.id}>{fin.name}</OptionName>
                <OptionDesc>{fin.desc}</OptionDesc>
              </OptionCard>
            ))}
          </OptionsRow>
        </SectionWrap>

        {/* Step 3: Zip */}
        <SectionWrap>
          <StepNumber>STEP 3</StepNumber>
          <SectionTitle>With or Without Zip</SectionTitle>
          <OptionsRow>
            {ZIP_OPTIONS.map((zip) => (
              <OptionCard
                key={zip.id}
                active={selectedZip === zip.id}
                onPress={() => setSelectedZip(zip.id)}
                activeOpacity={0.85}
              >
                <OptionIconWrap bgColor={selectedZip === zip.id ? '#DCFCE7' : '#F3F4F6'}>
                  <FontAwesome5
                    name={zip.icon as any}
                    size={20}
                    color={selectedZip === zip.id ? '#0F8A3C' : '#6B7280'}
                  />
                </OptionIconWrap>
                <OptionName active={selectedZip === zip.id}>{zip.name}</OptionName>
                <OptionDesc>{zip.desc}</OptionDesc>
              </OptionCard>
            ))}
          </OptionsRow>
        </SectionWrap>

        {/* Step 4: Thickness */}
        <SectionWrap>
          <StepNumber>STEP 4</StepNumber>
          <SectionTitle>Choose Thickness</SectionTitle>
          <OptionsRow>
            {THICKNESS_OPTIONS.map((thick) => (
              <OptionCard
                key={thick.id}
                active={selectedThickness === thick.value}
                onPress={() => setSelectedThickness(thick.value)}
                activeOpacity={0.85}
              >
                <ThicknessIconWrap active={selectedThickness === thick.value}>
                  <FontAwesome5
                    name="layer-group"
                    size={20}
                    color={selectedThickness === thick.value ? '#0F8A3C' : '#6B7280'}
                  />
                </ThicknessIconWrap>
                <ThicknessBadge active={selectedThickness === thick.value}>
                  {thick.value}μ
                </ThicknessBadge>
                <OptionName active={selectedThickness === thick.value}>{thick.name}</OptionName>
                <OptionDesc>{thick.desc}</OptionDesc>
              </OptionCard>
            ))}
          </OptionsRow>
        </SectionWrap>

        {/* Step 5: Size */}
        <SectionWrap>
          <StepNumber>STEP 5</StepNumber>
          <SectionTitle>Choose Size</SectionTitle>
          <OptionsRow>
            {SIZE_OPTIONS.map((size) => (
              <OptionCard
                key={size.id}
                active={selectedSize?.id === size.id}
                onPress={() => setSelectedSize(size)}
                activeOpacity={0.85}
              >
                <SizeBadge active={selectedSize?.id === size.id}>
                  <FontAwesome5 name="ruler-combined" size={18} color={selectedSize?.id === size.id ? '#FFFFFF' : '#0F8A3C'} />
                </SizeBadge>
                <OptionName active={selectedSize?.id === size.id}>{size.name}</OptionName>
                <OptionDesc>{size.desc}</OptionDesc>
              </OptionCard>
            ))}
          </OptionsRow>
          
          {/* Completion message after size selection */}
          {isConfigComplete && (
            <CompletionMessage>
              <FontAwesome5 name="arrow-down" size={14} color="#10B981" style={{ marginRight: 8 }} />
              <CompletionText>Scroll down to see your price and select quantity!</CompletionText>
            </CompletionMessage>
          )}
        </SectionWrap>

        {/* Instant Price Display */}
        {isConfigComplete && (
          <Animated.View
            style={{
              transform: [{ scale: priceCardScale }],
              opacity: priceCardOpacity,
            }}
          >
            <PriceCard>
              <PriceHeader>
                <FontAwesome5 name="check-circle" size={20} color="#10B981" style={{ marginRight: 8 }} />
                <PriceHeaderText>Configuration Complete</PriceHeaderText>
              </PriceHeader>
              <PriceDivider />
              <PriceRow>
                <PriceLabel>Unit Price</PriceLabel>
                <PriceValue>₹{(totalPrice / quantity).toFixed(2)}/pc</PriceValue>
              </PriceRow>
              <PriceRow>
                <PriceLabel>Quantity</PriceLabel>
                <PriceValue>{quantity.toLocaleString()} pcs</PriceValue>
              </PriceRow>
              <PriceDivider />
              <PriceTotalRow>
                <PriceTotalLabel>Total Price</PriceTotalLabel>
                <PriceTotalValue>₹{totalPrice.toLocaleString()}</PriceTotalValue>
              </PriceTotalRow>
            </PriceCard>
          </Animated.View>
        )}

        {/* Step 6: Quantity */}
        {isConfigComplete && (
          <SectionWrap>
            <StepNumber>STEP 6</StepNumber>
            <SectionTitle>Select Quantity</SectionTitle>
            <QtyRow>
              <QtyBtn onPress={decrementQty} activeOpacity={0.85}>
                <FontAwesome5 name="minus" size={14} color="#374151" />
              </QtyBtn>
              <QtyValue>{quantity.toLocaleString()}</QtyValue>
              <QtyBtn onPress={incrementQty} activeOpacity={0.85}>
                <FontAwesome5 name="plus" size={14} color="#374151" />
              </QtyBtn>
            </QtyRow>
            <QtyHint>Minimum order: 100 pcs</QtyHint>

            {/* Quick quantity buttons */}
            <QuickQtyRow>
              {[100, 500, 1000, 3000, 5000].map((q) => (
                <QuickQtyBtn
                  key={q}
                  active={quantity === q}
                  onPress={() => setQuantity(q)}
                  activeOpacity={0.85}
                >
                  <QuickQtyText active={quantity === q}>{q}</QuickQtyText>
                </QuickQtyBtn>
              ))}
            </QuickQtyRow>
          </SectionWrap>
        )}
        </ContentWrapper>
      </ScrollView>

      {/* Bottom Add to Cart Button */}
      {isConfigComplete && (
        <BottomBar>
          <AddToCartBtn
            onPress={handleAddToCart}
            activeOpacity={0.9}
            style={{
              shadowColor: '#0F8A3C',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <FontAwesome5 name="shopping-cart" size={16} color="#FFF" style={{ marginRight: 10 }} />
            <AddToCartText>Add to Cart — ₹{totalPrice.toLocaleString()}</AddToCartText>
          </AddToCartBtn>
        </BottomBar>
      )}
    </Container>
  );
};

export default StreamlinedPouchConfiguratorScreen;

// ─── Styled Components ─────────────────────────────────────────────────────

const Container = styled.View`
  flex: 1;
  background-color: #f8f9fa;
`;

const ContentWrapper = styled.View`
  width: 100%;
  max-width: 900px;
  align-self: center;
`;

const NavBar = styled.View`
  height: ${Platform.OS === 'ios' ? '96px' : '60px'};
  padding-top: ${Platform.OS === 'ios' ? '48px' : '0px'};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #f3f4f6;
`;

const NavBackBtn = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: #f9fafb;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const NavFavBtn = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: #f9fafb;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const NavCenter = styled.View`
  flex: 1;
  align-items: center;
`;

const NavTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;

const SectionWrap = styled.View`
  width: 100%;
  padding: 20px 16px;
  background-color: #ffffff;
  margin-bottom: 2px;
`;

const StepNumber = styled.Text`
  font-size: 11px;
  font-weight: 700;
  color: #0f8a3c;
  letter-spacing: 1px;
  margin-bottom: 6px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 16px;
`;

const OptionsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-horizontal: -6px;
  justify-content: space-between;
`;

const OptionCard = styled.TouchableOpacity<{ active: boolean }>`
  width: 48%;
  margin: 6px 1%;
  padding: 16px 12px;
  border-radius: 16px;
  background-color: ${({ active }) => (active ? '#DCFCE7' : '#F9FAFB')};
  border-width: 2px;
  border-color: ${({ active }) => (active ? '#0F8A3C' : '#E5E7EB')};
  align-items: center;
  min-height: 140px;
  justify-content: center;
`;

const OptionIconWrap = styled.View<{ bgColor: string }>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const OptionName = styled.Text<{ active: boolean }>`
  font-size: 15px;
  font-weight: 700;
  color: ${({ active }) => (active ? '#0F8A3C' : '#111827')};
  margin-bottom: 4px;
  text-align: center;
`;

const OptionDesc = styled.Text`
  font-size: 11px;
  color: #6b7280;
  text-align: center;
`;

const ThicknessIconWrap = styled.View<{ active: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background-color: ${({ active }) => (active ? '#DCFCE7' : '#F3F4F6')};
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const ThicknessBadge = styled.Text<{ active: boolean }>`
  font-size: 20px;
  font-weight: 800;
  color: ${({ active }) => (active ? '#0F8A3C' : '#6B7280')};
  margin-bottom: 4px;
`;

const SizeBadge = styled.View<{ active: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background-color: ${({ active }) => (active ? '#0F8A3C' : '#F3F4F6')};
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const CompletionMessage = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  background-color: #F0FDF4;
  border-radius: 12px;
  border-width: 1px;
  border-color: #BBF7D0;
  margin-top: 16px;
`;

const CompletionText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #10B981;
`;

const PriceCard = styled.View`
  width: 100%;
  margin: 16px 0;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 20px;
  border-width: 2px;
  border-color: #10b981;
  shadow-color: #10b981;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 12px;
  elevation: 5;
  align-self: center;
  max-width: 100%;
`;

const PriceHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const PriceHeaderText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #10b981;
`;

const PriceDivider = styled.View`
  height: 1px;
  background-color: #e5e7eb;
  margin-vertical: 12px;
`;

const PriceRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const PriceLabel = styled.Text`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

const PriceValue = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;

const PriceTotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
`;

const PriceTotalLabel = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;

const PriceTotalValue = styled.Text`
  font-size: 24px;
  font-weight: 800;
  color: #0f8a3c;
`;

const QtyRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

const QtyBtn = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: #f9fafb;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const QtyValue = styled.Text`
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  margin-horizontal: 24px;
  min-width: 100px;
  text-align: center;
`;

const QtyHint = styled.Text`
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin-bottom: 16px;
`;

const QuickQtyRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const QuickQtyBtn = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding: 12px 8px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${({ active }) => (active ? '#0F8A3C' : '#E5E7EB')};
  background-color: ${({ active }) => (active ? '#DCFCE7' : '#FFFFFF')};
  align-items: center;
  margin-horizontal: 4px;
`;

const QuickQtyText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ active }) => (active ? '#0F8A3C' : '#6B7280')};
`;

const BottomBar = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px ${Platform.OS === 'ios' ? 32 : 20}px;
  background-color: #ffffff;
  border-top-width: 1px;
  border-top-color: #f3f4f6;
`;

const AddToCartBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 56px;
  background-color: #0f8a3c;
  border-radius: 16px;
`;

const AddToCartText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
`;
