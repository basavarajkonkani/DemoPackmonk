/**
 * PouchConfiguratorScreen
 * Exactly matches the image:
 * Brochure-backed flow: pouch type, catalogue size, then quantity/artwork.
 */
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Platform,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setPouchType,
  setWindowOption,
  setMaterialType,
  setCapacity,
  setQuantity,
  setArtworkUri,
  setNeedsDesignAssistance,
  applyRecommendation,
  resetPouchConfig,
  selectPouchConfig,
  calculatePouchPrice,
  POUCH_CATALOG,
  getPouchVariant,
  POUCH_TYPE_LABELS,
  DELIVERY_TIMELINE,
  PouchType,
  WindowOption,
  MaterialType,
  CapacityOption,
  PouchConfig,
} from '../store/pouchSlice';
import { addToCart } from '../store/cartSlice';
import {
  BULK_ORDER_THRESHOLD,
  BULK_ORDER_MESSAGE,
  BULK_ORDER_CONTACT_PHONE,
  BULK_ORDER_CONTACT_EMAIL,
  QUANTITY_OPTIONS,
  MINIMUM_ORDER_QUANTITY,
} from '../constants';
import {
  quantityValidator,
  DEFAULT_QUANTITY_OPTIONS,
  applyQuantityValidationResult,
  showQuantityValidationAlert,
} from '../utils/quantityValidator';
import { IMAGES, POUCH_TYPE_IMAGES } from '../constants/images';

const TOTAL_STEPS = 3;

const STEP_LABELS = [
  'Pouch\nType',
  'Capacity\nSelection',
  'Quantity &\nCustomization',
];

const CATALOG_QUANTITY_OPTIONS = [50, 100, 200, 500, 1000, 3000, 5000];
const CATALOG_VALIDATION_OPTIONS = {
  ...DEFAULT_QUANTITY_OPTIONS,
  quantitySteps: CATALOG_QUANTITY_OPTIONS,
  minimumOrderQuantity: 50,
};

const PouchConfiguratorScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const config = useAppSelector(selectPouchConfig);
  const [step, setStep] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [qtyInput, setQtyInput] = useState(String(config.quantity));

  const handlePickArtwork = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload artwork.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      dispatch(setArtworkUri(result.assets[0].uri));
      Alert.alert('✅ Artwork Uploaded', 'Your design file has been attached to this order.');
    }
  };

  const livePrice = calculatePouchPrice(config);
  const selectedProduct = config.pouchType ? POUCH_CATALOG[config.pouchType] : null;
  const selectedVariant = getPouchVariant(config);
  const moq = selectedVariant?.piecesPerPacket ?? 50;
  const dimensions = selectedVariant;

  const goNext = () => {
    if (step === 1 && !config.pouchType) {
      Alert.alert('Select Pouch Type', 'Please choose a pouch type to continue.');
      return;
    }
    if (step === 2 && !config.capacity) {
      Alert.alert('Select Capacity', 'Please choose a capacity to continue.');
      return;
    }
    if (step === TOTAL_STEPS) {
      setShowSummary(true);
      return;
    }
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (showSummary) { setShowSummary(false); return; }
    if (step === 1) { navigation.goBack(); return; }
    setStep((s) => s - 1);
  };

  const incrementQty = () => {
    const result = quantityValidator.validateQuantityIncrement(
      config.quantity,
      CATALOG_VALIDATION_OPTIONS
    );

    applyQuantityValidationResult(result, (qty) => {
      dispatch(setQuantity(qty));
      setQtyInput(String(qty));
    });
  };

  const decrementQty = () => {
    const minQty = moq
      ? Math.max(
          50,
          CATALOG_QUANTITY_OPTIONS.find((q) => q >= moq) ?? 50
        )
      : MINIMUM_ORDER_QUANTITY;

    const result = quantityValidator.validateQuantityDecrement(config.quantity, {
      ...CATALOG_VALIDATION_OPTIONS,
      minimumOrderQuantity: minQty,
    });

    if (!result.isValid) {
      showQuantityValidationAlert(result);
      return;
    }

    dispatch(setQuantity(result.newQuantity!));
    setQtyInput(String(result.newQuantity));
  };

  const handleAddToCart = () => {
    if (!config.pouchType || !config.windowOption || !config.materialType || !config.capacity) {
      Alert.alert('Incomplete', 'Please complete all configuration steps first.');
      return;
    }
    const dims = getPouchVariant(config);
    if (!dims) return;
    const totalPrice = livePrice;
    const cartItem = {
      cartId: `pouch-${Date.now()}`,
      productId: `pouch-${config.pouchType}-${config.capacity}`,
      name: POUCH_TYPE_LABELS[config.pouchType],
      category: 'pouch' as const,
      design: {
        length: dims.width, width: dims.height, height: 0,
        materialId: config.materialType, inkColor: '#000000',
        logoUri: config.artworkUri, logoScale: 1, logoPosX: 0, logoPosY: 0,
        customText: '', textColor: '#000000', textSize: 12,
      },
      pouchConfig: {
        pouchType: config.pouchType, windowOption: config.windowOption,
        materialType: config.materialType, capacity: config.capacity,
        artworkUri: config.artworkUri, needsDesignAssistance: config.needsDesignAssistance,
        dimensions: dims,
      },
      quantity: config.quantity,
      baseUnitPrice: totalPrice / config.quantity,
      unitPrice: totalPrice / config.quantity,
      totalPrice,
      setupFee: 0,
    };
    dispatch(addToCart(cartItem));
    dispatch(resetPouchConfig());
    setStep(1);
    setShowSummary(false);
    Alert.alert(
      '✅ Added to Cart',
      'Your pouch configuration has been added to the cart.',
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  // ── Step Indicator (numbered dots at top) ────────────────────────────
  const renderStepBar = () => (
    <StepBar>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <React.Fragment key={n}>
            <StepDotWrap>
              <StepDot done={done} active={active}>
                {done
                  ? <FontAwesome5 name="check" size={9} color="#FFF" />
                  : <StepNum active={active}>{n}</StepNum>
                }
              </StepDot>
            </StepDotWrap>
            {i < TOTAL_STEPS - 1 && <StepConnector done={done} />}
          </React.Fragment>
        );
      })}
    </StepBar>
  );

  // ── Step 1: Select Pouch Type ─────────────────────────────────────────
  const renderStep1 = () => (
    <StepContent>
      <StepHeading>Select Pouch Type</StepHeading>
      <StepSubText>Step 1 of 5</StepSubText>
      <StepDesc>Choose the type of pouch you need</StepDesc>

      <OptionRow
        active={config.pouchType === 'plain'}
        onPress={() => dispatch(setPouchType('plain'))}
        activeOpacity={0.85}
      >
        <OptionImgBox bgColor="#F3F4F6">
          <Image source={POUCH_TYPE_IMAGES.plain} style={{ width: 60, height: 60, borderRadius: 12 }} resizeMode="contain" />
        </OptionImgBox>
        <OptionTextWrap>
          <OptionName active={config.pouchType === 'plain'}>{POUCH_CATALOG.plain.name}</OptionName>
          <OptionHint>{POUCH_CATALOG.plain.subtitle}</OptionHint>
        </OptionTextWrap>
        <ArrowIcon>
          <FontAwesome5 name="chevron-right" size={13} color="#D1D5DB" />
        </ArrowIcon>
      </OptionRow>

      <OptionRow
        active={config.pouchType === 'printed'}
        onPress={() => dispatch(setPouchType('printed'))}
        activeOpacity={0.85}
      >
        <OptionImgBox bgColor="#DCFCE7">
          <Image source={POUCH_TYPE_IMAGES.printed} style={{ width: 60, height: 60, borderRadius: 12 }} resizeMode="contain" />
        </OptionImgBox>
        <OptionTextWrap>
          <OptionName active={config.pouchType === 'printed'}>{POUCH_CATALOG.printed.name}</OptionName>
          <OptionHint>{POUCH_CATALOG.printed.subtitle}</OptionHint>
        </OptionTextWrap>
        <ArrowIcon>
          <FontAwesome5 name="chevron-right" size={13} color="#D1D5DB" />
        </ArrowIcon>
      </OptionRow>

      <OptionRow
        active={config.pouchType === 'kraft'}
        onPress={() => dispatch(setPouchType('kraft'))}
        activeOpacity={0.85}
      >
        <OptionImgBox bgColor="#FEF3C7">
          <Image source={POUCH_TYPE_IMAGES.kraft} style={{ width: 60, height: 60, borderRadius: 12 }} resizeMode="contain" />
        </OptionImgBox>
        <OptionTextWrap>
          <OptionName active={config.pouchType === 'kraft'}>{POUCH_CATALOG.kraft.name}</OptionName>
          <OptionHint>{POUCH_CATALOG.kraft.subtitle}</OptionHint>
        </OptionTextWrap>
        <ArrowIcon>
          <FontAwesome5 name="chevron-right" size={13} color="#D1D5DB" />
        </ArrowIcon>
      </OptionRow>
    </StepContent>
  );

  // ── Step 2: Window Option ─────────────────────────────────────────────
  const renderStep2 = () => {
    const isKraft = config.pouchType === 'kraft';
    return (
      <StepContent>
        <StepHeading>Window Option</StepHeading>
        <StepSubText>Step 2 of 5</StepSubText>
        <StepDesc>Do you need a window in your pouch?</StepDesc>

        {isKraft && (
          <InfoBox>
            <FontAwesome5 name="info-circle" size={13} color="#0F8A3C" style={{ marginRight: 7 }} />
            <InfoBoxText>Window not available for Kraft pouches.</InfoBoxText>
          </InfoBox>
        )}

        <WindowCard
          active={config.windowOption === 'with_window'}
          disabled={isKraft}
          onPress={() => !isKraft && dispatch(setWindowOption('with_window'))}
          activeOpacity={isKraft ? 1 : 0.85}
        >
          <WindowImgBox bgColor="#DCFCE7" disabled={isKraft}>
            <FontAwesome5 name="expand" size={38} color={isKraft ? '#D1D5DB' : '#16A34A'} />
          </WindowImgBox>
          <WindowLabelText active={config.windowOption === 'with_window'} disabled={isKraft}>
            With Window
          </WindowLabelText>
          {config.windowOption === 'with_window' && !isKraft && (
            <CheckBadge>
              <FontAwesome5 name="check" size={10} color="#FFF" />
            </CheckBadge>
          )}
        </WindowCard>

        <WindowCard
          active={config.windowOption === 'without_window'}
          disabled={false}
          onPress={() => dispatch(setWindowOption('without_window'))}
          activeOpacity={0.85}
        >
          <WindowImgBox bgColor="#F3F4F6" disabled={false}>
            <FontAwesome5 name="compress" size={38} color="#374151" />
          </WindowImgBox>
          <WindowLabelText active={config.windowOption === 'without_window'} disabled={false}>
            Without Window
          </WindowLabelText>
          {config.windowOption === 'without_window' && (
            <CheckBadge>
              <FontAwesome5 name="check" size={10} color="#FFF" />
            </CheckBadge>
          )}
        </WindowCard>
      </StepContent>
    );
  };

  // ── Step 3: Material Type ─────────────────────────────────────────────
  const renderStep3 = () => (
    <StepContent>
      <StepHeading>Material Type</StepHeading>
      <StepSubText>Step 3 of 5</StepSubText>
      <StepDesc>Select material combination</StepDesc>

      <MaterialCard
        active={config.materialType === 'metalised'}
        onPress={() => dispatch(setMaterialType('metalised'))}
        activeOpacity={0.85}
      >
        <MatImgBox>
          <MatImg source={IMAGES.metalised} resizeMode="cover" />
        </MatImgBox>
        <MatBody>
          <MatName active={config.materialType === 'metalised'}>Metalised</MatName>
          <MatDesc>Better barrier protection.{'\n'}Keeps product fresh for longer.</MatDesc>
        </MatBody>
        {config.materialType === 'metalised' && (
          <CheckBadge>
            <FontAwesome5 name="check" size={10} color="#FFF" />
          </CheckBadge>
        )}
      </MaterialCard>

      <MaterialCard
        active={config.materialType === 'non_metalised'}
        onPress={() => dispatch(setMaterialType('non_metalised'))}
        activeOpacity={0.85}
      >
        <MatImgBox>
          <MatImg source={IMAGES.withoutMetalised} resizeMode="cover" />
        </MatImgBox>
        <MatBody>
          <MatName active={config.materialType === 'non_metalised'}>Non-Metalised</MatName>
          <MatDesc>More transparency.{'\n'}Good for visibility of product.</MatDesc>
        </MatBody>
        {config.materialType === 'non_metalised' && (
          <CheckBadge>
            <FontAwesome5 name="check" size={10} color="#FFF" />
          </CheckBadge>
        )}
      </MaterialCard>
    </StepContent>
  );

  // ── Step 2: Brochure capacity / SKU ───────────────────────────────────
  const renderStep4 = () => (
    <StepContent>
      <StepHeading>Select Capacity</StepHeading>
      <StepSubText>Step 2 of 3</StepSubText>
      <StepDesc>{selectedProduct?.description}</StepDesc>

      <CapacityGrid>
        {(selectedProduct?.variants ?? []).map((item) => {
          const active = config.capacity === item.capacity;
          return (
            <CapBtn
              key={item.code}
              active={active}
              onPress={() => dispatch(setCapacity(item.capacity))}
              activeOpacity={0.85}
            >
              <CapBtnText active={active}>{item.capacity}</CapBtnText>
              <CapPriceText active={active}>₹{item.pricePerPiece.toFixed(2)}/pc</CapPriceText>
            </CapBtn>
          );
        })}
      </CapacityGrid>

      {dimensions && (
        <DimBox>
          <FontAwesome5 name="ruler-combined" size={14} color="#0F8A3C" style={{ marginRight: 8 }} />
          <View>
            <DimTitle>{dimensions.code} • {config.capacity} • {selectedProduct?.micron} micron</DimTitle>
            <DimValue>
              Size (W×H+G): {dimensions.width} × {dimensions.height} + {dimensions.gusset} {dimensions.unit}
            </DimValue>
            <DimValue>Pack: {dimensions.piecesPerPacket} pcs • Price: ₹{dimensions.pricePerPiece.toFixed(2)}/pc</DimValue>
          </View>
        </DimBox>
      )}
    </StepContent>
  );

  // ── Step 3: Quantity & Artwork ────────────────────────────────────────
  const renderStep5 = () => (
    <StepContent>
      <StepHeading>Order Details</StepHeading>
      <StepSubText>Step 3 of 3</StepSubText>

      {/* Quantity */}
      <FieldLabel>Quantity</FieldLabel>
      <QtyRow>
        <QtyBtn onPress={decrementQty} activeOpacity={0.85}>
          <FontAwesome5 name="minus" size={14} color="#374151" />
        </QtyBtn>
        <QtyValue>{config.quantity.toLocaleString()}</QtyValue>
        <QtyBtn onPress={incrementQty} activeOpacity={0.85}>
          <FontAwesome5 name="plus" size={14} color="#374151" />
        </QtyBtn>
      </QtyRow>
      <MOQNote>Minimum Order Quantity: {moq.toLocaleString()} pcs</MOQNote>

      {/* Large order warning */}
      {config.quantity >= BULK_ORDER_THRESHOLD && (
        <LargeOrderBanner>
          <FontAwesome5 name="phone-alt" size={14} color="#92400E" style={{ marginRight: 10, marginTop: 1 }} />
          <LargeOrderTextWrap>
            <LargeOrderTitle>Large Order — Contact Sales</LargeOrderTitle>
            <LargeOrderDesc>
              {BULK_ORDER_MESSAGE}{'\n'}
              📞 {BULK_ORDER_CONTACT_PHONE}  •  ✉️ {BULK_ORDER_CONTACT_EMAIL}
            </LargeOrderDesc>
          </LargeOrderTextWrap>
        </LargeOrderBanner>
      )}

      {/* Artwork */}
      {config.pouchType === 'printed' && (
        <>
          <FieldLabel style={{ marginTop: 18 }}>Artwork Upload <FieldLabelNote>(For Printed Pouches)</FieldLabelNote></FieldLabel>
          <ArtworkBox
            onPress={handlePickArtwork}
            activeOpacity={0.85}
          >
            <FontAwesome5 name="cloud-upload-alt" size={24} color="#0F8A3C" style={{ marginBottom: 6 }} />
            <ArtworkBoxTitle>Upload Design File</ArtworkBoxTitle>
            <ArtworkBoxHint>PDF, AI, PNG, PSD (Max 50MB)</ArtworkBoxHint>
            {config.artworkUri && (
              <ArtworkBadge>
                <FontAwesome5 name="check-circle" size={12} color="#0F8A3C" style={{ marginRight: 4 }} />
                <ArtworkBadgeText>File selected</ArtworkBadgeText>
              </ArtworkBadge>
            )}
          </ArtworkBox>

          <OrRow><OrLine /><OrText>OR</OrText><OrLine /></OrRow>

          <DesignAssist
            active={config.needsDesignAssistance}
            onPress={() => dispatch(setNeedsDesignAssistance(!config.needsDesignAssistance))}
            activeOpacity={0.85}
          >
            <FontAwesome5
              name="paint-brush" size={15}
              color={config.needsDesignAssistance ? '#7C3AED' : '#9CA3AF'}
              style={{ marginRight: 8 }}
            />
            <DesignAssistText active={config.needsDesignAssistance}>
              Need Design Assistance?
            </DesignAssistText>
          </DesignAssist>
        </>
      )}
    </StepContent>
  );

  // ── Summary ────────────────────────────────────────────────────────────
  const renderSummary = () => {
    if (!config.pouchType || !config.windowOption || !config.materialType || !config.capacity) return null;
    return (
      <SummaryWrap>
        <StepContent>
          <StepHeading>Price Summary</StepHeading>

          {/* Price card top */}
          <PriceSummaryCard>
            <PSRow>
              <PSKey>Quantity</PSKey>
              <PSQtyRow>
                <PSQtyBtn onPress={decrementQty}><FontAwesome5 name="minus" size={10} color="#374151" /></PSQtyBtn>
                <PSQtyNum>{config.quantity.toLocaleString()}</PSQtyNum>
                <PSQtyBtn onPress={incrementQty}><FontAwesome5 name="plus" size={10} color="#374151" /></PSQtyBtn>
              </PSQtyRow>
            </PSRow>
            <MOQNote2>Minimum Order Quantity: {moq.toLocaleString()} pcs</MOQNote2>

            {config.quantity >= BULK_ORDER_THRESHOLD && (
              <LargeOrderBanner>
                <FontAwesome5 name="phone-alt" size={14} color="#92400E" style={{ marginRight: 10, marginTop: 1 }} />
                <LargeOrderTextWrap>
                  <LargeOrderTitle>Large Order — Contact Sales</LargeOrderTitle>
                  <LargeOrderDesc>
                    {BULK_ORDER_MESSAGE}{'\n'}
                    📞 {BULK_ORDER_CONTACT_PHONE}  •  ✉️ {BULK_ORDER_CONTACT_EMAIL}
                  </LargeOrderDesc>
                </LargeOrderTextWrap>
              </LargeOrderBanner>
            )}

            {config.pouchType === 'printed' && (
              <ArtworkRow>
                <FontAwesome5 name="cloud-upload-alt" size={14} color="#0F8A3C" style={{ marginRight: 6 }} />
                <ArtworkRowText>
                  {config.artworkUri ? 'Design file uploaded' : 'No artwork uploaded'}
                </ArtworkRowText>
              </ArtworkRow>
            )}
          </PriceSummaryCard>

          {/* Right-side summary panel (as in image) */}
          <YourSelectionCard>
            <YSTitle>Your Product Selection</YSTitle>
            <YSImgWrap>
              <Image
                source={
                  config.pouchType
                    ? POUCH_TYPE_IMAGES[config.pouchType]
                    : POUCH_TYPE_IMAGES.plain
                }
                style={{ width: 100, height: 100, borderRadius: 16 }}
                resizeMode="contain"
              />
            </YSImgWrap>

            <YSRow><YSKey>{selectedProduct?.name}</YSKey></YSRow>
            <YSDivider />
            <YSRow><YSKey>• Code: {selectedVariant?.code}</YSKey></YSRow>
            <YSRow><YSKey>• {selectedProduct?.material} • {selectedProduct?.micron} micron</YSKey></YSRow>
            <YSRow><YSKey>• {config.capacity} • ₹{selectedVariant?.pricePerPiece.toFixed(2)}/pc</YSKey></YSRow>
            <YSRow><YSKey>• {selectedVariant?.width} × {selectedVariant?.height} + {selectedVariant?.gusset} cm</YSKey></YSRow>
            <YSRow><YSKey>• Qty: {config.quantity.toLocaleString()} pcs</YSKey></YSRow>
            <YSDivider />

            <YSPriceRow>
              <View>
                <YSPriceLabel>Estimated Price</YSPriceLabel>
                <YSPrice>₹{livePrice.toLocaleString()}</YSPrice>
              </View>
              <View>
                <YSDelivLabel>Delivery Time</YSDelivLabel>
                <YSDelivRow>
                  <FontAwesome5 name="truck" size={12} color="#0F8A3C" style={{ marginRight: 4 }} />
                  <YSDelivVal>{DELIVERY_TIMELINE}</YSDelivVal>
                </YSDelivRow>
              </View>
            </YSPriceRow>
          </YourSelectionCard>

          <CalculateBtn onPress={() => {
            Alert.alert(
              '💰 Price Breakdown',
              `Pouch Type: ${config.pouchType ? POUCH_TYPE_LABELS[config.pouchType] : '—'}\n` +
              `Product code: ${selectedVariant?.code ?? '—'}\n` +
              `Material: ${selectedProduct?.material ?? '—'}\n` +
              `Capacity: ${config.capacity ?? '—'}\n` +
              `Brochure unit price: ₹${selectedVariant?.pricePerPiece.toFixed(2) ?? '—'}\n` +
              `Quantity: ${config.quantity.toLocaleString()} pcs\n` +
              `─────────────────\n` +
              `Estimated Price: ₹${livePrice.toLocaleString()}\n` +
              `Unit Price: ₹${(livePrice / config.quantity).toFixed(2)}/pc\n` +
              `Delivery: ${DELIVERY_TIMELINE}`,
              [{ text: 'OK' }]
            );
          }} activeOpacity={0.85}>
            <FontAwesome5 name="calculator" size={14} color="#0F8A3C" style={{ marginRight: 8 }} />
            <CalcBtnText>Calculate Price</CalcBtnText>
          </CalculateBtn>

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
            <AddToCartText>Add to Cart — ₹{livePrice.toLocaleString()}</AddToCartText>
          </AddToCartBtn>

          <EditBtn onPress={() => setShowSummary(false)} activeOpacity={0.8}>
            <FontAwesome5 name="edit" size={14} color="#6B7280" style={{ marginRight: 6 }} />
            <EditBtnText>Edit Configuration</EditBtnText>
          </EditBtn>
        </StepContent>
      </SummaryWrap>
    );
  };

  const stepTitle = showSummary ? 'Price Summary' : `Step ${step} of ${TOTAL_STEPS}`;

  return (
    <Container>
      {/* Nav Bar */}
      <NavBar>
        <NavBackBtn onPress={goBack} activeOpacity={0.8}>
          <FontAwesome5 name="arrow-left" size={16} color="#111827" />
        </NavBackBtn>
        <NavCenter>
          <NavTitle>
            {showSummary ? 'Price Summary' : step === 1 ? 'Select Pouch Type' : step === 2 ? 'Select Capacity' : 'Order Details'}
          </NavTitle>
        </NavCenter>
        <NavFavBtn onPress={() => Alert.alert('Saved', 'Configuration saved to favourites.')} activeOpacity={0.8}>
          <FontAwesome5 name="heart" size={15} color="#D1D5DB" />
        </NavFavBtn>
      </NavBar>

      {/* Step indicator */}
      {!showSummary && renderStepBar()}

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {showSummary
          ? renderSummary()
          : step === 1 ? renderStep1()
          : step === 2 ? renderStep4()
          : renderStep5()
        }
      </ScrollView>

      {/* Bottom Continue / View Summary */}
      {!showSummary && (
        <BottomBar>
          <ContinueBtn
            onPress={goNext}
            activeOpacity={0.9}
            style={{
              shadowColor: '#0F8A3C',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <ContinueBtnText>
              {step === TOTAL_STEPS ? 'View Price Summary' : 'Continue'}
            </ContinueBtnText>
          </ContinueBtn>
        </BottomBar>
      )}
    </Container>
  );
};

export default PouchConfiguratorScreen;

// ─── Styled Components ─────────────────────────────────────────────────────

const Container = styled.View`flex: 1; background-color: #F8F9FA;`;

const NavBar = styled.View`
  height: ${Platform.OS === 'ios' ? '96px' : '60px'};
  padding-top: ${Platform.OS === 'ios' ? '48px' : '0px'};
  flex-direction: row; align-items: center; justify-content: space-between;
  padding-horizontal: 16px; background-color: #FFFFFF;
  border-bottom-width: 1px; border-bottom-color: #F3F4F6;
`;
const NavBackBtn = styled.TouchableOpacity`
  width: 36px; height: 36px; border-radius: 10px;
  background-color: #F9FAFB; align-items: center; justify-content: center;
  border-width: 1px; border-color: #E5E7EB;
`;
const NavFavBtn = styled.TouchableOpacity`
  width: 36px; height: 36px; border-radius: 10px;
  background-color: #F9FAFB; align-items: center; justify-content: center;
  border-width: 1px; border-color: #E5E7EB;
`;
const NavCenter = styled.View`flex: 1; align-items: center;`;
const NavTitle = styled.Text`font-size: 16px; font-weight: 700; color: #111827;`;

/* Step bar */
const StepBar = styled.View`
  flex-direction: row; align-items: center;
  padding: 12px 20px 10px; background-color: #FFFFFF;
  border-bottom-width: 1px; border-bottom-color: #F3F4F6;
`;
const StepDotWrap = styled.View`align-items: center;`;
const StepDot = styled.View<{ done: boolean; active: boolean }>`
  width: 26px; height: 26px; border-radius: 13px;
  background-color: ${({ done, active }) => done || active ? '#0F8A3C' : '#E5E7EB'};
  align-items: center; justify-content: center;
`;
const StepNum = styled.Text<{ active: boolean }>`
  font-size: 11px; font-weight: 700;
  color: ${({ active }) => active ? '#FFFFFF' : '#9CA3AF'};
`;
const StepConnector = styled.View<{ done: boolean }>`
  flex: 1; height: 2px; margin-horizontal: 3px;
  background-color: ${({ done }) => done ? '#0F8A3C' : '#E5E7EB'};
`;

/* Content */
const StepContent = styled.View`padding: 20px 16px;`;
const StepHeading = styled.Text`font-size: 20px; font-weight: 800; color: #111827; margin-bottom: 2px;`;
const StepSubText = styled.Text`font-size: 12px; color: #9CA3AF; margin-bottom: 4px;`;
const StepDesc = styled.Text`font-size: 14px; color: #374151; margin-bottom: 20px;`;

/* Step 1 Options */
const OptionRow = styled.TouchableOpacity<{ active: boolean }>`
  flex-direction: row; align-items: center;
  background-color: #FFFFFF; border-radius: 14px; padding: 14px;
  margin-bottom: 12px; border-width: 1.5px;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
`;
const OptionImgBox = styled.View<{ bgColor: string }>`
  width: 60px; height: 60px; border-radius: 12px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center; justify-content: center; margin-right: 14px;
`;
const OptionTextWrap = styled.View`flex: 1;`;
const OptionName = styled.Text<{ active: boolean }>`
  font-size: 16px; font-weight: 700;
  color: ${({ active }) => active ? '#0F8A3C' : '#111827'};
  margin-bottom: 3px;
`;
const OptionHint = styled.Text`font-size: 12px; color: #9CA3AF;`;
const ArrowIcon = styled.View`width: 28px; align-items: center;`;

/* Info Banner */
const InfoBox = styled.View`
  flex-direction: row; align-items: center;
  background-color: #F0FDF4; border-radius: 10px;
  padding: 10px 14px; margin-bottom: 14px;
  border-width: 1px; border-color: #BBF7D0;
`;
const InfoBoxText = styled.Text`flex: 1; font-size: 12px; color: #0A6B2E;`;

/* Step 2 Window Cards */
const WindowCard = styled.TouchableOpacity<{ active: boolean; disabled: boolean }>`
  background-color: #FFFFFF; border-radius: 14px; padding: 16px;
  margin-bottom: 14px; align-items: center; border-width: 1.5px;
  border-color: ${({ active, disabled }) => disabled ? '#E5E7EB' : active ? '#0F8A3C' : '#E5E7EB'};
  opacity: ${({ disabled }) => disabled ? 0.45 : 1};
  position: relative;
`;
const WindowImgBox = styled.View<{ bgColor: string; disabled: boolean }>`
  width: 100%; height: 120px; border-radius: 10px;
  background-color: ${({ bgColor, disabled }) => disabled ? '#F3F4F6' : bgColor};
  align-items: center; justify-content: center; margin-bottom: 10px;
`;
const WindowLabelText = styled.Text<{ active: boolean; disabled: boolean }>`
  font-size: 16px; font-weight: 700;
  color: ${({ active, disabled }) => disabled ? '#D1D5DB' : active ? '#0F8A3C' : '#111827'};
`;
const CheckBadge = styled.View`
  position: absolute; top: 12px; right: 12px;
  width: 22px; height: 22px; border-radius: 11px;
  background-color: #0F8A3C; align-items: center; justify-content: center;
`;

/* Step 3 Material Cards */
const MaterialCard = styled.TouchableOpacity<{ active: boolean }>`
  flex-direction: row; background-color: #FFFFFF; border-radius: 14px;
  padding: 14px; margin-bottom: 14px; align-items: center;
  border-width: 1.5px;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
  position: relative;
`;
const MatImgBox = styled.View`
  width: 70px; height: 80px; border-radius: 10px;
  background-color: #f9fafb; margin-right: 14px; overflow: hidden;
`;
const MatImg = styled.Image`width: 100%; height: 100%;`;
const MatBody = styled.View`flex: 1;`;
const MatName = styled.Text<{ active: boolean }>`
  font-size: 17px; font-weight: 700;
  color: ${({ active }) => active ? '#0F8A3C' : '#111827'};
  margin-bottom: 5px;
`;
const MatDesc = styled.Text`font-size: 12px; color: #6B7280; line-height: 18px;`;

/* Step 4 Capacity */
const CapacityGrid = styled.View`
  flex-direction: row; flex-wrap: wrap; margin-bottom: 16px;
`;
const CapBtn = styled.TouchableOpacity<{ active: boolean }>`
  padding: 10px 20px; border-radius: 10px; margin-right: 10px; margin-bottom: 10px;
  border-width: 1.5px;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
  background-color: ${({ active }) => active ? '#F0FDF4' : '#FFFFFF'};
`;
const CapBtnText = styled.Text<{ active: boolean }>`
  font-size: 15px; font-weight: 700;
  color: ${({ active }) => active ? '#0F8A3C' : '#374151'};
`;
const CapPriceText = styled.Text<{ active: boolean }>`
  font-size: 10px; font-weight: 600; margin-top: 2px;
  color: ${({ active }) => active ? '#0F8A3C' : '#9CA3AF'};
`;
const DimBox = styled.View`
  flex-direction: row; align-items: flex-start;
  background-color: #F0FDF4; border-radius: 12px;
  padding: 14px; border-width: 1px; border-color: #BBF7D0;
`;
const DimTitle = styled.Text`font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 3px;`;
const DimValue = styled.Text`font-size: 12px; color: #6B7280;`;

/* Step 5 */
const FieldLabel = styled.Text`font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 10px;`;
const FieldLabelNote = styled.Text`font-size: 12px; font-weight: 400; color: #9CA3AF;`;
const QtyRow = styled.View`
  flex-direction: row; align-items: center;
  background-color: #FFFFFF; border-radius: 12px; padding: 8px;
  border-width: 1px; border-color: #E5E7EB; align-self: flex-start; margin-bottom: 8px;
`;
const QtyBtn = styled.TouchableOpacity`
  width: 34px; height: 34px; border-radius: 8px;
  background-color: #F3F4F6; align-items: center; justify-content: center;
  border-width: 1px; border-color: #E5E7EB;
`;
const QtyValue = styled.Text`
  font-size: 17px; font-weight: 800; color: #111827; padding-horizontal: 20px; min-width: 90px; text-align: center;
`;
const MOQNote = styled.Text`font-size: 11px; color: #9CA3AF; margin-bottom: 8px;`;

const ArtworkBox = styled.TouchableOpacity`
  background-color: #FFFFFF; border-radius: 14px; padding: 20px;
  align-items: center; border-width: 1.5px; border-color: #E5E7EB; border-style: dashed; margin-bottom: 12px;
`;
const ArtworkBoxTitle = styled.Text`font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 3px;`;
const ArtworkBoxHint = styled.Text`font-size: 12px; color: #9CA3AF;`;
const ArtworkBadge = styled.View`flex-direction: row; align-items: center; margin-top: 8px;`;
const ArtworkBadgeText = styled.Text`font-size: 12px; color: #0F8A3C; font-weight: 600;`;
const OrRow = styled.View`flex-direction: row; align-items: center; margin-bottom: 12px;`;
const OrLine = styled.View`flex: 1; height: 1px; background-color: #E5E7EB;`;
const OrText = styled.Text`font-size: 12px; color: #9CA3AF; margin-horizontal: 10px;`;
const DesignAssist = styled.TouchableOpacity<{ active: boolean }>`
  flex-direction: row; align-items: center;
  background-color: ${({ active }) => active ? '#F5F3FF' : '#F9FAFB'};
  border-radius: 12px; padding: 14px; border-width: 1.5px;
  border-color: ${({ active }) => active ? '#7C3AED' : '#E5E7EB'};
`;
const DesignAssistText = styled.Text<{ active: boolean }>`
  font-size: 14px; font-weight: 600;
  color: ${({ active }) => active ? '#7C3AED' : '#6B7280'};
`;

/* Summary */
const SummaryWrap = styled.View``;

const PriceSummaryCard = styled.View`
  background-color: #FFFFFF; border-radius: 14px; padding: 16px;
  border-width: 1px; border-color: #E5E7EB; margin-bottom: 14px;
`;
const PSRow = styled.View`flex-direction: row; align-items: center; justify-content: space-between; margin-bottom: 8px;`;
const PSKey = styled.Text`font-size: 14px; font-weight: 600; color: #374151;`;
const PSQtyRow = styled.View`flex-direction: row; align-items: center;`;
const PSQtyBtn = styled.TouchableOpacity`
  width: 28px; height: 28px; border-radius: 7px;
  background-color: #F3F4F6; align-items: center; justify-content: center;
  border-width: 1px; border-color: #E5E7EB;
`;
const PSQtyNum = styled.Text`font-size: 16px; font-weight: 800; color: #111827; padding-horizontal: 14px;`;
const MOQNote2 = styled.Text`font-size: 11px; color: #9CA3AF; margin-bottom: 8px;`;
const ArtworkRow = styled.View`flex-direction: row; align-items: center;`;
const ArtworkRowText = styled.Text`font-size: 12px; color: #6B7280;`;

const YourSelectionCard = styled.View`
  background-color: #F0FDF4; border-radius: 14px; padding: 16px;
  border-width: 1px; border-color: #BBF7D0; margin-bottom: 14px;
`;
const YSTitle = styled.Text`font-size: 15px; font-weight: 800; color: #0A6B2E; margin-bottom: 10px;`;
const YSImgWrap = styled.View`
  align-items: center; justify-content: center; height: 80px; margin-bottom: 10px;
`;
const YSRow = styled.View`margin-bottom: 4px;`;
const YSKey = styled.Text`font-size: 13px; font-weight: 600; color: #374151;`;
const YSDivider = styled.View`height: 1px; background-color: #BBF7D0; margin-vertical: 8px;`;
const YSPriceRow = styled.View`flex-direction: row; justify-content: space-between; align-items: flex-end; margin-top: 8px;`;
const YSPriceLabel = styled.Text`font-size: 11px; color: #6B7280; margin-bottom: 2px;`;
const YSPrice = styled.Text`font-size: 22px; font-weight: 800; color: #0F8A3C;`;
const YSDelivLabel = styled.Text`font-size: 11px; color: #6B7280; margin-bottom: 2px; text-align: right;`;
const YSDelivRow = styled.View`flex-direction: row; align-items: center;`;
const YSDelivVal = styled.Text`font-size: 13px; font-weight: 700; color: #0F8A3C;`;

const CalculateBtn = styled.TouchableOpacity`
  flex-direction: row; align-items: center; justify-content: center;
  background-color: #F0FDF4; border-radius: 12px; padding: 14px;
  border-width: 1.5px; border-color: #BBF7D0; margin-bottom: 12px;
`;
const CalcBtnText = styled.Text`font-size: 14px; font-weight: 700; color: #0F8A3C;`;

const AddToCartBtn = styled.TouchableOpacity`
  flex-direction: row; align-items: center; justify-content: center;
  background-color: #0F8A3C; border-radius: 14px; padding: 16px; margin-bottom: 12px;
`;
const AddToCartText = styled.Text`font-size: 16px; font-weight: 700; color: #FFFFFF;`;

const EditBtn = styled.TouchableOpacity`
  flex-direction: row; align-items: center; justify-content: center;
  padding: 12px;
`;
const EditBtnText = styled.Text`font-size: 14px; color: #6B7280; font-weight: 600;`;

/* Bottom Continue Bar */
const BottomBar = styled.View`
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 12px 16px ${Platform.OS === 'ios' ? '36px' : '20px'};
  background-color: #FFFFFF;
  border-top-width: 1px; border-top-color: #F3F4F6;
`;
const ContinueBtn = styled.TouchableOpacity`
  height: 52px; background-color: #0F8A3C; border-radius: 14px;
  align-items: center; justify-content: center;
`;
const ContinueBtnText = styled.Text`font-size: 16px; font-weight: 700; color: #FFFFFF;`;

/* Large Order Warning Banner */
const LargeOrderBanner = styled.View`
  flex-direction: row; align-items: flex-start;
  background-color: #FEF3C7; border-radius: 12px;
  padding: 14px; margin-bottom: 14px;
  border-width: 1.5px; border-color: #F59E0B;
`;
const LargeOrderTextWrap = styled.View`flex: 1;`;
const LargeOrderTitle = styled.Text`
  font-size: 14px; font-weight: 800; color: #92400E; margin-bottom: 4px;
`;
const LargeOrderDesc = styled.Text`
  font-size: 12px; color: #78350F; line-height: 18px;
`;
