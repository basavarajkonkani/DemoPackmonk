import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation: any;
}

const CustomOrderFlowScreen: React.FC<Props> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedFinish, setSelectedFinish] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState('');
  const [artworkUploaded, setArtworkUploaded] = useState(false);
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);

  const totalSteps = 6;

  const materials = [
    { id: 'bopp', name: 'BOPP', desc: 'High clarity, moisture resistant', icon: 'layer-group' },
    { id: 'kraft', name: 'Kraft Paper', desc: 'Eco-friendly, natural look', icon: 'leaf' },
    { id: 'metalized', name: 'Metalized', desc: 'Premium barrier protection', icon: 'medal' },
    { id: 'pe', name: 'Polyethylene', desc: 'Flexible, durable', icon: 'shield-alt' },
  ];

  const finishes = [
    { id: 'matte', name: 'Matte', desc: 'Smooth, non-reflective', icon: 'circle' },
    { id: 'gloss', name: 'Gloss', desc: 'Shiny, vibrant colors', icon: 'sun' },
  ];

  const sizes = [
    { id: 'small', name: 'Small', dimensions: '4" × 6"', icon: 'compress' },
    { id: 'medium', name: 'Medium', dimensions: '6" × 9"', icon: 'compress-arrows-alt' },
    { id: 'large', name: 'Large', dimensions: '8" × 12"', icon: 'expand' },
    { id: 'custom', name: 'Custom Size', dimensions: 'Specify dimensions', icon: 'ruler-combined' },
  ];

  const effects = [
    { id: 'spot_uv', name: 'Spot UV', desc: 'Glossy highlights', price: '+₹0.15/unit', icon: 'star' },
    { id: 'metallic', name: 'Metallic Print', desc: 'Foil effect', price: '+₹0.25/unit', icon: 'gem' },
    { id: 'emboss', name: 'Embossing', desc: 'Raised texture', price: '+₹0.20/unit', icon: 'layer-group' },
  ];

  const handleNext = () => {
    if (currentStep === 1 && !selectedMaterial) {
      Alert.alert('Select Material', 'Please choose a material to continue');
      return;
    }
    if (currentStep === 2 && !selectedFinish) {
      Alert.alert('Select Finish', 'Please choose a finish to continue');
      return;
    }
    if (currentStep === 3 && !selectedSize) {
      Alert.alert('Select Size', 'Please choose a size to continue');
      return;
    }
    if (currentStep === 4 && !quantity) {
      Alert.alert('Enter Quantity', 'Please enter quantity to continue');
      return;
    }
    if (currentStep === 5 && !artworkUploaded) {
      Alert.alert('Upload Artwork', 'Please upload artwork to continue');
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate('OrderProofApproval', {
        material: selectedMaterial,
        finish: selectedFinish,
        size: selectedSize,
        quantity,
        effects: selectedEffects,
      });
    }
  };

  const toggleEffect = (effectId: string) => {
    if (selectedEffects.includes(effectId)) {
      setSelectedEffects(selectedEffects.filter((e) => e !== effectId));
    } else {
      setSelectedEffects([...selectedEffects, effectId]);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContent>
            <StepTitle>Choose Material</StepTitle>
            <StepSubtitle>Select the base material for your packaging</StepSubtitle>
            {materials.map((material) => (
              <OptionCard
                key={material.id}
                selected={selectedMaterial === material.id}
                onPress={() => setSelectedMaterial(material.id)}
              >
                <OptionIconWrap>
                  <FontAwesome5 name={material.icon} size={24} color="#0F8A3C" />
                </OptionIconWrap>
                <OptionInfo>
                  <OptionName>{material.name}</OptionName>
                  <OptionDesc>{material.desc}</OptionDesc>
                </OptionInfo>
                {selectedMaterial === material.id && (
                  <CheckCircle>
                    <FontAwesome5 name="check" size={14} color="#FFFFFF" />
                  </CheckCircle>
                )}
              </OptionCard>
            ))}
          </StepContent>
        );

      case 2:
        return (
          <StepContent>
            <StepTitle>Choose Finish</StepTitle>
            <StepSubtitle>Select the surface finish for your packaging</StepSubtitle>
            {finishes.map((finish) => (
              <OptionCard
                key={finish.id}
                selected={selectedFinish === finish.id}
                onPress={() => setSelectedFinish(finish.id)}
              >
                <OptionIconWrap>
                  <FontAwesome5 name={finish.icon} size={24} color="#0F8A3C" />
                </OptionIconWrap>
                <OptionInfo>
                  <OptionName>{finish.name}</OptionName>
                  <OptionDesc>{finish.desc}</OptionDesc>
                </OptionInfo>
                {selectedFinish === finish.id && (
                  <CheckCircle>
                    <FontAwesome5 name="check" size={14} color="#FFFFFF" />
                  </CheckCircle>
                )}
              </OptionCard>
            ))}
          </StepContent>
        );

      case 3:
        return (
          <StepContent>
            <StepTitle>Select Size</StepTitle>
            <StepSubtitle>Choose your packaging dimensions</StepSubtitle>
            {sizes.map((size) => (
              <OptionCard
                key={size.id}
                selected={selectedSize === size.id}
                onPress={() => setSelectedSize(size.id)}
              >
                <OptionIconWrap>
                  <FontAwesome5 name={size.icon} size={24} color="#0F8A3C" />
                </OptionIconWrap>
                <OptionInfo>
                  <OptionName>{size.name}</OptionName>
                  <OptionDesc>{size.dimensions}</OptionDesc>
                </OptionInfo>
                {selectedSize === size.id && (
                  <CheckCircle>
                    <FontAwesome5 name="check" size={14} color="#FFFFFF" />
                  </CheckCircle>
                )}
              </OptionCard>
            ))}
          </StepContent>
        );

      case 4:
        return (
          <StepContent>
            <StepTitle>Enter Quantity</StepTitle>
            <StepSubtitle>Minimum order: 500 units</StepSubtitle>
            <QuantityInput>
              <QuantityLabel>Number of Units</QuantityLabel>
              <QuantityInputField
                placeholder="e.g., 1000"
                placeholderTextColor="#9CA3AF"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </QuantityInput>
            <QuickQuantityRow>
              {[500, 1000, 2500, 5000].map((q) => (
                <QuickQuantityBtn
                  key={q}
                  onPress={() => setQuantity(String(q))}
                  selected={quantity === String(q)}
                >
                  <QuickQuantityText selected={quantity === String(q)}>
                    {q.toLocaleString()}
                  </QuickQuantityText>
                </QuickQuantityBtn>
              ))}
            </QuickQuantityRow>
          </StepContent>
        );

      case 5:
        return (
          <StepContent>
            <StepTitle>Upload Artwork</StepTitle>
            <StepSubtitle>Upload your design files (AI, PDF, PSD)</StepSubtitle>
            {!artworkUploaded ? (
              <UploadCard onPress={() => setArtworkUploaded(true)}>
                <FontAwesome5 name="cloud-upload-alt" size={48} color="#0F8A3C" />
                <UploadText>Tap to Upload Design</UploadText>
                <UploadSubtext>Supported: AI, PDF, PSD, PNG, JPG</UploadSubtext>
              </UploadCard>
            ) : (
              <UploadedCard>
                <FontAwesome5 name="check-circle" size={32} color="#10B981" />
                <UploadedText>Design Uploaded Successfully</UploadedText>
                <UploadedFile>brand-logo-design.ai</UploadedFile>
                <ChangeBtn onPress={() => setArtworkUploaded(false)}>
                  <ChangeText>Change File</ChangeText>
                </ChangeBtn>
              </UploadedCard>
            )}
          </StepContent>
        );

      case 6:
        return (
          <StepContent>
            <StepTitle>Special Effects</StepTitle>
            <StepSubtitle>Add premium finishing touches (optional)</StepSubtitle>
            {effects.map((effect) => (
              <EffectCard
                key={effect.id}
                selected={selectedEffects.includes(effect.id)}
                onPress={() => toggleEffect(effect.id)}
              >
                <EffectCheckbox selected={selectedEffects.includes(effect.id)}>
                  {selectedEffects.includes(effect.id) && (
                    <FontAwesome5 name="check" size={12} color="#FFFFFF" />
                  )}
                </EffectCheckbox>
                <EffectIconWrap>
                  <FontAwesome5 name={effect.icon} size={20} color="#F59E0B" />
                </EffectIconWrap>
                <EffectInfo>
                  <EffectName>{effect.name}</EffectName>
                  <EffectDesc>{effect.desc}</EffectDesc>
                </EffectInfo>
                <EffectPrice>{effect.price}</EffectPrice>
              </EffectCard>
            ))}
          </StepContent>
        );

      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <Header>
        <BackBtn onPress={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color="#111827" />
        </BackBtn>
        <HeaderTitle>Custom Order</HeaderTitle>
        <PlaceholderBtn />
      </Header>

      <ProgressSection>
        <ProgressBar>
          <ProgressFill width={(currentStep / totalSteps) * 100} />
        </ProgressBar>
        <ProgressText>
          Step {currentStep} of {totalSteps}
        </ProgressText>
      </ProgressSection>

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      <Footer>
        <NextBtn onPress={handleNext} activeOpacity={0.9}>
          <NextBtnText>
            {currentStep === totalSteps ? 'Review Order' : 'Continue'}
          </NextBtnText>
          <FontAwesome5 name="arrow-right" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </NextBtn>
      </Footer>
    </Wrapper>
  );
};

export default CustomOrderFlowScreen;

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

const PlaceholderBtn = styled.View`
  width: 40px;
`;

const ProgressSection = styled.View`
  padding: 16px 20px;
  background-color: #ffffff;
`;

const ProgressBar = styled.View`
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.View<{ width: number }>`
  height: 100%;
  width: ${(props: { width: number }) => props.width}%;
  background-color: #0f8a3c;
  border-radius: 3px;
`;

const ProgressText = styled.Text`
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  font-weight: 600;
`;

const StepContent = styled.View`
  padding: 20px;
`;

const StepTitle = styled.Text`
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 8px;
`;

const StepSubtitle = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 24px;
`;

const OptionCard = styled.TouchableOpacity<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 16px;
  border-width: 2px;
  border-color: ${(props: { selected: boolean }) => (props.selected ? '#0f8a3c' : '#e5e7eb')};
  margin-bottom: 12px;
`;

const OptionIconWrap = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: #DCFCE7;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const OptionInfo = styled.View`
  flex: 1;
`;

const OptionName = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
`;

const OptionDesc = styled.Text`
  font-size: 13px;
  color: #6b7280;
`;

const CheckCircle = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: #0f8a3c;
  align-items: center;
  justify-content: center;
`;

const QuantityInput = styled.View`
  margin-bottom: 20px;
`;

const QuantityLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const QuantityInputField = styled.TextInput`
  height: 56px;
  border-radius: 16px;
  border-width: 2px;
  border-color: #e5e7eb;
  background-color: #ffffff;
  padding: 0 16px;
  font-size: 16px;
  color: #111827;
  font-weight: 600;
`;

const QuickQuantityRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const QuickQuantityBtn = styled.TouchableOpacity<{ selected: boolean }>`
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${(props: { selected: boolean }) => (props.selected ? '#0f8a3c' : '#e5e7eb')};
  background-color: ${(props: { selected: boolean }) => (props.selected ? '#DCFCE7' : '#ffffff')};
  align-items: center;
  margin: 0 4px;
`;

const QuickQuantityText = styled.Text<{ selected: boolean }>`
  font-size: 14px;
  font-weight: 700;
  color: ${(props: { selected: boolean }) => (props.selected ? '#0f8a3c' : '#6b7280')};
`;

const UploadCard = styled.TouchableOpacity`
  padding: 48px;
  background-color: #ffffff;
  border-radius: 16px;
  border-width: 2px;
  border-color: #0f8a3c;
  border-style: dashed;
  align-items: center;
`;

const UploadText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #0f8a3c;
  margin-top: 12px;
`;

const UploadSubtext = styled.Text`
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
`;

const UploadedCard = styled.View`
  padding: 32px;
  background-color: #ffffff;
  border-radius: 16px;
  border-width: 2px;
  border-color: #10B981;
  align-items: center;
`;

const UploadedText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #10B981;
  margin-top: 12px;
`;

const UploadedFile = styled.Text`
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
`;

const ChangeBtn = styled.TouchableOpacity`
  margin-top: 16px;
  padding: 10px 20px;
  border-radius: 8px;
  background-color: #f3f4f6;
`;

const ChangeText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
`;

const EffectCard = styled.TouchableOpacity<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 16px;
  border-width: 2px;
  border-color: ${(props: { selected: boolean }) => (props.selected ? '#0f8a3c' : '#e5e7eb')};
  margin-bottom: 12px;
`;

const EffectCheckbox = styled.View<{ selected: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border-width: 2px;
  border-color: ${(props: { selected: boolean }) => (props.selected ? '#0f8a3c' : '#d1d5db')};
  background-color: ${(props: { selected: boolean }) => (props.selected ? '#0f8a3c' : '#ffffff')};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const EffectIconWrap = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: #FEF3C7;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const EffectInfo = styled.View`
  flex: 1;
`;

const EffectName = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2px;
`;

const EffectDesc = styled.Text`
  font-size: 12px;
  color: #6b7280;
`;

const EffectPrice = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #0f8a3c;
`;

const Footer = styled.View`
  padding: 16px 20px;
  background-color: #ffffff;
  border-top-width: 1px;
  border-top-color: #e5e7eb;
`;

const NextBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 56px;
  border-radius: 16px;
  background-color: #0f8a3c;
`;

const NextBtnText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
`;
