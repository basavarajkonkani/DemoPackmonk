import React, { useState } from 'react';
import { ScrollView, Alert, Image } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation: any;
  route: any;
}

const OrderProofApprovalScreen: React.FC<Props> = ({ navigation, route }) => {
  const [selectedColor, setSelectedColor] = useState('full-color');
  const [notes, setNotes] = useState('');

  const orderDetails = route.params || {
    material: 'bopp',
    finish: 'gloss',
    size: 'medium',
    quantity: '1000',
    effects: ['spot_uv'],
  };

  const colorOptions = [
    { id: 'full-color', label: 'Full Color (CMYK)', price: 'Included' },
    { id: 'pantone', label: '+ Pantone Colors', price: '+$0.10/unit' },
  ];

  const handleApprove = () => {
    Alert.alert(
      'Approve Design',
      'Once approved, production will begin. You cannot make changes after approval.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve & Continue',
          onPress: () => {
            navigation.navigate('PreCheckoutInfo', {
              orderDetails: { ...orderDetails, colorOption: selectedColor, notes },
            });
          },
        },
      ]
    );
  };

  const handleRequestChanges = () => {
    Alert.alert('Request Changes', 'Describe the changes you need in the notes section below.');
  };

  return (
    <Wrapper>
      <Header>
        <BackBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color="#111827" />
        </BackBtn>
        <HeaderTitle>Proof Approval</HeaderTitle>
        <PlaceholderBtn />
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ProofSection>
          <SectionTitle>Design Preview</SectionTitle>
          <ProofImageCard>
            <ProofImagePlaceholder>
              <FontAwesome5 name="image" size={48} color="#9CA3AF" />
              <ProofImageText>Your Design Preview</ProofImageText>
              <ProofImageSubtext>3D mockup will appear here</ProofImageSubtext>
            </ProofImagePlaceholder>
            <ZoomHint>
              <FontAwesome5 name="search-plus" size={12} color="#6b7280" />
              <ZoomText>Tap to zoom and inspect details</ZoomText>
            </ZoomHint>
          </ProofImageCard>
        </ProofSection>

        <OrderSummarySection>
          <SectionTitle>Order Summary</SectionTitle>
          <SummaryCard>
            <SummaryRow>
              <SummaryLabel>Material:</SummaryLabel>
              <SummaryValue>{orderDetails.material.toUpperCase()}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Finish:</SummaryLabel>
              <SummaryValue>{orderDetails.finish}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Size:</SummaryLabel>
              <SummaryValue>{orderDetails.size}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Quantity:</SummaryLabel>
              <SummaryValue>{orderDetails.quantity} units</SummaryValue>
            </SummaryRow>
            {orderDetails.effects?.length > 0 && (
              <SummaryRow>
                <SummaryLabel>Effects:</SummaryLabel>
                <SummaryValue>{orderDetails.effects.join(', ')}</SummaryValue>
              </SummaryRow>
            )}
          </SummaryCard>
        </OrderSummarySection>

        <ColorSection>
          <SectionTitle>Color Printing</SectionTitle>
          {colorOptions.map((option) => (
            <ColorOption
              key={option.id}
              selected={selectedColor === option.id}
              onPress={() => setSelectedColor(option.id)}
            >
              <ColorRadio selected={selectedColor === option.id}>
                {selectedColor === option.id && (
                  <ColorRadioInner />
                )}
              </ColorRadio>
              <ColorInfo>
                <ColorLabel>{option.label}</ColorLabel>
                <ColorPrice>{option.price}</ColorPrice>
              </ColorInfo>
            </ColorOption>
          ))}
        </ColorSection>

        <NotesSection>
          <SectionTitle>Additional Notes (Optional)</SectionTitle>
          <NotesInput
            placeholder="Add any special instructions or change requests..."
            placeholderTextColor="#9CA3AF"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </NotesSection>

        <WarningCard>
          <WarningIcon>
            <FontAwesome5 name="exclamation-triangle" size={18} color="#F59E0B" />
          </WarningIcon>
          <WarningContent>
            <WarningTitle>Important Notice</WarningTitle>
            <WarningText>
              Once you approve this proof, production will begin immediately. Changes cannot be made after approval.
            </WarningText>
          </WarningContent>
        </WarningCard>
      </ScrollView>

      <Footer>
        <SecondaryBtn onPress={handleRequestChanges}>
          <SecondaryBtnText>Request Changes</SecondaryBtnText>
        </SecondaryBtn>
        <PrimaryBtn onPress={handleApprove}>
          <PrimaryBtnText>Approve & Continue</PrimaryBtnText>
          <FontAwesome5 name="check" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </PrimaryBtn>
      </Footer>
    </Wrapper>
  );
};

export default OrderProofApprovalScreen;

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

const ProofSection = styled.View`
  padding: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
`;

const ProofImageCard = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const ProofImagePlaceholder = styled.View`
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  background-color: #F9FAFB;
`;

const ProofImageText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  margin-top: 12px;
`;

const ProofImageSubtext = styled.Text`
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 4px;
`;

const ZoomHint = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background-color: #F3F4F6;
`;

const ZoomText = styled.Text`
  font-size: 12px;
  color: #6b7280;
  margin-left: 6px;
`;

const OrderSummarySection = styled.View`
  padding: 0 20px 20px;
`;

const SummaryCard = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const SummaryLabel = styled.Text`
  font-size: 14px;
  color: #6b7280;
`;

const SummaryValue = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

const ColorSection = styled.View`
  padding: 0 20px 20px;
`;

const ColorOption = styled.TouchableOpacity<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${(props: { selected: boolean }) => (props.selected ? '#0f8a3c' : '#e5e7eb')};
  margin-bottom: 12px;
`;

const ColorRadio = styled.View<{ selected: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${(props: { selected: boolean }) => (props.selected ? '#0f8a3c' : '#d1d5db')};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const ColorRadioInner = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: #0f8a3c;
`;

const ColorInfo = styled.View`
  flex: 1;
`;

const ColorLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2px;
`;

const ColorPrice = styled.Text`
  font-size: 12px;
  color: #6b7280;
`;

const NotesSection = styled.View`
  padding: 0 20px 20px;
`;

const NotesInput = styled.TextInput`
  background-color: #ffffff;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
  padding: 12px;
  font-size: 14px;
  color: #111827;
  min-height: 100px;
`;

const WarningCard = styled.View`
  flex-direction: row;
  background-color: #FEF3C7;
  margin: 0 20px 20px;
  padding: 16px;
  border-radius: 16px;
  border-width: 1px;
  border-color: #FDE68A;
`;

const WarningIcon = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #FDE68A;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const WarningContent = styled.View`
  flex: 1;
`;

const WarningTitle = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #92400E;
  margin-bottom: 4px;
`;

const WarningText = styled.Text`
  font-size: 12px;
  color: #B45309;
  line-height: 18px;
`;

const Footer = styled.View`
  flex-direction: row;
  padding: 16px 20px;
  background-color: #ffffff;
  border-top-width: 1px;
  border-top-color: #e5e7eb;
`;

const SecondaryBtn = styled.TouchableOpacity`
  flex: 1;
  height: 52px;
  border-radius: 14px;
  background-color: #F3F4F6;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const SecondaryBtnText = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #374151;
`;

const PrimaryBtn = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  height: 52px;
  border-radius: 14px;
  background-color: #0f8a3c;
  align-items: center;
  justify-content: center;
`;

const PrimaryBtnText = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
`;
