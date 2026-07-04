import React, { useState } from 'react';
import { ScrollView, Alert, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

const GSTDetailsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [gstNumber, setGstNumber] = useState('29ABCDE1234F1Z5');
  const [legalName, setLegalName] = useState('ZenTech Logistics Private Limited');
  const [tradeName, setTradeName] = useState('ZenTech Logistics');
  const [businessType, setBusinessType] = useState('Private Limited Company');
  const [state, setState] = useState('Karnataka');
  const [isVerified, setIsVerified] = useState(true);

  const handleVerifyGST = () => {
    Alert.alert('Verify GST', 'GST Number verification will be integrated with GSTIN API', [
      { text: 'OK' }
    ]);
  };

  const handleSave = () => {
    Alert.alert('Success', 'GST details updated successfully!');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#1F2937" />
        </BackButton>
        <HeaderTitle>GST Details</HeaderTitle>
        <Placeholder />
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Verification Status */}
        <StatusCard verified={isVerified}>
          <StatusIcon>
            <FontAwesome5 
              name={isVerified ? "check-circle" : "exclamation-circle"} 
              size={24} 
              color={isVerified ? "#0F8A3C" : "#F59E0B"} 
            />
          </StatusIcon>
          <StatusInfo>
            <StatusTitle>{isVerified ? 'GST Verified' : 'Verification Pending'}</StatusTitle>
            <StatusText>
              {isVerified 
                ? 'Your GST number has been verified and is active'
                : 'Please verify your GST number to enable GST invoicing'
              }
            </StatusText>
          </StatusInfo>
        </StatusCard>

        {/* GST Form */}
        <FormCard>
          <FormLabel>GST Number *</FormLabel>
          <FormInput
            value={gstNumber}
            onChangeText={setGstNumber}
            placeholder="Enter 15-digit GSTIN"
            maxLength={15}
            autoCapitalize="characters"
          />
          
          <VerifyButton onPress={handleVerifyGST}>
            <FontAwesome5 name="shield-alt" size={14} color="#0F8A3C" style={{ marginRight: 8 }} />
            <VerifyButtonText>Verify GST Number</VerifyButtonText>
          </VerifyButton>

          <FormLabel style={{ marginTop: 16 }}>Legal Business Name *</FormLabel>
          <FormInput
            value={legalName}
            onChangeText={setLegalName}
            placeholder="As per GST registration"
          />

          <FormLabel style={{ marginTop: 16 }}>Trade Name</FormLabel>
          <FormInput
            value={tradeName}
            onChangeText={setTradeName}
            placeholder="Your business trade name"
          />

          <FormLabel style={{ marginTop: 16 }}>Business Type *</FormLabel>
          <FormInput
            value={businessType}
            onChangeText={setBusinessType}
            placeholder="e.g., Private Limited, LLP, Partnership"
          />

          <FormLabel style={{ marginTop: 16 }}>State *</FormLabel>
          <FormInput
            value={state}
            onChangeText={setState}
            placeholder="State of registration"
          />
        </FormCard>

        {/* GST Info */}
        <InfoCard>
          <InfoTitle>
            <FontAwesome5 name="info-circle" size={14} color="#3B82F6" style={{ marginRight: 8 }} />
            About GST Details
          </InfoTitle>
          <InfoText>• GST details are required for generating GST-compliant invoices</InfoText>
          <InfoText>• Your GST number will be verified through GSTN portal</InfoText>
          <InfoText>• Verified GST enables you to claim input tax credit</InfoText>
          <InfoText>• You can update GST details anytime from your account</InfoText>
        </InfoCard>

        {/* Save Button */}
        <SaveButton onPress={handleSave}>
          <SaveButtonText>Save GST Details</SaveButtonText>
        </SaveButton>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GSTDetailsScreen;

const Header = styled.View`
  flex-direction: row; align-items: center; justify-content: space-between;
  padding: 16px 20px; background-color: #FFFFFF;
  border-bottom-width: 1px; border-bottom-color: #E5E7EB;
`;
const BackButton = styled.TouchableOpacity`width: 40px; height: 40px; align-items: center; justify-content: center;`;
const HeaderTitle = styled.Text`font-size: 18px; font-weight: 700; color: #1F2937;`;
const Placeholder = styled.View`width: 40px;`;

const StatusCard = styled.View<{ verified: boolean }>`
  background-color: ${({ verified }) => verified ? '#DCFCE7' : '#FEF3C7'};
  border-radius: 16px; padding: 16px; margin: 16px;
  flex-direction: row; align-items: center;
`;
const StatusIcon = styled.View`margin-right: 12px;`;
const StatusInfo = styled.View`flex: 1;`;
const StatusTitle = styled.Text`font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 4px;`;
const StatusText = styled.Text`font-size: 12px; color: #6B7280; line-height: 18px;`;

const FormCard = styled.View`
  background-color: #FFFFFF; border-radius: 16px; padding: 20px;
  margin: 0 16px 16px; border-width: 1px; border-color: #F3F4F6;
`;
const FormLabel = styled.Text`
  font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 8px;
`;
const FormInput = styled.TextInput`
  background-color: #F9FAFB; border-width: 1px; border-color: #E5E7EB;
  border-radius: 10px; padding: 12px; font-size: 14px; color: #111827;
`;

const VerifyButton = styled.TouchableOpacity`
  flex-direction: row; align-items: center; justify-content: center;
  background-color: #DCFCE7; padding: 12px; border-radius: 10px;
  margin-top: 12px; border-width: 1px; border-color: #0F8A3C;
`;
const VerifyButtonText = styled.Text`font-size: 13px; font-weight: 700; color: #0F8A3C;`;

const InfoCard = styled.View`
  background-color: #EFF6FF; border-radius: 16px; padding: 16px;
  margin: 0 16px 16px; border-width: 1px; border-color: #DBEAFE;
`;
const InfoTitle = styled.Text`
  font-size: 13px; font-weight: 700; color: #1E40AF;
  margin-bottom: 12px; flex-direction: row; align-items: center;
`;
const InfoText = styled.Text`font-size: 12px; color: #1E3A8A; line-height: 20px; margin-bottom: 6px;`;

const SaveButton = styled.TouchableOpacity`
  background-color: #0F8A3C; padding: 16px; border-radius: 12px;
  margin: 0 16px 24px; align-items: center;
`;
const SaveButtonText = styled.Text`font-size: 15px; font-weight: 700; color: #FFFFFF;`;
