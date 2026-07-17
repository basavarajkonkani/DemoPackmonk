import React, { useState } from 'react';
import {
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Image,
} from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch } from '../store';
import { login, loginAsAdmin } from '../store/authSlice';
import { AUTH_KEY, ONBOARDING_KEY } from '../constants';
import { IMAGES } from '../constants/images';

interface Props {
  navigation: any;
}

const SignInScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Get the return screen from route params
  const returnScreen = navigation.getParam('returnScreen') || 'MainTabs';

  // Countdown timer for resend OTP
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      Alert.alert('Missing details', 'Please enter your mobile number.');
      return;
    }

    // Basic phone validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+91/, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      Alert.alert('Invalid phone', 'Please enter a valid 10-digit mobile number.');
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
      // For demo purposes, accept any 6-digit OTP
      await new Promise(resolve => setTimeout(resolve, 1000));

      const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+91/, '');
      const formattedPhone = `+91 ${cleanPhone.substring(0, 5)} ${cleanPhone.substring(5)}`;

      // Regular user login only - admin login is handled separately via AdminLoginScreen
      const user = { 
        id: Date.now().toString(),
        name: 'User', 
        email: '',
        phone: formattedPhone,
        role: 'user' as const,
        companyName: '',
        gstNumber: '',
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      
      // Dispatch to Redux
      console.log('Dispatching login action with user:', user);
      dispatch(login(user));
      
      // Small delay to ensure Redux state is updated before navigation
      setTimeout(() => {
        console.log(`Navigating to: ${returnScreen}`);
        // If returning to checkout, use replace to avoid stack issues
        if (returnScreen === 'Checkout') {
          // Use replace instead of navigate to avoid navigation stack confusion
          navigation.replace('Checkout');
        } else {
          navigation.reset({ 
            index: 0, 
            routes: [{ name: 'MainTabs' }] 
          });
        }
      }, 100);
    } catch (error) {
      console.error('OTP verification error:', error);
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
    <Wrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: Platform.OS === 'ios' ? 56 : 32,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <BackBtn onPress={() => navigation.goBack()} activeOpacity={0.85}>
            <FontAwesome5 name="arrow-left" size={16} color="#111827" />
          </BackBtn>

          <BrandRow>
            <Image source={IMAGES.logo} style={{ width: 36, height: 36 }} resizeMode="contain" />
            <BrandName>PACKMONK</BrandName>
          </BrandRow>

          <Title>Welcome back</Title>
          <Subtitle>Sign in with your mobile number to continue.</Subtitle>

          <FieldLabel>Mobile Number</FieldLabel>
          <InputWrap>
            <FontAwesome5 name="phone" size={14} color="#9CA3AF" style={{ marginRight: 10 }} />
            <Input
              placeholder="9876543210"
              placeholderTextColor="#9CA3AF"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
              editable={!otpSent}
            />
          </InputWrap>

          {otpSent && (
            <>
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
                  autoFocus
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
            </>
          )}

          <PrimaryBtn 
            onPress={otpSent ? handleVerifyOTP : handleSendOTP} 
            activeOpacity={0.9} 
            disabled={loading}
          >
            <PrimaryBtnText>
              {loading ? (otpSent ? 'Verifying…' : 'Sending OTP…') : (otpSent ? 'Verify & Login' : 'Send OTP')}
            </PrimaryBtnText>
          </PrimaryBtn>

          {otpSent && (
            <ChangeNumberBtn onPress={() => { setOtpSent(false); setOtp(''); setTimer(0); }} activeOpacity={0.7}>
              <ChangeNumberText>Change mobile number</ChangeNumberText>
            </ChangeNumberBtn>
          )}

          <FooterRow>
            <FooterText>Don&apos;t have an account?</FooterText>
            <LinkBtn onPress={() => navigation.replace('SignUp')}>
              <LinkText>Sign up</LinkText>
            </LinkBtn>
          </FooterRow>
        </ScrollView>
      </KeyboardAvoidingView>
    </Wrapper>
  );
};

export default SignInScreen;

const Wrapper = styled.View`flex: 1; background-color: #ffffff;`;

const BackBtn = styled.TouchableOpacity`
  width: 40px; height: 40px; border-radius: 20px;
  background-color: #f9fafb; align-items: center; justify-content: center;
  margin-bottom: 24px;
`;

const BrandRow = styled.View`
  flex-direction: row; align-items: center; justify-content: center;
  margin-bottom: 28px;
`;

const BrandName = styled.Text`
  font-size: 20px; font-weight: 900; color: #111827;
  letter-spacing: 2px; margin-left: 10px;
`;

const Title = styled.Text`
  font-size: 26px; font-weight: 800; color: #111827; margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-size: 14px; color: #6b7280; line-height: 22px; margin-bottom: 28px;
`;

const FieldLabel = styled.Text`
  font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 8px;
`;

const InputWrap = styled.View`
  flex-direction: row; align-items: center;
  height: 52px; border-radius: 14px; border-width: 1px; border-color: #e5e7eb;
  background-color: #f9fafb; padding-horizontal: 14px; margin-bottom: 18px;
`;

const Input = styled.TextInput`flex: 1; font-size: 15px; color: #111827;`;

const PrimaryBtn = styled.TouchableOpacity`
  height: 52px; border-radius: 14px; background-color: #0f8a3c;
  align-items: center; justify-content: center; margin-top: 8px;
`;

const PrimaryBtnText = styled.Text`
  font-size: 16px; font-weight: 700; color: #ffffff;
`;

const ResendRow = styled.View`
  align-items: flex-end; margin-top: -10px; margin-bottom: 8px;
`;

const TimerText = styled.Text`
  font-size: 13px; color: #6b7280;
`;

const ResendBtn = styled.TouchableOpacity`
  padding: 4px;
`;

const ResendText = styled.Text`
  font-size: 13px; font-weight: 600; color: #0f8a3c;
`;

const ChangeNumberBtn = styled.TouchableOpacity`
  align-items: center; margin-top: 16px;
`;

const ChangeNumberText = styled.Text`
  font-size: 14px; font-weight: 600; color: #6b7280;
`;

const FooterRow = styled.View`
  flex-direction: row; align-items: center; justify-content: center;
  margin-top: 24px;
`;

const FooterText = styled.Text`font-size: 14px; color: #6b7280;`;

const LinkBtn = styled.TouchableOpacity`margin-left: 6px;`;

const LinkText = styled.Text`font-size: 14px; font-weight: 700; color: #0f8a3c;`;
