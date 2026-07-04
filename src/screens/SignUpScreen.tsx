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
import { AUTH_KEY, ONBOARDING_KEY } from '../constants';
import { IMAGES } from '../constants/images';

interface Props {
  navigation: any;
}

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim() || !companyName.trim()) {
      Alert.alert('Missing details', 'Please fill in all required fields (name, email, phone, company, password).');
      return;
    }

    setLoading(true);
    try {
      const user = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: 'buyer' as const,
        companyName: companyName.trim(),
        gstNumber: gstNumber.trim(),
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch {
      Alert.alert('Error', 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
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

          <Title>Create your account</Title>
          <Subtitle>Join thousands of businesses ordering premium custom packaging.</Subtitle>

          <FieldLabel>Full name</FieldLabel>
          <InputWrap>
            <FontAwesome5 name="user" size={14} color="#9CA3AF" style={{ marginRight: 10 }} />
            <Input
              placeholder="Rahul Sharma"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </InputWrap>

          <FieldLabel>Business email</FieldLabel>
          <InputWrap>
            <FontAwesome5 name="envelope" size={14} color="#9CA3AF" style={{ marginRight: 10 }} />
            <Input
              placeholder="you@company.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </InputWrap>

          <FieldLabel>Phone (optional)</FieldLabel>
          <InputWrap>
            <FontAwesome5 name="phone" size={14} color="#9CA3AF" style={{ marginRight: 10 }} />
            <Input
              placeholder="+91 98765 43210"
              placeholderTextColor="#9CA3AF"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </InputWrap>

          <FieldLabel>Company name *</FieldLabel>
          <InputWrap>
            <FontAwesome5 name="building" size={14} color="#9CA3AF" style={{ marginRight: 10 }} />
            <Input
              placeholder="Your Company Pvt Ltd"
              placeholderTextColor="#9CA3AF"
              value={companyName}
              onChangeText={setCompanyName}
              autoCapitalize="words"
            />
          </InputWrap>

          <FieldLabel>GST Number (optional)</FieldLabel>
          <InputWrap>
            <FontAwesome5 name="file-invoice" size={14} color="#9CA3AF" style={{ marginRight: 10 }} />
            <Input
              placeholder="22AAAAA0000A1Z5"
              placeholderTextColor="#9CA3AF"
              value={gstNumber}
              onChangeText={setGstNumber}
              autoCapitalize="characters"
            />
          </InputWrap>

          <FieldLabel>Password</FieldLabel>
          <InputWrap>
            <FontAwesome5 name="lock" size={14} color="#9CA3AF" style={{ marginRight: 10 }} />
            <Input
              placeholder="Create a password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </InputWrap>

          <PrimaryBtn onPress={handleSignUp} activeOpacity={0.9} disabled={loading}>
            <PrimaryBtnText>{loading ? 'Creating account…' : 'Get Started'}</PrimaryBtnText>
          </PrimaryBtn>

          <FooterRow>
            <FooterText>Already have an account?</FooterText>
            <LinkBtn onPress={() => navigation.replace('SignIn')}>
              <LinkText>Login</LinkText>
            </LinkBtn>
          </FooterRow>
        </ScrollView>
      </KeyboardAvoidingView>
    </Wrapper>
  );
};

export default SignUpScreen;

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

const FooterRow = styled.View`
  flex-direction: row; align-items: center; justify-content: center;
  margin-top: 24px;
`;

const FooterText = styled.Text`font-size: 14px; color: #6b7280;`;

const LinkBtn = styled.TouchableOpacity`margin-left: 6px;`;

const LinkText = styled.Text`font-size: 14px; font-weight: 700; color: #0f8a3c;`;
