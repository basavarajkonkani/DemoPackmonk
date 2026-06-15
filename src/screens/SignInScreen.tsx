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

const SignInScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing details', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const existing = await AsyncStorage.getItem(AUTH_KEY);
      const user = existing
        ? JSON.parse(existing)
        : { name: 'Rahul Sharma', email: email.trim() };

      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify({ ...user, email: email.trim() }));
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch {
      Alert.alert('Error', 'Could not sign in. Please try again.');
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

          <Title>Welcome back</Title>
          <Subtitle>Sign in to manage your packaging orders and designs.</Subtitle>

          <FieldLabel>Email</FieldLabel>
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

          <FieldLabel>Password</FieldLabel>
          <InputWrap>
            <FontAwesome5 name="lock" size={14} color="#9CA3AF" style={{ marginRight: 10 }} />
            <Input
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <EyeBtn onPress={() => setShowPassword((v) => !v)}>
              <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={14} color="#9CA3AF" />
            </EyeBtn>
          </InputWrap>

          <PrimaryBtn onPress={handleSignIn} activeOpacity={0.9} disabled={loading}>
            <PrimaryBtnText>{loading ? 'Signing in…' : 'Login'}</PrimaryBtnText>
          </PrimaryBtn>

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

const EyeBtn = styled.TouchableOpacity`padding: 6px;`;

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
