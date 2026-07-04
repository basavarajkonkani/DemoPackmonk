import React, { useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

interface PincodeCheckerProps {
  onPincodeVerified?: (pincode: string, deliveryInfo: DeliveryInfo) => void;
}

interface DeliveryInfo {
  serviceable: boolean;
  estimatedDays: number;
  expressAvailable: boolean;
  expressDays?: number;
  codAvailable: boolean;
  deliveryCharge: number;
  city?: string;
  state?: string;
}

const PincodeChecker: React.FC<PincodeCheckerProps> = ({ onPincodeVerified }) => {
  const [pincode, setPincode] = useState('');
  const [checking, setChecking] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [error, setError] = useState('');

  const checkPincode = async () => {
    if (!pincode || pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    setChecking(true);
    setError('');

    try {
      // Simulate API call - Replace with actual pincode API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data - replace with actual API response
      const mockData: DeliveryInfo = {
        serviceable: true,
        estimatedDays: parseInt(pincode.charAt(0)) % 2 === 0 ? 5 : 7,
        expressAvailable: parseInt(pincode.charAt(0)) <= 5,
        expressDays: 3,
        codAvailable: true,
        deliveryCharge: parseInt(pincode.charAt(0)) <= 3 ? 0 : 50,
        city: 'Mumbai',
        state: 'Maharashtra',
      };

      setDeliveryInfo(mockData);
      onPincodeVerified?.(pincode, mockData);

    } catch (err) {
      setError('Unable to check pincode. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const handleChange = (text: string) => {
    // Only allow numbers
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
    setPincode(cleaned);
    setError('');
    if (deliveryInfo) setDeliveryInfo(null);
  };

  return (
    <Container>
      <Label>Check Delivery Availability</Label>
      
      <InputRow>
        <InputWrapper>
          <FontAwesome5 name="map-marker-alt" size={14} color="#9CA3AF" style={{ marginRight: 10 }} />
          <Input
            placeholder="Enter pincode (6 digits)"
            placeholderTextColor="#9CA3AF"
            value={pincode}
            onChangeText={handleChange}
            keyboardType="number-pad"
            maxLength={6}
          />
        </InputWrapper>
        
        <CheckButton 
          onPress={checkPincode} 
          disabled={checking || pincode.length !== 6}
          activeOpacity={0.8}
        >
          {checking ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <ButtonText>Check</ButtonText>
          )}
        </CheckButton>
      </InputRow>

      {error && (
        <ErrorText>
          <FontAwesome5 name="exclamation-circle" size={10} color="#DC2626" style={{ marginRight: 4 }} />
          {error}
        </ErrorText>
      )}

      {deliveryInfo && (
        <ResultCard>
          {deliveryInfo.serviceable ? (
            <>
              <ResultHeader>
                <FontAwesome5 name="check-circle" size={18} color="#0F8A3C" />
                <ResultTitle>Available at your location!</ResultTitle>
              </ResultHeader>

              {deliveryInfo.city && deliveryInfo.state && (
                <LocationText>
                  <FontAwesome5 name="map-marker-alt" size={10} color="#6B7280" style={{ marginRight: 4 }} />
                  {deliveryInfo.city}, {deliveryInfo.state}
                </LocationText>
              )}

              <Divider />

              <InfoRow>
                <InfoIcon>
                  <FontAwesome5 name="truck" size={12} color="#0F8A3C" />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Standard Delivery</InfoLabel>
                  <InfoValue>{deliveryInfo.estimatedDays} business days</InfoValue>
                </InfoContent>
              </InfoRow>

              {deliveryInfo.expressAvailable && (
                <InfoRow>
                  <InfoIcon>
                    <FontAwesome5 name="shipping-fast" size={12} color="#F59E0B" />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Express Delivery</InfoLabel>
                    <InfoValue>{deliveryInfo.expressDays} business days</InfoValue>
                  </InfoContent>
                </InfoRow>
              )}

              <InfoRow>
                <InfoIcon>
                  <FontAwesome5 name="rupee-sign" size={12} color="#3B82F6" />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Delivery Charge</InfoLabel>
                  <InfoValue>
                    {deliveryInfo.deliveryCharge === 0 ? (
                      <FreeText>FREE</FreeText>
                    ) : (
                      `₹${deliveryInfo.deliveryCharge}`
                    )}
                  </InfoValue>
                </InfoContent>
              </InfoRow>

              {deliveryInfo.codAvailable && (
                <CODBadge>
                  <FontAwesome5 name="money-bill-wave" size={9} color="#10B981" style={{ marginRight: 4 }} />
                  <CODText>Cash on Delivery Available</CODText>
                </CODBadge>
              )}
            </>
          ) : (
            <>
              <ResultHeader>
                <FontAwesome5 name="times-circle" size={18} color="#DC2626" />
                <ResultTitle style={{ color: '#DC2626' }}>Not serviceable</ResultTitle>
              </ResultHeader>
              <NotServiceableText>
                We currently don't deliver to this location. Please contact support for assistance.
              </NotServiceableText>
            </>
          )}
        </ResultCard>
      )}
    </Container>
  );
};

export default PincodeChecker;

const Container = styled.View`
  margin-vertical: 12px;
`;

const Label = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const InputWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  height: 48px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #E5E7EB;
  background-color: #F9FAFB;
  padding-horizontal: 14px;
  margin-right: 10px;
`;

const Input = styled.TextInput`
  flex: 1;
  font-size: 15px;
  color: #111827;
`;

const CheckButton = styled.TouchableOpacity<{ disabled: boolean }>`
  height: 48px;
  padding-horizontal: 20px;
  border-radius: 12px;
  background-color: ${({ disabled }: { disabled: boolean }) => disabled ? '#9CA3AF' : '#0F8A3C'};
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #FFFFFF;
`;

const ErrorText = styled.Text`
  font-size: 12px;
  color: #DC2626;
  margin-top: 6px;
  flex-direction: row;
  align-items: center;
`;

const ResultCard = styled.View`
  margin-top: 12px;
  padding: 16px;
  border-radius: 12px;
  background-color: #FFFFFF;
  border-width: 1px;
  border-color: #F3F4F6;
`;

const ResultHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const ResultTitle = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #0F8A3C;
  margin-left: 8px;
`;

const LocationText = styled.Text`
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 12px;
  flex-direction: row;
  align-items: center;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #F3F4F6;
  margin-vertical: 12px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const InfoIcon = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: #F9FAFB;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const InfoContent = styled.View`
  flex: 1;
`;

const InfoLabel = styled.Text`
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 2px;
`;

const InfoValue = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

const FreeText = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #0F8A3C;
`;

const CODBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #D1FAE5;
  padding: 6px 10px;
  border-radius: 8px;
  align-self: flex-start;
  margin-top: 8px;
`;

const CODText = styled.Text`
  font-size: 10px;
  font-weight: 700;
  color: #10B981;
`;

const NotServiceableText = styled.Text`
  font-size: 13px;
  color: #6B7280;
  line-height: 20px;
  margin-top: 8px;
`;
