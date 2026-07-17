import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

interface MobileVerificationScreenProps {
  navigation: any;
}

const MobileVerificationScreen: React.FC<MobileVerificationScreenProps> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      Alert.alert('Missing Details', 'Please enter your mobile number.');
      return;
    }

    // Basic phone validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+91/, '');

    if (!phoneRegex.test(cleanPhone)) {
      Alert.alert('Invalid Mobile Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      // Simulate OTP sending (in production, call your backend API)
      await new Promise(resolve => setTimeout(resolve, 1000));

      setOtpSent(true);
      setTimer(60); // 60 seconds countdown
      Alert.alert('OTP Sent', 'We have sent a 6-digit OTP to your mobile number.');
    } catch (error) {
      console.error('OTP send error:', error);
      Alert.alert('Error', 'Could not send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert('Missing OTP', 'Please enter the OTP sent to your mobile.');
      return;
    }

    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      // Simulate OTP verification (in production, verify with backend)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+91/, '');
      const formattedPhone = `+91 ${cleanPhone.substring(0, 5)} ${cleanPhone.substring(5)}`;

      // Store phone in a way that checkout screen can access it
      // You can use Redux or pass via navigation params
      navigation.navigate('Checkout', { 
        verifiedPhone: formattedPhone,
        phoneVerified: true 
      });
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (timer > 0) return;
    setOtp('');
    handleSendOTP();
  };

  return (
    <Container>
      <Header>
        <BackBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={16} color="#111827" />
        </BackBtn>
        <HeaderTitle>Verify Mobile Number</HeaderTitle>
        <View style={{ width: 36 }} />
      </Header>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        <Content>
          <IconBox>
            <FontAwesome5 name="mobile-alt" size={40} color="#0F8A3C" />
          </IconBox>

          <Title>Enter Your Mobile Number</Title>
          <Subtitle>We'll send you an OTP to verify and proceed with checkout</Subtitle>

          <FormSection>
            {!otpSent ? (
              <>
                <FieldLabel>Mobile Number *</FieldLabel>
                <InputWrap>
                  <FontAwesome5 name="phone" size={14} color="#9CA3AF" style={{ marginRight: 10 }} />
                  <Input
                    placeholder="9876543210"
                    placeholderTextColor="#9CA3AF"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    editable={!loading}
                    maxLength={10}
                  />
                </InputWrap>

                <InfoBox>
                  <FontAwesome5 name="info-circle" size={12} color="#3B82F6" style={{ marginRight: 8 }} />
                  <InfoText>Enter your 10-digit mobile number without country code</InfoText>
                </InfoBox>

                <SendOTPBtn 
                  onPress={handleSendOTP} 
                  activeOpacity={0.9}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <SendOTPBtnText>Send OTP</SendOTPBtnText>
                  )}
                </SendOTPBtn>
              </>
            ) : (
              <>
                <VerificationBox>
                  <VerificationIcon>✓</VerificationIcon>
                  <VerificationText>OTP sent to +91 {phone.substring(0, 5)} {phone.substring(5)}</VerificationText>
                  <ChangeNumberBtn onPress={() => { setOtpSent(false); setOtp(''); setTimer(0); setPhone(''); }} activeOpacity={0.7}>
                    <ChangeNumberText>Change number</ChangeNumberText>
                  </ChangeNumberBtn>
                </VerificationBox>

                <FieldLabel>Enter OTP</FieldLabel>
                <InputWrap>
                  <FontAwesome5 name="lock" size={14} color="#9CA3AF" style={{ marginRight: 10 }} />
                  <Input
                    placeholder="Enter 6-digit OTP"
                    placeholderTextColor="#9CA3AF"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!loading}
                  />
                </InputWrap>

                <ResendRow>
                  {timer > 0 ? (
                    <TimerText>Resend OTP in {timer}s</TimerText>
                  ) : (
                    <ResendBtn onPress={handleResendOTP} activeOpacity={0.7}>
                      <ResendText>Resend OTP</ResendText>
                    </ResendBtn>
                  )}
                </ResendRow>

                <VerifyOTPBtn 
                  onPress={handleVerifyOTP} 
                  activeOpacity={0.9}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <VerifyOTPBtnText>Verify & Continue to Checkout</VerifyOTPBtnText>
                  )}
                </VerifyOTPBtn>
              </>
            )}
          </FormSection>

          <SecurityNote>
            <FontAwesome5 name="shield-alt" size={12} color="#6B7280" style={{ marginRight: 6 }} />
            <SecurityNoteText>Your mobile number is secure and will only be used for order verification</SecurityNoteText>
          </SecurityNote>
        </Content>
      </ScrollView>
    </Container>
  );
};

export default MobileVerificationScreen;

// Styles
const Container = styled.View`
  flex: 1;
  background-color: #F8F9FA;
  ${Platform.OS === 'ios' ? 'padding-top: 10px;' : ''}
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  padding-vertical: 12px;
  background-color: #FFFFFF;
  border-bottom-width: 1px;
  border-bottom-color: #E5E7EB;
  ${Platform.OS === 'ios' ? 'padding-top: 48px;' : ''}
`;

const BackBtn = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: #F9FAFB;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #E5E7EB;
`;

const HeaderTitle = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: #111827;
`;

const Content = styled.View`
  padding: 24px 16px;
  max-width: 900px;
  width: 100%;
  align-self: center;
`;

const IconBox = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background-color: #E8F5E9;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  align-self: center;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: #9CA3AF;
  text-align: center;
  line-height: 20px;
  margin-bottom: 24px;
`;

const FormSection = styled.View`
  margin-bottom: 24px;
`;

const FieldLabel = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const InputWrap = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-width: 1px;
  border-color: #E5E7EB;
  border-radius: 12px;
  padding: 14px 12px;
  margin-bottom: 16px;
`;

const Input = styled.TextInput`
  flex: 1;
  font-size: 14px;
  color: #111827;
  padding-horizontal: 4px;
`;

const InfoBox = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #EFF6FF;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 16px;
`;

const InfoText = styled.Text`
  font-size: 12px;
  color: #1E40AF;
  flex: 1;
`;

const SendOTPBtn = styled.TouchableOpacity`
  height: 52px;
  background-color: #0F8A3C;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

const SendOTPBtnText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
`;

const VerificationBox = styled.View`
  background-color: #E8F5E9;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  align-items: center;
`;

const VerificationIcon = styled.Text`
  font-size: 32px;
  color: #0F8A3C;
  margin-bottom: 8px;
`;

const VerificationText = styled.Text`
  font-size: 13px;
  color: #2E7D32;
  text-align: center;
  margin-bottom: 12px;
`;

const ChangeNumberBtn = styled.TouchableOpacity`
  padding: 6px 12px;
`;

const ChangeNumberText = styled.Text`
  font-size: 12px;
  color: #0F8A3C;
  font-weight: 600;
`;

const ResendRow = styled.View`
  align-items: center;
  margin-bottom: 16px;
`;

const TimerText = styled.Text`
  font-size: 13px;
  color: #9CA3AF;
`;

const ResendBtn = styled.TouchableOpacity`
  padding: 8px 12px;
`;

const ResendText = styled.Text`
  font-size: 13px;
  color: #0F8A3C;
  font-weight: 600;
`;

const VerifyOTPBtn = styled.TouchableOpacity`
  height: 52px;
  background-color: #0F8A3C;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
`;

const VerifyOTPBtnText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
`;

const SecurityNote = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 10px;
  padding: 12px;
  border-width: 1px;
  border-color: #E5E7EB;
`;

const SecurityNoteText = styled.Text`
  font-size: 12px;
  color: #6B7280;
  flex: 1;
`;
