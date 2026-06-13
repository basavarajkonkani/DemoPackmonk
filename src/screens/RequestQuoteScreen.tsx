import React, { useState } from 'react';
import { ScrollView, View, Alert, Platform } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const STEPS = ['Product', 'Material', 'Quantity', 'Artwork'];

const PRODUCT_TYPES = [
  { id: 'stand-up-pouch', label: 'Stand Up Pouch', icon: 'shopping-bag', color: '#FEF3C7', iconColor: '#D97706' },
  { id: 'corrugated-box', label: 'Corrugated Box', icon: 'box-open', color: '#DCFCE7', iconColor: '#0F8A3C' },
  { id: 'mailer-box', label: 'Mailer Box', icon: 'mail-bulk', color: '#DCFCE7', iconColor: '#0F8A3C' },
  { id: 'flat-bottom-pouch', label: 'Flat Bottom\nPouch', icon: 'archive', color: '#FEE2E2', iconColor: '#DC2626' },
  { id: 'label', label: 'Labels &\nStickers', icon: 'tag', color: '#F3E8FF', iconColor: '#7C3AED' },
  { id: 'business-card', label: 'Business\nCards', icon: 'id-card', color: '#FEF9C3', iconColor: '#CA8A04' },
];

const MATERIALS = [
  { id: 'kraft', label: 'Kraft Brown', desc: 'Natural eco-friendly look', color: '#C4914F', tag: 'Eco' },
  { id: 'white-clay', label: 'White Clay Coat', desc: 'Vibrant print surface', color: '#F0F0F0', tag: 'Popular' },
  { id: 'matte-black', label: 'Matte Black', desc: 'Ultra-premium luxury', color: '#1E1E1E', tag: 'Premium' },
  { id: 'biodegradable', label: 'Biodegradable', desc: 'Compostable PBAT film', color: '#7AB648', tag: 'Eco' },
  { id: 'foil-laminate', label: 'Foil Laminate', desc: 'Metallic sheen finish', color: '#B8960C', tag: 'Special' },
];

const FINISHES = ['Matte', 'Gloss', 'Soft Touch', 'Spot UV', 'Foil Stamp'];

interface Props {
  navigation: any;
  route?: any;
}

const RequestQuoteScreen: React.FC<Props> = ({ navigation, route }) => {
  const [step, setStep] = useState(0);
  // Pre-select product type if navigated from a product
  const routeProductId = route?.params?.productId ?? '';
  const defaultProductType = PRODUCT_TYPES.find((p) => p.id === routeProductId)?.id ?? '';
  const [productType, setProductType] = useState(defaultProductType);
  const [material, setMaterial] = useState('');
  const [finish, setFinish] = useState('Matte');
  const [quantity, setQuantity] = useState('500');
  const [width, setWidth] = useState('8');
  const [height, setHeight] = useState('10');
  const [depth, setDepth] = useState('4');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [artworkType, setArtworkType] = useState('');
  const [artworkFileName, setArtworkFileName] = useState('');

  const handlePickArtwork = async () => {
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
      setArtworkType('upload');
      setArtworkFileName(fileName);
      Alert.alert('✅ Artwork Uploaded', `File "${fileName}" has been attached.`);
    }
  };

  const canProceed = () => {
    if (step === 0) return productType !== '';
    if (step === 1) return material !== '';
    if (step === 2) return quantity !== '' && width !== '' && height !== '';
    return true;
  };

  const estimate = () => {
    const qty = parseInt(quantity) || 500;
    const base = productType === 'corrugated-box' ? 1.85 : productType === 'mailer-box' ? 1.45 : 0.75;
    const mat = material === 'matte-black' ? 1.35 : material === 'foil-laminate' ? 1.6 : 1.0;
    const sub = base * mat * qty;
    const tax = sub * 0.09;
    return { subtotal: sub, gst: tax, shipping: 35, total: sub + tax + 35 };
  };

  const est = estimate();

  const handleSubmit = () => {
    Alert.alert(
      '🎉 Quote Submitted!',
      `Your quote has been submitted. Our team responds within 2 business hours.\n\nEstimated Total: ₹${est.total.toFixed(2)}`,
      [
        { text: 'View Orders', onPress: () => navigation.navigate('Orders') },
        { text: 'Done', onPress: () => navigation.goBack() },
      ]
    );
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <StepBox>
            <StepHeading>Select Product Type</StepHeading>
            <StepHint>What type of packaging are you looking for?</StepHint>
            <ProductGrid>
              {PRODUCT_TYPES.map((p) => (
                <ProductTypeCard
                  key={p.id}
                  active={productType === p.id}
                  onPress={() => setProductType(p.id)}
                  activeOpacity={0.8}
                  style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}
                >
                  <PTIconWrap bgColor={p.color}>
                    <FontAwesome5 name={p.icon as any} size={22} color={p.iconColor} />
                  </PTIconWrap>
                  <PTLabel active={productType === p.id}>{p.label}</PTLabel>
                  {productType === p.id && (
                    <CheckMark>
                      <FontAwesome5 name="check" size={9} color="#FFFFFF" />
                    </CheckMark>
                  )}
                </ProductTypeCard>
              ))}
            </ProductGrid>
          </StepBox>
        );

      case 1:
        return (
          <StepBox>
            <StepHeading>Choose Material</StepHeading>
            <StepHint>Select the base material for your packaging.</StepHint>
            {MATERIALS.map((m) => (
              <MaterialRow
                key={m.id}
                active={material === m.id}
                onPress={() => setMaterial(m.id)}
                activeOpacity={0.8}
              >
                <Swatch color={m.color} />
                <MatInfo>
                  <MatName active={material === m.id}>{m.label}</MatName>
                  <MatDesc>{m.desc}</MatDesc>
                </MatInfo>
                <MatTag>{m.tag}</MatTag>
                {material === m.id && (
                  <FontAwesome5 name="check-circle" size={18} color="#0F8A3C" style={{ marginLeft: 6 }} />
                )}
              </MaterialRow>
            ))}
            <FinishLabel>Finish Type</FinishLabel>
            <FinishWrap>
              {FINISHES.map((f) => (
                <FinishChip key={f} active={finish === f} onPress={() => setFinish(f)} activeOpacity={0.8}>
                  <FinishChipText active={finish === f}>{f}</FinishChipText>
                </FinishChip>
              ))}
            </FinishWrap>
          </StepBox>
        );

      case 2:
        return (
          <StepBox>
            <StepHeading>Dimensions & Quantity</StepHeading>
            <StepHint>Enter your required dimensions and order quantity.</StepHint>
            <DimRow>
              <DimGroup>
                <DimLabel>Width (in)</DimLabel>
                <DimInput keyboardType="numeric" value={width} onChangeText={setWidth} placeholder="8" placeholderTextColor="#D1D5DB" />
              </DimGroup>
              <DimGroup>
                <DimLabel>Height (in)</DimLabel>
                <DimInput keyboardType="numeric" value={height} onChangeText={setHeight} placeholder="10" placeholderTextColor="#D1D5DB" />
              </DimGroup>
              <DimGroup>
                <DimLabel>Depth (in)</DimLabel>
                <DimInput keyboardType="numeric" value={depth} onChangeText={setDepth} placeholder="4" placeholderTextColor="#D1D5DB" />
              </DimGroup>
            </DimRow>
            <FieldLabel>Quantity (units)</FieldLabel>
            <FieldInput
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
              placeholder="500"
              placeholderTextColor="#D1D5DB"
            />
            <FieldLabel style={{ marginTop: 12 }}>Expected Delivery Date</FieldLabel>
            <FieldInput
              value={deliveryDate}
              onChangeText={setDeliveryDate}
              placeholder="e.g. Aug 20, 2026"
              placeholderTextColor="#D1D5DB"
            />
            <FieldLabel style={{ marginTop: 12 }}>Additional Notes</FieldLabel>
            <NotesArea
              value={notes}
              onChangeText={setNotes}
              placeholder="Special requirements, print colors, certifications needed..."
              placeholderTextColor="#D1D5DB"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </StepBox>
        );

      case 3:
        return (
          <StepBox>
            <StepHeading>Upload Artwork</StepHeading>
            <StepHint>Upload your design file or let AI generate a design.</StepHint>

            <UploadBox onPress={handlePickArtwork} activeOpacity={0.8} active={artworkType === 'upload'}>
              <FontAwesome5 name="cloud-upload-alt" size={40} color="#0F8A3C" style={{ marginBottom: 12 }} />
              <UploadTitle>Drag & Drop or Tap to Upload</UploadTitle>
              <UploadDesc>Supports PDF, PSD, PNG, SVG, AI files</UploadDesc>
              <FormatRow>
                {['PDF', 'PSD', 'PNG', 'SVG', 'AI'].map((f) => (
                  <FormatChip key={f}><FormatText>{f}</FormatText></FormatChip>
                ))}
              </FormatRow>
            </UploadBox>

            <OrRow><OrLine /><OrLabel>OR</OrLabel><OrLine /></OrRow>

            <AIGenBtn onPress={() => setArtworkType('ai')} activeOpacity={0.85} active={artworkType === 'ai'}>
              <FontAwesome5 name="magic" size={18} color="#7C3AED" style={{ marginRight: 10 }} />
              <AIGenText>Generate Design with AI</AIGenText>
            </AIGenBtn>

            {artworkType !== '' && (
              <SelectedArtworkRow>
                <FontAwesome5 name={artworkType === 'ai' ? 'magic' : 'file-alt'} size={14} color="#0F8A3C" style={{ marginRight: 8 }} />
                <SelectedArtworkText>
                  {artworkType === 'ai' ? 'AI Design Generation selected' : `Artwork ready: ${artworkFileName || 'file selected'}`}
                </SelectedArtworkText>
                <FontAwesome5 name="check" size={14} color="#0F8A3C" />
              </SelectedArtworkRow>
            )}

            {/* Summary Card */}
            <SummaryCard>
              <SummaryCardTitle>Quote Summary</SummaryCardTitle>
              <SummaryRow><SummaryKey>Product</SummaryKey><SummaryVal>{PRODUCT_TYPES.find((p) => p.id === productType)?.label ?? '—'}</SummaryVal></SummaryRow>
              <SummaryRow><SummaryKey>Material</SummaryKey><SummaryVal>{MATERIALS.find((m) => m.id === material)?.label ?? '—'}</SummaryVal></SummaryRow>
              <SummaryRow><SummaryKey>Finish</SummaryKey><SummaryVal>{finish}</SummaryVal></SummaryRow>
              <SummaryRow><SummaryKey>Quantity</SummaryKey><SummaryVal>{quantity} units</SummaryVal></SummaryRow>
              <SummaryDivider />
              <SummaryRow><SummaryKey>Subtotal</SummaryKey><SummaryVal>${est.subtotal.toFixed(2)}</SummaryVal></SummaryRow>
              <SummaryRow><SummaryKey>GST (9%)</SummaryKey><SummaryVal>${est.gst.toFixed(2)}</SummaryVal></SummaryRow>
              <SummaryRow><SummaryKey>Shipping</SummaryKey><SummaryVal>${est.shipping.toFixed(2)}</SummaryVal></SummaryRow>
              <SummaryTotalRow>
                <SummaryTotalLabel>Estimated Total</SummaryTotalLabel>
                <SummaryTotalVal>${est.total.toFixed(2)}</SummaryTotalVal>
              </SummaryTotalRow>
            </SummaryCard>
          </StepBox>
        );
      default: return null;
    }
  };

  return (
    <Container>
      <NavBar>
        <NavBtn onPress={() => (step > 0 ? setStep(step - 1) : navigation.goBack())}>
          <FontAwesome5 name="arrow-left" size={16} color="#111827" />
        </NavBtn>
        <NavTitle>Request Quote</NavTitle>
        <View style={{ width: 38 }} />
      </NavBar>

      {/* Stepper */}
      <StepperRow>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <StepperItem>
              <StepCircle active={i <= step} done={i < step}>
                {i < step ? (
                  <FontAwesome5 name="check" size={10} color="#FFFFFF" />
                ) : (
                  <StepCircleNum active={i <= step}>{i + 1}</StepCircleNum>
                )}
              </StepCircle>
              <StepperLabel active={i <= step}>{s}</StepperLabel>
            </StepperItem>
            {i < STEPS.length - 1 && <StepperLine done={i < step} />}
          </React.Fragment>
        ))}
      </StepperRow>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {renderStep()}
      </ScrollView>

      <BottomBar>
        <NextBtn
          disabled={!canProceed()}
          onPress={() => (step < STEPS.length - 1 ? setStep(step + 1) : handleSubmit())}
          activeOpacity={0.9}
        >
          <NextBtnText>{step === STEPS.length - 1 ? 'Submit Quote Request' : 'Next Step'}</NextBtnText>
          <FontAwesome5
            name={step === STEPS.length - 1 ? 'paper-plane' : 'arrow-right'}
            size={14}
            color="#FFF"
            style={{ marginLeft: 8 }}
          />
        </NextBtn>
      </BottomBar>
    </Container>
  );
};

export default RequestQuoteScreen;

const Container = styled.View`flex: 1; background-color: #F8F9FA;`;

const NavBar = styled.View`
  height: 56px; flex-direction: row; align-items: center; justify-content: space-between;
  padding-horizontal: 16px; background-color: #FFFFFF;
  border-bottom-width: 1px; border-bottom-color: #F3F4F6;
`;
const NavBtn = styled.TouchableOpacity`
  width: 38px; height: 38px; border-radius: 12px;
  background-color: #F9FAFB; align-items: center; justify-content: center;
  border-width: 1px; border-color: #F3F4F6;
`;
const NavTitle = styled.Text`font-size: 16px; font-weight: 700; color: #111827;`;

const StepperRow = styled.View`
  flex-direction: row; align-items: center; padding: 14px 20px;
  background-color: #FFFFFF; border-bottom-width: 1px; border-bottom-color: #F3F4F6;
`;
const StepperItem = styled.View`align-items: center;`;
const StepCircle = styled.View<{ active: boolean; done: boolean }>`
  width: 28px; height: 28px; border-radius: 14px; align-items: center; justify-content: center;
  background-color: ${({ done }) => done ? '#0F8A3C' : 'transparent'};
  border-width: 1.5px;
  border-color: ${({ active, done }) => active || done ? '#0F8A3C' : '#E5E7EB'};
`;
const StepCircleNum = styled.Text<{ active: boolean }>`
  font-size: 12px; font-weight: 700;
  color: ${({ active }) => active ? '#0F8A3C' : '#9CA3AF'};
`;
const StepperLabel = styled.Text<{ active: boolean }>`
  font-size: 9px; font-weight: 600; margin-top: 4px;
  color: ${({ active }) => active ? '#0F8A3C' : '#9CA3AF'};
`;
const StepperLine = styled.View<{ done: boolean }>`
  flex: 1; height: 2px; margin-horizontal: 3px; margin-bottom: 14px;
  background-color: ${({ done }) => done ? '#0F8A3C' : '#E5E7EB'};
`;

const StepBox = styled.View`padding: 24px 16px;`;
const StepHeading = styled.Text`font-size: 22px; font-weight: 800; color: #111827; margin-bottom: 6px; letter-spacing: -0.3px;`;
const StepHint = styled.Text`font-size: 14px; color: #6B7280; margin-bottom: 22px; line-height: 20px;`;

const ProductGrid = styled.View`flex-direction: row; flex-wrap: wrap; justify-content: space-between;`;
const ProductTypeCard = styled.TouchableOpacity<{ active: boolean }>`
  width: 48%; padding: 18px 12px; border-radius: 18px; align-items: center;
  margin-bottom: 12px; position: relative;
  border-width: 1.5px;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
  background-color: ${({ active }) => active ? '#F0FDF4' : '#FFFFFF'};
`;
const PTIconWrap = styled.View<{ bgColor: string }>`
  width: 56px; height: 56px; border-radius: 18px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center; justify-content: center; margin-bottom: 12px;
`;
const PTLabel = styled.Text<{ active: boolean }>`
  font-size: 12px; font-weight: 600; text-align: center; line-height: 17px;
  color: ${({ active }) => active ? '#0F8A3C' : '#374151'};
`;
const CheckMark = styled.View`
  position: absolute; top: 8px; right: 8px;
  width: 20px; height: 20px; border-radius: 10px;
  background-color: #0F8A3C; align-items: center; justify-content: center;
`;

const MaterialRow = styled.TouchableOpacity<{ active: boolean }>`
  flex-direction: row; align-items: center; padding: 14px; border-radius: 14px; margin-bottom: 10px;
  border-width: 1.5px;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
  background-color: ${({ active }) => active ? '#DCFCE7' : '#FFFFFF'};
`;
const Swatch = styled.View<{ color: string }>`
  width: 36px; height: 36px; border-radius: 10px;
  background-color: ${({ color }) => color}; margin-right: 12px;
  border-width: 1px; border-color: rgba(0,0,0,0.08);
`;
const MatInfo = styled.View`flex: 1;`;
const MatName = styled.Text<{ active: boolean }>`
  font-size: 14px; font-weight: 700;
  color: ${({ active }) => active ? '#0F8A3C' : '#111827'};
`;
const MatDesc = styled.Text`font-size: 11px; color: #9CA3AF; margin-top: 2px;`;
const MatTag = styled.Text`
  font-size: 9px; font-weight: 700; color: #6B7280;
  background-color: #F3F4F6; padding: 3px 7px; border-radius: 5px; margin-right: 6px;
`;
const FinishLabel = styled.Text`font-size: 13px; font-weight: 700; color: #111827; margin-top: 16px; margin-bottom: 10px;`;
const FinishWrap = styled.View`flex-direction: row; flex-wrap: wrap;`;
const FinishChip = styled.TouchableOpacity<{ active: boolean }>`
  padding: 7px 14px; border-radius: 20px; margin-right: 8px; margin-bottom: 8px; border-width: 1.5px;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
  background-color: ${({ active }) => active ? '#0F8A3C' : '#FFFFFF'};
`;
const FinishChipText = styled.Text<{ active: boolean }>`
  font-size: 12px; font-weight: 600;
  color: ${({ active }) => active ? '#FFF' : '#6B7280'};
`;

const DimRow = styled.View`flex-direction: row; margin-bottom: 14px;`;
const DimGroup = styled.View`flex: 1; margin-right: 8px;`;
const DimLabel = styled.Text`font-size: 11px; font-weight: 600; color: #6B7280; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.3px;`;
const DimInput = styled.TextInput`
  height: 44px; border-width: 1.5px; border-color: #E5E7EB; border-radius: 12px;
  padding-horizontal: 12px; font-size: 14px; color: #111827; background-color: #FFFFFF;
`;
const FieldLabel = styled.Text`font-size: 12px; font-weight: 600; color: #6B7280; margin-bottom: 6px;`;
const FieldInput = styled.TextInput`
  height: 46px; border-width: 1.5px; border-color: #E5E7EB; border-radius: 12px;
  padding-horizontal: 14px; font-size: 14px; color: #111827; background-color: #FFFFFF;
`;
const NotesArea = styled.TextInput`
  border-width: 1.5px; border-color: #E5E7EB; border-radius: 12px;
  padding: 12px 14px; font-size: 13px; color: #111827; background-color: #FFFFFF; height: 100px;
`;

const UploadBox = styled.TouchableOpacity<{ active: boolean }>`
  border-width: 2px; border-style: dashed;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#D1D5DB'};
  border-radius: 16px; padding: 32px 20px; align-items: center;
  background-color: ${({ active }) => active ? '#F0FDF4' : '#FAFAFA'}; margin-bottom: 16px;
`;
const UploadTitle = styled.Text`font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 4px;`;
const UploadDesc = styled.Text`font-size: 12px; color: #9CA3AF; margin-bottom: 12px;`;
const FormatRow = styled.View`flex-direction: row;`;
const FormatChip = styled.View`
  padding: 4px 8px; border-radius: 6px; background-color: #DCFCE7; margin-right: 6px;
`;
const FormatText = styled.Text`font-size: 10px; font-weight: 700; color: #0F8A3C;`;

const OrRow = styled.View`flex-direction: row; align-items: center; margin-vertical: 14px;`;
const OrLine = styled.View`flex: 1; height: 1px; background-color: #E5E7EB;`;
const OrLabel = styled.Text`font-size: 11px; color: #9CA3AF; font-weight: 600; margin-horizontal: 12px;`;

const AIGenBtn = styled.TouchableOpacity<{ active: boolean }>`
  flex-direction: row; align-items: center; justify-content: center; height: 50px;
  border-width: 1.5px; border-radius: 14px; margin-bottom: 18px;
  border-color: ${({ active }) => active ? '#7C3AED' : '#DDD6FE'};
  background-color: ${({ active }) => active ? '#EDE9FE' : '#F5F3FF'};
`;
const AIGenText = styled.Text`font-size: 14px; font-weight: 700; color: #7C3AED;`;

const SelectedArtworkRow = styled.View`
  flex-direction: row; align-items: center; background-color: #DCFCE7;
  border-radius: 12px; padding: 10px 14px; margin-bottom: 18px;
`;
const SelectedArtworkText = styled.Text`flex: 1; font-size: 13px; font-weight: 600; color: #0F8A3C;`;

const SummaryCard = styled.View`
  border-width: 1.5px; border-color: #BBF7D0; border-radius: 18px; padding: 18px;
  background-color: #F0FDF4;
`;
const SummaryCardTitle = styled.Text`
  font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 14px;
  text-transform: uppercase; letter-spacing: 0.5px;
`;
const SummaryRow = styled.View`flex-direction: row; justify-content: space-between; margin-bottom: 8px;`;
const SummaryKey = styled.Text`font-size: 13px; color: #9CA3AF;`;
const SummaryVal = styled.Text`font-size: 13px; font-weight: 600; color: #374151;`;
const SummaryDivider = styled.View`height: 1px; background-color: #F3F4F6; margin-vertical: 10px;`;
const SummaryTotalRow = styled.View`
  flex-direction: row; justify-content: space-between; align-items: center;
  padding-top: 10px; border-top-width: 1px; border-top-color: #E5E7EB;
`;
const SummaryTotalLabel = styled.Text`font-size: 15px; font-weight: 700; color: #111827;`;
const SummaryTotalVal = styled.Text`font-size: 24px; font-weight: 800; color: #0F8A3C; letter-spacing: -0.5px;`;

const BottomBar = styled.View`
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 12px 16px ${Platform.OS === 'ios' ? 36 : 24}px; background-color: #FFFFFF;
  border-top-width: 1px; border-top-color: #F3F4F6;
`;
const NextBtn = styled.TouchableOpacity<{ disabled?: boolean }>`
  height: 54px; flex-direction: row; align-items: center; justify-content: center;
  border-radius: 16px;
  background-color: ${({ disabled }) => disabled ? '#D1D5DB' : '#0F8A3C'};
`;
const NextBtnText = styled.Text`font-size: 16px; font-weight: 700; color: #FFFFFF;`;
