import React, { useState, useEffect } from 'react';
import { ScrollView, View, Alert, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useAppSelector, useAppDispatch } from '../store';
import { selectCurrentProduct, clearSelectedProduct } from '../store/productsSlice';
import { addToCart, calculateItemPrice } from '../store/cartSlice';
import Header from '../components/Header';
import DesignPreview from '../components/DesignPreview';
import { FontAwesome5 } from '@expo/vector-icons';
import { IMAGES } from '../constants/images';
import * as ImagePicker from 'expo-image-picker';
import { QUANTITY_OPTIONS } from '../constants';
import {
  quantityValidator,
  DEFAULT_QUANTITY_OPTIONS,
  applyQuantityValidationResult,
} from '../utils/quantityValidator';
import { getScrollViewBottomPaddingWithTabBar } from '../utils/layoutUtils';

const ACTIVE_TABS = ['Design', 'Dieline', '3D Preview'] as const;
type StudioTab = typeof ACTIVE_TABS[number];

const LOGO_PRESETS = [
  { id: null, label: 'None', icon: 'ban' },
  { id: 'preset-eco', label: 'Eco Leaf', icon: 'leaf' },
  { id: 'preset-ship', label: 'Logistics', icon: 'shipping-fast' },
  { id: 'preset-stamp', label: 'Retro Stamp', icon: 'award' },
];

const INK_PALETTE = [
  { name: 'Ink Black', hex: '#111827' },
  { name: 'Forest Green', hex: '#0F8A3C' },
  { name: 'Royal Blue', hex: '#0A6B2E' },
  { name: 'Terracotta', hex: '#EA580C' },
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Gold', hex: '#D97706' },
];

const TEXT_COLORS = [
  { hex: '#111827' }, { hex: '#0F8A3C' }, { hex: '#0A6B2E' },
  { hex: '#EA580C' }, { hex: '#FFFFFF' }, { hex: '#D97706' },
];

const DesignStudioScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const selectedProduct = useAppSelector(selectCurrentProduct);
  const [activeTab, setActiveTab] = useState<StudioTab>('Design');

  const [length, setLength] = useState(10);
  const [width, setWidth] = useState(8);
  const [height, setHeight] = useState(4);
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [inkColor, setInkColor] = useState('#111827');
  const [logoPreset, setLogoPreset] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState(1);
  const [customText, setCustomText] = useState('');
  const [textColor, setTextColor] = useState('#111827');
  const [textSize, setTextSize] = useState(14);
  const [quantity, setQuantity] = useState(100);

  const handleUploadArtwork = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow photo library access to upload artwork.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const fileName = uri.split('/').pop() ?? 'artwork';
      // Store URI as logoUri so the preview can show it was uploaded
      setLogoPreset(uri);
      Alert.alert('✅ Artwork Uploaded', `"${fileName}" attached to your design.`);
    }
  };

  const handleQuantitySelect = (qty: number) => {
    const result = quantityValidator.validateQuantityInput(qty, DEFAULT_QUANTITY_OPTIONS);
    applyQuantityValidationResult(result, setQuantity);
  };

  useEffect(() => {
    if (selectedProduct) {
      setLength(selectedProduct.dimensions.length);
      setWidth(selectedProduct.dimensions.width);
      setHeight(selectedProduct.dimensions.height);
      setSelectedMaterialId(selectedProduct.materials[0]?.id ?? 'kraft');
      setQuantity(selectedProduct.minQuantity);
      setInkColor('#111827');
      setLogoPreset(null);
      setCustomText('');
      setLogoScale(1);
    }
  }, [selectedProduct]);

  /* ── Empty state ── */
  if (!selectedProduct) {
    return (
      <Container>
        <Header navigation={navigation} />
        <EmptyWrap>
          <EmptyIconWrap>
            <EmptyHeroImage source={IMAGES.bannerDesign} resizeMode="cover" />
          </EmptyIconWrap>
          <EmptyTitle>Design Studio</EmptyTitle>
          <EmptyDesc>Select a product from the catalog to start customizing your packaging design.</EmptyDesc>
          <EmptyCTA onPress={() => navigation.navigate('Products')} activeOpacity={0.9}
            style={{ shadowColor: '#0F8A3C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 }}>
            <FontAwesome5 name="box-open" size={15} color="#FFF" style={{ marginRight: 8 }} />
            <EmptyCTAText>Contact</EmptyCTAText>
          </EmptyCTA>

          {/* Feature Cards */}
          <FeatureGrid>
            {[
              { icon: 'robot', color: '#7C3AED', bg: '#F5F3FF', label: 'AI Design Generator', desc: 'Generate designs automatically' },
              { icon: 'ruler-combined', color: '#0F8A3C', bg: '#DCFCE7', label: 'Dieline Editor', desc: 'Precision cut line control' },
              { icon: 'cube', color: '#0F8A3C', bg: '#DCFCE7', label: '3D Preview', desc: 'See your box in 3D' },
              { icon: 'palette', color: '#D97706', bg: '#FEF3C7', label: 'Color Studio', desc: 'CMYK + Pantone matching' },
            ].map((f) => (
              <FeatureCard key={f.label}>
                <FeatureIcon bgColor={f.bg}>
                  <FontAwesome5 name={f.icon as any} size={18} color={f.color} />
                </FeatureIcon>
                <FeatureLabel>{f.label}</FeatureLabel>
                <FeatureDesc>{f.desc}</FeatureDesc>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </EmptyWrap>
      </Container>
    );
  }

  const currentDesign = {
    length, width, height,
    materialId: selectedMaterialId,
    inkColor,
    logoUri: logoPreset,
    logoScale,
    logoPosX: 0, logoPosY: 0,
    customText, textColor, textSize,
  };

  const { unitPrice, setupFee, totalPrice } = calculateItemPrice(selectedProduct, currentDesign, quantity);
  const currentMaterial = selectedProduct.materials.find((m) => m.id === selectedMaterialId);
  const activeDiscount = [...selectedProduct.bulkDiscounts]
    .sort((a, b) => b.minQuantity - a.minQuantity)
    .find((d) => quantity >= d.minQuantity);

  const handleAddToCart = () => {
    dispatch(addToCart({
      cartId: `cart-${Date.now()}`,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      category: selectedProduct.category,
      design: currentDesign,
      quantity,
      baseUnitPrice: selectedProduct.basePrice,
      unitPrice,
      totalPrice,
      setupFee,
    }));
    Alert.alert(
      '✅ Added to Cart',
      `${selectedProduct.name} custom config added successfully.`,
      [
        { text: 'Configure Another', onPress: () => dispatch(clearSelectedProduct()) },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  const step = (dir: 'inc' | 'dec', val: number, min: number, max: number, s = 1) =>
    dir === 'inc' ? Math.min(max, val + s) : Math.max(min, val - s);

  return (
    <Container>
      <Header navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: getScrollViewBottomPaddingWithTabBar() }}>

        {/* Product info bar */}
        <ProductInfoBar>
          <ProductInfoLeft>
            <FontAwesome5 name="box-open" size={14} color="#0F8A3C" style={{ marginRight: 8 }} />
            <ProductInfoName numberOfLines={1}>{selectedProduct.name}</ProductInfoName>
          </ProductInfoLeft>
          <ChangeProductBtn onPress={() => dispatch(clearSelectedProduct())} activeOpacity={0.8}>
            <FontAwesome5 name="exchange-alt" size={11} color="#6B7280" style={{ marginRight: 4 }} />
            <ChangeProductText>Change</ChangeProductText>
          </ChangeProductBtn>
        </ProductInfoBar>

        {/* Studio Tabs */}
        <TabBar>
          {ACTIVE_TABS.map((t) => (
            <TabItem key={t} active={activeTab === t} onPress={() => setActiveTab(t)} activeOpacity={0.8}>
              <FontAwesome5
                name={t === 'Design' ? 'paint-brush' : t === 'Dieline' ? 'ruler-combined' : 'cube'}
                size={11}
                color={activeTab === t ? '#0F8A3C' : '#9CA3AF'}
                style={{ marginRight: 5 }}
              />
              <TabItemText active={activeTab === t}>{t}</TabItemText>
            </TabItem>
          ))}
        </TabBar>

        {/* Live Preview Canvas */}
        <CanvasSection>
          <CanvasHeader>
            <CanvasHeaderLeft>
              <LiveDot />
              <CanvasHeaderTitle>Live 2.5D Preview</CanvasHeaderTitle>
            </CanvasHeaderLeft>
            <AIBadge onPress={() => Alert.alert('AI Design', 'AI design generator coming soon — will auto-generate print-ready artwork!')} activeOpacity={0.8}>
              <FontAwesome5 name="robot" size={10} color="#7C3AED" style={{ marginRight: 4 }} />
              <AIBadgeText>AI Generate</AIBadgeText>
            </AIBadge>
          </CanvasHeader>
          <DesignPreview
            productId={selectedProduct.id}
            category={selectedProduct.category}
            design={currentDesign}
          />
        </CanvasSection>

        {activeTab === 'Design' ? (
          <ConfigPanel>

            {/* ── Section 1: Dimensions ── */}
            <SectionCard>
              <SectionCardHeader>
                <SectionCardIconWrap bgColor="#DCFCE7">
                  <FontAwesome5 name="ruler-combined" size={13} color="#0F8A3C" />
                </SectionCardIconWrap>
                <SectionCardTitle>Dimensions</SectionCardTitle>
                <SectionCardUnit>({selectedProduct.dimensions.unit})</SectionCardUnit>
              </SectionCardHeader>

              {[
                { label: 'Length', val: length, set: setLength, min: selectedProduct.dimensions.minLength, max: selectedProduct.dimensions.maxLength },
                { label: 'Width', val: width, set: setWidth, min: selectedProduct.dimensions.minWidth, max: selectedProduct.dimensions.maxWidth },
                ...(selectedProduct.dimensions.maxHeight > 0.5 ? [{ label: 'Height', val: height, set: setHeight, min: selectedProduct.dimensions.minHeight, max: selectedProduct.dimensions.maxHeight }] : []),
              ].map((dim) => (
                <DimRow key={dim.label}>
                  <DimLabel>{dim.label}</DimLabel>
                  <DimRange>{dim.min}" – {dim.max}"</DimRange>
                  <DimStepper>
                    <StepBtn disabled={dim.val <= dim.min} onPress={() => dim.set(step('dec', dim.val, dim.min, dim.max))}>
                      <FontAwesome5 name="minus" size={10} color={dim.val <= dim.min ? '#D1D5DB' : '#374151'} />
                    </StepBtn>
                    <StepVal>{dim.val}"</StepVal>
                    <StepBtn disabled={dim.val >= dim.max} onPress={() => dim.set(step('inc', dim.val, dim.min, dim.max))}>
                      <FontAwesome5 name="plus" size={10} color={dim.val >= dim.max ? '#D1D5DB' : '#374151'} />
                    </StepBtn>
                  </DimStepper>
                </DimRow>
              ))}
            </SectionCard>

            {/* ── Section 2: Material ── */}
            <SectionCard>
              <SectionCardHeader>
                <SectionCardIconWrap bgColor="#DCFCE7">
                  <FontAwesome5 name="layer-group" size={13} color="#0F8A3C" />
                </SectionCardIconWrap>
                <SectionCardTitle>Material</SectionCardTitle>
              </SectionCardHeader>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 4 }}>
                {selectedProduct.materials.map((mat) => {
                  const sel = selectedMaterialId === mat.id;
                  return (
                    <MatCard key={mat.id} active={sel} onPress={() => setSelectedMaterialId(mat.id)} activeOpacity={0.8}>
                      <MatSwatch color={
                        mat.id.includes('black') ? '#1F1F1F' :
                        mat.id.includes('white') ? '#F0F0F0' :
                        mat.id.includes('bio') || mat.id.includes('green') ? '#4D7C4E' :
                        '#C4914F'
                      } />
                      <MatName active={sel}>{mat.name}</MatName>
                      <MatDesc active={sel} numberOfLines={2}>{mat.description}</MatDesc>
                      {mat.multiplier > 1 && (
                        <MatCostTag>+{Math.round((mat.multiplier - 1) * 100)}% cost</MatCostTag>
                      )}
                    </MatCard>
                  );
                })}
              </ScrollView>
            </SectionCard>

            {/* ── Section 3: Print & Brand ── */}
            <SectionCard>
              <SectionCardHeader>
                <SectionCardIconWrap bgColor="#F5F3FF">
                  <FontAwesome5 name="palette" size={13} color="#7C3AED" />
                </SectionCardIconWrap>
                <SectionCardTitle>Brand & Print</SectionCardTitle>
              </SectionCardHeader>

              {/* Ink color */}
              <SubLabel>Ink Color</SubLabel>
              <InkRow>
                {INK_PALETTE.map((c) => (
                  <InkSwatch
                    key={c.hex}
                    hex={c.hex}
                    selected={inkColor === c.hex}
                    onPress={() => setInkColor(c.hex)}
                    activeOpacity={0.8}
                  >
                    {inkColor === c.hex && (
                      <FontAwesome5 name="check" size={9} color={c.hex === '#FFFFFF' ? '#000' : '#FFF'} />
                    )}
                  </InkSwatch>
                ))}
              </InkRow>

              {/* Logo preset */}
              <SubLabel>Logo / Icon</SubLabel>
              <LogoPresetsRow>
                {LOGO_PRESETS.map((p) => (
                  <LogoPresetBtn
                    key={String(p.id)}
                    active={logoPreset === p.id}
                    onPress={() => setLogoPreset(p.id)}
                    activeOpacity={0.8}
                  >
                    <FontAwesome5 name={p.icon as any} size={12} color={logoPreset === p.id ? '#0F8A3C' : '#9CA3AF'} style={{ marginRight: 5 }} />
                    <LogoPresetText active={logoPreset === p.id}>{p.label}</LogoPresetText>
                  </LogoPresetBtn>
                ))}
              </LogoPresetsRow>

              {logoPreset && (
                <ScaleRow>
                  <ScaleLabel>Logo Scale: {logoScale.toFixed(1)}×</ScaleLabel>
                  <ScaleBtns>
                    <ScaleBtn onPress={() => setLogoScale(Math.max(0.5, logoScale - 0.2))}>
                      <FontAwesome5 name="compress-alt" size={11} color="#6B7280" />
                    </ScaleBtn>
                    <ScaleBtn onPress={() => setLogoScale(Math.min(1.8, logoScale + 0.2))}>
                      <FontAwesome5 name="expand-alt" size={11} color="#6B7280" />
                    </ScaleBtn>
                  </ScaleBtns>
                </ScaleRow>
              )}

              {/* Custom text */}
              <SubLabel>Custom Text (max 30 chars)</SubLabel>
              <TextFieldWrap>
                <FontAwesome5 name="font" size={13} color="#9CA3AF" style={{ marginRight: 10 }} />
                <StyledTextField
                  placeholder="e.g. FRAGILE • HANDLE WITH CARE"
                  placeholderTextColor="#D1D5DB"
                  value={customText}
                  onChangeText={setCustomText}
                  maxLength={30}
                />
                {customText !== '' && (
                  <ClearTextBtn onPress={() => setCustomText('')}>
                    <FontAwesome5 name="times-circle" size={14} color="#D1D5DB" />
                  </ClearTextBtn>
                )}
              </TextFieldWrap>

              {customText !== '' && (
                <>
                  <SubLabel>Text Color</SubLabel>
                  <InkRow>
                    {TEXT_COLORS.map((c) => (
                      <InkSwatch
                        key={c.hex + 'tc'}
                        hex={c.hex}
                        selected={textColor === c.hex}
                        onPress={() => setTextColor(c.hex)}
                        activeOpacity={0.8}
                      >
                        {textColor === c.hex && (
                          <FontAwesome5 name="check" size={9} color={c.hex === '#FFFFFF' ? '#000' : '#FFF'} />
                        )}
                      </InkSwatch>
                    ))}
                  </InkRow>

                  <ScaleRow>
                    <ScaleLabel>Font Size: {textSize}pt</ScaleLabel>
                    <ScaleBtns>
                      <ScaleBtn onPress={() => setTextSize(Math.max(10, textSize - 2))}>
                        <FontAwesome5 name="minus" size={10} color="#6B7280" />
                      </ScaleBtn>
                      <ScaleBtn onPress={() => setTextSize(Math.min(24, textSize + 2))}>
                        <FontAwesome5 name="plus" size={10} color="#6B7280" />
                      </ScaleBtn>
                    </ScaleBtns>
                  </ScaleRow>
                </>
              )}

              {/* Upload CTA */}
              <UploadArtworkBtn onPress={handleUploadArtwork} activeOpacity={0.8}>
                <FontAwesome5 name="cloud-upload-alt" size={14} color="#0F8A3C" style={{ marginRight: 8 }} />
                <UploadArtworkText>Upload Artwork File</UploadArtworkText>
                <UploadArtworkFormats>PDF · AI · PSD · SVG</UploadArtworkFormats>
              </UploadArtworkBtn>
            </SectionCard>

            {/* ── Section 4: Quantity ── */}
            <SectionCard>
              <SectionCardHeader>
                <SectionCardIconWrap bgColor="#FEF3C7">
                  <FontAwesome5 name="boxes" size={13} color="#D97706" />
                </SectionCardIconWrap>
                <SectionCardTitle>Production Quantity</SectionCardTitle>
                <MinOrderBadge>min {selectedProduct.minQuantity}</MinOrderBadge>
              </SectionCardHeader>

              <QtyRow>
                {QUANTITY_OPTIONS.map((qty) => (
                  <QtyOption
                    key={qty}
                    active={quantity === qty}
                    onPress={() => handleQuantitySelect(qty)}
                    activeOpacity={0.8}
                  >
                    <QtyOptionText active={quantity === qty}>{qty}</QtyOptionText>
                  </QtyOption>
                ))}
              </QtyRow>

              {/* Discount tiers */}
              <DiscountTiersRow>
                {selectedProduct.bulkDiscounts.map((d) => (
                  <DiscountTier key={d.minQuantity} active={quantity >= d.minQuantity}>
                    <DiscountTierNum active={quantity >= d.minQuantity}>{d.minQuantity}+</DiscountTierNum>
                    <DiscountTierPct active={quantity >= d.minQuantity}>-{d.discountPercent}%</DiscountTierPct>
                  </DiscountTier>
                ))}
              </DiscountTiersRow>
            </SectionCard>

            {/* ── Quote Receipt ── */}
            <QuoteCard>
              <QuoteCardHeader>
                <FontAwesome5 name="receipt" size={14} color="#0F8A3C" style={{ marginRight: 8 }} />
                <QuoteCardTitle>Live Quote Estimate</QuoteCardTitle>
              </QuoteCardHeader>

              <QuoteLine>
                <QuoteKey>Base unit cost</QuoteKey>
                <QuoteVal>₹{selectedProduct.basePrice.toFixed(2)}</QuoteVal>
              </QuoteLine>
              {currentMaterial && (
                <QuoteLine>
                  <QuoteKey>Material ({currentMaterial.name})</QuoteKey>
                  <QuoteVal>×{currentMaterial.multiplier.toFixed(2)}</QuoteVal>
                </QuoteLine>
              )}
              <QuoteLine>
                <QuoteKey>Print plate setup</QuoteKey>
                <QuoteVal>{setupFee > 0 ? `₹${setupFee.toFixed(2)} + ₹0.18/unit` : 'Free'}</QuoteVal>
              </QuoteLine>
              {activeDiscount && (
                <QuoteLine>
                  <QuoteKey>Bulk volume discount</QuoteKey>
                  <QuoteValGreen>-{activeDiscount.discountPercent}%</QuoteValGreen>
                </QuoteLine>
              )}

              <QuoteDivider />

              <QuoteUnitRow>
                <QuoteUnitLabel>Net unit cost</QuoteUnitLabel>
                <QuoteUnitVal>₹{unitPrice.toFixed(2)}</QuoteUnitVal>
              </QuoteUnitRow>

              <QuoteTotalRow>
                <QuoteTotalLabel>Total estimate</QuoteTotalLabel>
                <QuoteTotalVal>₹{totalPrice.toFixed(2)}</QuoteTotalVal>
              </QuoteTotalRow>

              <QuoteSaving>
                <FontAwesome5 name="tag" size={10} color="#0F8A3C" style={{ marginRight: 5 }} />
                <QuoteSavingText>
                  {activeDiscount ? `You save ${activeDiscount.discountPercent}% on this order` : `Order ${selectedProduct.bulkDiscounts[0]?.minQuantity}+ units for ${selectedProduct.bulkDiscounts[0]?.discountPercent}% off`}
                </QuoteSavingText>
              </QuoteSaving>
            </QuoteCard>

            {/* ── Add to Cart ── */}
            <AddToCartBtn
              onPress={handleAddToCart}
              activeOpacity={0.9}
              style={{ shadowColor: '#0F8A3C', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 8 }}
            >
              <FontAwesome5 name="cart-plus" size={16} color="#FFF" style={{ marginRight: 10 }} />
              <AddToCartBtnText>Save & Add to Cart</AddToCartBtnText>
              <AddToCartPrice>₹{totalPrice.toFixed(2)}</AddToCartPrice>
            </AddToCartBtn>

          </ConfigPanel>
        ) : activeTab === 'Dieline' ? (
          <ComingSoonCard>
            <FontAwesome5 name="ruler-combined" size={40} color="#0F8A3C" style={{ marginBottom: 14 }} />
            <ComingSoonTitle>Dieline Editor</ComingSoonTitle>
            <ComingSoonDesc>Precision cut line & fold mark editor. Upload a dieline PDF or generate one automatically based on your dimensions.</ComingSoonDesc>
            <ComingSoonTag>Coming Soon</ComingSoonTag>
          </ComingSoonCard>
        ) : (
          <ComingSoonCard>
            <FontAwesome5 name="cube" size={40} color="#7C3AED" style={{ marginBottom: 14 }} />
            <ComingSoonTitle>3D Preview</ComingSoonTitle>
            <ComingSoonDesc>Rotate, zoom and inspect your packaging in full 3D — see exactly how it will look on shelf before going to print.</ComingSoonDesc>
            <ComingSoonTag>Coming Soon</ComingSoonTag>
          </ComingSoonCard>
        )}
      </ScrollView>
    </Container>
  );
};

export default DesignStudioScreen;

/* ─── Styles ────────────────────────────────────────────────────────────────── */

const Container = styled.View`flex: 1; background-color: #F8F9FA;`;

/* Empty State */
const EmptyWrap = styled.View`
  flex: 1; align-items: center; padding: 36px 24px;
`;
const EmptyIconWrap = styled.View`
  width: 120px; height: 120px; border-radius: 20px;
  overflow: hidden; margin-bottom: 20px; margin-top: 16px;
  shadow-color: #000; shadow-offset: 0px 4px; shadow-opacity: 0.1; shadow-radius: 12px; elevation: 4;
`;
const EmptyHeroImage = styled.Image`width: 100%; height: 100%;`;
const EmptyTitle = styled.Text`font-size: 22px; font-weight: 800; color: #111827; margin-bottom: 8px;`;
const EmptyDesc = styled.Text`font-size: 14px; color: #6B7280; text-align: center; line-height: 21px; margin-bottom: 24px;`;
const EmptyCTA = styled.TouchableOpacity`
  flex-direction: row; align-items: center;
  background-color: #0F8A3C; height: 52px; border-radius: 16px;
  padding-horizontal: 28px; margin-bottom: 32px;
`;
const EmptyCTAText = styled.Text`font-size: 15px; font-weight: 700; color: #FFFFFF;`;
const FeatureGrid = styled.View`flex-direction: row; flex-wrap: wrap; justify-content: space-between; width: 100%;`;
const FeatureCard = styled.View`
  width: 48%; background-color: #FFFFFF; border-radius: 16px;
  padding: 16px; margin-bottom: 12px; border-width: 1px; border-color: #F3F4F6;
`;
const FeatureIcon = styled.View<{ bgColor: string }>`
  width: 40px; height: 40px; border-radius: 12px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center; justify-content: center; margin-bottom: 10px;
`;
const FeatureLabel = styled.Text`font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 3px;`;
const FeatureDesc = styled.Text`font-size: 11px; color: #9CA3AF; line-height: 16px;`;

/* Product Info Bar */
const ProductInfoBar = styled.View`
  flex-direction: row; align-items: center; justify-content: space-between;
  padding: 10px 16px; background-color: #FFFFFF;
  border-bottom-width: 1px; border-bottom-color: #F3F4F6;
`;
const ProductInfoLeft = styled.View`flex-direction: row; align-items: center; flex: 1;`;
const ProductInfoName = styled.Text`font-size: 14px; font-weight: 700; color: #111827; flex: 1;`;
const ChangeProductBtn = styled.TouchableOpacity`
  flex-direction: row; align-items: center;
  background-color: #F9FAFB; padding: 6px 12px; border-radius: 8px;
  border-width: 1px; border-color: #E5E7EB;
`;
const ChangeProductText = styled.Text`font-size: 11px; font-weight: 600; color: #6B7280;`;

/* Tab Bar */
const TabBar = styled.View`
  flex-direction: row; padding: 10px 16px 0; background-color: #FFFFFF;
  border-bottom-width: 1px; border-bottom-color: #F3F4F6;
`;
const TabItem = styled.TouchableOpacity<{ active: boolean }>`
  flex-direction: row; align-items: center;
  padding: 8px 14px; margin-right: 4px; border-radius: 10px 10px 0 0;
  border-bottom-width: 2px;
  border-bottom-color: ${({ active }) => active ? '#0F8A3C' : 'transparent'};
  background-color: ${({ active }) => active ? '#F0FDF4' : 'transparent'};
`;
const TabItemText = styled.Text<{ active: boolean }>`
  font-size: 13px; font-weight: 600;
  color: ${({ active }) => active ? '#0F8A3C' : '#9CA3AF'};
`;

/* Canvas */
const CanvasSection = styled.View`padding: 14px 16px 0;`;
const CanvasHeader = styled.View`flex-direction: row; align-items: center; justify-content: space-between; margin-bottom: 10px;`;
const CanvasHeaderLeft = styled.View`flex-direction: row; align-items: center;`;
const LiveDot = styled.View`
  width: 8px; height: 8px; border-radius: 4px;
  background-color: #0F8A3C; margin-right: 7px;
`;
const CanvasHeaderTitle = styled.Text`font-size: 12px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.5px;`;
const AIBadge = styled.TouchableOpacity`
  flex-direction: row; align-items: center;
  background-color: #F5F3FF; padding: 5px 10px; border-radius: 8px;
  border-width: 1px; border-color: #DDD6FE;
`;
const AIBadgeText = styled.Text`font-size: 11px; font-weight: 700; color: #7C3AED;`;

/* Config Panel */
const ConfigPanel = styled.View`padding: 14px 16px;`;

const SectionCard = styled.View`
  background-color: #FFFFFF; border-radius: 18px; padding: 16px;
  margin-bottom: 14px; border-width: 1px; border-color: #F3F4F6;
`;
const SectionCardHeader = styled.View`
  flex-direction: row; align-items: center; margin-bottom: 16px;
`;
const SectionCardIconWrap = styled.View<{ bgColor: string }>`
  width: 32px; height: 32px; border-radius: 10px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center; justify-content: center; margin-right: 10px;
`;
const SectionCardTitle = styled.Text`font-size: 15px; font-weight: 700; color: #111827; flex: 1;`;
const SectionCardUnit = styled.Text`font-size: 12px; color: #9CA3AF;`;

/* Dimension stepper */
const DimRow = styled.View`
  flex-direction: row; align-items: center; margin-bottom: 12px;
  background-color: #F9FAFB; border-radius: 12px; padding: 8px 12px;
  border-width: 1px; border-color: #F3F4F6;
`;
const DimLabel = styled.Text`font-size: 13px; font-weight: 600; color: #374151; flex: 1;`;
const DimRange = styled.Text`font-size: 10px; color: #D1D5DB; margin-right: 12px;`;
const DimStepper = styled.View`flex-direction: row; align-items: center;`;
const StepBtn = styled.TouchableOpacity<{ disabled?: boolean }>`
  width: 30px; height: 30px; border-radius: 9px;
  background-color: #FFFFFF; border-width: 1px; border-color: #E5E7EB;
  align-items: center; justify-content: center;
  opacity: ${({ disabled }) => disabled ? 0.4 : 1};
`;
const StepVal = styled.Text`
  font-size: 14px; font-weight: 800; color: #111827;
  padding-horizontal: 14px; min-width: 50px; text-align: center;
`;

/* Material Cards */
const MatCard = styled.TouchableOpacity<{ active: boolean }>`
  width: 155px; padding: 14px; border-radius: 14px; margin-right: 10px;
  border-width: 1.5px;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
  background-color: ${({ active }) => active ? '#F0FDF4' : '#FFFFFF'};
`;
const MatSwatch = styled.View<{ color: string }>`
  width: 32px; height: 32px; border-radius: 10px;
  background-color: ${({ color }) => color};
  margin-bottom: 8px; border-width: 1px; border-color: rgba(0,0,0,0.08);
`;
const MatName = styled.Text<{ active: boolean }>`
  font-size: 12px; font-weight: 700; margin-bottom: 4px;
  color: ${({ active }) => active ? '#0F8A3C' : '#111827'};
`;
const MatDesc = styled.Text<{ active: boolean }>`
  font-size: 10px; line-height: 14px;
  color: ${({ active }) => active ? '#374151' : '#9CA3AF'};
`;
const MatCostTag = styled.Text`
  font-size: 9px; font-weight: 700; color: #D97706;
  margin-top: 6px; background-color: #FEF3C7; padding: 2px 6px; border-radius: 5px; align-self: flex-start;
`;

/* Sub labels */
const SubLabel = styled.Text`
  font-size: 11px; font-weight: 700; color: #9CA3AF;
  text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; margin-top: 4px;
`;

/* Ink swatches */
const InkRow = styled.View`flex-direction: row; flex-wrap: wrap; margin-bottom: 14px;`;
const InkSwatch = styled.TouchableOpacity<{ hex: string; selected: boolean }>`
  width: 32px; height: 32px; border-radius: 16px;
  background-color: ${({ hex }) => hex};
  border-width: 2.5px;
  border-color: ${({ selected }) => selected ? '#0F8A3C' : '#E5E7EB'};
  align-items: center; justify-content: center; margin-right: 10px; margin-bottom: 6px;
`;

/* Logo Presets */
const LogoPresetsRow = styled.View`flex-direction: row; flex-wrap: wrap; margin-bottom: 10px;`;
const LogoPresetBtn = styled.TouchableOpacity<{ active: boolean }>`
  flex-direction: row; align-items: center;
  background-color: ${({ active }) => active ? '#DCFCE7' : '#F9FAFB'};
  border-width: 1.5px;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
  padding: 7px 12px; border-radius: 10px; margin-right: 8px; margin-bottom: 8px;
`;
const LogoPresetText = styled.Text<{ active: boolean }>`
  font-size: 11px; font-weight: 600;
  color: ${({ active }) => active ? '#0F8A3C' : '#6B7280'};
`;

/* Scale row */
const ScaleRow = styled.View`
  flex-direction: row; align-items: center; justify-content: space-between;
  background-color: #F9FAFB; border-radius: 10px; padding: 8px 12px;
  margin-bottom: 12px; border-width: 1px; border-color: #F3F4F6;
`;
const ScaleLabel = styled.Text`font-size: 12px; font-weight: 600; color: #374151;`;
const ScaleBtns = styled.View`flex-direction: row;`;
const ScaleBtn = styled.TouchableOpacity`
  width: 30px; height: 30px; border-radius: 8px;
  background-color: #FFFFFF; border-width: 1px; border-color: #E5E7EB;
  align-items: center; justify-content: center; margin-left: 6px;
`;

/* Text field */
const TextFieldWrap = styled.View`
  flex-direction: row; align-items: center;
  background-color: #F9FAFB; border-radius: 12px; padding: 0 14px;
  border-width: 1.5px; border-color: #E5E7EB; height: 48px; margin-bottom: 12px;
`;
const StyledTextField = styled.TextInput`
  flex: 1; font-size: 13px; color: #111827;
`;
const ClearTextBtn = styled.TouchableOpacity`padding: 4px;`;

/* Upload artwork */
const UploadArtworkBtn = styled.TouchableOpacity`
  flex-direction: row; align-items: center;
  border-width: 1.5px; border-style: dashed; border-color: #BBF7D0;
  background-color: #F0FDF4; border-radius: 12px; padding: 13px 14px;
`;
const UploadArtworkText = styled.Text`font-size: 13px; font-weight: 600; color: #0F8A3C; flex: 1;`;
const UploadArtworkFormats = styled.Text`font-size: 10px; color: #9CA3AF;`;

/* Quantity */
const MinOrderBadge = styled.Text`
  font-size: 9px; font-weight: 700; color: #D97706;
  background-color: #FEF3C7; padding: 2px 7px; border-radius: 6px;
`;
const QtyRow = styled.View`
  flex-direction: row; align-items: center; flex-wrap: wrap; gap: 8px;
  margin-bottom: 14px;
`;
const QtyOption = styled.TouchableOpacity<{ active: boolean }>`
  padding: 10px 16px; border-radius: 10px;
  background-color: ${({ active }) => active ? '#0F8A3C' : '#FFFFFF'};
  border-width: 1px;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
`;
const QtyOptionText = styled.Text<{ active: boolean }>`
  font-size: 14px; font-weight: 600;
  color: ${({ active }) => active ? '#FFFFFF' : '#374151'};
`;

const DiscountTiersRow = styled.View`flex-direction: row;`;
const DiscountTier = styled.View<{ active: boolean }>`
  flex: 1; align-items: center; padding: 8px 4px; border-radius: 10px; margin-right: 6px;
  background-color: ${({ active }) => active ? '#DCFCE7' : '#F9FAFB'};
  border-width: 1px; border-color: ${({ active }) => active ? '#BBF7D0' : '#F3F4F6'};
`;
const DiscountTierNum = styled.Text<{ active: boolean }>`
  font-size: 11px; font-weight: 700;
  color: ${({ active }) => active ? '#0F8A3C' : '#9CA3AF'};
`;
const DiscountTierPct = styled.Text<{ active: boolean }>`
  font-size: 12px; font-weight: 800;
  color: ${({ active }) => active ? '#0F8A3C' : '#D1D5DB'};
`;

/* Quote Card */
const QuoteCard = styled.View`
  background-color: #FFFFFF; border-radius: 18px; padding: 16px;
  margin-bottom: 14px; border-width: 1.5px; border-color: #BBF7D0;
`;
const QuoteCardHeader = styled.View`flex-direction: row; align-items: center; margin-bottom: 14px;`;
const QuoteCardTitle = styled.Text`font-size: 14px; font-weight: 700; color: #111827;`;
const QuoteLine = styled.View`flex-direction: row; justify-content: space-between; margin-bottom: 8px;`;
const QuoteKey = styled.Text`font-size: 12px; color: #9CA3AF;`;
const QuoteVal = styled.Text`font-size: 12px; font-weight: 600; color: #374151;`;
const QuoteValGreen = styled.Text`font-size: 12px; font-weight: 700; color: #0F8A3C;`;
const QuoteDivider = styled.View`height: 1px; background-color: #F3F4F6; margin-vertical: 10px;`;
const QuoteUnitRow = styled.View`flex-direction: row; justify-content: space-between; margin-bottom: 6px;`;
const QuoteUnitLabel = styled.Text`font-size: 13px; color: #6B7280;`;
const QuoteUnitVal = styled.Text`font-size: 15px; font-weight: 700; color: #111827;`;
const QuoteTotalRow = styled.View`flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-top: 4px;`;
const QuoteTotalLabel = styled.Text`font-size: 16px; font-weight: 700; color: #111827;`;
const QuoteTotalVal = styled.Text`font-size: 30px; font-weight: 800; color: #0F8A3C; letter-spacing: -1px;`;
const QuoteSaving = styled.View`
  flex-direction: row; align-items: center;
  background-color: #F0FDF4; border-radius: 10px; padding: 8px 12px;
`;
const QuoteSavingText = styled.Text`font-size: 12px; font-weight: 600; color: #0F8A3C;`;

/* Add to Cart */
const AddToCartBtn = styled.TouchableOpacity`
  height: 58px; background-color: #0F8A3C; border-radius: 18px;
  flex-direction: row; align-items: center; justify-content: center; margin-bottom: 8px;
`;
const AddToCartBtnText = styled.Text`font-size: 16px; font-weight: 700; color: #FFFFFF; flex: 1; margin-left: 6px;`;
const AddToCartPrice = styled.Text`font-size: 17px; font-weight: 800; color: rgba(255,255,255,0.9); margin-right: 6px;`;

/* Coming Soon */
const ComingSoonCard = styled.View`
  margin: 20px 16px; background-color: #FFFFFF; border-radius: 20px;
  padding: 40px 24px; align-items: center; border-width: 1px; border-color: #F3F4F6;
`;
const ComingSoonTitle = styled.Text`font-size: 20px; font-weight: 800; color: #111827; margin-bottom: 10px;`;
const ComingSoonDesc = styled.Text`
  font-size: 14px; color: #6B7280; text-align: center; line-height: 21px; margin-bottom: 20px;
`;
const ComingSoonTag = styled.Text`
  font-size: 12px; font-weight: 700; color: #7C3AED;
  background-color: #F5F3FF; padding: 6px 16px; border-radius: 20px;
  border-width: 1px; border-color: #DDD6FE;
`;
